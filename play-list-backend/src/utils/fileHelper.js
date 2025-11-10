import fs from "fs";
import path from "path";

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const sanitizeFileName = (name) => {
  return name.replace(/[\\/:*?"<>|]/g, "").trim();
};

const makeOutputPath = (dir, title) => {
  const file = `${sanitizeFileName(title)}.mp3`;
  return path.join(dir, file);
};

const memoryList = [];
const addToMemory = (item) => {
  memoryList.push({ ...item, date: new Date().toISOString() });
};
const getMemory = () => memoryList;

export { ensureDir, sanitizeFileName, makeOutputPath, addToMemory, getMemory };