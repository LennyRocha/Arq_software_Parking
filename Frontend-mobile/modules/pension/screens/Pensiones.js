import { Icon, Text, useTheme } from "react-native-paper";
import React from "react";
import PensionCard from "../components/PensionCard";
import { View } from "react-native";
import BoxStyles from "../../../utils/genericScreenStyles";
import usePensiones from "../hooks/usePensiones";
import ScrollRefreshingView from "../../../components/ScrollRefreshingView";
import LoadingView from "../../../components/LoadingView";
import ErrorAxios from "../../errores/screens/ErroresScreens";
import EmptyListView from "../../errores/screens/EmptyListView";

export default function Pensiones({ navigation }) {
  const goTo = () => {
    navigation.navigate("detallesPension");
  }
  const { data, isLoading, error, errorData, renderedList, restartCall } = usePensiones(navigation, goTo);
  const paper = useTheme();
  if (isLoading) return <LoadingView />;
  if (errorData) console.log(errorData)
  if (error) return <ErrorAxios error={error} callback={restartCall} />
  return (
    <ScrollRefreshingView refreshHandler={restartCall} style={{ flex: 1 }} contentContainerStyle={{ padding: 24, gap: 12, flexGrow: 1 }}>
      {data?.data.length === 0 ? <EmptyListView message={"No hay pensiones registradas"} icon={"folder-off"} /> :
        <>
          <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4 }}>
            <Icon source={require("../../../img/logo_parking_hd_no_titulo.png")} size={48} />
            <Text style={[BoxStyles.font700, { color: paper.colors.primary }]} variant="headlineSmall">Pensiones parKing</Text>
          </View>
          <Text variant="bodyLarge" style={{ textAlign: "center" }}>Todas las pensiones disponibles</Text>
          {renderedList}
          <Text variant="bodySmall" style={{ color: paper.colors.gray, textAlign: "center" }}>La suscripción se sigue cobrando al precio normal y al periodo seleccionado, a menos que se cancele.</Text>
        </>
      }
    </ScrollRefreshingView>
  );
}
