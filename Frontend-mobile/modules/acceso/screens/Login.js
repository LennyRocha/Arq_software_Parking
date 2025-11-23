import React, { use } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { TextInput, Button, Text, Divider, useTheme } from "react-native-paper";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  View,
} from "react-native";
import fondoCorto from "../../../img/fondo_corto.png";
import logo from "../../../img/logo_parking_hd_no_titulo.png";
import { useCustomThemes } from "../../../context/useCustomColors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import BoxStyles from "../../../utils/genericScreenStyles";

const gradient1 = ["#1E3A3E", "#1F4D4C", "#397974", "#4B7C7B"];
const gradient2 = ["#0D2226", "#1E3A3E", "#21484E", "#255A60", "#2A6F77"];
const gradient3 = ["#0C2727", "#1E4342", "#1F4D4C", "#236260", "#277A77"];

export default function Login() {
  const navigation = useNavigation();
  const { theme } = useCustomThemes();
  const paper = useTheme();
  const [visible, setVisible] = React.useState(false);
  //Prueba de acceso
  async function setUser() {
    try {
      const user = {
        name: "LO",
      };
      await AsyncStorage.setItem("user", JSON.stringify(user));

      // Get root navigation and reset
      const rootNavigation = navigation.getParent();
      if (rootNavigation) {
        rootNavigation.reset({
          index: 0,
          routes: [{ name: "User" }],
        });
      } else {
        // Fallback if no parent navigator
        navigation.reset({
          index: 0,
          routes: [{ name: "User" }],
        });
      }
    } catch (err) {
      console.error("Error setting user:", err);
    }
  }
  return (
    <>
      {/* <LinearGradient
        colors={gradient3}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      > */}
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
        touchSoundDisabled={Keyboard.isVisible ? true : false}
        style={{backgroundColor: "transparent"}}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, width: "100%", zIndex: 2, backgroundColor: "transparent" }}
        >
          <ScrollView
            contentContainerStyle={{
              justifyContent: "center",
              paddingHorizontal: 24,
              paddingVertical: 50,
              gap: 20,
              zIndex: 1,
              backgroundColor: "transparent",
            }}
            keyboardShouldPersistTaps="handled"
          >
            <Text
              variant="labelLarge"
              style={{ color: paper.colors.onBackground, textAlign: "center" }}
            >
              Bienvenido
            </Text>
            <Image
              source={logo}
              style={{
                width: "50%",
                aspectRatio: 4 / 3,
                height: "auto",
                resizeMode: "contain",
                alignSelf: "center",
              }}
            />
            <Text
              style={{
                color: theme.txtTertiary,
                fontFamily: "Exo2_700Bold",
                textAlign: "center",
              }}
              variant="headlineLarge"
            >
              Iniciar sesión
            </Text>

            <TextInput
              label="Correo electrónico"
              mode="flat"
              keyboardType="email-address"
              placeholder="Ingresa tu correo electrónico"
            />
            <TextInput
              label="Contraseña"
              mode="flat"
              secureTextEntry={visible}
              right={
                <TextInput.Icon
                  icon={visible ? "eye" : "eye-off"}
                  onPress={() => setVisible(!visible)}
                />
              }
            />
            <Button
              mode="text"
              onPress={() => navigation.navigate("recovery")}
              style={{ flex: 0, alignSelf: "flex-end", borderRadius: 5 }}
            >
              ¿Olvidaste tu contraseña?
            </Button>
            <Button
              mode="contained"
              style={{
                width: "100%",
                borderRadius: 5,
              }}
              labelStyle={BoxStyles.buttonText}
              onPress={() => setUser()}
            >
              Acceder
            </Button>
            <Divider style={{ backgroundColor: theme.gray }} />
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                variant="titleSmall"
                style={{
                  color: paper.colors.onBackground,
                  textAlign: "center",
                }}
              >
                ¿No tienes cuenta?
              </Text>
              <Button
                mode="text"
                onPress={() => {
                  navigation.navigate("signup");
                }}
                style={{
                  flex: 0,
                  alignSelf: "flex-end",
                  borderRadius: 5,
                  paddingHorizontal: 0,
                }}
              >
                Regístrate aquí
              </Button>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      {/* </LinearGradient> */}
      <Image
        source={fondoCorto}
        style={{
          width: "100%",
          position: "absolute",
          bottom: 0,
          left: 0,
          aspectRatio: 16 / 9,
        }}
      />
    </>
  );
}
