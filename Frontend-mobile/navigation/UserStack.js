import React from "react";
import { View, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Appbar,
  Avatar,
  TouchableRipple,
  useTheme,
  BottomNavigation,
} from "react-native-paper";
import BoxStyles from "../utils/genericScreenStyles";

//Pantallas
import Inicio from "../modules/cajon/screens/Inicio";
import Vehiculos from "../modules/vehiculo/screens/Vehiculos";
import Perfil from "../modules/perfil/screens/Perfil";
import Pensiones from "../modules/pension/screens/Pensiones";
import DetallesPerfil from "../modules/perfil/screens/DetallesPerfil";
import InputPerfil from "../modules/perfil/screens/InputPerfil";
import Historial from "../modules/perfil/screens/Historial";

import MetodosPago from "../modules/perfil/screens/MetodosPago";
import Estacionados from "../modules/salidas/screens/Estacionados";
import DetallesVehiculo from "../modules/vehiculo/screens/DetallesVehiculo";
import InputVehiculo from "../modules/vehiculo/screens/InputVehiculo";
import NuevoVehiculo from "../modules/vehiculo/screens/NuevoVehiculo";
import SalidaQR from "../modules/salidas/screens/SalidaQR";
import EntradaQR from "../modules/cajon/screens/EntradaQR";

const Stack = createNativeStackNavigator();

const GenericScreen = () => (
  <View style={{ flex: 1 }}>
    <Text>Generic screen</Text>
  </View>
);

function HomeWithTabs({ navigation }) {
  const paper = useTheme();
  const [index, setIndex] = React.useState(0);

  const routes = [
    {
      key: "home",
      title: "Inicio",
      focusedIcon: "home",
      unfocusedIcon: "home-outline",
    },
    {
      key: "parking",
      title: "Marcajes",
      focusedIcon: "book-open-variant",
      unfocusedIcon: "book-open-outline",
    },
    {
      key: "cars",
      title: "Vehículos",
      focusedIcon: "car",
      unfocusedIcon: "car-outline",
    },
    {
      key: "suscriptions",
      title: "Pensiones",
      focusedIcon: "view-carousel",
      unfocusedIcon: "view-carousel-outline",
    },
  ];

 const  renderScene = BottomNavigation.SceneMap({
    home: () => <Inicio navigation={navigation} />,
    cars: () => <Vehiculos navigation={navigation} />,
    parking: () => <Estacionados navigation={navigation} />,
    suscriptions: () => <Pensiones navigation={navigation} />,
  });

  return (
    <BottomNavigation
      elevated
      navigationState={{ index, routes }}
      onIndexChange={(i) => setIndex(i)}
      renderScene={renderScene}
      sceneAnimationEnabled={false}
      activeColor={paper.colors.tertiary}
      inactiveColor={paper.colors.gray}
      activeIndicatorStyle={{ backgroundColor: paper.colors.surface }}
      barStyle={{ backgroundColor: paper.colors.background }}
      safeAreaInsets={{ bottom: 0 }}
      sceneAnimationType="shifting"
      compact
    />
  );
}

// ...existing code...
export default function UserStack({ name = "LO", navigation, route }) {
  const parent = navigation;
  const ruta = route;
  const mainRoutes = ["home", "cars", "parking", "suscriptions"];
  const paper = useTheme();

  function PerfilWrapper(props) {
    return <Perfil {...props} dad={parent} ruta={ruta} />;
  }

  return (
    <Stack.Navigator
      initialRouteName="home"
      screenOptions={({ route, navigation }) => {
        const isMain = mainRoutes.includes(route.name);
        const defaultTitles = {
          home: "Inicio",
          cars: "Mis vehículos",
          parking: "Entradas activas",
          suscriptions: "Pensiones",
          perfil: "Mi perfil",
          //Rutas secundarias
          entradaQR: "Boleto de entrada",
          salidaQR: "Boleto de salida",
          detallesCar: "Detalles del vehículo",
          inputCarScreen: "Modificar campo",
          newCar: "Nuevo vehículo",
          detallesPension: "Detalles de la pensión",
          historial: "Historial de marcajes",
          detallesPerfil: "Modificar perfil",
          inputPerfilScreen: "Modificar campo",
          metodos: "Métodos de págo",
        };

        const tituloDeUpdate =
          route.params?.campo ?? defaultTitles[route.name] ?? route.name;
        return {
          headerShown: route.name !== "noWifi" && route.name !== "error",
          contentStyle: { backgroundColor: paper.colors.background },
          // animation: "fade",
          header: () =>
            isMain ? (
              <Appbar.Header
                style={{
                  justifyContent: "space-between",
                  paddingRight: 16,
                  backgroundColor: paper.colors.background,
                }}
                elevated
                statusBarHeight={0}
              >
                <Appbar.Content
                  title="parKing"
                  titleStyle={[
                    BoxStyles.font700,
                    {
                      color: paper.colors.tertiary,
                    },
                  ]}
                />
                <TouchableRipple
                  onPress={() => navigation.navigate("perfil")}
                  rippleColor="rgba(0, 0, 0, .32)"
                  style={{
                    borderRadius: 21,
                    marginLeft: 8,
                  }}
                >
                  <Avatar.Text
                    size={42}
                    label={name}
                    style={{ backgroundColor: paper.colors.tertiary }}
                  />
                </TouchableRipple>
              </Appbar.Header>
            ) : (
              <Appbar.Header
                style={{
                  backgroundColor: paper.colors.background,
                }}
                elevated
                statusBarHeight={0}
              >
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content
                  title={tituloDeUpdate}
                  titleStyle={[
                    BoxStyles.font400,
                    { color: paper.colors.onBackground },
                  ]}
                />
              </Appbar.Header>
            ),
        };
      }}
    >
      {/* Pantallas principales -> use HomeWithTabs as the "home" screen */}
      <Stack.Screen name="home" component={HomeWithTabs} />
      {/* <Stack.Screen name="cars" component={CarsScreen} />
      <Stack.Screen name="parking" component={ParkingScreen} />
      <Stack.Screen name="suscriptions" component={Pensiones} /> */}

      {/* Pantallas secundarias */}
      <Stack.Screen name="perfil" component={PerfilWrapper} />
      <Stack.Screen name="entradaQR" component={EntradaQR} />
      <Stack.Screen name="salidaQR" component={SalidaQR} />
      <Stack.Screen name="detallesCar" component={DetallesVehiculo} />
      <Stack.Screen name="inputCarScreen" component={InputVehiculo} />
      <Stack.Screen name="newCar" component={NuevoVehiculo} />
      <Stack.Screen name="detallesPension" component={GenericScreen} />
      <Stack.Screen name="historial" component={Historial} />
      <Stack.Screen name="detallesPerfil" component={DetallesPerfil} />
      <Stack.Screen name="inputPerfilScreen" component={InputPerfil} />
      <Stack.Screen name="metodos" component={MetodosPago} />
      <Stack.Screen name="noWifi" component={GenericScreen} />
      <Stack.Screen name="error" component={GenericScreen} />
    </Stack.Navigator>
  );
}