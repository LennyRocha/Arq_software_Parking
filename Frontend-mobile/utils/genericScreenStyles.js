import { StyleSheet } from "react-native";

const BoxStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    padding: 24,
    gap: 12,
  },
  containerScroll: {
    backgroundColor: "transparent",
    padding: 24,
    gap: 20,
  },
  font300: {
    fontFamily: "Exo2_300Light",
  },
  font400: {
    fontFamily: "Exo2_400Regular",
  },
  font700: {
    fontFamily: "Exo2_700Bold",
  },
  font800: {
    fontFamily: "Exo2_800ExtraBold",
  },
  font900: {
    fontFamily: "Exo2_900Black",
  },
  flexCentered: {
    justifyContent: "center",
    alignItems: "center",
  },
  flexJustifiedCenter: {
    justifyContent: "center",
  },
  flexAlignedCenter: {
    alignItems: "center",
  },
  ButtonRadius: {
    borderRadius: 5,
    fontWeight: "bold",
  },
  ButtonBottomRadius: {
    borderBottomStartRadius: 5,
    borderBottomEndRadius: 5,
    borderTopStartRadius: 0,
    borderTopEndRadius: 0,
    fontWeight: "bold",
  },
  flex: {
    flex: 1,
  },
  buttonText: {
    textTransform: "uppercase",
    fontFamily: "Exo2_700Bold",
    width: "100%"
  },
  buttonTextAuto: {
    textTransform: "uppercase",
    fontFamily: "Exo2_700Bold",
  }
});

export default BoxStyles;
