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
import Perfil from "../modules/perfil/screens/Perfil";
import { useCustomThemes } from "../context/useCustomColors";

const Stack = createNativeStackNavigator();
const CarsScreen = () => (
  <View>
    <Text>Cars</Text>
  </View>
);

const ParkingScreen = () => (
  <View>
    <Text>Parking</Text>
  </View>
);

const SuscriptionsScreen = () => (
  <View>
    <Text>Suscriptions</Text>
  </View>
);

const GenericScreen = () => (
  <View>
    <Text>Generic screen</Text>
  </View>
);

function HomeWithTabs() {
  const paper = useTheme();
  const [index, setIndex] = React.useState(0);
  const { theme } = useCustomThemes();

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

  const renderScene = BottomNavigation.SceneMap({
    home: Inicio,
    cars: CarsScreen,
    parking: ParkingScreen,
    suscriptions: SuscriptionsScreen,
  });

  return (
    <View style={{ flex: 1, backgroundColor: paper.colors.background }}>
      {/* bottom navigation */}
      <BottomNavigation
        elevated
        navigationState={{ index, routes }}
        onIndexChange={(i) => setIndex(i)}
        renderScene={renderScene}
        sceneAnimationEnabled={false}
        activeColor={paper.colors.tertiary}
        inactiveColor={paper.colors.gray}
        activeIndicatorStyle={{ backgroundColor: paper.colors.surfaceVariant }}
        barStyle={{ backgroundColor: paper.colors.background }}
      />
    </View>
  );
}

// ...existing code...
export default function UserStack({ name = "LO", navigation, route }) {
  const parent = navigation;
  const ruta = route;
  const mainRoutes = ["home", "cars", "parking", "suscriptions"];
  const paper = useTheme();
  // removed top-level index/routes state from here (moved into HomeWithTabs)
  // ...existing code...

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
          animation: "fade",
          header: () =>
            isMain ? (
              <Appbar.Header
                style={{
                  justifyContent: "space-between",
                  paddingRight: 16,
                  backgroundColor: paper.colors.background,
                }}
                elevated
              >
                <Appbar.Content
                  title="parKing"
                  titleStyle={[
                    BoxStyles.font700,
                    {
                      color: paper.colors.tertiary,
                    },
                  ]}
                  style={{ flex: 1 }}
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
      <Stack.Screen name="cars" component={CarsScreen} />
      <Stack.Screen name="parking" component={ParkingScreen} />
      <Stack.Screen name="suscriptions" component={SuscriptionsScreen} />

      {/* Pantallas secundarias */}
      <Stack.Screen name="perfil">
        {(props) => <Perfil {...props} dad={parent} ruta={ruta} />}
      </Stack.Screen>
      <Stack.Screen name="entradaQR" component={GenericScreen} />
      <Stack.Screen name="salidaQR" component={GenericScreen} />
      <Stack.Screen name="detallesCar" component={GenericScreen} />
      <Stack.Screen name="inputCarScreen" component={GenericScreen} />
      <Stack.Screen name="newCar" component={GenericScreen} />
      <Stack.Screen name="detallesPension" component={GenericScreen} />
      <Stack.Screen name="historial" component={GenericScreen} />
      <Stack.Screen name="detallesPerfil" component={GenericScreen} />
      <Stack.Screen name="inputPerfilScreen" component={GenericScreen} />
      <Stack.Screen name="metodos" component={GenericScreen} />
      <Stack.Screen name="noWifi" component={GenericScreen} />
      <Stack.Screen name="error" component={GenericScreen} />
    </Stack.Navigator>
  );
}

/*
import React from "react";
import { View, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Appbar, Avatar, TouchableRipple, useTheme } from "react-native-paper";
import BoxStyles from "../utils/genericScreenStyles";

//Pantallas
import Inicio from "../modules/cajon/screens/Inicio";
import Perfil from "../modules/perfil/screens/Perfil";

const Stack = createNativeStackNavigator();

const CarsScreen = () => (
  <View>
    <Text>Cars</Text>
  </View>
);

const ParkingScreen = () => (
  <View>
    <Text>Parking</Text>
  </View>
);

const SuscriptionsScreen = () => (
  <View>
    <Text>Suscriptions</Text>
  </View>
);

const GenericScreen = () => (
  <View>
    <Text>Generic screen</Text>
  </View>
);

export default function UserStack({ name = "LO", navigation, route }) {
  const parent = navigation;
  const ruta = route;
  const mainRoutes = ["home", "cars", "parking", "suscriptions"];
  const paper = useTheme();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "music",
      title: "Favorites",
      focusedIcon: "heart",
      unfocusedIcon: "heart-outline",
    },
    { key: "albums", title: "Albums", focusedIcon: "album" },
    { key: "recents", title: "Recents", focusedIcon: "history" },
    {
      key: "notifications",
      title: "Notifications",
      focusedIcon: "bell",
      unfocusedIcon: "bell-outline",
    },
  ]);
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
          animation: "fade",
          header: () =>
            isMain ? (
              <Appbar.Header
                style={{
                  justifyContent: "space-between",
                  paddingRight: 16,
                  backgroundColor: paper.colors.surfaceVariant,
                }}
                elevated
              >
                <Appbar.Content
                  title="parKing"
                  titleStyle={[
                    BoxStyles.font700,
                    {
                      color: paper.colors.tertiary,
                    },
                  ]}
                  style={{ flex: 1 }}
                />
                <TouchableRipple
                  onPress={() => navigation.navigate("perfil")}
                  rippleColor="rgba(0, 0, 0, .32)"
                  style={{
                    borderRadius: 21, // half of avatar size for perfect circle
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
                  backgroundColor: paper.colors.surfaceVariant,
                }}
                elevated
              >
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content
                  title={tituloDeUpdate}
                  titleStyle={[
                    BoxStyles.font400,
                    { color: paper.colors.onSurfaceVariant },
                  ]}
                />
              </Appbar.Header>
            ),
        };
      }}
    >
*/
