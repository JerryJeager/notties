import {  View } from "react-native";
import "./global.css";
import { Slot, Stack } from "expo-router";
import {StatusBar} from "expo-status-bar"

export default function RootLayout() {
  return (
    <>
      {/* <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack> */}
      <View className="pb-8 bg-black"/>
      <Slot />
      <StatusBar style="dark"/>
    </>
  );
}
