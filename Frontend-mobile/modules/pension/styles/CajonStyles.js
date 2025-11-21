import { StyleSheet } from "react-native";

//Este es un ejemplo de estilos para un componente llamado "Cajon"
export default CajonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginTop: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "95%",
    height: 150,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderStyle: "dashed",
    backgroundColor: "#f9f9f9",
    position: "relative",
    overflow: "hidden",
    zIndex: 1,
    marginBottom: 20,
    // Animation
    transform: [{ scale: 1 }],
    transitionDuration: "200ms",
    transitionProperty: "all",
    transitionTimingFunction: "ease-in-out",
    // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // For Android shadow
    elevation: 5,
  },
});
