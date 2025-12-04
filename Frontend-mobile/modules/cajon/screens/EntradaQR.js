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
import { useWebSocket } from "../hooks/useWebSocket";
import { useGlobalContext } from '../../../context/GlobalContext';
import setPension from "../../acceso/hooks/setPension";
import { useSnackBar } from "../../../context/SnackBarContext";

export default function EntradaQR({ route, navigation }) {
  const { visible, config, showAlert, hideAlert } = useCustomAlert();

  const { idUsuario } = useGlobalContext();

  const { showSnack} = useSnackBar();

  const { on, isConnected } = useWebSocket();

  const { recall } = setPension();

  React.useEffect(() => {
    console.log(idUsuario)
    if (!isConnected) return;

    on("uuid", (data) => {
      if (data.id === idUsuario) {
        showSnack("Entrada marcada", "Cerrar");
        navigation.goBack();
        recall();
      }
    });

  }, [isConnected]);

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
      console.error(err);
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
  const vehiculos = {
    1: "Coche",
    2: "Camioneta",
    3: "Moto"
  }

  const parseDate = (fecha) => {
    const ano = fecha.substring(0, 4);
    const mes = fecha.substring(5, 7);
    const dia = fecha.substring(8, 10);

    let mesString = "";
    switch (mes) {
      case "01": mesString = "Enero"; break;
      case "02": mesString = "Febrero"; break;
      case "03": mesString = "Marzo"; break;
      case "04": mesString = "Abril"; break;
      case "05": mesString = "Mayo"; break;
      case "06": mesString = "Junio"; break;
      case "07": mesString = "Julio"; break;
      case "08": mesString = "Agosto"; break;
      case "09": mesString = "Septiembre"; break;
      case "10": mesString = "Octubre"; break;
      case "11": mesString = "Noviembre"; break;
      case "12": mesString = "Diciembre"; break;
      default: mesString = "Mes inválido";
    }

    return `${mesString} ${dia}, ${ano}`;
  }

  const formatHour = (hora24) => {
    // Separar horas y minutos
    const [horaStr, minStr] = hora24.split(":");
    let hora = parseInt(horaStr, 10);
    const ampm = hora >= 12 ? "PM" : "AM";

    // Convertir hora a formato 12h
    hora = hora % 12;
    if (hora === 0) hora = 12;

    return `${hora}:${minStr} ${ampm}`;
  }

  const { folio, entrada } = route.params;
  console.log(entrada);
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
                description={`${entrada.usuario.nombre} ${entrada.usuario.apellidos}`}
                titleStyle={{ fontWeight: "bold", color: paper.colors.primary }}
                style={{ flex: 1 }}
                contentStyle={{ paddingLeft: 0 }}
              />
              <List.Item
                title="Fecha"
                description={parseDate(entrada.fecha)}
                titleStyle={{ fontWeight: "bold", color: paper.colors.primary }}
                style={{ flex: 1 }}
                contentStyle={{ paddingLeft: 0 }}
              />
            </View>
            <View style={{ flexDirection: "row", width: "100%" }}>
              <List.Item
                title="Teléfono"
                description={entrada.usuario.telefono}
                titleStyle={{ fontWeight: "bold", color: paper.colors.primary }}
                style={{ flex: 1 }}
                contentStyle={{ paddingLeft: 0 }}
              />
              <List.Item
                title="Hora de entrada"
                description={formatHour(entrada.horaEntrada)}
                titleStyle={{ fontWeight: "bold", color: paper.colors.primary }}
                style={{ flex: 1 }}
                contentStyle={{ paddingLeft: 0 }}
              />
            </View>
            <View style={{ flexDirection: "row", width: "100%" }}>
              <List.Item
                title="Vehículo"
                description={entrada.vehiculo.modelo}
                titleStyle={{ fontWeight: "bold", color: paper.colors.primary }}
                style={{ flex: 1 }}
                contentStyle={{ paddingLeft: 0 }}
              />
              <List.Item
                title="Tipo vehículo"
                description={vehiculos[entrada.vehiculo.tipoVehiculo.id]}
                titleStyle={{ fontWeight: "bold", color: paper.colors.primary }}
                style={{ flex: 1 }}
                contentStyle={{ paddingLeft: 0 }}
              />
            </View>
            {/* <View style={{ flexDirection: "row", width: "100%" }}>
              <List.Item
                title="Folio"
                description={entrada.folioTicket}
                titleStyle={{ fontWeight: "bold", color: paper.colors.primary }}
                style={{ flex: 1 }}
                contentStyle={{ paddingLeft: 0 }}
              />
            </View> */}
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