import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Platform,
} from "react-native";
import YoutubeIframe from "react-native-youtube-iframe";
import { downloadYoutube, BASE_URL } from "../services/api";
// eslint-disable-next-line import/no-unresolved
import * as FileSystem from "expo-file-system/legacy";

export default function PlayerScreen({ route }) {
  const { videoId, title } = route.params || {};
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  const onDownload = async () => {
    try {
      setDownloading(true);
      setError("");
      setDownloadUrl("");
      const res = await downloadYoutube(
        `https://www.youtube.com/watch?v=${videoId}`,
      );
      if (res?.error) setError(res.error);
      else {
        const d = res.downloadUrl || "";
        if (!d) return;
        const remote = `${BASE_URL}${d}`;
        const fname = decodeURIComponent(
          d.split("/").pop() || `${videoId}.mp3`,
        );
        if (Platform.OS === "web") {
          const a = document.createElement("a");
          a.href = remote;
          a.download = fname;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setDownloadUrl(remote);
        } else {
          if (Platform.OS === "android") {
            const tmp =
              (FileSystem.cacheDirectory || FileSystem.documentDirectory) +
              fname;
            await FileSystem.downloadAsync(remote, tmp);
            const base64 = await FileSystem.readAsStringAsync(tmp, {
              encoding: FileSystem.EncodingType.Base64,
            });
            const perm =
              await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
            if (!perm.granted) {
              alert("Permiso de carpeta denegado");
              setDownloadUrl(tmp);
              return;
            }
            const dir = perm.directoryUri;
            const fileUri =
              await FileSystem.StorageAccessFramework.createFileAsync(
                dir,
                fname,
                "audio/mpeg",
              );
            await FileSystem.writeAsStringAsync(fileUri, base64, {
              encoding: FileSystem.EncodingType.Base64,
            });
            alert(`Guardado en: ${fileUri}`);
            setDownloadUrl(fileUri);
          } else {
            const local = FileSystem.documentDirectory + fname;
            const resDownload = await FileSystem.downloadAsync(remote, local);
            alert(`Guardado en: ${resDownload?.uri || local}`);
            setDownloadUrl(local);
          }
        }
      }
    } catch (_) {
      setError("Error descargando");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title || "Reproductor"}</Text>
      <View style={styles.playerBox}>
        <YoutubeIframe height={220} play={false} videoId={videoId} />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={onDownload}
          disabled={downloading}
        >
          <Text style={styles.btnText}>
            {downloading ? "Descargando..." : "Descargar MP3"}
          </Text>
        </TouchableOpacity>
      </View>

      {downloadUrl ? (
        <View style={styles.downloadRow}>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => Linking.openURL(downloadUrl)}
          >
            <Text style={styles.btnText}>Abrir enlace</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    alignSelf: "flex-start",
  },
  playerBox: {
    width: "100%",
    marginTop: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  error: {
    color: "#c00",
  },
  buttonsRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  primaryBtn: {
    backgroundColor: "#cc0000",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  secondaryBtn: {
    backgroundColor: "#222",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
  },
  downloadRow: {
    width: "100%",
    alignItems: "flex-start",
    marginTop: 8,
  },
});
