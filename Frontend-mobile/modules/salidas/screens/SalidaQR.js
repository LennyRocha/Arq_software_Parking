import { View } from "react-native";
import React from "react";
import QRCode from "react-native-qrcode-svg";
import BoxStyles from "../../../utils/genericScreenStyles";
import { Card, Icon, Text, List, useTheme, Button, ActivityIndicator } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { useCustomThemes } from "../../../context/useCustomColors";
import ViewShot from "react-native-view-shot";
import { CustomAlert } from "../../../utils/customAlert";
import * as MediaLibrary from "expo-media-library";
import { useCustomAlert } from "../../../utils/useCustomAlert";

export default function SalidaQR({ route }) {
  const { visible, config, showAlert, hideAlert } = useCustomAlert();

  const [loadingSafe, setLoadingSafe] = React.useState(false);

  const viewRef = React.useRef();

  const takeShot = async () => {
    const perm = await MediaLibrary.getPermissionsAsync({ granularPermissions: ["photo"] });
    if (!perm.granted) {
      const newPerm = await MediaLibrary.requestPermissionsAsync({ granularPermissions: ["photo"] });
      if (!newPerm.granted) {
        return showAlert({
          icon: "error",
          title: "Permisos requeridos",
          message: "No se puede guardar sin permisos de galería.",
          confirmText: "OK",
        });
      }
    }

    try {
      setLoadingSafe(true);
      // 1️⃣ Capturar imagen
      const uri = await viewRef.current.capture();

      // 2️⃣ Crear o buscar el álbum existente
      let album = await MediaLibrary.getAlbumAsync("ParkingApp");

      if (!album) {
        // Si no existe, se crea
        album = await MediaLibrary.createAlbumAsync("ParkingApp", uri, false);
      } else {
        // Si existe solo agregamos la foto
        await MediaLibrary.addAssetsToAlbumAsync(
          [await MediaLibrary.createAssetAsync(uri)],
          album.id,
          false
        );
      }

      // 3️⃣ Mostrar alerta
      showAlert({
        icon: "success",
        title: "Guardado",
        message: "Captura almacenada en la carpeta 'ParkingApp'",
        confirmText: "OK",
      });

    } catch (err) {
      console.log(err);
      showAlert({
        icon: "error",
        title: "Error",
        message: "No se pudo guardar la imagen.",
        confirmText: "OK",
      });
    } finally {
      setLoadingSafe(false);
    }
  };

  /*
  const takeShot = async () => {
    const uri = await viewRef.current.capture();
    //Así se guarda en la caché de la app
    console.log("Screenshot guardado en:", uri);
    showAlert({
      icon: "success",
      title: "¡Éxito!",
      message: "Se guardó correctamente en este dispositivo.",
      showCancelButton: true,
      confirmText: "Ok",
      cancelText: "Cancelar",
      onConfirm: () => {},
      onCancel: () => {},
      externalDismiss: false,
    })
  };
  */

  const { folio } = route.params;
  console.log(folio)
  const paper = useTheme();
  const { mode } = useCustomThemes();
  return (
    <ViewShot ref={viewRef} options={{ format: "png", quality: 0.9 }} style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={[BoxStyles.containerScroll]}>
        <Card>
          <Card.Content style={{ gap: 4 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginHorizontal: 8 }}>
              <View>
                <Icon
                  source={require("../../../img/logo_parking_hd_no_titulo.png")}
                  size={56}
                />
              </View>
              <Text
                variant="bodyMedium"
                numberOfLines={2}
                style={{ flex: 1 }}
              >
                Muestra este código QR para marcar tu salida
              </Text>
            </View>
            <View style={{ width: "auto", marginHorizontal: "auto" }}>
              <QRCode value={String(folio)} size={200} backgroundColor={mode === "dark" ? "white" : "transparent"} />
            </View>
            <View />
            <View style={{ flexDirection: "row", width: "100%" }}>
              <List.Item
                title="Nombre"
                description="Usuario DAO"
                titleStyle={{ fontWeight: "bold", color: paper.colors.primary }}
                style={{ flex: 1 }}
                contentStyle={{ paddingLeft: 0 }}
              />
              <List.Item
                title="Fecha"
                description="Noviembre 22, 2025"
                titleStyle={{ fontWeight: "bold", color: paper.colors.primary }}
                style={{ flex: 1 }}
                contentStyle={{ paddingLeft: 0 }}
              />
            </View>
            <View style={{ flexDirection: "row", width: "100%" }}>
              <List.Item
                title="Hora de entrada"
                description="03:00 PM"
                titleStyle={{ fontWeight: "bold", color: paper.colors.primary }}
                style={{ flex: 1 }}
                contentStyle={{ paddingLeft: 0 }}
              />
              <List.Item
                title="Hora de salida"
                description="04:00 PM"
                titleStyle={{ fontWeight: "bold", color: paper.colors.primary }}
                style={{ flex: 1 }}
                contentStyle={{ paddingLeft: 0 }}
              />
            </View>
            <View style={{ flexDirection: "row", width: "100%" }}>
              <List.Item
                title="Vehículo"
                description="Camaro 1999"
                titleStyle={{ fontWeight: "bold", color: paper.colors.primary }}
                style={{ flex: 1 }}
                contentStyle={{ paddingLeft: 0 }}
              />
              <List.Item
                title="Tipo de vehículo"
                description="Coche"
                titleStyle={{ fontWeight: "bold", color: paper.colors.primary }}
                style={{ flex: 1 }}
                contentStyle={{ paddingLeft: 0 }}
              />
            </View>
            <View style={{ flexDirection: "row", width: "100%" }}>
              <List.Item
                title="Teléfono"
                description="777 123 4567"
                titleStyle={{ fontWeight: "bold", color: paper.colors.primary }}
                style={{ flex: 1 }}
                contentStyle={{ paddingLeft: 0 }}
              />
              <List.Item
                title="Folio"
                description={folio}
                titleStyle={{ fontWeight: "bold", color: paper.colors.primary }}
                style={{ flex: 1 }}
                contentStyle={{ paddingLeft: 0 }}
              />
            </View>
          </Card.Content>
          <Card.Actions style={{ backgroundColor: paper.colors.cardSurface, alignItems: "center", justifyContent: "center", paddingVertical: 18 }}>
            <Text variant="bodyMedium" style={{ color: paper.colors.tertiary }}>Total a pagar: <Text style={{ color: paper.colors.primary }} >Pago cubierto por pensión</Text></Text>
          </Card.Actions>
        </Card>
        {
          loadingSafe ? <View style={{ width: "100%", justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size={"large"} />
          </View> : <Button theme={{
            colors: {
              primary: paper.colors.secondary,
            }
          }} mode="outlined" style={[BoxStyles.ButtonRadius, { borderColor: paper.colors.secondary }]} labelStyle={BoxStyles.buttonText}
            onPress={takeShot}>Guardar</Button>
        }
      </ScrollView>
      <CustomAlert visible={visible} hideAlert={hideAlert} config={config} />
    </ViewShot >
  );
}
