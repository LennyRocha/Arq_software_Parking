import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { TextInput, Button, Text, Divider } from "react-native-paper";
import {
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import fondoCorto from "../../img/fondo_corto.png";
import logo from "../../img/logo_parking_hd_no_titulo.png";

const gradient1 = ["#1E3A3E", "#1F4D4C", "#397974", "#4B7C7B"];
const gradient2 = ["#0D2226", "#1E3A3E", "#21484E", "#255A60", "#2A6F77"];
const gradient3 = ["#0C2727", "#1E4342", "#1F4D4C", "#236260", "#277A77"];

export default function Login() {
  return (
    <>
      <LinearGradient
        colors={gradient3}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, width: "100%", zIndex: 2 }}
          >
            <ScrollView
              contentContainerStyle={{
                justifyContent: "center",
                paddingHorizontal: 25,
                paddingVertical: 50,
                gap: 20,
                zIndex: 1,
                backgroundColor: "transparent",
              }}
              keyboardShouldPersistTaps="handled"
            >
              <Text
                variant="labelLarge"
                style={{ color: "white", textAlign: "center" }}
              >
                Bienvenido
              </Text>
              <Image
                source={logo}
                style={{
                  width: "80%",
                  resizeMode: "contain",
                  aspectRatio: 1,
                  alignSelf: "center",
                }}
              />

              <Text
                style={{
                  color: "white",
                  fontFamily: "Exo2_700Bold",
                  textAlign: "center",
                }}
                variant="headlineLarge"
              >
                Iniciar sesión
              </Text>

              <TextInput label="Correo" mode="flat" />
              <TextInput label="Contraseña" mode="flat" secureTextEntry />
              <Text
                variant="bodyLarge"
                style={{ color: "white", textAlign: "right" }}
              >
                ¿Olvidaste tu contraseña?
              </Text>

              <Button
                mode="contained"
                style={{
                  width: "100%",
                  borderRadius: 5,
                }}
                labelStyle={{
                  fontFamily: "Exo2_700Bold",
                }}
              >
                Acceder
              </Button>
              <Divider style={{ backgroundColor: "white" }} />
              <Text
                variant="titleSmall"
                style={{ color: "white", textAlign: "center" }}
              >
                ¿No tienes cuenta? Regístrate aquí
              </Text>
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </LinearGradient>
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
