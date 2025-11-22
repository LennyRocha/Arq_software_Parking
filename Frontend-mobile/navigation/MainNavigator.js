import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthStack from "./AuthStack";
import UserStack from "./UserStack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native";
import { useTheme } from "react-native-paper";
import { StatusBar } from "react-native";
import changeNavigationBarColor from "react-native-navigation-bar-color";
import { hideNavigationBar } from "react-native-navigation-bar-color";

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const paper = useTheme();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        setUser(storedUser);
      } catch (err) {
        console.error("Error al obtener usuario:", err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (Platform.OS !== "android") return;
      try {
        const navColor = paper?.colors?.primary ?? "#1E3A3E";
        const response = await changeNavigationBarColor(navColor);
        if (mounted) console.log("changeNavigationBarColor ->", response);
      } catch (e) {
        console.warn("changeNavigationBarColor failed ->", e);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [paper?.colors?.primary]); // re-ejecuta si cambia el color del theme

  if (loading) return <ActivityIndicator />;

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={paper.colors.primary}
        translucent={true}
      />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
        }}
        initialRouteName={user === null ? "Auth" : "User"}
      >
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen
          name="User"
          component={UserStack}
          initialParams={{ screen: "home" }}
        />
      </Stack.Navigator>
    </>
  );
}
