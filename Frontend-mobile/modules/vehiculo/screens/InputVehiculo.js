import { View, KeyboardAvoidingView, Platform } from "react-native";
import React from "react";
import { Text, TextInput, HelperText, useTheme, Button } from "react-native-paper";
import BoxStyles from "../../../utils/genericScreenStyles";
import usePutVehiculos from "../hooks/usePutVehiculos";

export default function InputVehiculo({ navigation, route }) {
  const paper = useTheme();
  const [longitud, setLongitud] = React.useState(0);
  const [longReal, setLongReal] = React.useState(0);
  const { campo, label, data } = route.params;
  const { isLoading, errorData, preSubmit, defaultValues, vehicleYup, visible, hideAlert, config } = usePutVehiculos(navigation, data, campo)
  const [field, setField] = React.useState("");
  React.useEffect(() => {
    switch (campo) {
      case "Modificar modelo":
        setLongitud(50);
        setField("modelo");
        break;
      case "Modificar placa":
        setLongitud(7);
        setField("placa");
        break;
      case "Modificar descripción":
        setLongitud(250);
        setField("descripción");
        break;
    }
  }, []);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "transparent", padding: 24 }}
    >
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View>
          <TextInput label={label} onChangeText={(text) => setLongReal(text.length)} maxLength={longitud}/>
          <HelperText type="info" visible style={{ alignSelf: "flex-end", color: paper.colors.gray }}>
            {longReal}/{longitud}
          </HelperText>
          <Text variant="bodyMedium" style={{ textAlign: "justify" }}>Aquí podrás actualizar {field === "descripción" ? "la" : "el"} {field.trim()} de tu vehículo en caso de haberlo ingresado incorrectamente</Text>
        </View>
        <Button mode="contained" style={[BoxStyles.ButtonRadius, { justifySelf: "flex-end" }]} labelStyle={BoxStyles.buttonText} disabled={longReal === 0}>Guardar</Button>
      </View>
    </KeyboardAvoidingView>
  );
}
