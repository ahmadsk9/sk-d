// خادم SK على VPS: يقدّم الملفات الثابتة و /api/* بنفس كود netlify/functions/api.mjs
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import api from "./netlify/functions/api.mjs";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 3000);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".txt": "text/plain; charset=utf-8" };
const BLOCK = /^\/(netlify|node_modules|\.git)(\/|$)|^\/(server\.mjs|blobs-shim\.mjs|package\.json|netlify\.toml|setup\.sh|update\.sh|README\.md|CLAUDE\.md)$/;

function readBody(req, max = 6e6) {
  return new Promise((ok, no) => {
    const a = []; let n = 0;
    req.on("data", (c) => { n += c.length; if (n > max) { no(new Error("big")); req.destroy(); } else a.push(c); });
    req.on("end", () => ok(Buffer.concat(a)));
    req.on("error", no);
  });
}
const send = (res, s, t) => { res.writeHead(s, { "content-type": "text/plain; charset=utf-8" }); res.end(t); };

http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url, "http://x");
    let p = decodeURIComponent(u.pathname);

    if (p.startsWith("/api/")) {
      const body = req.method === "GET" || req.method === "HEAD" ? undefined : await readBody(req);
      const r = await api(new Request("https://" + (req.headers.host || "localhost") + req.url, { method: req.method, headers: req.headers, body }));
      res.writeHead(r.status, Object.fromEntries(r.headers));
      res.end(Buffer.from(await r.arrayBuffer()));
      return;
    }

    if (p === "/") p = "/index.html";
    if (p.startsWith("/i/")) p = "/i.html";
    if (BLOCK.test(p)) return send(res, 404, "Not found");

    let f = path.join(ROOT, p);
    if (!f.startsWith(ROOT + path.sep)) return send(res, 403, "Forbidden");
    let st = await fs.stat(f).catch(() => null);
    if (!st && !path.extname(f)) { f += ".html"; st = await fs.stat(f).catch(() => null); }
    if (!st || !st.isFile()) return send(res, 404, "Not found");

    res.writeHead(200, { "content-type": MIME[path.extname(f)] || "application/octet-stream", "cache-control": "no-cache" });
    if (req.method === "HEAD") return res.end();
    res.end(await fs.readFile(f));
  } catch (e) {
    send(res, e && e.message === "big" ? 413 : 500, "Server error");
  }
}).listen(PORT, "127.0.0.1", () => console.log("SK server on " + PORT));
