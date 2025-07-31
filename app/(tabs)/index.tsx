import { View, Text, FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import NoteCards, { NoteCardType } from "@/components/Notes/NoteCards";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { getData } from "@/utils/store";

export type NoteType = {
  id: string;
  title: string;
  body: string;
  created_at: string;
};

const NoteScreen = () => {
  const folders: string[] = [
    "research",
    "school",
    "finance",
    "health",
    "diary",
    "family",
    "church",
  ];

  const [allNotes, setAllNotes] = useState<NoteType[] | null>(null);

  useEffect(() => {
    const getAllNotes = async () => {
      const allNotes = await getData("notties/notes");
      if (allNotes != null) {
        let data = JSON.parse(allNotes);
        if (Array.isArray(data)) {
          setAllNotes(data);
        }
      }
    };

    getAllNotes();
  }, []);

  return (
    <View className="bg-black px-6 pb-6 flex-1">
      <View className="gap-4 flex-row">
        <View className="gap-2">
          <Text className="p-2 bg-secondary text-white rounded-lg">All</Text>
        </View>
        <FlatList
          data={folders}
          horizontal
          renderItem={({ item, index }) => (
            <Text
              className="text-white mr-3 rounded-lg bg-secondary p-2"
              key={index}
            >
              {item}
            </Text>
          )}
        />
        <View className="p-2 bg-secondary text-white rounded-lg">
          <MaterialIcons name="folder" size={20} color="#ffd33d" />
        </View>
      </View>
      <View className="mt-4 pb-6 flex-1">
        {allNotes && allNotes?.length > 0 ? (
          <FlatList
            data={allNotes.reverse()}
            renderItem={({ item, index }) => (
              <NoteCards
                id={item.id}
                key={index}
                body={item.body}
                created_at={item.created_at}
                title={item.title}
              />
            )}
          />
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text className="text-center  text-white text-xl">
              You've not added any notes yet
            </Text>
          </View>
        )}
      </View>

      <Link
        href="/create-note"
        className="p-3 rounded-full bg-primary w-fit absolute bottom-24 right-[20]"
      >
        <MaterialIcons name="add" size={24} color="white" />
      </Link>
    </View>
  );
};

export default NoteScreen;
