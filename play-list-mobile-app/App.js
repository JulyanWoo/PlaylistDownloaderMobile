import React, { useState, useEffect } from "react";
import { View } from "react-native";
import AppNavigator from "./src/navigation/AppNavigator";
import { StatusBar } from "expo-status-bar";
import DebugPanel from "./src/components/DebugPanel";
import eventBus from "./src/utils/eventBus";

export default function App() {
  const [debugVisible, setDebugVisible] = useState(false);

  useEffect(() => {
    const toggleDebug = () => setDebugVisible((prev) => !prev);
    eventBus.on("toggleDebug", toggleDebug);
    return () => eventBus.off("toggleDebug", toggleDebug);
  }, []);

  return (
    <>
      <StatusBar style="auto" />
      <View style={{ flex: 1 }}>
        <AppNavigator />
      </View>
      <DebugPanel
        visible={debugVisible}
        onClose={() => setDebugVisible(false)}
      />
    </>
  );
}
