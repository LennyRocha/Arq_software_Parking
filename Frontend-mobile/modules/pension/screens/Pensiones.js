import { Icon, Text, useTheme } from "react-native-paper";
import React from "react";
import { View } from "react-native";
import BoxStyles from "../../../utils/genericScreenStyles";
import usePensiones from "../hooks/usePensiones";
import ScrollRefreshingView from "../../../components/ScrollRefreshingView";
import LoadingView from "../../../components/LoadingView";
import ErrorAxios from "../../errores/screens/ErroresScreens";
import EmptyListView from "../../errores/screens/EmptyListView";
import RenovarMiPensionModal from "../../../components/RenovarPensionModal";
import useMiPension from "../hooks/useMiPension";
import setPension from "../../acceso/hooks/setPension";

export default function Pensiones({ navigation }) {
  const goTo = (pension) => {
    navigation.navigate("detallesPension", { pension: pension });
  }
  const [loading, setLoading] = React.useState(false);
  const { loading: pensionLoad } = setPension();
  const {
    pension,
    cargarMiPension,
    renovarModalOpen,
    handleAbrirRenovar,
    handleCerrarRenovar,
    iniciarPagoRenovacion,
    confirmarRenovacion,
  } = useMiPension();
  const { data, isLoading, errorData, renderedList, restartCall } = usePensiones(navigation, goTo, handleAbrirRenovar);
  React.useEffect(() => {
    cargarMiPension();
  }, [cargarMiPension]);
  const paper = useTheme();
  if (isLoading || loading || pensionLoad ) return <LoadingView />;
  if (errorData?.tipo === "Error de Axios") return <ErrorAxios error={errorData.detalles} callback={restartCall} />;
  return (
    <>
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
      <RenovarMiPensionModal
        visible={renovarModalOpen}           // ← Cambio: open → visible
        onDismiss={handleCerrarRenovar}      // ← Cambio: onClose → onDismiss
        pension={pension}
        onIniciarPago={iniciarPagoRenovacion}
        onConfirmarRenovacion={confirmarRenovacion}
        setLoading={setLoading}
      />
    </>
  );
}
