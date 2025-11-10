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
  if (!q) return res.status(400).json({ error: "q requerida" });
  try {
    const r = await yts(q);
    const items = (r.videos || []).map((v) => ({
      id: v.videoId,
      videoId: v.videoId,
      title: v.title,
      thumbnail: v.thumbnail,
      uploader: v.author?.name || v.author?.title || "",
    }));
    return res.json(items);
  } catch (e) {
    return res.status(502).json({ error: "no se pudo obtener resultados" });
  }
});

export default router;
