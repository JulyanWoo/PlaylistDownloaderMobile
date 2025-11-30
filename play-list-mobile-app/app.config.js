export default ({ config }) => ({
  ...config,
  name: "yt downloader",
  slug: "play-list-mobile-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  newArchEnabled: false,
  splash: {
    image: "./assets/icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
  },
  extra: {
    apiUrl: "http://192.168.3.53:3001",
    eas: {
      projectId: "796db245-30a4-4dbe-b792-44ad3da59281",
    },
  },
  android: {
    package: "com.ytdownloader",
    usesCleartextTraffic: true,
    permissions: ["READ_MEDIA_VIDEO", "READ_MEDIA_IMAGES", "READ_MEDIA_AUDIO"],
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#ffffff",
    },
    edgeToEdgeEnabled: true,
  },
  web: {
    favicon: "./assets/favicon.png",
  },
});
