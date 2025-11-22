import React from "react";
import { View } from "react-native";
import BoxStyles from "../../../utils/genericScreenStyles";
import { Text } from "react-native-paper";

export default function Inicio() {
  return (
    <View style={[BoxStyles.container, BoxStyles.flexCentered]}>
      <Text>Inicio</Text>
    </View>
  );
}
