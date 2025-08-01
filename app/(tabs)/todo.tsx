import { getData, storeData } from "@/utils/store";
import { MaterialIcons } from "@expo/vector-icons";
import { runOnJS } from "react-native-reanimated";
import { useEffect, useMemo, useState } from "react";
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
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

export type Todo = {
  id: string;
  todo: string;
  status: "completed" | "pending";
};

const TodoScreen = () => {
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);
  const [pendingTodos, setPendingTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo>();

  useEffect(() => {
    const getAllTodos = async () => {
      try {
        const allTodos = await getData("notties/todos");
        if (allTodos) {
          const data: Todo[] = JSON.parse(allTodos);
          if (Array.isArray(data)) {
            setCompletedTodos(data.filter((d) => d.status === "completed"));
            setPendingTodos(data.filter((d) => d.status === "pending"));
          }
        }
      } catch (error) {
        console.error("Error loading todos:", error);
      }
    };
    getAllTodos();
  }, []);

  const addTodo = async () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: uuidv4(),
        status: "pending",
        todo: newTodo,
      };
      try {
        const allTheTodos = await getData("notties/todos");
        let todos: Todo[] = allTheTodos ? JSON.parse(allTheTodos) : [];
        if (!Array.isArray(todos)) {
          todos = [];
        }
        todos.push(todo);
        await storeData("notties/todos", JSON.stringify(todos));
        setPendingTodos((prev) => [...prev, todo]);
        setNewTodo("");
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    }
  };

  const markAsComplete = async (updatedTd: Todo) => {
    try {
      const allTodos = [...pendingTodos, ...completedTodos];
      const updatedTodos = allTodos.map((todo) =>
        todo.id === updatedTd.id ? { ...todo, status: "completed" } : todo
      );
      await storeData("notties/todos", JSON.stringify(updatedTodos));
      setPendingTodos(
        updatedTodos.filter((td): td is Todo => td.status === "pending")
      );
      setCompletedTodos(
        updatedTodos.filter((td): td is Todo => td.status === "completed")
      );
    } catch (error) {
      console.error("Error marking as complete:", error);
    }
  };

  const markAsPending = async (updatedTd: Todo) => {
    try {
      const allTodos = [...pendingTodos, ...completedTodos];
      const updatedTodos = allTodos.map((todo) =>
        todo.id === updatedTd.id ? { ...todo, status: "pending" } : todo
      );
      await storeData("notties/todos", JSON.stringify(updatedTodos));
      setPendingTodos(
        updatedTodos.filter((td): td is Todo => td.status === "pending")
      );
      setCompletedTodos(
        updatedTodos.filter((td): td is Todo => td.status === "completed")
      );
    } catch (error) {
      console.error("Error marking as pending:", error);
    }
  };

  const deleteTodo = async () => {
    if (!selectedTodo) return;

    try {
      const allTodos = [...pendingTodos, ...completedTodos];
      const updatedTodos = allTodos.filter(
        (todo) => todo.id !== selectedTodo.id
      );
      await storeData("notties/todos", JSON.stringify(updatedTodos));
      setPendingTodos(
        updatedTodos.filter((td): td is Todo => td.status === "pending")
      );
      setCompletedTodos(
        updatedTodos.filter((td): td is Todo => td.status === "completed")
      );
      setIsDeleteModalOpen(false);
      setSelectedTodo(undefined);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const createLongPressGesture = (todo: Todo) => {
    return Gesture.LongPress()
      .minDuration(300)
      .onStart(() => {
        runOnJS(setSelectedTodo)(todo);
        runOnJS(setIsDeleteModalOpen)(true);
      });
  };

  return (
    <GestureHandlerRootView>
      <View className="bg-black flex-1 px-6 pb-6">
        <View className="mt-4 pb-6 flex-1">
          {completedTodos.length === 0 && pendingTodos.length === 0 && (
            <View className="flex-1 justify-center items-center">
              <Text className="text-center text-white text-xl">
                You've not added any tasks yet
              </Text>
            </View>
          )}
          {pendingTodos.length > 0 && (
            <View>
              <Text className="text-white text-lg mb-2">Pending Tasks</Text>
              <FlatList
                data={pendingTodos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  return (
                    <GestureDetector gesture={createLongPressGesture(item)}>
                      <Pressable className="bg-secondary p-4 rounded-xl flex-row gap-3 mb-3">
                        <Pressable onPress={() => markAsComplete(item)}>
                          <MaterialIcons
                            name="check-box-outline-blank"
                            color="white"
                            size={20}
                          />
                        </Pressable>
                        <Text className="text-white">{item.todo}</Text>
                      </Pressable>
                    </GestureDetector>
                  );
                }}
              />
            </View>
          )}
          {completedTodos.length > 0 && (
            <View>
              <Text className="text-white text-lg mb-2">Completed Tasks</Text>
              <FlatList
                data={completedTodos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <GestureDetector gesture={createLongPressGesture(item)}>
                    <View className="bg-secondary p-4 rounded-xl flex-row gap-3 mb-3">
                      <Pressable onPress={() => markAsPending(item)}>
                        <MaterialIcons
                          name="check-box"
                          color="white"
                          size={20}
                        />
                      </Pressable>
                      <Text className="text-white">{item.todo}</Text>
                    </View>
                  </GestureDetector>
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
                borderTopRightRadius: 30,
                borderTopLeftRadius: 30,
                backgroundColor: "#25292e",
                padding: 30,
              }}
              onStartShouldSetResponder={() => true}
            >
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
                  placeholder="Write task"
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
          </Pressable>
        </Modal>

        <Modal
          visible={isDeleteModalOpen}
          animationType="slide"
          transparent={true}
        >
          <Pressable
            style={{ flex: 1 }}
            onPress={() => setIsDeleteModalOpen(false)}
          >
            <View
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                borderTopRightRadius: 30,
                borderTopLeftRadius: 30,
                backgroundColor: "#25292e",
                padding: 30,
              }}
              onStartShouldSetResponder={() => true}
            >
              <Text className="text-center font-semibold text-white text-xl">
                Delete Task
              </Text>
              <Text className="text-center text-white mt-3">
                Are you sure you want to delete this task?
              </Text>

              <View className="flex-row gap-5 items-center justify-center mt-4 w-full">
                <Pressable
                  onPress={() => setIsDeleteModalOpen(false)}
                  className="rounded-full py-5 w-1/2 bg-gray-950"
                >
                  <Text className="text-slate-400 text-center">Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={deleteTodo}
                  className="rounded-full w-1/2 py-5 bg-gray-950"
                >
                  <Text className="text-red-700 text-center">Delete</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </Modal>
      </View>
    </GestureHandlerRootView>
  );
};

export default TodoScreen;
