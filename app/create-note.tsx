import { Link } from "expo-router";
import { View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRef } from "react";

const CreateNoteScreen = () => {
  const date = new Date();
  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      style={{ flex: 1, backgroundColor: "#000" }}
      className="p-6"
    >
      <View className="pb-4">
        <Link href="/(tabs)">
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </Link>
      </View>

      <ScrollView
        ref={scrollViewRef}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: "#000" }} // Ensure ScrollView background is black
        contentContainerStyle={{ flexGrow: 1, backgroundColor: "#000", paddingBottom: 20 }} // Ensure content fills and has padding
      >
        <View className="flex-1">
          <TextInput
            placeholder="Title"
            className="text-white placeholder:text-secondary placeholder:text-3xl mb-4"
          />
          <Text className="text-slate-600 ml-2 mb-4">{`${date.getDate()}-${
            date.getMonth() + 1
          }-${date.getFullYear()}`}</Text>
          <TextInput
            placeholder="Start typing"
            multiline
            textAlignVertical="top"
            className="text-white placeholder:text-secondary placeholder:text-xl"
            style={{ minHeight: 200 }}
            onFocus={() => {
              scrollViewRef.current?.scrollTo({ y: 100, animated: true });
            }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateNoteScreen;