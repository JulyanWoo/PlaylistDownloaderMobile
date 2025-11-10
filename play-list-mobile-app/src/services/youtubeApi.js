import { BASE_URL } from "./api";

const mapItems = (items) => {
  if (!Array.isArray(items)) return [];
  return items.map((it) => {
    const id = it.id || it.videoId || it.url || "";
    const vid =
      it.videoId || (typeof id === "string" && id.split("v=")[1]) || id;
    const thumb =
      it.thumbnail ||
      (it.thumbnails && it.thumbnails[0]?.url) ||
      (it.videoThumbnails && it.videoThumbnails[0]?.url) ||
      null;
    return {
      id: vid || id,
      videoId: vid || id,
      title: it.title || it.name || "",
      thumbnail: thumb,
      uploader: it.uploader || it.channelName || it.author || "",
    };
  });
};

export async function searchVideos(q, page = 1, pageSize = 20) {
  if (!q) return { items: [], hasMore: false };
  const r = await fetch(
    `${BASE_URL}/api/youtube/search?q=${encodeURIComponent(q)}&page=${page}&pageSize=${pageSize}`,
  );
  if (!r.ok) throw new Error("search failed");
  const data = await r.json();
  const items = Array.isArray(data) ? data : data.items || [];
  const mapped = mapItems(items);
  const hasMore = !!data.hasMore && mapped.length > 0;
  return { items: mapped, hasMore };
}
