import { Router } from "express";
import { metadata, download } from "../controllers/youtube.controller.js";
import { validateUrlBody, validateUrlQuery, handleValidation } from "../middlewares/validation.js";

const router = Router();

router.post("/api/youtube/metadata", validateUrlBody, handleValidation, metadata);
router.post("/api/youtube/download", validateUrlBody, handleValidation, download);
router.get("/api/youtube/metadata", validateUrlQuery, handleValidation, metadata);
router.get("/api/youtube/download", validateUrlQuery, handleValidation, download);

export default router;