import { getMetadata, downloadToMp3 } from "../services/youtube.service.js";
import { makeOutputPath, addToMemory } from "../utils/fileHelper.js";
import { baseDir } from "../config/server.js";
import logger from "../config/logger.js";

const metadata = async (req, res) => {
  let url;
  try {
    url = req.body?.url || req.query?.url;
    if (!url) return res.status(400).json({ error: "url requerida" });
    const info = await getMetadata(url);
    return res.json(info);
  } catch (e) {
    logger.error({ error: e.message, url });
    return res.status(500).json({ error: "error obteniendo metadata" });
  }
};

const download = async (req, res) => {
  let url;
  try {
    url = req.body?.url || req.query?.url;
    if (!url) return res.status(400).json({ error: "url requerida" });
    const info = await getMetadata(url);
    const outputPath = makeOutputPath(baseDir, info.title);
    await downloadToMp3(url, outputPath, baseDir);
    const fileName = outputPath.split("\\").pop();
    const downloadUrl = `/downloads/${fileName}`;
    addToMemory({ title: info.title, url, path: outputPath });
    logger.info({ title: info.title, file: fileName });
    return res.json({ downloadUrl });
  } catch (e) {
    logger.error({ error: e.message, url });
    return res.status(500).json({ error: "error descargando" });
  }
};

export { metadata, download };
