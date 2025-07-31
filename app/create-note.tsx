import { Link } from "expo-router";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { v4 as uuidv4 } from "uuid";
import { NoteType } from "./(tabs)";
import { getData, storeData } from "@/utils/store";
import "react-native-get-random-values";

const CreateNoteScreen = () => {
  const date = new Date();
  const dateString = `${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()}`;
  const scrollViewRef = useRef<ScrollView>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const navigation = useNavigation<any>();

  const saveNote = async (value: NoteType) => {
    const allNotes = await getData("notties/notes");
    if (allNotes == null) {
      let data: any = [value];
      //   console.log(data);
      data = JSON.stringify(data);
      await storeData("notties/notes", data);
    } else {
      const notes = JSON.parse(allNotes);
      if (Array.isArray(notes)) {
        notes.push(value);
        await storeData("notties/notes", JSON.stringify(notes));
      } else {
        console.error("Stored value is not an array; resetting notes.");
        const data = [value];
        await storeData("notties/notes", JSON.stringify(data));
      }
    }
    // console.log("saved");
  };

  const handleGoBack = async () => {
    if (title.trim() || body.trim()) {
      const data: NoteType = {
        id: uuidv4(),
        body: body,
        title: title,
        created_at: dateString,
      };
      //   console.log(data);
      await saveNote(data);
    }
    navigation.navigate("(tabs)");
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener(
      "beforeRemove",
      async (e: any) => {
        if (title.trim() || body.trim()) {
          e.preventDefault();
          const data: NoteType = {
            id: uuidv4(),
            body: body,
            title: title,
            created_at: dateString,
          };
          console.log(data);
          await saveNote(data);
        //   console.log("saved via back");
          navigation.dispatch(e.data.action);
        }
      }
    );
    return unsubscribe;
  }, [navigation, title, body]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      style={{ flex: 1, backgroundColor: "#000" }}
      className="p-6"
    >
      <View className="pb-4">
        <Pressable onPress={handleGoBack}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </Pressable>
      </View>

      <ScrollView
        ref={scrollViewRef}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: "#000" }} // Ensure ScrollView background is black
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: "#000",
          paddingBottom: 20,
        }} // Ensure content fills and has padding
      >
        <View className="flex-1">
          <TextInput
            placeholder="Title"
            className="text-white placeholder:text-secondary placeholder:text-3xl mb-4"
            value={title}
            onChangeText={setTitle}
          />
          <Text className="text-slate-600 ml-2 mb-4">{dateString}</Text>
          <TextInput
            placeholder="Start typing"
            multiline
            textAlignVertical="top"
            className="text-white placeholder:text-secondary placeholder:text-xl"
            value={body}
            onChangeText={setBody}
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
