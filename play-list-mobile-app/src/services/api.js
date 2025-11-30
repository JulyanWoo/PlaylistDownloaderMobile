import Constants from "expo-constants";
const hostUri =
  Constants?.expoGoConfig?.hostUri ||
  Constants?.manifest2?.extra?.expoGo?.hostUri ||
  "";
let defaultLocal = "https://yt-downloader-aaa.up.railway.app";
if (hostUri) {
  const ip = hostUri.split(":")[0];
  if (ip) defaultLocal = `http://${ip}:3001`;
}
const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || defaultLocal;

const getYoutubeMetadata = async (url) => {
  const res = await fetch(
    `${BASE_URL}/api/youtube/metadata?url=${encodeURIComponent(url)}`,
  );
  if (!res.ok) return { error: "error de servidor" };
  return await res.json();
};

const downloadYoutube = async (url) => {
  const res = await fetch(
    `${BASE_URL}/api/youtube/download?url=${encodeURIComponent(url)}`,
  );
  if (!res.ok) return { error: "error de servidor" };
  return await res.json();
};

export { BASE_URL, getYoutubeMetadata, downloadYoutube };
