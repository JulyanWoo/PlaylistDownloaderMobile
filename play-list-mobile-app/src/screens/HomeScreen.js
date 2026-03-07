import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { sharePlaylist } from "../services/playlist";
import eventBus from "../utils/eventBus";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido</Text>
      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate("YouTube")}
        >
          <Ionicons
            name="logo-youtube"
            size={18}
            color="#fff"
            style={styles.icon}
          />
          <Text style={styles.btnText}>YouTube</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate("Spotify")}
        >
          <Image
            source={require("../../assets/Spotify_Logo.png")}
            style={styles.spotifyIcon}
          />
          <Text style={styles.btnText}>Spotify</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.shareBtn} onPress={sharePlaylist}>
        <Ionicons
          name="share-outline"
          size={18}
          color="#fff"
          style={styles.icon}
        />
        <Text style={styles.btnText}>Compartir lista</Text>
      </TouchableOpacity>
      <View style={styles.footer}>
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Github-desktop-logo-symbol.svg/2048px-Github-desktop-logo-symbol.svg.png",
          }}
          style={styles.githubIcon}
        />
        <Text style={styles.footerText}>@julyanWoo</Text>
        
        {/* Botón Debug Visible */}
        <TouchableOpacity 
          style={styles.debugBtn} 
          onPress={() => eventBus.emit("toggleDebug")}
        >
          <Ionicons name="bug-outline" size={16} color="#aaa" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 28,
    color: "#ff1a1a",
    textShadowColor: "#ff3b3b",
    textShadowRadius: 20,
    fontWeight: "600",
  },
  buttonsRow: {
    flexDirection: "row",
    marginTop: 12,
  },
  primaryBtn: {
    backgroundColor: "#cc0000",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    textShadowColor: "#ff3b3b",
    textShadowRadius: 20,
    marginRight: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  secondaryBtn: {
    backgroundColor: "#000000ff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
  },
  icon: {
    marginRight: 8,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  githubIcon: {
    width: 24,
    height: 24,
  },
  footerText: {
    color: "#888",
    fontSize: 14,
  },
  spotifyIcon: {
    width: 28,
    height: 28,
    marginRight: 8,
  },
  shareBtn: {
    backgroundColor: "#1e90ff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  debugBtn: {
    backgroundColor: "#333",
    padding: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
});
