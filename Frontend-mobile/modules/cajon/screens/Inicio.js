import React from "react";
import { View, FlatList, Dimensions, RefreshControl } from "react-native";
import BoxStyles from "../../../utils/genericScreenStyles";
import { Text, Button, SegmentedButtons, RadioButton, useTheme, Chip, HelperText, IconButton, ActivityIndicator } from "react-native-paper";
import useVehiculosEstacionados from "../../vehiculo/hooks/useVehiculosEstacionados";
import Cajoncito from "../components/Cajoncito";
import LoadingView from '../../../components/LoadingView'
import { useSnackBar } from "../../../context/SnackBarContext";
import EmptyListView from "../../errores/screens/EmptyListView";
import useVehiculos from "../../vehiculo/hooks/useVehículos";
import useTiposVehiculos from "../../vehiculo/hooks/useTiposVehiculos";
import VehiculoSheetCard from "../components/VehiculoSheetCard";
import { ScrollView } from "react-native-gesture-handler";
import useCajones from "../hooks/useCajones";
import { CustomAlert } from "../../../utils/customAlert";
import { Portal, Dialog } from "react-native-paper";
import useMarcarEntrada from "../hooks/useMarcarEntrada";

const { width, height } = Dimensions.get("screen")

export default function Inicio({ navigation }) {
  const { data: list, load: loadTypes } = useTiposVehiculos();
  const { data: cars, isLoading: load } = useVehiculos(3);
  const { setSnapPoints, openSheet, closeSheet, setSheetChild } = useSnackBar();
  const paper = useTheme();
  const { setVehiculo, vehiculo, errorData, visible, config, hideAlert, data: entrada, onSubmit, isLoading: loadingPost } = useMarcarEntrada(navigation);
  const { getVehiculosActive, activeData, isLoading: loadingActive, errorData: errData, restartCall: recall } = useVehiculosEstacionados();

  const [simbolVis, setVisible] = React.useState(false);
  const showDialog = () => {
    setVisible(true);
  };
  const hideDialog = () => {
    setVisible(false);
  };

  const {
    data,
    loading,
    restartValues,
    setPiso,
    setIdCar,
    piso,
    idCar,
    availableCount,
    message
  } = useCajones();

  React.useEffect(() => {
    setSnapPoints(["25%", "50%"])
    return () => closeSheet();
  }, []);

  const [idEnter, setIdEnter] = React.useState(null);

  React.useEffect(() => {
    // 1. Lógica de selección de vehículo
    let currentVehiculo = vehiculo; // Usamos el estado actual como fallback
    if (cars && idEnter !== null) {
      const selectedVehiculo = cars.data.find(v => v.id === idEnter);
      if (selectedVehiculo && selectedVehiculo !== vehiculo) {
        setVehiculo(selectedVehiculo);
        currentVehiculo = selectedVehiculo; // Actualizamos la variable local para usarla abajo
      } else if (!selectedVehiculo && vehiculo !== null) {
        setVehiculo(null);
        currentVehiculo = null;
      }
    } else if (vehiculo !== null) {
      // Limpiar vehiculo si idEnter es null, por si acaso.
      setVehiculo(null);
      currentVehiculo = null;
    }

    // 2. Construcción de la hoja (SheetChild)
    if (cars) {
      let filtered = [];
      // ... (Tu lógica para filtrar vehículos sigue igual) ...
      if (activeData?.data?.vehiculo) { // Usar encadenamiento opcional para prevenir el error anterior
        filtered = cars.data.filter((c) => c.id !== activeData.data.vehiculo.id && c.status !== false);
      } else {
        filtered = cars.data.filter((c) => c.status !== false)
      }

      setSheetChild(
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 12 }}>
          <Text variant="titleMedium">Selecciona un vehículo</Text>
          <RadioButton.Group onValueChange={setIdEnter} value={idEnter}>
            <View style={{ gap: 8, padding: 2 }}>
              {filtered.map((v) => (
                <VehiculoSheetCard
                  key={v.id}
                  vehic={v}
                  useRadios
                  currentValue={idEnter}
                  list={list}
                  value={v.id}
                />
              ))}
            </View>
          </RadioButton.Group>

          {
            loadingPost ?
              <View style={{ width: "100%", alignItems: "center", justifyContent: "center" }} >
                <ActivityIndicator size={"small"} />
              </View>
              :
              <Button
                // 🛑 USAMOS currentVehiculo AQUÍ PARA UN SOLO CICLO
                disabled={!currentVehiculo}
                mode="text" style={[BoxStyles.ButtonRadius]} labelStyle={BoxStyles.buttonText}
                onPress={async () => {
                  await onSubmit(closeSheet);
                }}
              >
                Continuar
              </Button>
          }
        </ScrollView >
      );
    }
  }, [cars, activeData, idEnter, loadingPost, setVehiculo, vehiculo]);

  /*React.useEffect(() => {
    if (cars) {
      let filtered = [];
      if (activeData.data.vehiculo) {
        filtered = cars.data.filter((c) => c.id !== activeData.data.vehiculo.id && c.status !== false);
      } else {
        filtered = cars.data.filter((c) => c.status !== false)
      }
      setSheetChild(
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 12 }}>
          <Text variant="titleMedium">Selecciona un vehículo</Text>
          <RadioButton.Group onValueChange={setIdEnter} value={idEnter}>
            <View style={{ gap: 8, padding: 2 }}>
              {filtered.map((v) => (
                <VehiculoSheetCard
                  key={v.id}
                  vehic={v}
                  useRadios
                  currentValue={idEnter}
                  list={list}
                  value={v.id}
                />
              ))}
            </View>
          </RadioButton.Group>
          {
            loadingPost ?
              <View style={{ width: "100%", alignItems: "center", justifyContent: "center" }} >
                <ActivityIndicator size={"small"} />
              </View>
              :
              <Button
                disabled={!vehiculo}
                mode="text" style={[BoxStyles.ButtonRadius]} labelStyle={BoxStyles.buttonText}
                onPress={async () => {
                  await onSubmit(closeSheet);
                }}
              >
                Continuar
              </Button>
          }
        </ScrollView >
      );
    }
  }, [cars, activeData, idEnter, loadingPost]);*/

  /*React.useEffect(() => {
    if (cars && idEnter !== null) {
      const selectedVehiculo = cars.data.find(v => v.id === idEnter);
      setVehiculo(selectedVehiculo);
    }

    return () => setVehiculo(null);
  }, [idEnter, cars]);*/

  const [normalizedData, setNormalizedData] = React.useState([]);

  const ListHeaderComponent = () => (
    <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8, alignItems: "center", height: 40 }}>
      <View style={{ height: 2, flex: 1, borderBottomWidth: 2, borderBottomColor: paper.colors.outline, borderStyle: "dashed" }} />
      <Chip mode="outlined" style={{ borderColor: paper.colors.secondary }} textStyle={{ color: paper.colors.secondary }}>Entrada</Chip>
      <View style={{ height: 2, flex: 1, borderBottomWidth: 2, borderBottomColor: paper.colors.outline, borderStyle: "dashed" }} />
    </View>
  );

  const ListFooterComponent = () => (
    <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8, alignItems: "center", height: 20 }}>
      <View style={{ height: 2, flex: 1, borderBottomWidth: 2, borderBottomColor: paper.colors.outline, borderStyle: "dashed" }} />
    </View>
  );

  const normalizeColumns = (data, columns = 5) => {
    const result = [];
    const ROW_SIZE = columns;
    const CENTER = 2;

    const copy = [...data];

    while (copy.length > 0) {
      const left = copy.splice(0, 2);

      const right = copy.splice(0, 2);

      const row = new Array(ROW_SIZE).fill(null);

      row[CENTER] = { id: `road-${result.length}`, road: true };

      if (left[0]) row[0] = left[0];
      if (left[1]) row[1] = left[1];

      if (right[0]) row[3] = right[0];
      if (right[1]) row[4] = right[1];

      for (let i = 0; i < ROW_SIZE; i++) {
        if (!row[i]) {
          row[i] = {
            id: `empty-${result.length}-${i}`,
            empty: true,
          };
        }
      }

      result.push(...row);
    }

    return result;
  };

  React.useEffect(() => {
    if (data) setNormalizedData(normalizeColumns(data, 5))
  }, [data]);

  const SCREEN = width;
  const H_PADDING = 24;
  const ROAD_WIDTH = 40;
  const SLOTS = 4;
  const ITEM_MARGIN_HORIZONTAL = 2;

  const totalPadding = H_PADDING * 2;
  const totalItemMargins = SLOTS * (ITEM_MARGIN_HORIZONTAL * 2);

  const available = SCREEN - totalPadding - ROAD_WIDTH - totalItemMargins;
  const slotWidth = Math.floor(available / SLOTS);

  if (loading || !data || load || loadTypes || loadingActive) return <LoadingView />;

  return (
    <View style={[BoxStyles.container, BoxStyles.flexCentered]}>
      <Text variant='titleLarge' style={{ fontWeight: "bold", color: paper.colors.primary, width: "100%" }}>
        Cajones disponibles
      </Text>

      {data.length !== 0 && (
        <View style={{ width: "100%", gap: 1, flexDirection: "column" }}>
          <HelperText type="info" variant="labelSmall" style={{ textAlign: "left", paddingHorizontal: 0 }}>Tipo de vehículo</HelperText>
          <SegmentedButtons
            value={idCar}
            onValueChange={setIdCar}
            buttons={[
              {
                value: 0,
                label: 'Todos',
                style: { backgroundColor: idCar === 0 ? paper.colors.tertiary : undefined },
                checkedColor: "white",
              },
              {
                value: 1,
                label: 'Coche',
                style: { backgroundColor: idCar === 1 ? paper.colors.tertiary : undefined },
                checkedColor: "white",
              },
              {
                value: 2,
                label: 'Camioneta',
                style: { backgroundColor: idCar === 2 ? paper.colors.tertiary : undefined },
                checkedColor: "white",
              },
              {
                value: 3,
                label: 'Moto',
                style: { backgroundColor: idCar === 3 ? paper.colors.tertiary : undefined },
                checkedColor: "white",
              },
            ]}
            style={{ borderColor: paper.colors.tertiary, marginBottom: 4 }}
            theme={{ roundness: 1 }}
          />
          <HelperText type="info" variant="labelSmall" style={{ textAlign: "left", paddingHorizontal: 0 }}>Piso</HelperText>
          <View style={{ width: "100%", flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 8 }}>
            <Button
              style={{
                borderRadius: 5,
                flex: 1,
                backgroundColor: piso === 0 ? paper.colors.primary : paper.colors.cardSurface,
              }}
              labelStyle={{ color: piso === 0 ? paper.colors.onPrimary : paper.colors.onCardSurface }}
              compact
              mode={piso === 0 ? "contained" : "elevated"}
              onPress={() => setPiso(0)}
            >
              Todos
            </Button>
            <Button style={{
              borderRadius: 5,
              flex: 1,
              backgroundColor: piso === 1 ? paper.colors.primary : paper.colors.cardSurface,
            }}
              labelStyle={{ color: piso === 1 ? paper.colors.onPrimary : paper.colors.onCardSurface }}
              compact mode={piso === 1 ? "contained" : "elevated"}
              onPress={() => setPiso(1)}>Piso 1</Button>
            <Button style={{
              borderRadius: 5,
              flex: 1,
              backgroundColor: piso === 2 ? paper.colors.primary : paper.colors.cardSurface,
            }}
              labelStyle={{ color: piso === 2 ? paper.colors.onPrimary : paper.colors.onCardSurface }} compact mode={piso === 2 ? "contained" : "elevated"} onPress={() => setPiso(2)}>Piso 2</Button>
            <Button style={{
              borderRadius: 5,
              flex: 1,
              backgroundColor: piso === 3 ? paper.colors.primary : paper.colors.cardSurface,
            }}
              labelStyle={{ color: piso === 3 ? paper.colors.onPrimary : paper.colors.onCardSurface }} compact mode={piso === 3 ? "contained" : "elevated"} onPress={() => setPiso(3)}>Piso 3</Button>
          </View>
          <View style={{ width: "100%", flexDirection: "row", alignItems: "center" }}>
            <Text variant="bodyLarge">Cajones disponibles: {availableCount}</Text>
            <IconButton
              icon={"information-outline"}
              size={24}
              style={{ padding: 0, margin: 0 }}
              onPress={showDialog}
              iconColor={paper.colors.primary}
            />
          </View>
        </View>
      )}

      {data && (
        <View style={{ flex: 1, gap: 0 }}>
          <ListHeaderComponent />
          <FlatList
            data={normalizedData}
            numColumns={5}
            style={{ flex: 1 }}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={restartValues}
                tintColor={paper.colors.primary} // iOS
                colors={[paper.colors.primary]} // Android
                progressBackgroundColor={paper.colors.background}
              />
            }
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={{ flexGrow: 1 }}
            renderItem={({ item, index }) => {
              if (item.empty) {
                return <View style={{ width: slotWidth, height: 40, margin: 2 }} />;
              }

              const columnIndex = index % 5;
              const isMiddle = columnIndex === 2;

              if (item.road) {
                return (
                  <View style={{ width: ROAD_WIDTH, justifyContent: 'center', alignItems: 'center', marginVertical: 1, height: 40, padding: 1 }}>
                    <View style={{ width: 2, height: "100%", borderRightWidth: 2, borderRightColor: paper.colors.outline, borderStyle: "dashed" }} />
                  </View>
                );
              }

              return (
                <View style={{ width: slotWidth, height: 40, margin: 2 }}>
                  <Cajoncito cajon={item} index={columnIndex} />
                </View>
              );
            }}
            columnWrapperStyle={{ gap: 0 }}
            ListEmptyComponent={<EmptyListView message={message} icon={"parking"} />}
          />
          <ListFooterComponent />
          <CustomAlert visible={visible} hideAlert={hideAlert} config={config} />
          <DialogSimbologia visible={simbolVis} hideDialog={hideDialog} />
        </View>
      )}

      <Button
        theme={{ colors: { primary: paper.colors.tertiary } }}
        mode="contained"
        style={[BoxStyles.ButtonRadius]}
        labelStyle={BoxStyles.buttonText}
        onPress={() => openSheet()}
      >
        Marcar entrada
      </Button>
    </View>
  );
}

