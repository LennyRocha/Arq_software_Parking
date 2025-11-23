import { View, KeyboardAvoidingView, Platform } from "react-native";
import React from "react";
import { Text, TextInput, HelperText, useTheme, Button } from "react-native-paper";
import { MaskedTextInput } from "react-native-mask-text";
import BoxStyles from "../../../utils/genericScreenStyles";

export default function InputPerfil({ route }) {
  const paper = useTheme();
  const [longitud, setLongitud] = React.useState(0);
  const [longReal, setLongReal] = React.useState(0);
  const { campo, label } = route.params;
  const [field, setField] = React.useState("");
  React.useEffect(() => {
    switch (campo) {
      case "Modificar nombre":
        setLongitud(50);
        setField("nombre");
        break;
      case "Modificar apellido":
        setLongitud(50);
        setField("apellido");
        break;
      case "Modificar teléfono":
        setLongitud(12);
        setField("teléfono");
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
          {campo === "Modificar teléfono" ? <TextInput
            label={label}
            mode="flat"
            keyboardType="numeric"
            onChangeText={(text) => setLongReal(text.length)}
           maxLength={longitud}
            render={inputProps => (
              <MaskedTextInput
                {...inputProps}
                mask="999 999 9999"
                style={[inputProps.style]}   // O estilos opcionales
              />
            )}
          /> :
            <TextInput label={label} onChangeText={(text) => setLongReal(text.length)} maxLength={longitud} keyboardType={campo === "Modificar teléfono" ? "phone-pad" : "default"} />
          }
          <HelperText type="info" visible style={{ alignSelf: "flex-end", color: paper.colors.gray }}>
            {longReal}/{longitud}
          </HelperText>
          <Text variant="bodyMedium" style={{ textAlign: "justify" }}>Aquí podrás actualizar tu {field.trim()} en caso de haberlo ingresado incorrectamente</Text>
        </View>
        <Button mode="contained" style={[BoxStyles.ButtonRadius, { justifySelf: "flex-end" }]} labelStyle={BoxStyles.buttonText} disabled={longReal === 0}>Guardar</Button>
      </View>
    </KeyboardAvoidingView>
  );
}
