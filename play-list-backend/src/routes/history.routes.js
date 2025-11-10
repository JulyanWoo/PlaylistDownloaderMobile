import { Router } from "express";
import { listHistory, cleanup } from "../controllers/history.controller.js";

const router = Router();

router.get("/api/history", listHistory);
router.post("/api/cleanup", cleanup);
router.get("/api/cleanup", cleanup);

export default router;