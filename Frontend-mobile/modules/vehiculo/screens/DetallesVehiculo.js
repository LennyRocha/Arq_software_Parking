import { Image, Dimensions, View } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme, List, Switch, Avatar, IconButton } from "react-native-paper";
import { useCustomThemes } from "../../../context/useCustomColors";
import { ScrollView } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("screen")

export default function DetallesVehiculo({ navigation }) {
  const paper = useTheme();
  const { mode } = useCustomThemes();
  const vehiculos = {
    moto: require('../../../img/moto_view_small.png'),
    coche: require('../../../img/coche_view_small.png'),
    camioneta: require('../../../img/camioneta_view_small.png'),
  }
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  const [ value, setValue ] = React.useState("moto");
  const vehiculo = vehiculos[value];

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  return (
    <LinearGradient style={{ flex: 1 }} colors={[mode === "dark" ? paper.colors.surfaceVariant : paper.colors.olderBack, paper.colors.background]} >
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ backgroundColor: "transparent", padding: 24, justifyContent: "center", alignItems: "center", gap: 12 }}>
        <Image source={vehiculo} style={{  aspectRatio:  value === "moto" ? 16 / 10 : 16/9, flex: 1, maxWidth: width, height: 175}} resizeMethod="scale" resizeMode="stretch" />
        <List.Item
          title="Modelo:"
          description="Datsun 1970"
          titleStyle={{ fontWeight: "600", color: paper.colors.primary }}
          left={props => (
            <IconButton
              {...props}
              icon="pencil"
              iconColor={paper.colors.primary}
              style={{ margin: 0, padding: 0 }}
              onPress={() => navigation.navigate("inputCarScreen", { campo: "Modificar modelo", label: "Nuevo modelo:" })}
            />
          )}
        />
        <List.Item
          title="Placa:"
          description="DUGEY73"
          titleStyle={{ fontWeight: "600", color: paper.colors.primary }}
          left={props => (
            <IconButton
              {...props}
              icon="pencil"
              iconColor={paper.colors.primary}
              style={{ margin: 0, padding: 0 }}
              onPress={() => navigation.navigate("inputCarScreen", { campo: "Modificar placa", label: "Nueva placa:" })}
            />
          )}
        />
        <List.Item
          title="Descripción:"
          description="Descripción muy larga del vehículo para comprobar su adpatabilidad al ancho de toda la fucking pantalla"
          titleStyle={{ fontWeight: "600", color: paper.colors.primary }}
          left={props => (
            <IconButton
              {...props}
              icon="pencil"
              iconColor={paper.colors.primary}
              style={{ margin: 0, padding: 0 }}
              onPress={() => navigation.navigate("inputCarScreen", { campo: "Modificar descripción", label: "Nueva descripción:" })}
            />
          )}
        />
        <View style={{ flexDirection: "row", width: "100%" }}>
          <List.Item
            title="Tipo"
            description="Coche"
            titleStyle={{ fontWeight: "600", color: paper.colors.primary }}
            style={{ flex: 1 }}
          />
          <List.Item
            title="Estado"
            description="Activo"
            titleStyle={{ fontWeight: "600", color: paper.colors.primary }}
            style={{ flex: 1 }}
          />
        </View>
        <View style={{ flexDirection: "row", width: "100%" }}>
          <List.Item
            title="En uso"
            description="Chi"
            titleStyle={{ fontWeight: "600", color: paper.colors.primary }}
            style={{ flex: 1 }}
          />
          <List.Item
            title="Último uso"
            description="20/11/2025"
            titleStyle={{ fontWeight: "600", color: paper.colors.primary }}
            style={{ flex: 1 }}
          />
        </View>
        <List.Item
          title="Deshabilitar vehículo:"
          description="Por el momento ño se puede"
          descriptionStyle={{ color: paper.colors.error }}
          right={props => (
            <Switch {...props} value={isSwitchOn} onValueChange={onToggleSwitch} color={paper.colors.primary} />
          )}
        />
      </ScrollView>
    </LinearGradient>
  );
}
