import fs from "fs";
import path from "path";
import { getMemory } from "../utils/fileHelper.js";
import { baseDir } from "../config/server.js";
import logger from "../config/logger.js";

const listHistory = (req, res) => {
  const list = getMemory().map((i) => ({
    title: i.title,
    fileName: path.basename(i.path),
    date: i.date,
  }));
  return res.json(list);
};

const cleanup = async (req, res) => {
  try {
    const days = parseInt(req.body?.days || req.query?.days || "7", 10);
    const now = Date.now();
    const limit = days * 24 * 60 * 60 * 1000;
    const entries = fs.readdirSync(baseDir, { withFileTypes: true });
    let removed = 0;
    for (const e of entries) {
      const p = path.join(baseDir, e.name);
      if (e.isDirectory()) {
        const sub = fs.readdirSync(p);
        for (const s of sub) {
          const sp = path.join(p, s);
          const st = fs.statSync(sp);
          if (now - st.mtimeMs > limit) {
            fs.unlinkSync(sp);
            removed++;
          }
        }
      } else {
        const st = fs.statSync(p);
        if (now - st.mtimeMs > limit) {
          fs.unlinkSync(p);
          removed++;
        }
      }
    }
    logger.info({ removed });
    return res.json({ removed });
  } catch (e) {
    logger.error({ error: e.message });
    return res.status(500).json({ error: "error limpiando" });
  }
};

export { listHistory, cleanup };
