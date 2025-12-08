import { View, Text, Image } from 'react-native';
import React from 'react';
import { useTheme } from 'react-native-paper';

export default function Cajoncito({ cajon, index }) {
  const paper = useTheme();

  const vehiculos = {
    moto: require('../../../img/moto.png'),
    coche: require('../../../img/coche.png'),
    camioneta: require('../../../img/camioneta.png'),
  };

  const setBackground = () => {
    if (!cajon.disponible) {
      return "transparent";
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
      return paper.colors.surfaceVariant;
    } else if (cajon.paraPensionados && cajon.estatus) {
      return paper.colors.tertiary;
    } else if (cajon.disponible && !cajon.paraPensionados && !cajon.estatus) {
      return paper.colors.gray;
    } else if (!cajon.estatus) {
      return paper.colors.dark;
    }
    return paper.colors.tertiary;
  };

  const tipo = cajon.tipoVehiculo?.nombre?.toLowerCase();

  const getOrientation = () => {
    switch (index) {
      case 1:
      case 4:
        return "90deg";
      case 0:
      case 3:
        return "-90deg";
      default:
        return "0deg";
    }
  }

  return (
    <View
      style={{
        borderRadius: 6,
        height: 40,
        backgroundColor: setBackground(),
        borderWidth: 1,
        borderColor: setBorder(),
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden"
      }}
    >
      {!cajon.disponible && (
        <Image
          source={vehiculos[tipo]}
          style={{
            width: "100%",
            height: undefined,
            aspectRatio: 1,
            transform: [{ rotate: getOrientation() }],
            resizeMode: "contain",
          }}
        />
      )}
    </View>
  );
}