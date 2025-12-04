import { Image, Dimensions, View } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme, List, Switch, Avatar, IconButton, ActivityIndicator } from "react-native-paper";
import { useCustomThemes } from "../../../context/useCustomColors";
import { ScrollView } from "react-native-gesture-handler";
import { CustomAlert } from "../../../utils/customAlert";
import useDeleteVehiculos from "../hooks/useDeleteVehiculos";

const { width, height } = Dimensions.get("screen")

export default function DetallesVehiculo({ navigation, route }) {
  const { vehic, tipo, current } = route.params;
  const [vehicle, setVehiculo] = React.useState({});
  React.useEffect(() => {
    setVehiculo(vehic)
  }, [])
  const value = tipo.nombre.toLowerCase();
  const { isLoading, errorData, preSubmit, visible, hideAlert, config, newStatus } = useDeleteVehiculos(navigation, vehicle);
  const paper = useTheme();
  const { mode } = useCustomThemes();
  const vehiculos = {
    moto: require('../../../img/moto_view_small.png'),
    coche: require('../../../img/coche_view_small.png'),
    camioneta: require('../../../img/camioneta_view_small.png'),
  }
  const [isSwitchOn, setIsSwitchOn] = React.useState(vehicle.estatus);

  const vehiculo = vehiculos[value];

  const onToggleSwitch = async () => {
    await preSubmit((estadoActualizado) => {
      setIsSwitchOn(estadoActualizado);
    });
  };

  return (
    <LinearGradient style={{ flex: 1 }} colors={[mode === "dark" ? paper.colors.surfaceVariant : paper.colors.olderBack, paper.colors.background]} >
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ backgroundColor: "transparent", padding: 24, justifyContent: "center", alignItems: "center", gap: 12 }}>
        <Image source={vehiculo} style={{ aspectRatio: value === "moto" ? 16 / 10 : 16 / 9, flex: 1, maxWidth: width, height: 175 }} resizeMethod="scale" resizeMode="stretch" />
        <List.Item
          title="Modelo:"
          description={vehicle.modelo}
          titleStyle={{ fontWeight: "600", color: paper.colors.primary }}
          left={props => (
            <IconButton
              {...props}
              icon="pencil"
              iconColor={paper.colors.primary}
              style={{ margin: 0, padding: 0 }}
              onPress={() => navigation.navigate("inputCarScreen", {
                campo: "Modificar modelo", label: "Nuevo modelo:", data: vehicle, onReturn: (vehic) => {
                  setVehiculo(vehic);
                },
              })}
            />
          )}
        />
        <List.Item
          title="Placa:"
          description={vehicle.placa ? vehicle.placa : "Sin placa"}
          titleStyle={{ fontWeight: "600", color: paper.colors.primary }}
          left={props => (
            <IconButton
              {...props}
              icon="pencil"
              iconColor={paper.colors.primary}
              style={{ margin: 0, padding: 0 }}
              onPress={() => navigation.navigate("inputCarScreen", {
                campo: "Modificar placa", label: "Nueva placa:", data: vehicle, onReturn: (vehic) => {
                  setVehiculo(vehic);
                },
              })}
            />
          )}
        />
        <List.Item
          title="Descripción:"
          description={vehicle.descripcion}
          titleStyle={{ fontWeight: "600", color: paper.colors.primary }}
          left={props => (
            <IconButton
              {...props}
              icon="pencil"
              iconColor={paper.colors.primary}
              style={{ margin: 0, padding: 0 }}
              onPress={() => navigation.navigate("inputCarScreen", {
                campo: "Modificar descripción", label: "Nueva descripción:", data: vehicle, onReturn: (vehic) => {
                  setVehiculo(vehic);
                },
              })}
            />
          )}
        />
        <View style={{ flexDirection: "row", width: "100%" }}>
          <List.Item
            title="Tipo"
            description={tipo.nombre}
            titleStyle={{ fontWeight: "600", color: paper.colors.primary }}
            style={{ flex: 1 }}
          />
          <List.Item
            title="Estado"
            description={vehicle.estatus ? "Activo" : "Inactivo"}
            titleStyle={{ fontWeight: "600", color: paper.colors.primary }}
            style={{ flex: 1 }}
          />
        </View>
        <View style={{ flexDirection: "row", width: "100%" }}>
          <List.Item
            title="En uso"
            description={(current && current.id === vehic.id) ? "Si" : "No"}
            titleStyle={{ fontWeight: "600", color: paper.colors.primary }}
            style={{ flex: 1 }}
          />
        </View>
        <List.Item
          title="Deshabilitar vehículo:"
          description={(current && current.id === vehic.id) ? "Por el momento ño se puede" : ""}
          descriptionStyle={{ color: paper.colors.error }}
          right={props => (
            isLoading ? <ActivityIndicator {...props} size={"small"} /> :
              <Switch {...props} disabled={current && current.id === vehic.id} value={isSwitchOn} onValueChange={onToggleSwitch} color={paper.colors.primary} />
          )}
        />
      </ScrollView>
      <CustomAlert visible={visible} hideAlert={hideAlert} config={config} />
    </LinearGradient>
  );
}
