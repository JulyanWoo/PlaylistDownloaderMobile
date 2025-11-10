import { Router } from "express";
import yts from "yt-search";
import { metadata, download } from "../controllers/youtube.controller.js";
import {
  validateUrlBody,
  validateUrlQuery,
  handleValidation,
} from "../middlewares/validation.js";

const router = Router();

router.post(
  "/api/youtube/metadata",
  validateUrlBody,
  handleValidation,
  metadata,
);
router.post(
  "/api/youtube/download",
  validateUrlBody,
  handleValidation,
  download,
);
router.get(
  "/api/youtube/metadata",
  validateUrlQuery,
  handleValidation,
  metadata,
);
router.get(
  "/api/youtube/download",
  validateUrlQuery,
  handleValidation,
  download,
);

router.get("/api/youtube/search", async (req, res) => {
  const { q } = req.query;
  const page = parseInt(req.query.page || "1", 10);
  const pageSize = parseInt(req.query.pageSize || "20", 10);
  if (!q) return res.status(400).json({ error: "q requerida" });
  try {
    const r = await yts({ query: q, pageStart: page, pages: 1 });
    const items = (r.videos || []).map((v) => ({
      id: v.videoId,
      videoId: v.videoId,
      title: v.title,
      thumbnail: v.thumbnail,
      uploader: v.author?.name || v.author?.title || "",
    }));
    const seen = new Set();
    const unique = items.filter((it) => {
      const k = it.videoId || it.id;
      if (!k) return false;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    const sliced = unique.slice(0, pageSize);
    const hasMore = sliced.length > 0;
    return res.json({ items: sliced, hasMore });
  } catch (e) {
    return res.status(502).json({ error: "no se pudo obtener resultados" });
  }
});

export default router;
