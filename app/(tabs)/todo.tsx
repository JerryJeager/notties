import { getData, removeData, storeData } from "@/utils/store";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  TextInput,
  FlatList,
} from "react-native";
import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";

export type Todo = {
  id: string;
  todo: string;
  status: "completed" | "pending";
};

const TodoScreen = () => {
  const [completedTodos, setCompletedTodos] = useState<Todo[] | []>([]);
  const [pendingTodos, setPendingTodos] = useState<Todo[] | []>([]);
  const [newTodo, setNewTodo] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompletedVisible, setIsCompletedVisible] = useState(false);

  useEffect(() => {
    const getAllTodos = async () => {
      const allTodos = await getData("notties/todos");
      if (allTodos != null) {
        let data: Todo[] = JSON.parse(allTodos);
        if (Array.isArray(data)) {
          let completed = data.filter((d) => d.status == "completed");
          let pending = data.filter((d) => d.status == "pending");
          setCompletedTodos(completed);
          setPendingTodos(pending);
        }
      }
    };
    getAllTodos();
  }, []);

  const addTodo = async () => {
    if (newTodo) {
      const todo: Todo = {
        id: uuidv4(),
        status: "pending",
        todo: newTodo,
      };
      const allTheTodos = await getData("notties/todos");
      if (allTheTodos == null) {
        await storeData("notties/todos", JSON.stringify([todo]));
      } else if (Array.isArray(JSON.parse(allTheTodos))) {
        await storeData(
          "notties/todos",
          JSON.stringify(JSON.parse(allTheTodos)?.push(todo))
        );
      }
      setPendingTodos((tds) => [...tds, todo]);
    }
    setIsModalOpen(false);
    setNewTodo("");
  };

  const markAsComplete = async (updatedTd: Todo) => {
    if (pendingTodos != null) {
      const updatedTodos: Todo[] = pendingTodos.map((p) => {
        if (p.id == updatedTd.id) {
          p.status = "completed";
        }
        return p;
      });
      await storeData("notties/todos", JSON.stringify(updatedTodos));
      setPendingTodos(p => updatedTodos.filter((td) => td.status === "pending"));
      setCompletedTodos(c => updatedTodos.filter((td) => td.status === "completed"));
    }
  };

  const markAsPending = async (updatedTd: Todo) => {
    if (completedTodos != null) {
      const updatedTodos: Todo[] = pendingTodos.map((p) => {
        if (p.id == updatedTd.id) {
          p.status = "pending";
        }
        return p;
      });
      await storeData("notties/todos", JSON.stringify(updatedTodos));
      setPendingTodos(p => updatedTodos.filter((td) => td.status === "pending"));
      setCompletedTodos(c => updatedTodos.filter((td) => td.status === "completed"));
    }
  };

  return (
    <View className="bg-black flex-1 px-6 pb-6">
      <View className="mt-4 pb-6 flex-1">
        {completedTodos.length < 1 && pendingTodos.length < 1 && (
          <View className="flex-1 justify-center items-center">
            <Text className="text-center  text-white text-xl">
              You've not added any tasks yet
            </Text>
          </View>
        )}
        {pendingTodos.length > 0 && (
          <View>
            <FlatList
              data={pendingTodos}
              renderItem={({ item, index }) => (
                <View
                  key={index}
                  className="bg-secondary p-4 rounded-xl flex-row gap-3 mb-3"
                >
                  <Pressable onPress={() => markAsComplete(item)}>
                    <MaterialIcons
                      name="check-box-outline-blank"
                      color="white"
                      size={20}
                    />
                  </Pressable>
                  <Text className="text-white">{item.todo}</Text>
                </View>
              )}
            />
          </View>
        )}
        {completedTodos.length > 0 && (
          <View>
            <FlatList
              data={completedTodos}
              renderItem={({ item, index }) => (
                <View
                  key={index}
                  className="bg-secondary p-4 rounded-xl flex-row gap-3 mb-3"
                >
                  <Pressable onPress={() => markAsPending(item)}>
                    <MaterialIcons name="check-box" color="white" size={20} />
                  </Pressable>
                  <Text className="text-white">{item.todo}</Text>
                </View>
              )}
            />
          </View>
        )}
      </View>
      <Pressable
        onPress={() => setIsModalOpen(true)}
        className="p-3 rounded-full bg-primary w-fit absolute bottom-24 right-[20]"
      >
        <MaterialIcons name="add" size={24} color="white" />
      </Pressable>

      <Modal visible={isModalOpen} animationType="slide" transparent={true}>
        <Pressable style={{ flex: 1 }} onPress={() => setIsModalOpen(false)}>
          <View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              //   height: 180,
              borderTopRightRadius: 30,
              borderTopLeftRadius: 30,
              backgroundColor: "#25292e",
              padding: 30,
              marginHorizontal: 0,
            }}
            onStartShouldSetResponder={() => true}
          >
            <View className="flex-1">
              <View className="gap-2 flex-row items-center">
                <MaterialIcons
                  name="check-box-outline-blank"
                  size={20}
                  color="#64748b"
                />
                <TextInput
                  value={newTodo}
                  onChangeText={(text) => setNewTodo(text.replace(/\n/g, ""))}
                  className="text-white placeholder:text-slate-500 w-full"
                  placeholder="write task"
                  multiline
                />
              </View>
              <Pressable
                className="justify-end items-end w-full"
                onPress={addTodo}
              >
                <Text className="text-slate-500">Done</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default TodoScreen;
