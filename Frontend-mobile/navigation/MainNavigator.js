import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthStack from "./AuthStack";
import UserStack from "./UserStack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native";
import { useTheme } from "react-native-paper";
import { StatusBar } from "react-native";
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

  if (loading) return <ActivityIndicator />;

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={paper.colors.tertiary}
        translucent={false}
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
