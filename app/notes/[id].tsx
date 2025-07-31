import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { getData, storeData } from "@/utils/store";
import { NoteType } from "../(tabs)";
import { useNavigation } from "@react-navigation/native";

const ViewNoteScreen = () => {
  const { id } = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [dateString, setDateString] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allNotes, setAllNotes] = useState<NoteType[] | null>(null);
  const navigation = useNavigation<any>();
  useEffect(() => {
    const getAllNotes = async () => {
      const allNotes = await getData("notties/notes");
      if (allNotes != null) {
        let data = JSON.parse(allNotes);
        if (Array.isArray(data)) {
          const note = data.filter((d) => d?.id == id);
          setTitle(note[0]?.title);
          setBody(note[0]?.body);
          setDateString(note[0]?.created_at);
          setAllNotes(data);
        }
      }
    };

    getAllNotes();
  }, []);

  const saveNote = async (value: NoteType) => {
    if (allNotes != null && (title.trim() || body.trim())) {
      const notes = [...allNotes];
      const noteIdx = notes?.findIndex((n) => n?.id == id);
      if (noteIdx != -1) {
        notes[noteIdx] = value;
        console.log(notes);

        await storeData("notties/notes", JSON.stringify(notes));
      }
    }
  };

  const handleGoBack = async () => {
    if (title.trim() || body.trim()) {
      const data: NoteType = {
        id: typeof id === "string" ? id : id[0],
        body: body,
        title: title,
        created_at: dateString,
      };
      // console.log(data);
      await saveNote(data);
    }
    navigation.navigate("(tabs)");
  };

  const handleDelete = async () => {
    if (allNotes != null) {
      const newNotes = allNotes.filter((n) => n.id != id);
      await storeData("notties/notes", JSON.stringify(newNotes));
      navigation.navigate("(tabs)");
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", () => {
      if (title.trim() || body.trim()) {
        const data: NoteType = {
          id: typeof id === "string" ? id : id[0],
          body: body,
          title: title,
          created_at: dateString,
        };
        console.log(data);
        saveNote(data);
      }
    });
    return unsubscribe;
  }, [navigation, title, body]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      style={{ flex: 1, backgroundColor: "#000" }}
      className="p-6"
    >
      <View className="pb-4 flex-row justify-between w-full">
        <Pressable onPress={handleGoBack}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </Pressable>

        <Pressable onPress={() => setIsModalOpen(true)}>
          <MaterialIcons name="delete" size={24} color="red" />
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
      <Modal visible={isModalOpen} animationType="slide" transparent={true}>
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 180,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            backgroundColor: "#25292e",
            padding: 16,
            marginHorizontal: 0,
          }}
        >
          <Text className="text-center font-semibold text-white text-xl">
            Delete Notes
          </Text>
          <Text className="text-center text-white mt-3">delete this note</Text>

          <View className="flex-row gap-5 items-center justify-center mt-4 w-full">
            <Pressable
              onPress={() => setIsModalOpen(false)}
              className="rounded-full py-5 w-1/2 bg-gray-950"
            >
              <Text className="text-slate-400 text-center">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleDelete}
              className="rounded-full w-1/2 py-5 bg-gray-950"
            >
              <Text className="text-red-700 text-center">Delete</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default ViewNoteScreen;
