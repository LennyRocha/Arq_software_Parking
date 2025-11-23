import { View, Image, KeyboardAvoidingView, Platform } from "react-native";
import CustomMultiSteps from "../../../components/CustomMultiSteps";
import { Button, HelperText, IconButton, Text, TextInput, useTheme, Checkbox } from "react-native-paper";
import React from "react";
import BoxStyles from "../../../utils/genericScreenStyles";
import fondoCorto from "../../../img/fondo_corto.png";
import { ScrollView } from "react-native-gesture-handler";
import { MaskedTextInput } from "react-native-mask-text";

import usePensiones from "../../pension/hooks/usePensiones";
import LoadingView from "../../../components/LoadingView";
import ErrorAxios from "../../errores/screens/ErroresScreens";
import EmptyListView from "../../errores/screens/EmptyListView";

export default function Signup({ navigation }) {
  const paper = useTheme();

  const openModal = () => {
    console.log("Uniendose")
  }

  const { data, isLoading, error, renderedList, restartCall } = usePensiones(navigation, openModal);

  //Datos del usuario
  const [tel, setTel] = React.useState("");

  //Datos del vehículo
  const [noPlaca, setNoPlaca] = React.useState(false);

  //Datos de la pensión

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
      <TextInput label={"Correo electrónico"} placeholder="Ingresa tu correo elctrónico" inputMode="email" keyboardType="email-address" />
      <HelperText type="info" visible style={{ alignSelf: "flex-end", color: paper.colors.gray }}>
        0/50
      </HelperText>
      <TextInput
        mode="flat"
        label={"Teléfono"}
        placeholder="Ingresa tu número de teléfono"
        keyboardType="phone-pad"
        inputMode="tel"
        render={inputProps => (
          <MaskedTextInput
            {...inputProps}
            mask="999 999 9999"
            style={[inputProps.style]}
          />
        )}
      />
      <HelperText type="info" visible style={{ alignSelf: "flex-end", color: paper.colors.gray }}>
        0/10
      </HelperText>
    </View>
  );
  const Vista2 = () => (
    <View
      style={[
        {
          flex: 1,
          width: "100%",
          height: "100%",
          justifyContent: "center",
        },
      ]}
    >
      <Text variant="labelLarge" style={{ color: paper.colors.secondary, textAlign: "left", width: "100%" }}>Registro de vehículos</Text>
      <View style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "space-between" }}>
        <Text variant="labelMedium" >0 Vehículos registrados</Text>
        <IconButton icon={"eye"} size={24} onPress={() => { }} />
      </View>
      <TextInput label={"Modelo del vehículo"} placeholder="Ingresa el modelo de tu vehículo" maxLength={50} />
      <HelperText type="info" visible style={{ alignSelf: "flex-end", color: paper.colors.gray }}>
        0/50
      </HelperText>
      <TextInput label={"Placa del vehículo"} placeholder="Ingresa el modelo de tu vehículo" maxLength={7} disabled={noPlaca} />
      <HelperText type="info" visible style={{ alignSelf: "flex-end", color: paper.colors.gray }}>
        0/7
      </HelperText>
      <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between", alignItems: "center", marginVertical: 12 }}>
        <Text variant='labelLarge'>No tiene placa</Text>
        <Checkbox
          status={noPlaca ? "checked" : "unchecked"}
          onPress={() => setNoPlaca(!noPlaca)}
        />
      </View>
      <TextInput label={"Descripción del vehículo"} placeholder="Ingresa el modelo de tu vehículo" maxLength={250} multiline numberOfLines={3} style={{ height: 112, textAlignVertical: "top" }} />
      <HelperText type="info" visible style={{ alignSelf: "flex-end", color: paper.colors.gray }}>
        0/250
      </HelperText>
      <Button
        mode="contained"
        theme={{
          colors: {
            primary: paper.colors.tertiary,
          }
        }}
        onPress={() => { }}
        style={BoxStyles.ButtonRadius} labelStyle={BoxStyles.buttonText}>Guardar vehículo</Button>
    </View>
  );
  const Vista3 = () => {
    if (isLoading) return <LoadingView />;
    if (error) return <ErrorAxios error={error} callback={restartCall} />
    return (
      <View
        style={[
          {
            flex: 1,
            gap: 12,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        {data?.data.length === 0 ? <EmptyListView message={"No hay pensiones registradas"} icon={"folder-off"} /> :
          <>
            <Text variant="labelLarge" style={{ color: paper.colors.secondary, textAlign: "left", width: "100%" }}>Seleccionar una pensión</Text>
            {renderedList}
          </>
        }
      </View>
    )
  };

  return (
    <View style={{ flex: 1, paddingVertical: 24 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
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
    </View>
  );
}
