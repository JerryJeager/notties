import { View, Text, FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import NoteCards, { NoteCardType } from "@/components/Notes/NoteCards";
import { Link } from "expo-router";

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

  const notecards: NoteCardType[] = [
    {
      title: "Grocery List",
      body: "Buy milk, eggs, bread, and some fruits for the week.",
      created_at: "2025-07-28T09:30:00Z",
    },
    {
      title: "Meeting Notes",
      body: "Discussed project milestones and upcoming deadlines. Need to prepare the demo by Friday.",
      created_at: "2025-07-27T14:15:00Z",
    },
    {
      title: "Book Idea",
      body: "A story about a forgotten town where time moves differently. Main character is a watchmaker.",
      created_at: "2025-07-25T18:45:00Z",
    },
    {
      title: "Workout Plan",
      body: "Monday: Push. Tuesday: Pull. Wednesday: Legs. Thursday: Cardio. Friday: Full Body.",
      created_at: "2025-07-26T07:20:00Z",
    },
    {
      title: "Quote",
      body: "“Discipline is choosing between what you want now and what you want most.”",
      created_at: "2025-07-24T12:05:00Z",
    },
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
      <View className="mt-4">
        <FlatList
          data={notecards}
          renderItem={({ item, index }) => <NoteCards key={index} {...item} />}
        />
      </View>

      <Link href="/create-note" className="p-3 rounded-full bg-primary w-fit absolute bottom-24 right-[20]">
        <MaterialIcons name="add" size={24} color="white"/>
      </Link>
    </View>
  );
};

export default NoteScreen;
