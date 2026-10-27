// SK Design API (Netlify Functions v2 + Netlify Blobs)
// المسارات: POST /api/order  |  GET /api/status?id=  |  GET /api/invite?id=  |  POST /api/admin
import { getStore } from "@netlify/blobs";
import { timingSafeEqual } from "node:crypto";

const BASE = 7;
const PRICES = { photo: 2, count: 3, par: 1, map: 1, story: 5, open: 3, anim: 2, style: 3 };
const TYPES = ["wedding", "engage", "katb", "henna", "grad", "baby"];
const FX = ["none", "env", "cur", "slide", "book", "doors", "seal", "gate", "env3", "scroll", "box"];
const AM = ["none", "petal", "sparkle", "dust", "bokeh"];
const TP = ["classic", "modern", "glass", "floral", "luxe", "arch"];
const NF = ["auto", "ruqaa", "katibeh", "lalezar", "rakkas", "gulzar", "reem", "amiri"];
const ID = /^SK-[A-Z0-9]{6,10}$/;
const IMG = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+\/=]+$/;

const json = (o, s = 200) =>
  new Response(JSON.stringify(o), {
    status: s,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

const str = (v, n) => String(v == null ? "" : v).slice(0, n);
const pick = (v, list) => (list.includes(v) ? v : list[0]);
function img(v, max) {
  v = String(v || "");
  if (!v) return "";
  if (v.length > max || !IMG.test(v)) throw new Error("bad_image");
  return v;
}

// تنظيف بيانات الدعوة: يمنع حقن أي كود لأن الدعوة تُعرض على نطاقك
function clean(S) {
  if (!S || typeof S !== "object") throw new Error("bad_state");
  const o = {};
  o.type = pick(S.type, TYPES);
  o.n1 = str(S.n1, 100); o.n2 = str(S.n2, 100);
  o.p1 = str(S.p1, 100); o.p2 = str(S.p2, 100);
  o.date = str(S.date, 60); o.time = str(S.time, 60);
  o.venue = str(S.venue, 150); o.addr = str(S.addr, 200);
  o.dt = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(S.dt) ? S.dt : "";
  const m = str(S.map, 500);
  o.map = /^https?:\/\/[^\s"'<>]+$/.test(m) ? m : "";
  o.wa = String(S.wa || "").replace(/\D/g, "").slice(0, 15);
  o.intro = str(S.intro, 1500); o.story = str(S.story, 1500);
  o.br = str(S.br == null ? "SK" : S.br, 40); o.bw = "";
  o.fx = pick(S.fx, FX); o.am = pick(S.am, AM); o.tp = pick(S.tp, TP); o.nf = pick(S.nf, NF);
  o.th = S.th === "c" ? "c" : Math.min(10, Math.max(0, parseInt(S.th, 10) || 0));
  o.cc = /^#[0-9a-fA-F]{6}$/.test(S.cc) ? S.cc : "#7a4fb0";
  o.dk = !!S.dk;
  o.bg = img(S.bg, 1400000);
  o.ph = img(S.ph, 600000);
  o.gal = (Array.isArray(S.gal) ? S.gal : []).slice(0, 6).map((g) => img(g, 700000));
  return o;
}

// الإضافات المستخدمة فعلاً داخل الدعوة، ومنها يُحسب السعر على الخادم
function derive(S) {
  const x = [];
  if (S.ph) x.push("photo");
  if (S.dt) x.push("count");
  if (S.p1 || S.p2) x.push("par");
  if (S.map || S.addr) x.push("map");
  if (S.story || S.gal.length) x.push("story");
  if (S.fx !== "none") x.push("open");
  if (S.am !== "none") x.push("anim");
  if (S.tp !== "classic" || S.nf !== "ruqaa" || S.th !== 0 || S.bg || S.dk) x.push("style");
  return x;
}

function authed(req) {
  const key = process.env.ADMIN_KEY || "";
  const got = req.headers.get("x-admin-key") || "";
  if (key.length < 8) return "no_key";
  const a = Buffer.from(key), b = Buffer.from(got);
  return a.length === b.length && timingSafeEqual(a, b) ? "ok" : "bad";
}

export default async (req) => {
  const url = new URL(req.url);
  const path = url.pathname.replace(/\/+$/, "");
  const orders = getStore("orders");
  const meta = getStore("meta");

  try {
    // ---- الزبون: إرسال طلب ----
    if (path === "/api/order" && req.method === "POST") {
      const text = await req.text();
      if (text.length > 5000000) return json({ error: "too_big" }, 413);
      let b;
      try { b = JSON.parse(text); } catch { return json({ error: "bad_json" }, 400); }
      if (!ID.test(b.id || "")) return json({ error: "bad_id" }, 400);
      if (await meta.get(b.id)) return json({ error: "exists" }, 409);
      let S;
      try { S = clean(b.S); } catch (e) { return json({ error: e.message }, 400); }
      const extras = derive(S);
      const total = BASE + extras.reduce((t, k) => t + (PRICES[k] || 0), 0);
      const created = new Date().toISOString();
      const customer = { name: str(b.customer && b.customer.name, 80), phone: str(b.customer && b.customer.phone, 30) };
      const payment = { method: "direct", payer: str(b.payment && b.payment.payer, 80), ref: str(b.payment && b.payment.ref, 60) };
      const note = str(b.note, 500);
      const raw = { dt: str(b.raw && b.raw.dt, 10), tm: str(b.raw && b.raw.tm, 5) };
      const rec = { id: b.id, created, status: "pending", total, clientTotal: Number(b.total) || 0, customer, payment, note, extras, raw, S };
      await orders.setJSON(b.id, rec);
      await meta.setJSON(b.id, {
        id: b.id, created, status: "pending", total, clientTotal: rec.clientTotal,
        customer, payment, note, extras, n1: S.n1, n2: S.n2, type: S.type,
      });
      // إشعار فوري على جوالك عبر تطبيق ntfy (اختياري: يشتغل فقط إذا ضفت NTFY_TOPIC)
      const topic = process.env.NTFY_TOPIC;
      if (topic) {
        try {
          await fetch("https://ntfy.sh/", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              topic,
              title: "طلب جديد - SK ديزاين",
              message: b.id + " بقيمة " + total + " دينار",
              click: url.origin + "/sk-admin.html",
              priority: 4,
              tags: ["bell"],
            }),
            signal: AbortSignal.timeout(3000),
          });
        } catch {}
      }
      return json({ ok: true, id: b.id });
    }

    // ---- الزبون: حالة الطلب ----
    if (path === "/api/status" && req.method === "GET") {
      const id = (url.searchParams.get("id") || "").toUpperCase();
      if (!ID.test(id)) return json({ status: "none" });
      const m = await meta.get(id, { type: "json" });
      return json({ status: m ? m.status : "none" });
    }

    // ---- الدعوة: تُسلَّم فقط بعد الوصل ----
    if (path === "/api/invite" && req.method === "GET") {
      const id = (url.searchParams.get("id") || "").toUpperCase();
      if (!ID.test(id)) return json({ error: "not_found" }, 404);
      const m = await meta.get(id, { type: "json" });
      if (!m) return json({ error: "not_found" }, 404);
      if (m.status !== "paid") return json({ error: "not_ready" }, 403);
      const rec = await orders.get(id, { type: "json" });
      if (!rec) return json({ error: "not_found" }, 404);
      return json({ S: rec.S });
    }

    // ---- الأدمن ----
    if (path === "/api/admin" && req.method === "POST") {
      const a = authed(req);
      if (a === "no_key") return json({ error: "no_key" }, 500);
      if (a !== "ok") return json({ error: "unauthorized" }, 401);
      let b;
      try { b = await req.json(); } catch { return json({ error: "bad_json" }, 400); }

      if (b.action === "list") {
        const { blobs } = await meta.list();
        const all = await Promise.all(blobs.map((x) => meta.get(x.key, { type: "json" })));
        return json({ orders: all.filter(Boolean) });
      }
      const id = String(b.id || "").toUpperCase();
      if (!ID.test(id)) return json({ error: "bad_id" }, 400);
      const m = await meta.get(id, { type: "json" });
      if (!m) return json({ error: "not_found" }, 404);

      if (b.action === "get") {
        const rec = await orders.get(id, { type: "json" });
        return json({ order: { ...rec, status: m.status } });
      }
      if (b.action === "approve" || b.action === "unapprove") {
        const paid = b.action === "approve";
        m.status = paid ? "paid" : "pending";
        m.paidAt = paid ? new Date().toISOString() : "";
        await meta.setJSON(id, m);
        return json({ ok: true, status: m.status });
      }
      if (b.action === "delete") {
        await orders.delete(id);
        await meta.delete(id);
        return json({ ok: true });
      }
      return json({ error: "bad_action" }, 400);
    }

    return json({ error: "not_found" }, 404);
  } catch (e) {
    return json({ error: "server", detail: String(e && e.message || e).slice(0, 120) }, 500);
  }
};

export const config = { path: "/api/*" };
