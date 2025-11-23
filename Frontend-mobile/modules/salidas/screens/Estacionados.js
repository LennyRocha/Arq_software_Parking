import { Image, View } from "react-native";
import SwiperView from "../../../components/Swiper";
import React from "react";
import { Button, Text, useTheme, Icon } from "react-native-paper";
import BoxStyles from "../../../utils/genericScreenStyles";

export default function Estacionados({ navigation }) {
  const paper = useTheme();
  const vehiculos = {
    moto: require('../../../img/moto.png'),
    coche: require('../../../img/coche.png'),
    camioneta: require('../../../img/camioneta.png'),
  }
  const EntradaView = () => {
    return (
      <View
        style={[
          {
            backgroundColor: "transparent",
            flex: 1,
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 24,
            gap: 24
          },
        ]}
      >
        <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text variant='labelLarge' style={{ backgroundColor: paper.colors.cardSurface, padding: 4, color: paper.colors.onCardSurface }}>Noviembre 20, 2025</Text>
          <Text
            style={{
              borderRadius: 2,
              paddingHorizontal: 4,
              color: paper.colors.primary,
              alignSelf: "flex-start",
            }}
            variant="titleLarge"
          >
            03:00 PM
          </Text>
        </View>
        <Text variant="headlineMedium" style={{ fontWeight: "bold", color: paper.colors.tertiary }}>Modelo del vehículo</Text>
        <Image source={vehiculos["coche"]} style={{ flex: 1, aspectRatio: 9 / 16, resizeMode: "contain" }} />
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <Icon source={"clock-time-three-outline"} color={paper.colors.gray} size={24} />
          <Text variant="labelLarge" style={{ fontWeight: "bold", color: paper.colors.gray }}>4 hrs transcurridas</Text>
        </View>
        <Button mode="contained" style={[BoxStyles.ButtonRadius, { width: "100%" }]} labelStyle={BoxStyles.buttonTextAuto} onPress={() => navigation.navigate("salidaQR", { folio: 2025 }) } >Marcar Salida</Button>
      </View>
    )
  }
  const Vista1 = () => (
    <View
      style={[
        {
          backgroundColor: "transparent",
          flex: 1,
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 24,
          gap: 24
        },
      ]}
    >
      <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text variant='labelLarge' style={{ backgroundColor: paper.colors.cardSurface, padding: 4, color: paper.colors.onCardSurface }}>Noviembre 20, 2025</Text>
        <Text
          style={{
            borderRadius: 2,
            paddingHorizontal: 4,
            color: paper.colors.primary,
            alignSelf: "flex-start",
          }}
          variant="titleLarge"
        >
          03:00 PM
        </Text>
      </View>
      <Text variant="headlineMedium" style={{ fontWeight: "bold", color: paper.colors.tertiary }}>Modelo del vehículo</Text>
      <Image source={vehiculos["camioneta"]} style={{ flex: 1, aspectRatio: 9 / 16, resizeMode: "contain" }} />
      <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
        <Icon source={"clock-time-three-outline"} color={paper.colors.gray} size={24} />
        <Text variant="labelLarge" style={{ fontWeight: "bold", color: paper.colors.gray }}>4 hrs transcurridas</Text>
      </View>
      <Button mode="contained" style={[BoxStyles.ButtonRadius, { width: "100%" }]} labelStyle={BoxStyles.buttonTextAuto} onPress={() => navigation.navigate("salidaQR", { folio: 2020 })} >Marcar Salida</Button>
    </View>
  );
  const Vista2 = () => (
    <View
      style={[
        {
          backgroundColor: "transparent",
          flex: 1,
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 24,
          gap: 24
        },
      ]}
    >
      <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text variant='labelLarge' style={{ backgroundColor: paper.colors.cardSurface, padding: 4, color: paper.colors.onCardSurface }}>Noviembre 20, 2025</Text>
        <Text
          style={{
            borderRadius: 2,
            paddingHorizontal: 4,
            color: paper.colors.primary,
            alignSelf: "flex-start",
          }}
          variant="titleLarge"
        >
          03:00 PM
        </Text>
      </View>
      <Text variant="headlineMedium" style={{ fontWeight: "bold", color: paper.colors.tertiary }}>Modelo del vehículo</Text>
      <Image source={vehiculos["moto"]} style={{ flex: 1, aspectRatio: 9 / 16, resizeMode: "contain", transform: [{ scaleX: -1 }, { scaleY: -1 }]}} />
      <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
        <Icon source={"clock-time-three-outline"} color={paper.colors.gray} size={24} />
        <Text variant="labelLarge" style={{ fontWeight: "bold", color: paper.colors.gray }}>4 hrs transcurridas</Text>
      </View>
      <Button mode="contained" style={[BoxStyles.ButtonRadius, { width: "100%" }]} labelStyle={BoxStyles.buttonTextAuto} onPress={() => navigation.navigate("salidaQR", { folio: 2019 })} >Marcar Salida</Button>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <SwiperView
        slides={[EntradaView, Vista1, Vista2]}
        horizontal={true}
        showsPagination
        paginationStyle={{ bottom: 0 }} // Ajusta la posición
        loop
      />
    </View>
  );
}
