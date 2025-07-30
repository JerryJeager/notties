import { View, Text, FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

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
  return (
    <View className="bg-black px-6 pb-6 flex-1">
      <View className="gap-4 flex-row">
        <View className="gap-2">
          <Text className="p-2 bg-secondary text-white rounded-lg">All</Text>
        </View>
        <FlatList
          data={folders}
          horizontal
          renderItem={({ item, index }) => <Text className="text-white mr-3 rounded-lg bg-secondary p-2" key={index}>{item}</Text>}
        />
        <View className="p-2 bg-secondary text-white rounded-lg">
          <MaterialIcons name="folder" size={20} color="#ffd33d" />
        </View>
      </View>
      <Text className="text-red-400 justify-center">NoteScreen</Text>
    </View>
  );
};

export default NoteScreen;
