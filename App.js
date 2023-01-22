import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import { db, auth } from "./firebase";
import LoginScreen from "./src/screens/LoginScreen";
import { onAuthStateChanged, signOut } from "firebase/auth";
import MainScreen from "./src/screens/MainScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import { THEME } from "./theme";
import RequestsScreen from "./src/screens/RequestsScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function LoginNavigation() {
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerShown: false,
      })}
    >
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
    </Stack.Navigator>
  );
}

function RootNavigation() {
  return (
    <Tab.Navigator
      screenOptions={() => ({
        tabBarActiveTintColor: THEME.MAIN_COLOR,
        tabBarStyle: {
          height: 90,
        },
      })}
      initialRouteName="MainScreen"
    >
      <Tab.Screen
        name="MainScreen"
        component={MainScreen}
        options={{
          title: "Главная",
          tabBarIcon: ({ color }) => <Ionicons name="compass-outline" size={28} color={color} />,
        }}
      />
      <Tab.Screen
        name="RequestsScreen"
        component={RequestsScreen}
        options={{
          title: "Запросы на обмен",
          tabBarIcon: ({ color }) => <Ionicons name="swap-horizontal-outline" size={28} color={color} />,
        }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          title: "Мой профиль",
          tabBarIcon: ({ color }) => <Ionicons name="person-circle-outline" size={28} color={color} />,
          headerRight: () => <Ionicons name="log-out-outline" size={24} color="#cc4b41" style={{ marginRight: 20 }} onPress={() => signOut(auth)} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (resUser) => {
      if (resUser) {
        setUser(resUser);
        setIsReady(true);
      } else {
        setIsReady(false);
      }
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar />
      <NavigationContainer>{isReady ? <RootNavigation /> : <LoginNavigation />}</NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
