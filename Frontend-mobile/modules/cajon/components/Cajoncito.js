import { View, Text, Image } from 'react-native';
import React from 'react';
import { useTheme } from 'react-native-paper';

export default function Cajoncito({ cajon }) {
  const paper = useTheme();

  const vehiculos = {
    moto: require('../../../img/moto.png'),
    coche: require('../../../img/coche.png'),
    camioneta: require('../../../img/camioneta.png'),
  };

  const setBackground = () => {
    if (!cajon.disponible) {
      return paper.colors.surface;
    } else if (cajon.paraPensionados && cajon.estatus) {
      return paper.colors.tertiary;
    } else if (cajon.disponible && !cajon.paraPensionados && !cajon.estatus) {
      return paper.colors.secondary;
    } else if (!cajon.estatus) {
      return paper.colors.surfaceVariant;
    }
    return paper.colors.surface;
  };

  const setBorder = () => {
    if (!cajon.disponible) {
      return "transparent";
    } else if (cajon.paraPensionados && cajon.estatus) {
      return paper.colors.tertiary;
    } else if (cajon.disponible && !cajon.paraPensionados && !cajon.estatus) {
      return paper.colors.gray;
    } else if (!cajon.estatus) {
      return paper.colors.dark;
    }
    return "transparent";
  };

  const tipo = cajon.tipoVehiculo?.nombre?.toLowerCase();

  return (
    <View
      style={{
        borderRadius: 6,
        flex: 1,
        height: 50,
        backgroundColor: setBackground(),
        borderWidth: 1,
        borderColor: setBorder(),
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden"
      }}
    >
      {cajon.disponible ? (
        <Text>{cajon.name}</Text>
      ) : (
        <Image
          source={vehiculos[tipo]}
          style={{
            width: "100%",
            height: "100%",
            transform: [{ rotate: "90deg" }],
            resizeMode: "contain",
          }}
        />
      )}
    </View>
  );
}