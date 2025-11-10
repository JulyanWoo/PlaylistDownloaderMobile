import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import YouTubeScreen from "../screens/YouTubeScreen";
import SpotifyScreen from "../screens/SpotifyScreen";
import PlayerScreen from "../screens/PlayerScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Bienvenido" }}
        />
        <Stack.Screen name="YouTube" component={YouTubeScreen} />
        <Stack.Screen name="Player" component={PlayerScreen} />
        <Stack.Screen name="Spotify" component={SpotifyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
