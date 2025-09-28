import React, { useEffect } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import {
  Button,
  Card,
  Text,
  Provider as PaperProvider,
} from "react-native-paper";
import { ThemeProvider } from "./context/useCustomColors";
import PaperContext from "./context/paperContext";
import { useCustomThemes } from "./context/useCustomColors";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "react-native-paper";
import changeNavigationBarColor from "react-native-navigation-bar-color";
import { CustomAlert } from "./utils/customAlert";
import { useCustomAlert } from "./utils/useCustomAlert";
import CustomBottomSheet from "./components/CustomBottomSheet";
import useBottomSheetController from "./hooks/useBottomSheetController";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import ScrollRefreshingView from "./components/ScrollRefreshingView";
import SwiperExample from "./components/Swiper";
import SwiperView from "./components/Swiper";

const MyApp = () => {
  const { theme, toggleTheme } = useCustomThemes();
  const paperTheme = useTheme();
  const { visible, config, showAlert, hideAlert } = useCustomAlert();
  const { sheetRef, openSheet, closeSheet } = useBottomSheetController();

  //Probar el refresh control con una función sincrona
  function handlerRefresh() {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Terminó");
        resolve(); //Si es función sincrona, una asincrona será llamara al API
      }, 2000);
    });
  }

  //Vistas a utilizar en el slider
  const Vista1 = () => (
    <View
      style={[
        {
          backgroundColor: "red",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
      ]}
    >
      <Text>Slide 1</Text>
    </View>
  );
  const Vista2 = () => (
    <View
      style={[
        {
          backgroundColor: "green",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
      ]}
    >
      <Text>Slide 2</Text>
    </View>
  );
  const Vista3 = () => (
    <View
      style={[
        {
          backgroundColor: "blue",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
      ]}
    >
      <Text>Slide 3</Text>
    </View>
  );

  return (
    <>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: paperTheme.colors.background }}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor={paperTheme.colors.primary}
          translucent={true}
        />
        <ScrollRefreshingView
          refreshHandler={handlerRefresh}
          contentContainerStyle={[
            styles.container,
            { backgroundColor: paperTheme.colors.background },
          ]}
        >
          <Text
            style={[styles.header, { color: paperTheme.colors.onBackground }]}
            variant="bodyLarge"
          >
            Prueba de Paleta Para aplicación
          </Text>

          <Card
            style={[
              styles.card,
              { backgroundColor: paperTheme.colors.primary },
            ]}
          >
            <Card.Content>
              <Text style={{ color: paperTheme.colors.onPrimary }}>
                Primary (#4B7C7B)
              </Text>
            </Card.Content>
          </Card>

          <Card
            style={[
              styles.card,
              { backgroundColor: paperTheme.colors.secondary },
            ]}
          >
            <Card.Content>
              <Text style={{ color: paperTheme.colors.onSecondary }}>
                Secondary (#7EBEBE)
              </Text>
            </Card.Content>
          </Card>

          <Card style={[styles.card, { backgroundColor: theme.background }]}>
            <Card.Content>
              <Text style={{ color: theme.primary }}>Background (#F0F9F9)</Text>
            </Card.Content>
          </Card>

          <Card
            style={[
              styles.card,
              { backgroundColor: paperTheme.colors.surface },
            ]}
          >
            <Card.Content>
              <Text style={{ color: paperTheme.colors.onSurface }}>
                Surface (#C5E4E7)
              </Text>
            </Card.Content>
          </Card>

          <Card style={[styles.card, { backgroundColor: theme.other }]}>
            <Card.Content>
              <Text style={{ color: theme.background }}>Other (#1E3A3E)</Text>
            </Card.Content>
          </Card>

          <Button
            mode="contained"
            style={{ marginTop: 16 }}
            buttonColor="#FF5252"
            onPress={() => {
              toggleTheme();
            }}
          >
            Error (#FF5252)
          </Button>
          <Button
            mode="contained"
            style={{ marginTop: 8 }}
            buttonColor={theme.warning}
            onPress={openSheet}
          >
            Warning (#FF9800)
          </Button>
          <Button
            mode="contained"
            style={{ marginTop: 8 }}
            buttonColor={theme.success}
            onPress={() =>
              showAlert({
                icon: "success",
                title: "¡Éxito!",
                message: "Se guardó correctamente.",
                showCancelButton: true,
                confirmText: "Ok",
                cancelText: "Cancelar",
                onConfirm: () => console.log("Confirmado"),
                onCancel: () => console.log("Cancelado"),
                externalDismiss: false,
              })
            }
          >
            Success (#4CAF50)
          </Button>
          <Button
            mode="contained"
            style={{ marginTop: 8 }}
            buttonColor={theme.info}
          >
            Info (#2196F3)
          </Button>
          <Button
            mode="contained"
            style={{ marginTop: 8 }}
            buttonColor={theme.dark}
          >
            Dark (#424242)
          </Button>
          <SwiperView
            slides={[Vista1, Vista2, Vista3]}
            horizontal={true}
            showsPagination
            loop
          />
        </ScrollRefreshingView>
        <CustomBottomSheet ref={sheetRef} snapPoints={["25%", "50%", "75%"]}>
          <Text>¡Hola desde el BottomSheet! 🎉</Text>
          <Button onPress={closeSheet}>Cerrar</Button>
        </CustomBottomSheet>
        <CustomAlert visible={visible} hideAlert={hideAlert} config={config} />
      </SafeAreaView>
    </>
  );
};

export default function App() {
  SplashScreen.preventAutoHideAsync();
  // Simulate resource loading
  useEffect(() => {
    async function prepare() {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate loading
      SplashScreen.hideAsync();
    }
    prepare();
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <PaperContext>
          <MyApp />
        </PaperContext>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "stretch",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    marginVertical: 8,
    padding: 8,
  },
});
