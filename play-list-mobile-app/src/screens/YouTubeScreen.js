import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
} from "react-native";
import { getYoutubeMetadata, downloadYoutube, BASE_URL } from "../services/api";

export default function YouTubeScreen() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");

  const onSearch = async () => {
    try {
      setLoading(true);
      setError("");
      setMetadata(null);
      const info = await getYoutubeMetadata(query.trim());
      if (info?.error) setError(info.error);
      else setMetadata(info);
    } catch (e) {
      setError("Error buscando");
    } finally {
      setLoading(false);
    }
  };

  const onDownload = async () => {
    try {
      setDownloading(true);
      setError("");
      setDownloadUrl("");
      const res = await downloadYoutube(query.trim());
      if (res?.error) setError(res.error);
      else setDownloadUrl(res.downloadUrl || "");
    } catch (e) {
      setError("Error descargando");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>YouTube</Text>
      <View style={styles.searchBox}>
        <Text style={styles.label}>URL de YouTube</Text>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder="https://www.youtube.com/watch?v=..."
        />
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={onSearch}
          disabled={!query || loading}
        >
          <Text style={styles.btnText}>
            {loading ? "Buscando..." : "Buscar"}
          </Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {metadata ? (
        <View style={styles.card}>
          {Array.isArray(metadata?.thumbnails) &&
          metadata.thumbnails.length > 0 ? (
            <Image
              source={{
                uri: (
                  metadata.thumbnails[metadata.thumbnails.length - 1] ||
                  metadata.thumbnails[0]
                ).url,
              }}
              style={styles.thumb}
            />
          ) : null}
          <Text style={styles.cardTitle}>{metadata.title}</Text>
          <Text style={styles.cardSub}>{metadata.author}</Text>
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
        </View>
      ) : null}

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
    fontSize: 24,
    fontWeight: "600",
    alignSelf: "flex-start",
  },
  searchBox: {
    width: "100%",
    marginTop: 12,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: "100%",
    marginBottom: 8,
  },
  error: {
    color: "#c00",
  },
  card: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  thumb: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  cardSub: {
    fontSize: 14,
    color: "#666",
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
