import { View, Text } from "react-native";
import React from "react";
import BoxStyles from "../../../utils/genericScreenStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "react-native-paper";
import { useCustomThemes } from "../../../context/useCustomColors";

export default function Perfil({ dad, ruta }) {
  const { toggleTheme } = useCustomThemes();
  //Prueba de acceso
  async function unsetUser() {
    await AsyncStorage.removeItem("user");
    dad.navigate("Auth",{ screen: "login" })
  }
  return (
    <View style={[BoxStyles.container, BoxStyles.flexCentered]}>
      <Text>Perfil</Text>
      <Button onPress={unsetUser} mode="contained-tonal">
        Cerrar sesión
      </Button>
      <Button onPress={() => toggleTheme()} mode="contained-tonal">
        Cambiar tema
      </Button>
    </View>
  );
}
