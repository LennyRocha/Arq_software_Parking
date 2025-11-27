import { Image, ScrollView, View } from "react-native";
import React from "react";
import BoxStyles from "../../../utils/genericScreenStyles";
import { Button, Chip, Divider, Icon, List, Text, useTheme } from "react-native-paper";
import logo from '../../../img/logo_parking_sin_fondo.png';
import mercadoPago from '../../../img/mercado_pago.png';
import dinero from '../../../img/dinero.png';

export default function DetallesPension({ route, naviagtion, pensionObject = null }) {
  const [pension, setPension] = React.useState({});
  React.useEffect(() => {
    if (pensionObject) {
      setPension(pensionObject);
    }
    else if (route.params) {
      const { pension } = route.params;
      setPension(pension);
    }
  }, [])
  const paper = useTheme();
  const obtenerPeriodo = (dias) => {
    switch (dias) {
      case 7:
        return "semanal";
      case 15:
        return "quincenal";
      case 30:
        return "mensual";
      case 60:
        return "bimestral";
      case 90:
        return "trimestral";
      case 365:
        return "anual";
      default:
        return `${dias} dias`;
    }
  }
  return (
    <View style={!pensionObject ? BoxStyles.container: {flex: 1}}>
      <View style={{ flexDirection: "row", width: "100%", gap: 4, height: "25%" }}>
        <View style={{ width: "35%", backgroundColor: paper.colors.tertiary, borderRadius: 5, alignItems: "center", justifyContent: "center" }}>
          <Icon source={logo} size={72} />
        </View>
        <View style={{ flex: 1, gap: 4, justifyContent: "center" }}>
          <Text variant="headlineSmall" style={[BoxStyles.font400, { color: paper.colors.tertiary }]} >Pension  {pension.nombre}</Text>
          <Text variant="titleMedium" >MXN${pension.costo} IVA incluido {obtenerPeriodo(pension.duracionDias)}</Text>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
          gap: 8
        }}
      >
        <Chip icon="lock" mode="outlined" style={{ borderColor: paper.colors.primary, backgroundColor: "transparent" }} textStyle={{ color: paper.colors.primary }}>Cajon reservado</Chip>
        <Chip icon="cash-off" mode="outlined" style={{ borderColor: paper.colors.primary, backgroundColor: "transparent" }} textStyle={{ color: paper.colors.primary }} >Sin costos extra</Chip>
        <Chip icon="clock" mode="outlined" style={{ borderColor: paper.colors.primary, backgroundColor: "transparent" }} textStyle={{ color: paper.colors.primary }} >Acceso 24/7</Chip>
        <Chip icon="car" mode="outlined" style={{ borderColor: paper.colors.primary, backgroundColor: "transparent" }} textStyle={{ color: paper.colors.primary }} >Sin límite de vehículos</Chip>
      </ScrollView>
      <Text variant="bodyMedium" style={{ color: paper.colors.gray }}>Pagar con</Text>
      <List.Item title="Efectivo" left={(props) => <List.Icon {...props} icon={dinero} color={undefined} />} />
      <Divider />
      <List.Item title="Mercado pago" left={(props) => <List.Icon {...props} icon={mercadoPago} color={undefined} />} />
      <Divider />
      <Text variant="bodySmall" style={{ textAlign: "justify" }}>
        Al seleccionar Pagar, te comprometes a realizar el pago de MXN${pension.costo},00 IVA incluido al periodo {obtenerPeriodo(pension.duracionDias)} en efecto en el estacionamiento. Al seleccionar pagar con Mercado Pago se te aplicará la facturación periódica, la puedes cancelar en cualquier momento y realizar el pago manualmente.
      </Text>
      <View style={{ flexGrow: 1 }} />
      <Button mode="contained" theme={{ colors: { primary: paper.colors.tertiary } }} style={BoxStyles.ButtonRadius} labelStyle={BoxStyles.buttonText} onPress={() => { }} >
        Pagar
      </Button>
    </View>
  );
}
