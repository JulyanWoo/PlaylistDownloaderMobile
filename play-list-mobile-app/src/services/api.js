import { Platform } from "react-native";

const DEFAULT_URL =
  Platform.OS === "android" ? "http://10.0.2.2:3001" : "http://localhost:3001";
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_URL;

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
