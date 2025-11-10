// eslint-disable-next-line import/no-unresolved
import * as FileSystem from "expo-file-system/legacy";
import { Share, Platform } from "react-native";

const FILE = FileSystem.documentDirectory + "playlist.txt";

export async function addLink(link) {
  const info = await FileSystem.getInfoAsync(FILE);
  let content = "";
  if (info.exists) content = await FileSystem.readAsStringAsync(FILE);
  if (content && !content.endsWith("\n")) content += "\n";
  content += `${link}\n`;
  await FileSystem.writeAsStringAsync(FILE, content);
}

export async function readPlaylist() {
  const info = await FileSystem.getInfoAsync(FILE);
  if (!info.exists) return "";
  return await FileSystem.readAsStringAsync(FILE);
}

export async function sharePlaylist() {
  const content = await readPlaylist();
  if (!content) return { shared: false };
  if (Platform.OS === "web") {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "playlist.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return { shared: true };
  }
  await Share.share({ message: content });
  return { shared: true };
}
