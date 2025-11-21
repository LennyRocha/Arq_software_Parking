import { View, Image, KeyboardAvoidingView, Platform } from "react-native";
import CustomMultiSteps from "../../../components/CustomMultiSteps";
import { Button, HelperText, Text, TextInput, useTheme } from "react-native-paper";
import React from "react";
import BoxStyles from "../../../utils/genericScreenStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import fondoCorto from "../../../img/fondo_corto.png";
import { ScrollView } from "react-native-gesture-handler";

export default function Signup() {
  const paper = useTheme();
  const Vista1 = () => (
    <View
      style={[
        {
          flex: 1,
          width: "100%",
          height: "100%",
          justifyContent: "center",
          gap: 0,
        },
      ]}
    >
      <Text variant="labelLarge" style={{ color: paper.colors.secondary }}>Datos personales</Text>
      <TextInput label={"Nombre (s);"} placeholder="Ingresa tu nombre" />
      <HelperText type="info" visible style={{ alignSelf: "flex-end", color: paper.colors.gray }}>
        0/50
      </HelperText>
      <TextInput label={"Apellido (s)"} placeholder="Ingresa tus apellidos" />
      <HelperText type="info" visible style={{ alignSelf: "flex-end", color: paper.colors.gray }}>
        0/50
      </HelperText>
      <TextInput label={"Correo electrónico"} placeholder="Ingresa tu correo elctrónico" inputMode="email" />
      <HelperText type="info" visible style={{ alignSelf: "flex-end", color: paper.colors.gray }}>
        0/50
      </HelperText>
      <TextInput label={"Teléfono"} placeholder="Ingresa tu número de teléfono" inputMode="tel" />
      <HelperText type="info" visible style={{ alignSelf: "flex-end", color: paper.colors.gray }}>
        0/10
      </HelperText>
    </View>
  );
  const Vista2 = () => (
    <View
      style={[
        {
          backgroundColor: "green",
          flex: 1,
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
      ]}
    >
      <Text>Slide 2</Text>
    </View>
  );
  const Vista3 = () => (
    <View
      style={[
        {
          backgroundColor: "blue",
          flex: 1,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
      ]}
    >
      <Text>Slide 3</Text>
    </View>
  );
  return (
    <>
      <SafeAreaView style={{ flex: 1, zIndex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }} keyboardVerticalOffset={100}>
          <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
            <View style={{ width: "100%", paddingHorizontal: 24, height: "auto" }}>
              <Text variant="displaySmall" style={[BoxStyles.font700, { color: paper.colors.tertiary }]}>Crea tu cuenta</Text>
            </View>
            <CustomMultiSteps
              stepProps={{
                buttonNextText: "Siguiente",
                buttonPreviousText: "Anterior",
                buttonFinishText: "Completar",
              }}
              showButtons={false}
              steps={[
                { label: "Paso 1", content: <Vista1 /> },
                { label: "Paso 2", content: <Vista2 /> },
                { label: "Paso 3", content: <Vista3 /> }
              ]}
            />
          </ScrollView>
        </KeyboardAvoidingView>
        <Image
          source={fondoCorto}
          style={{
            width: "100%",
            position: "absolute",
            bottom: 0,
            left: 0,
            aspectRatio: 16 / 9,
            zIndex: -1
          }}
        />
      </SafeAreaView >
    </>
  );
}
