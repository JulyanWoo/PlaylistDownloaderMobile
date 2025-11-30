import Constants from "expo-constants";
const BASE_URL = Constants.expoConfig?.extra?.apiUrl;
console.log("BASE_URL USADA POR LA APP:", BASE_URL);
alert("BASE_URL USADA POR LA APP: " + BASE_URL);

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
