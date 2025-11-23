import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import {
  Button,
  Card,
  Text,
  Provider as PaperProvider,
  TouchableRipple,
} from "react-native-paper";
import { ThemeProvider } from "./context/useCustomColors";
import PaperContext from "./context/paperContext";
import { useCustomThemes } from "./context/useCustomColors";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useTheme } from "react-native-paper";
import {
  useFonts,
  Exo2_400Regular,
  Exo2_700Bold,
  Exo2_300Light,
  Exo2_800ExtraBold,
  Exo2_900Black,
} from "@expo-google-fonts/exo-2";
import { CustomAlert } from "./utils/customAlert";
import { useCustomAlert } from "./utils/useCustomAlert";
import CustomBottomSheet from "./components/CustomBottomSheet";
import useBottomSheetController from "./hooks/useBottomSheetController";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import ScrollRefreshingView from "./components/ScrollRefreshingView";
import SwiperView from "./components/Swiper";
import CustomModal from "./components/CustomModal";
import useModalController from "./hooks/useModalController";
import CustomMultiSteps from "./components/CustomMultiSteps";
import { CreditCardView } from "react-native-credit-card-input";
import { NavigationContainer } from "@react-navigation/native";
import AppWrapper from "./AppWrapper";

export const MyApp = () => {
  const { theme, toggleTheme } = useCustomThemes();
  const paperTheme = useTheme();
  const { visible, config, showAlert, hideAlert } = useCustomAlert();
  const { sheetRef, openSheet, closeSheet } = useBottomSheetController();
  const { modalVisible, showModal, hideModal } = useModalController();

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
          width: "100%",
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
          width: "100%",
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
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
      ]}
    >
      <Text>Slide 3</Text>
    </View>
  );
  const Vista4 = () => (
    <View
      style={[
        {
          backgroundColor: "yellow",
          flex: 1,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
      ]}
    >
      <Text>Slide 4</Text>
    </View>
  );

  const [itemFocused, setItemFocused] = React.useState("number");

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

          {/* <Card
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
          </Card> */}

          <Card
            style={[
              styles.card,
              { backgroundColor: paperTheme.colors.primaryContainer },
            ]}
          >
            <Card.Content>
              <Text style={{ color: paperTheme.colors.onPrimaryContainer }}>
                Primary container
              </Text>
            </Card.Content>
          </Card>

          <Card
            style={[
              styles.card,
              { backgroundColor: paperTheme.colors.secondaryContainer },
            ]}
          >
            <Card.Content>
              <Text style={{ color: paperTheme.colors.onSecondaryContainer }}>
                Secondary container
              </Text>
            </Card.Content>
          </Card>

          <Card
            style={[
              styles.card,
              { backgroundColor: paperTheme.colors.tertiaryContainer },
            ]}
          >
            <Card.Content>
              <Text style={{ color: paperTheme.colors.onTertiaryContainer }}>
                Tertiary container
              </Text>
            </Card.Content>
          </Card>

          {/* <Card style={[styles.card, { backgroundColor: theme.other }]}>
            <Card.Content>
              <Text style={{ color: theme.background }}>Other (#1E3A3E)</Text>
            </Card.Content>
          </Card> */}

          <Card
            style={[styles.card, { backgroundColor: theme.surface }]}
            elevation={5}
          >
            <Card.Content>
              <Text style={{ color: paperTheme.colors.onSurface }}>
                Card normal{" "}
              </Text>
            </Card.Content>
          </Card>

          <Card
            style={[
              styles.card,
              { backgroundColor: paperTheme.colors.primary },
            ]}
          >
            <Card.Content>
              <Text style={{ color: paperTheme.colors.onPrimary }}>
                Primary
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
                Secondary
              </Text>
            </Card.Content>
          </Card>

          <Card
            style={[
              styles.card,
              { backgroundColor: paperTheme.colors.tertiary },
            ]}
          >
            <Card.Content>
              <Text style={{ color: paperTheme.colors.onTertiary }}>
                Tertiary
              </Text>
            </Card.Content>
          </Card>

          <Card
            style={[styles.card, { backgroundColor: paperTheme.colors.error }]}
          >
            <Card.Content>
              <Text style={{ color: paperTheme.colors.onError }}>Error</Text>
            </Card.Content>
          </Card>

          <Card
            style={[styles.card, { backgroundColor: paperTheme.colors.errorContainer }]}
          >
            <Card.Content>
              <Text style={{ color: paperTheme.colors.onErrorContainer }}>Error</Text>
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
                Surface
              </Text>
            </Card.Content>
          </Card>

          <Card
            style={[
              styles.card,
              { backgroundColor: paperTheme.colors.surfaceVariant },
            ]}
          >
            <Card.Content>
              <Text style={{ color: paperTheme.colors.onSurfaceVariant }}>
                surface Variant
              </Text>
            </Card.Content>
          </Card>

          <Card
            style={[
              styles.card,
              { backgroundColor: paperTheme.colors.cardDark },
            ]}
          >
            <Card.Content>
              <Text style={{ color: paperTheme.colors.onCardDark }}>
                Card dark
              </Text>
            </Card.Content>
          </Card>

          <Button
            mode="contained"
            style={{ marginTop: 16 }}
            buttonColor={theme.error}
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
            onPress={showModal}
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
          <CustomModal visible={modalVisible} onClose={hideModal}>
            <Text variant="headlineSmall">Modal personalizado.</Text>
            <Text>Example Modal. Click outside this area to dismiss.</Text>
            <Button onPress={hideModal}>Cerrar</Button>
          </CustomModal>
          <SwiperView
            slides={[Vista1, Vista2, Vista3, Vista4]}
            horizontal={true}
            showsPagination
            loop
          />
          <CustomMultiSteps
            stepProps={{
              buttonNextText: "Siguiente",
              buttonPreviousText: "Anterior",
              buttonFinishText: "Completar",
            }}
            steps={[
              { label: "Paso 1", content: <Vista1 /> },
              { label: "Paso 2", content: <Vista2 /> },
              { label: "Paso 3", content: <Vista3 /> },
              { label: "Paso 4", content: <Vista4 /> },
            ]}
          />
          <View
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableRipple
              style={{ borderRadius: 10, overflow: "hidden", width: 300 }}
              onPress={() =>
                setItemFocused((item) => (item === "number" ? "cvc" : "number"))
              }
            >
              <CreditCardView
                name="Juan Peréz"
                cvc="123"
                expiry="09/28"
                number="**** **** **** 4321"
                type="visa"
                imageFront={require("./img/cards/Card_back_3.png")}
                imageBack={require("./img/cards/Card_back_3.png")}
                style={{ flex: 1 }}
                focusedField={itemFocused}
              />
            </TouchableRipple>
          </View>
        </ScrollRefreshingView>
        <CustomBottomSheet
          ref={sheetRef}
          snapPoints={["25%", "50%", "75%", "100%"]}
        >
          <Text>¡Hola desde el BottomSheet! 🎉</Text>
          <Button onPress={closeSheet}>Cerrar</Button>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ fontFamily: "Exo2_300Light", fontSize: 18 }}>
              Texto ligero 🪶
            </Text>
            <Text style={{ fontFamily: "Exo2_400Regular", fontSize: 20 }}>
              Texto regular 😎
            </Text>
            <Text style={{ fontFamily: "Exo2_700Bold", fontSize: 22 }}>
              Texto en negritas 💪
            </Text>
          </View>
        </CustomBottomSheet>
        <CustomAlert visible={visible} hideAlert={hideAlert} config={config} />
      </SafeAreaView>
    </>
  );
};

export default function App() {
  SplashScreen.preventAutoHideAsync();
  // Simulate resource loading
  const [fontsLoaded] = useFonts({
    Exo2_300Light,
    Exo2_400Regular,
    Exo2_700Bold,
    Exo2_800ExtraBold,
    Exo2_900Black,
  });

  //Todos los pesos de la fuente Exo2
  //  Exo2_100Thin
  // Exo2_200ExtraLight
  // Exo2_300Light
  // Exo2_400Regular
  // Exo2_500Medium
  // Exo2_600SemiBold
  // Exo2_700Bold
  // Exo2_800ExtraBold
  // Exo2_900Black

  if (fontsLoaded) {
    SplashScreen.hideAsync();
  }
  // useEffect(() => {
  //   async function prepare() {
  //     await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate loading
  //     SplashScreen.hideAsync();
  //   }
  //   prepare();
  // }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <ThemeProvider>
            <PaperContext>
              <AppWrapper />
            </PaperContext>
          </ThemeProvider>
        </NavigationContainer>
      </SafeAreaProvider>
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
