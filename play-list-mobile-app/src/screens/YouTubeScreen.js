import { useState, useCallback, memo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { searchVideos } from "../services/youtubeApi";
import { downloadYoutube } from "../services/api";
import { addLink } from "../services/playlist";
// eslint-disable-next-line import/no-unresolved
import { Ionicons } from "@expo/vector-icons";
// eslint-disable-next-line import/no-unresolved
import * as FileSystem from "expo-file-system/legacy";
import { Platform } from "react-native";

// eslint-disable-next-line react/display-name
const Loader = memo(() => (
  <View style={styles.footer}>
    <Text style={styles.footerText}>Cargando...</Text>
  </View>
));

// eslint-disable-next-line react/display-name
const VideoRow = memo(({ item, onPress, onDownload, onAddToList }) => (
  <TouchableOpacity style={styles.row} onPress={() => onPress(item)}>
    {item.thumbnail ? (
      <Image source={{ uri: item.thumbnail }} style={styles.thumb} />
    ) : null}
    <View style={styles.rowTextBox}>
      <Text style={styles.rowTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.rowSub} numberOfLines={1}>
        {item.uploader}
      </Text>
    </View>
    <View style={styles.actions}>
      <TouchableOpacity
        style={[styles.circleBtn, styles.downloadBtn]}
        onPress={() => onDownload(item)}
      >
        <Ionicons name="download" size={18} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.circleBtn, styles.listBtn]}
        onPress={() => onAddToList(item)}
      >
        <Ionicons name="document-text" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
));

export default function YouTubeScreen() {
  const navigation = useNavigation();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState("");

  const onSearch = async () => {
    try {
      setLoading(true);
      setError("");
      const r = await searchVideos(query, 1, 20);
      const seen = new Set();
      const unique = r.items.filter((it) => {
        const k = it.videoId || it.id;
        if (!k) return false;
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
      setResults(unique);
      setHasMore(r.hasMore);
      setPage(1);
    } catch (_) {
      setError("Error buscando videos");
    } finally {
      setLoading(false);
    }
  };

  const onEndReached = async () => {
    if (loading) return;
    if (!hasMore) return;
    try {
      setLoading(true);
      const next = page + 1;
      const r = await searchVideos(query, next, 20);
      setResults((prev) => {
        const ids = new Set(prev.map((p) => p.videoId || p.id));
        const add = r.items.filter((it) => {
          const k = it.videoId || it.id;
          if (!k) return false;
          if (ids.has(k)) return false;
          ids.add(k);
          return true;
        });
        return [...prev, ...add];
      });
      setHasMore(r.hasMore);
      setPage(next);
    } finally {
      setLoading(false);
    }
  };

  const onPressNavigate = useCallback(
    (item) => {
      navigation.navigate("Player", {
        videoId: item.videoId,
        title: item.title,
      });
    },
    [navigation],
  );

  const onDownload = useCallback(async (videoId) => {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const res = await downloadYoutube(url);
    const d = res?.downloadUrl || "";
    if (!d) return;
    const remote = `${process.env.EXPO_PUBLIC_API_URL || (Platform.OS === "android" ? "http://10.0.2.2:3001" : "http://localhost:3001")}${d}`;
    const fname = decodeURIComponent(d.split("/").pop() || `${videoId}.mp3`);
    if (Platform.OS === "web") {
      const a = document.createElement("a");
      a.href = remote;
      a.download = fname;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      if (Platform.OS === "android") {
        const tmp =
          (FileSystem.cacheDirectory || FileSystem.documentDirectory) + fname;
        await FileSystem.downloadAsync(remote, tmp);
        const base64 = await FileSystem.readAsStringAsync(tmp, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const perm =
          await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (!perm.granted) {
          alert("Permiso de carpeta denegado");
          return;
        }
        let dir = perm.directoryUri;
        try {
          dir = await FileSystem.StorageAccessFramework.makeDirectoryAsync(
            dir,
            "PlaylistDownloader",
          );
        } catch (_) {}
        const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
          dir,
          fname,
          "audio/mpeg",
        );
        await FileSystem.writeAsStringAsync(fileUri, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });
        alert(`Guardado en: ${fileUri}`);
      } else {
        const local = FileSystem.documentDirectory + fname;
        const resDownload = await FileSystem.downloadAsync(remote, local);
        alert(`Guardado en: ${resDownload?.uri || local}`);
      }
    }
  }, []);

  const handleDownloadItem = useCallback(
    (item) => {
      if (item?.videoId) onDownload(item.videoId);
    },
    [onDownload],
  );

  const handleAddToList = useCallback(async (item) => {
    if (!item?.videoId) return;
    const url = `https://www.youtube.com/watch?v=${item.videoId}`;
    await addLink(url);
  }, []);

  const renderItem = useCallback(
    ({ item }) => (
      <VideoRow
        item={item}
        onPress={onPressNavigate}
        onDownload={handleDownloadItem}
        onAddToList={handleAddToList}
      />
    ),
    [onPressNavigate, handleDownloadItem, handleAddToList],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>YouTube</Text>

      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar canciones o artistas..."
          placeholderTextColor="#777"
        />
        <TouchableOpacity
          style={[styles.primaryBtn, (!query || loading) && styles.disabledBtn]}
          onPress={onSearch}
          disabled={!query || loading}
        >
          <Text style={styles.btnText}>
            {loading ? "Buscando..." : "Buscar"}
          </Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        style={styles.list}
        data={results}
        keyExtractor={(item) => `${item.videoId || item.id || "x"}`}
        renderItem={renderItem}
        onEndReachedThreshold={0.2}
        onEndReached={onEndReached}
        ListFooterComponent={loading ? Loader : null}
        initialNumToRender={12}
        maxToRenderPerBatch={12}
        windowSize={6}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    color: "#ff1a1a",
    textShadowColor: "#ff3b3b",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    marginTop: 24,
    marginBottom: 20,
  },
  searchBox: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ff2e2e",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#fff",
    backgroundColor: "#111",
    shadowColor: "#ff0000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  primaryBtn: {
    backgroundColor: "#ff1a1a",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    shadowColor: "#ff0000",
    shadowOpacity: 0.9,
    shadowRadius: 16,
    elevation: 6,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  error: {
    color: "#ff5555",
    marginTop: 10,
    fontWeight: "500",
  },
  list: {
    width: "100%",
    marginTop: 20,
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: "#111",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ff1a1a22",
    shadowColor: "#ff0000",
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  thumb: {
    width: 100,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#222",
  },
  rowTextBox: {
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginLeft: 8,
    alignItems: "center",
  },
  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  downloadBtn: {
    backgroundColor: "#1e90ff",
  },
  listBtn: {
    backgroundColor: "#7c3aed",
  },
  footer: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    color: "#fff",
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  rowSub: {
    fontSize: 13,
    color: "#ff4444",
  },
});
