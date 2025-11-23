import { View, Image } from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Banner, Button, Text, useTheme } from "react-native-paper";
import mercado_pago from "../../../img/mercado_pago.png";
import CreditCard from "../components/CreditCard";
import BoxStyles from "../../../utils/genericScreenStyles";

export default function MetodosPago() {
  const [visible, setVisible] = React.useState(true);
  const paper = useTheme();
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 12 }}>
      <Banner
        visible={true}
        actions={[
          {
            label: 'Administrar',
            onPress: () => { },
          },
        ]}
        icon={({ size }) => (
          <Image
            source={mercado_pago}
            style={{
              width: size,
              height: size,
              resizeMode: "contain"
            }}
          />
        )}>
        Pagos seguros con Mercado Pago. Tus tarjetas se administran directamente desde Mercado Pago.
      </Banner>
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, width: "100%" }}>
        <ScrollView horizontal style={{ flex: 1 }} contentContainerStyle={{ gap: 12, padding: 4 }}>
          <CreditCard colorIndex={1} />
          <CreditCard colorIndex={2} />
          <CreditCard colorIndex={3} />
          <CreditCard colorIndex={4} />
          <CreditCard colorIndex={5} />
        </ScrollView>
      </View>
      <Text style={{ color: paper.colors.gray, textAlign: "center" }} variant="bodyLarge" >5 tarjetas</Text>
      <View style={{ width: "100%", paddingHorizontal: 20 }}>
        <Button theme={{
          colors: {
            primary: paper.colors.secondary,
          }
        }} mode="outlined" style={[BoxStyles.ButtonRadius, { borderColor: paper.colors.secondary }]} labelStyle={BoxStyles.buttonText}
          onPress={() => { }}>Nueva tarjeta</Button>
      </View>
    </ScrollView>
  );
}
