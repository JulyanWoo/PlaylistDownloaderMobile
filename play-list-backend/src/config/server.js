import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import logger from "./logger.js";
import helmet from "helmet";

dotenv.config();

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

const baseDir =
  process.env.DOWNLOAD_DIR || path.join(process.cwd(), "downloads");
app.use("/downloads", express.static(baseDir));

app.use((req, res, next) => {
  logger.info({ method: req.method, path: req.path });
  next();
});

export { app, baseDir };
