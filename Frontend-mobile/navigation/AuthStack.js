import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View } from "react-native";

//Appbar
import { Appbar, useTheme } from "react-native-paper";

//Pantallas
import Login from "../modules/acceso/screens/Login";
import Signup from "../modules/acceso/screens/Signup";
import RecuContra from "../modules/acceso/screens/RecuContra";

const Stack = createNativeStackNavigator();

export default function AuthStack({ navigation }) {
  const parent = navigation;
  const paper = useTheme();
  return (
    <Stack.Navigator
      screenOptions={({ route, navigation }) => ({
        animation: "fade",
        headerShown: route.name !== "login",
        header: () => (
          <Appbar.Header
            style={{
              backgroundColor: paper.colors.background,
            }}
            elevated
          >
            <Appbar.BackAction onPress={() => navigation.popToTop()} />
          </Appbar.Header>
        ),
        contentStyle: { backgroundColor: paper.colors.background },
      })}
      initialRouteName="login"
    >
      <Stack.Screen name="login">
        {(props) => <Login {...props} dad={parent} />}
      </Stack.Screen>
      <Stack.Screen name="recovery" component={RecuContra} />
      <Stack.Screen name="signup" component={Signup} />
    </Stack.Navigator>
  );
}
