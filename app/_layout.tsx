import { View, SafeAreaView, Platform } from "react-native";
import "./global.css";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <View className="pt-6" style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar style="light" />
      <Slot />
    </View>
  );
}
