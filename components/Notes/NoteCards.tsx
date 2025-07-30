import { View, Text } from "react-native";

export type NoteCardType = {
  title: string;
  body: string;
  created_at: string;
};

const NoteCards = ({ title, body, created_at }: NoteCardType) => {
  return (
    <View className="bg-secondary p-4 rounded-lg mb-3">
      <Text className="font-bold text-white">{title}</Text>
      <Text className="font-bold mt-2 text-gray-500 line-clamp-1">{body}</Text>
      <Text className="font-bold mt-3 text-xs text-gray-600">{created_at}</Text>
    </View>
  );
};

export default NoteCards;
