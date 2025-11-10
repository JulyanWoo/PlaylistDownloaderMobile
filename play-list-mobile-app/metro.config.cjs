const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

// eslint-disable-next-line no-undef
const config = getDefaultConfig(__dirname);

config.resolver = config.resolver || {};
config.resolver.extraNodeModules = {
  "react-native-web-webview": path.resolve(
    // eslint-disable-next-line no-undef
    __dirname,
    "src/shims/react-native-web-webview",
  ),
};

module.exports = config;
