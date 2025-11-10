import ytdl from "ytdl-core";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import ytDlp from "yt-dlp-exec";
import path from "path";
import { ensureDir } from "../utils/fileHelper.js";

ffmpeg.setFfmpegPath(ffmpegPath);

const getMetadata = async (url) => {
  const info = await ytdl.getBasicInfo(url);
  const details = info.videoDetails;
  return {
    title: details.title,
    lengthSeconds: details.lengthSeconds,
    author: details.author?.name || "",
    channelId: details.channelId,
    thumbnails: details.thumbnails,
    videoId: details.videoId,
    url: details.video_url
  };
};

const downloadViaYtDlp = async (url, outputPath, dir) => {
  ensureDir(dir);
  const fileName = path.basename(outputPath);
  await ytDlp(url, {
    extractAudio: true,
    audioFormat: "mp3",
    audioQuality: 0,
    output: fileName,
    ffmpegLocation: ffmpegPath,
    "ffmpeg-location": ffmpegPath,
    noWarnings: true
  }, { cwd: dir });
  return path.join(dir, fileName);
};

const downloadToMp3 = async (url, outputPath, dir) => {
  const p = await downloadViaYtDlp(url, outputPath, dir);
  return p;
};

export { getMetadata, downloadToMp3 };