import { View, Text, Image } from "react-native";
import React from "react";
import ScrollRefreshingView from "../../../components/ScrollRefreshingView";
import { Button, SegmentedButtons, useTheme, Checkbox, TextInput, HelperText } from "react-native-paper";
import { KeyboardAvoidingView, Platform } from "react-native";
import BoxStyles from "../../../utils/genericScreenStyles";

export default function NuevoVehiculo() {
  const paper = useTheme();
  const [value, setValue] = React.useState('coche');
  const vehiculos = {
    moto: require('../../../img/moto_view_small.png'),
    coche: require('../../../img/coche_view_small.png'),
    camioneta: require('../../../img/camioneta_view_small.png'),
  }
  const vehiculo = React.useMemo(() => {
    return vehiculos[value];
  }, [value])

  const restartValues = () => {
    setValue("coche");
  }

  const [hasPlaca, setHasPlaca] = React.useState(true)

  return (
    <KeyboardAvoidingView
      style={[ BoxStyles.flex]}
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
    >
      <ScrollRefreshingView refreshHandler={restartValues} style={{ flex: 1 }} contentContainerStyle={{ justifyContent: "space-between", padding: 24,   flexGrow: 1,}}>
        <View>
          <Image source={vehiculo} style={{ aspectRatio: 16 / 9, height: 150, marginHorizontal: "auto" }} resizeMode="stretch" resizeMethod="scale" />
          <SegmentedButtons
            value={value}
            onValueChange={setValue}
            buttons={[
              {
                value: 'coche',
                label: 'Coche',
                style: {
                  backgroundColor: value === 'coche' ? paper.colors.tertiary : undefined,
                },
                checkedColor: "white",
              },
              {
                value: 'camioneta',
                label: 'Camioneta',
                style: {
                  backgroundColor: value === 'camioneta' ? paper.colors.tertiary : undefined,
                },
                checkedColor: "white",
              },
              {
                value: 'moto',
                label: 'Moto',
                style: {
                  backgroundColor: value === 'moto' ? paper.colors.tertiary : undefined,
                },
                checkedColor: "white",
              },
            ]}
            style={{ borderColor: paper.colors.tertiary, marginVertical: 12 }}
            theme={{ roundness: 1 }}
          />
          <TextInput label={"Modelo del vehículo"} maxLength={50} />
          <HelperText type="info" visible style={{ alignSelf: "flex-end", color: paper.colors.gray }}>
            0/50
          </HelperText>
          <TextInput label={"Placa del vehículo"} maxLength={7} disabled={!hasPlaca} />
          <HelperText type="info" visible style={{ alignSelf: "flex-end", color: paper.colors.gray }}>
            0/7
          </HelperText>
          <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between", alignItems: "center", marginVertical: 12 }}>
            <Text variant='labelLarge'>No tiene placa</Text>
            <Checkbox
              status={!hasPlaca ? "checked" : "unchecked"}
              onPress={() => setHasPlaca(!hasPlaca)}
            />
          </View>
          <TextInput label={"Descripción del vehículo"} maxLength={250} />
          <HelperText type="info" visible style={{ alignSelf: "flex-end", color: paper.colors.gray }}>
            0/250
          </HelperText>
        </View>
        <Button mode="contained" style={BoxStyles.ButtonRadius} labelStyle={BoxStyles.buttonText} onPress={() => {}}>Guardar</Button>
      </ScrollRefreshingView>
    </KeyboardAvoidingView>
  );
}
