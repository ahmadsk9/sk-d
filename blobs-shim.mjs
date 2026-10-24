// بديل محلي لـ @netlify/blobs: يخزن كل سجل كملف JSON على قرص السيرفر
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.env.DATA_DIR || "/var/lib/sk-data";

export function getStore(name) {
  const dir = path.join(ROOT, name);
  const file = (k) => path.join(dir, encodeURIComponent(k) + ".json");
  return {
    async get(k, o) {
      try {
        const t = await fs.readFile(file(k), "utf8");
        return o && o.type === "json" ? JSON.parse(t) : t;
      } catch { return null; }
    },
    async setJSON(k, v) {
      await fs.mkdir(dir, { recursive: true });
      const f = file(k);
      await fs.writeFile(f + ".tmp", JSON.stringify(v));
      await fs.rename(f + ".tmp", f);
    },
    async delete(k) { try { await fs.unlink(file(k)); } catch {} },
    async list() {
      try {
        const fl = await fs.readdir(dir);
        return { blobs: fl.filter((f) => f.endsWith(".json")).map((f) => ({ key: decodeURIComponent(f.slice(0, -5)) })), directories: [] };
      } catch { return { blobs: [], directories: [] }; }
    },
  };
}
