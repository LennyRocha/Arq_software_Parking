import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthStack from "./AuthStack";
import UserStack from "./UserStack";
import { useTheme } from "react-native-paper";
import { StatusBar } from "react-native";
import LoadingView from "../components/LoadingView";
import { Session } from "../modules/acceso/hooks/TokenManagement";

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  const [user, setUser] = useState(null);
  const [ isExpired, setIsExpired ] = React.useState(false);
  const [loading, setLoading] = useState(true);
  const paper = useTheme();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await Session.getUser();
        const isTokenExpired = await Session.isExpired();
        console.log("¿Expiró el token?: ", isTokenExpired);
        setUser(storedUser);
        setIsExpired(isTokenExpired);
      } catch (err) {
        console.error("Error al obtener usuario:", err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  if (loading) return <LoadingView />;

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
        initialRouteName={user === null || isExpired ? "Auth" : "User"}
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
