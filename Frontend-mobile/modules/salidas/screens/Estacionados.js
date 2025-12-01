import { Image, View } from "react-native";
import SwiperView from "../../../components/Swiper";
import React from "react";
import { Button, Text, useTheme, Icon } from "react-native-paper";
import BoxStyles from "../../../utils/genericScreenStyles";
import useVehiculosEstacionados from "../../vehiculo/hooks/useVehiculosEstacionados";
import LoadingView from "../../../components/LoadingView";

export default function Estacionados({ navigation }) {
  const paper = useTheme();
  const vehiculos = {
    moto: require('../../../img/moto.png'),
    coche: require('../../../img/coche.png'),
    camioneta: require('../../../img/camioneta.png'),
  }
  const { getVehiculosActive, activeData, isLoading: loadingActive, errorData: errData, restartCall: recall } = useVehiculosEstacionados();
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
  const tiempoTranscurrido = (horaEntrada) => {
    // Obtener la fecha actual
    const now = new Date();

    // Separar hora, minuto, segundo
    const [horas, minutos, segundos] = horaEntrada.split(":").map(Number);

    // Crear un objeto Date con la misma fecha de hoy y la horaEntrada
    const entrada = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      horas,
      minutos,
      Math.floor(segundos),
      Math.floor((segundos % 1) * 1000) // milisegundos
    );

    // Calcular diferencia en milisegundos
    let diff = now - entrada;

    if (diff < 0) {
      // Si la hora es del día siguiente (por si fuera de la noche)
      diff += 24 * 60 * 60 * 1000;
    }

    const horasTrans = Math.floor(diff / (1000 * 60 * 60));
    const minutosTrans = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const segundosTrans = Math.floor((diff % (1000 * 60)) / 1000);

    if (horasTrans > 0) return `${horasTrans}h transcurridas`;
    if (minutosTrans > 0) return `${minutosTrans}m transcurridos`;
    return `${segundosTrans}s transcurridos`;
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

  const CarView = () => (
    <View
      style={[
        {
          backgroundColor: "transparent",
          flex: 1,
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 24,
          gap: 24
        },
      ]}
    >
      <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text variant='labelLarge' style={{ backgroundColor: paper.colors.cardSurface, padding: 4, color: paper.colors.onCardSurface }}>{parseDate(activeData.data.fechaEntrada)}</Text>
        <Text
          style={{
            borderRadius: 2,
            paddingHorizontal: 4,
            color: paper.colors.primary,
            alignSelf: "flex-start",
          }}
          variant="titleLarge"
        >
          {formatHour(activeData.data.horaEntrada)}
        </Text>
      </View>
      <Text variant="headlineMedium" style={{ fontWeight: "bold", color: paper.colors.tertiary }}>{activeData.data.vehiculo.modelo}</Text>
      <Image source={vehiculos["coche"]} style={{ flex: 1, aspectRatio: 9 / 16, resizeMode: "contain" }} />
      <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
        <Icon source={"clock-time-three-outline"} color={paper.colors.gray} size={24} />
        <Text variant="labelLarge" style={{ fontWeight: "bold", color: paper.colors.gray }}>{tiempoTranscurrido(activeData.data.horaEntrada)}</Text>
      </View>
      <Button
        theme={{
          colors: {
            primary: paper.colors.tertiary,
          }
        }}
        mode="contained" style={[BoxStyles.ButtonRadius, { width: "100%" }]} labelStyle={BoxStyles.buttonTextAuto} onPress={() => navigation.navigate("salidaQR", { folio:  activeData.data.folio })} >Marcar Salida</Button>
    </View>
  );
  const CamionView = () => (
    <View
      style={[
        {
          backgroundColor: "transparent",
          flex: 1,
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 24,
          gap: 24
        },
      ]}
    >
      <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text variant='labelLarge' style={{ backgroundColor: paper.colors.cardSurface, padding: 4, color: paper.colors.onCardSurface }}>{parseDate(activeData.data.fechaEntrada)}</Text>
        <Text
          style={{
            borderRadius: 2,
            paddingHorizontal: 4,
            color: paper.colors.primary,
            alignSelf: "flex-start",
          }}
          variant="titleLarge"
        >
          {formatHour(activeData.data.horaEntrada)}
        </Text>
      </View>
      <Text variant="headlineMedium" style={{ fontWeight: "bold", color: paper.colors.tertiary }}>{activeData.data.vehiculo.modelo}</Text>
      <Image source={vehiculos["camioneta"]} style={{ flex: 1, aspectRatio: 9 / 16, resizeMode: "contain", }} />
      <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
        <Icon source={"clock-time-three-outline"} color={paper.colors.gray} size={24} />
        <Text variant="labelLarge" style={{ fontWeight: "bold", color: paper.colors.gray }}>{tiempoTranscurrido(activeData.data.horaEntrada)}</Text>
      </View>
      <Button
        theme={{
          colors: {
            primary: paper.colors.tertiary,
          }
        }}
        mode="contained" style={[BoxStyles.ButtonRadius, { width: "100%" }]} labelStyle={BoxStyles.buttonTextAuto} onPress={() => navigation.navigate("salidaQR", { folio: activeData.data.folio })} >Marcar Salida</Button>
    </View>
  );
  const MotoView = () => (
    <View
      style={[
        {
          backgroundColor: "transparent",
          flex: 1,
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 24,
          gap: 24
        },
      ]}
    >
      <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text variant='labelLarge' style={{ backgroundColor: paper.colors.cardSurface, padding: 4, color: paper.colors.onCardSurface }}>{parseDate(activeData.data.fechaEntrada)}</Text>
        <Text
          style={{
            borderRadius: 2,
            paddingHorizontal: 4,
            color: paper.colors.primary,
            alignSelf: "flex-start",
          }}
          variant="titleLarge"
        >
          {formatHour(activeData.data.horaEntrada)}
        </Text>
      </View>
      <Text variant="headlineMedium" style={{ fontWeight: "bold", color: paper.colors.tertiary }}>{activeData.data.vehiculo.modelo}</Text>
      <Image source={vehiculos["moto"]} style={{ flex: 1, aspectRatio: 9 / 16, resizeMode: "contain", transform: [{ scaleX: -1 }, { scaleY: -1 }] }} />
      <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
        <Icon source={"clock-time-three-outline"} color={paper.colors.gray} size={24} />
        <Text variant="labelLarge" style={{ fontWeight: "bold", color: paper.colors.gray }}>{tiempoTranscurrido(activeData.data.horaEntrada)}</Text>
      </View>
      <Button
        theme={{
          colors: {
            primary: paper.colors.tertiary,
          }
        }}
        mode="contained" style={[BoxStyles.ButtonRadius, { width: "100%" }]} labelStyle={BoxStyles.buttonTextAuto} onPress={() => navigation.navigate("salidaQR", { folio:  activeData.data.folio })} >Marcar Salida</Button>
    </View>
  );

  const ViewNow = () => {

    switch (activeData.data.vehiculo.idTipoVehiculo) {
      case 1:
        return <CarView />;
      case 2:
        return <CamionView />;
      case 3:
        return <MotoView />
    }
  }

  if (!activeData) return <LoadingView />;

  return (
    <View style={{ flex: 1 }}>
      <SwiperView
        slides={[ViewNow]}
        horizontal={true}
        showsPagination
        paginationStyle={{ bottom: 0 }} // Ajusta la posición
        loop
      />
    </View>
  );
}
