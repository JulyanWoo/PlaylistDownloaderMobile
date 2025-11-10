import { StatusBar } from "expo-status-bar";
import { Text, View, Button } from "react-native";
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
