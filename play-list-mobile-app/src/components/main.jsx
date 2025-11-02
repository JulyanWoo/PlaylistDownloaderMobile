import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Main() {
  const insets = SafeAreaProvider.useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <StatusBar style="auto" />
      <Text>mike gay!</Text>
      <Button title="Hola" onPress={() => alert("Hi")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
