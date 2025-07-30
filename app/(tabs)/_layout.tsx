import { Slot, Tabs } from "expo-router";
import { Text, View } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import NoteScreen from ".";
import TodoScreen from "./todo";
import { Ionicons } from "@expo/vector-icons";

const Tab = createMaterialTopTabNavigator();

const Layout = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#ffd33d",
        tabBarStyle: {
          backgroundColor: "#000",
        },
        tabBarIndicatorStyle:{
            height: 0
        } 
      }}
    >
      <Tab.Screen
        name="index"
        options={{
          title: "Home",
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "book" : "book-outline"}
              color={color}
              size={24}
            />
          ),
        }}
        component={NoteScreen}
      />
      <Tab.Screen
        name="todo"
        options={{
          title: "Todo",
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "checkbox" : "checkbox-outline"}
              color={color}
              size={24}
            />
          ),
        }}
        component={TodoScreen}
      />
    </Tab.Navigator>
  );
};

export default Layout;
