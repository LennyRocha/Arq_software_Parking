import React from "react";
import { View } from "react-native";
import BoxStyles from "../../../utils/genericScreenStyles";
import { Button, Divider, Icon, useTheme } from "react-native-paper";
import { useCustomThemes } from "../../../context/useCustomColors";
import { ScrollView } from "react-native-gesture-handler";
import { Avatar, Text, List } from 'react-native-paper';
import { LinearGradient } from "expo-linear-gradient";
import { useGlobalContext } from "../../../context/GlobalContext";
import { Session } from "../../acceso/hooks/TokenManagement";
import LoadingView from "../../../components/LoadingView";

export default function Perfil({ dad, ruta, navigation }) {
  const { avatar, pension } = useGlobalContext();
  const { theme, toggleTheme } = useCustomThemes();
  const paper = useTheme();
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function getUserData() {
      const u = await Session.getUser();
      setUser(u);
      setLoading(false);
    }
    getUserData()
  }, []);

  const LeftContent = props => <Avatar.Text {...props} size={64} label={avatar} />

  async function unsetUser() {
    await Session.clearSession();
    dad.reset({
      index: 0,
      routes: [{ name: "Auth", params: { screen: "login" } }],
    });
  }

  if (loading) return <LoadingView />;

  const PensionBanner = () => {
    return (
      <LinearGradient style={{ width: "100%", padding: 12, borderRadius: 5, marginVertical: 12, flexDirection: "row" }} colors={['#5EB0A9', '#7EBEBE', '#A2E6E5', '#C5E4E7']} start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }} >
        <View style={{ backgroundColor: "transparent", flex: 1, gap: 4 }}>
          <View style={{ backgroundColor: "transparent", flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
            <Icon source={require("../../../img/logo_parking_hd_no_titulo.png")} size={40} />
            <Text variant="titleMedium" style={{ color: paper.colors.tertiary, marginLeft: 4, marginRight: 0 }}>
              Pensión{" "}
            </Text>
            <Text style={{ borderColor: paper.colors.tertiary, borderWidth: 2, fontFamily: "Exo2_700Bold", borderRadius: 2, paddingHorizontal: 4, color: paper.colors.tertiary }} variant="titleSmall">{pension.nombrePension}</Text>
          </View>
          <Text variant="titleSmall" style={{ color: paper.colors.onTertiaryContainer, fontWeight: "400" }}>Caduca el {pension.fechaFinalizacion}</Text>
        </View>
        <View style={{ height: "100%", flexDirection: "row", gap: 2, justifyContent: "flex-start", alignContent: "flex-start", paddingVertical: 12 }}>
          <Icon source={"cash"} size={18} color={paper.colors.primary} />
          <Text variant="labelLarge" style={{ color: paper.colors.primary }}>${pension.costoUltimoPago}</Text>
        </View>
      </LinearGradient>
    )
  }

  return (
    <ScrollView
      style={BoxStyles.flex}
      contentContainerStyle={{ height: "100%" }}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View
        style={{
          backgroundColor: paper.colors.surface,
          width: "100%",
          paddingHorizontal: 24,
          paddingVertical: 24,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          overflow: "hidden",
        }}
      >
        <LeftContent />
        <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
          <Text
            variant="titleMedium"
            style={{
              color: paper.colors.primary,
              flexShrink: 1,     // permite que el texto se encoja
            }}
            numberOfLines={2}   // máximo líneas
            ellipsizeMode="tail"
          >
            {user.nombre} {user.apellidos}
          </Text>

          <Text variant="bodyMedium" style={{ color: paper.colors.gray }}>
            {user.correo}
          </Text>

          <Button
            buttonColor={paper.colors.tertiary}
            style={[BoxStyles.ButtonRadius, { width: 150 }]}
            labelStyle={BoxStyles.buttonTextAuto}
            mode="contained"
            onPress={() => navigation.navigate("detallesPerfil", { data: user })}
          >
            Editar perfil
          </Button>
        </View>
      </View>

      <View style={{ flex: 1, padding: 12, width: "100%" }}>
        <PensionBanner />
        {/* <List.Item
          title="Métodos de pago"
          right={props => <List.Icon {...props} icon="chevron-right" color={theme.gray} />}
          style={{ justifyContent: "center", }}
          onPress={() => navigation.navigate("metodos")}
          rippleColor="rgba(0, 0, 0, 0.5)"
        />
        <Divider /> */}
        <List.Item
          title="Historial"
          right={props => <List.Icon {...props} icon="chevron-right" color={theme.gray} />}
          style={{ justifyContent: "center" }}
          onPress={() => navigation.navigate("historial")}
          rippleColor="rgba(0, 0, 0, 0.5)"
        />
        <Divider />
        <List.Item
          title="Modo oscuro"
          right={props => <List.Icon {...props} icon="chevron-right" color={theme.gray} />}
          style={{ justifyContent: "center" }}
          onPress={toggleTheme}
          rippleColor="rgba(0, 0, 0, 0.5)"
        />
        <Divider />
        <List.Item
          title="Cerrar sesión"
          right={props => <List.Icon {...props} icon="chevron-right" color={theme.gray} />}
          style={{ justifyContent: "center" }}
          onPress={unsetUser}
          rippleColor="rgba(0, 0, 0, 0.5)"
        />
        <Divider />
        <View style={{ flex: 1 }} />
        <Text variant="bodySmall" style={{ alignSelf: "center", color: paper.colors.gray }}>Versión 1.0.0</Text>
      </View>
    </ScrollView>
  );
}
