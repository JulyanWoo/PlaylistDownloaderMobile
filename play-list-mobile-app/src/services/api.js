import Constants from "expo-constants";
import Logger from "../utils/Logger";

// 1. Robust URL Resolution
const getBaseUrl = () => {
  const expoConfigUrl = Constants.expoConfig?.extra?.apiUrl;
  const manifestUrl = Constants.manifest?.extra?.apiUrl;
  const fallbackUrl = "http://192.168.3.53:3001";

  Logger.log("Resolving BASE_URL", {
    expoConfig: expoConfigUrl,
    manifest: manifestUrl,
    fallback: fallbackUrl,
  });

  if (expoConfigUrl) return expoConfigUrl;
  if (manifestUrl) return manifestUrl;
  return fallbackUrl;
};

const BASE_URL = getBaseUrl();
Logger.log(`FINAL BASE_URL: ${BASE_URL}`);

// 2. Auto-Test Connection on Init
const testConnection = async () => {
  try {
    Logger.log(`Testing connection to: ${BASE_URL}/api/youtube/search?q=test`);
    const start = Date.now();
    const res = await fetch(`${BASE_URL}/api/youtube/search?q=test`);
    const duration = Date.now() - start;

    if (res.ok) {
      Logger.log(`Connection SUCCESS (${duration}ms)`, { status: res.status });
    } else {
      Logger.error(`Connection FAILED (${duration}ms)`, { status: res.status });
    }
  } catch (error) {
    Logger.error("Connection ERROR", error);
  }
};

// Run test immediately
testConnection();

const getYoutubeMetadata = async (url) => {
  try {
    Logger.log(`Fetching metadata for: ${url}`);
    const res = await fetch(
      `${BASE_URL}/api/youtube/metadata?url=${encodeURIComponent(url)}`,
    );
    if (!res.ok) {
      Logger.error(`Metadata fetch failed: ${res.status}`);
      return { error: "error de servidor" };
    }
    const data = await res.json();
    Logger.log("Metadata success");
    return data;
  } catch (e) {
    Logger.error("Metadata fetch error", e);
    return { error: "error de red" };
  }
};

const downloadYoutube = async (url) => {
  try {
    Logger.log(`Requesting download for: ${url}`);
    const res = await fetch(
      `${BASE_URL}/api/youtube/download?url=${encodeURIComponent(url)}`,
    );
    if (!res.ok) {
      Logger.error(`Download request failed: ${res.status}`);
      return { error: "error de servidor" };
    }
    const data = await res.json();
    Logger.log("Download request success");
    return data;
  } catch (e) {
    Logger.error("Download request error", e);
    return { error: "error de red" };
  }
};

export { BASE_URL, getYoutubeMetadata, downloadYoutube, testConnection };
