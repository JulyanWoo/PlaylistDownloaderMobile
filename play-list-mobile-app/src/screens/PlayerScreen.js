import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import YoutubeIframe from "react-native-youtube-iframe";
import { downloadYoutube, BASE_URL } from "../services/api";

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
      else setDownloadUrl(res.downloadUrl || "");
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
            onPress={() => Linking.openURL(`${BASE_URL}${downloadUrl}`)}
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
