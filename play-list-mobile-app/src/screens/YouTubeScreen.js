import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { searchVideos } from "../services/youtubeApi";

export default function YouTubeScreen() {
  const navigation = useNavigation();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const onSearch = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await searchVideos(query);
      setResults(data);
    } catch (_) {
      setError("Error buscando");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar canciones o artistas"
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

      <View style={styles.list}>
        {results.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.row}
            onPress={() =>
              navigation.navigate("Player", {
                videoId: item.videoId,
                title: item.title,
              })
            }
          >
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
          </TouchableOpacity>
        ))}
      </View>
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
  searchBox: {
    width: "100%",
    marginTop: 12,
    marginBottom: 12,
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
  list: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  thumb: {
    width: 96,
    height: 54,
    borderRadius: 6,
    marginRight: 10,
    backgroundColor: "#ddd",
  },
  rowTextBox: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  rowSub: {
    fontSize: 12,
    color: "#666",
  },
});
