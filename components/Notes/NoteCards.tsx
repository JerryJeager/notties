import { useNavigation } from "@react-navigation/native";
import { Link } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

export type NoteCardType = {
  title: string;
  body: string;
  created_at: string;
  id: string;
};

const NoteCards = ({ id, title, body, created_at }: NoteCardType) => {
  const navigation = useNavigation<any>();
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push({ pathname: "/notes/[id]", params: { id } })}
      className="bg-secondary flex flex-col p-4 rounded-lg mb-3"
    >
      <Text className="font-bold text-white">{title}</Text>
      <Text className="font-bold mt-2 text-gray-500 line-clamp-1 w-full">{body}</Text>
      <Text className="font-bold mt-3 text-xs text-gray-600">{created_at}</Text>
    </Pressable>
  );
};

export default NoteCards;