const DialogSimbologia = ({ visible, hideDialog }) => {
  const cajon1 = {
    disponible: false,
    paraPensionados: false,
    estatus: true,
    tipoVehiculo: { nombre: "coche" }
  }
  const cajon2 = {
    disponible: true,
    paraPensionados: false,
    estatus: true,
    tipoVehiculo: { nombre: "coche" }
  }
  const cajon3 = {
    disponible: true,
    paraPensionados: true,
    estatus: true,
    tipoVehiculo: { nombre: "coche" }
  }
  const cajon4 = {
    disponible: true,
    paraPensionados: true,
    estatus: false,
    tipoVehiculo: { nombre: "coche" }
  }
  const theme = useTheme();
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}
        style={{ backgroundColor: theme.colors.surface }}
      >
        <Dialog.Title>Simbologia</Dialog.Title>
        <Dialog.Content style={{ gap: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: 6 }}>
            <View style={{ width: 100, height: 42 }}>
              <Cajoncito cajon={cajon1} />
            </View>
            <Text variant="bodyLarge" >Ocupado</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: 6 }}>
            <View style={{ width: 100, height: 42 }}>
              <Cajoncito cajon={cajon2} />
            </View>
            <Text variant="bodyLarge" >Disponible</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: 6 }}>
            <View style={{ width: 100, height: 42 }}>
              <Cajoncito cajon={cajon3} />
            </View>
            <Text variant="bodyLarge" >para pensionados</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: 6 }}>
            <View style={{ width: 100 }}>
              <Cajoncito cajon={cajon4} />
            </View>
            <Text variant="bodyLarge" >No disponible</Text>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog} style={{ borderRadius: 5 }}>Cerrar</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}