import React from "react";
import { View, FlatList, Dimensions } from "react-native";
import BoxStyles from "../../../utils/genericScreenStyles";
import { Text, Button, SegmentedButtons, useTheme } from "react-native-paper";
import { useWebSocket } from "../hooks/useWebSocket";
import ScrollRefreshingView from '../../../components/ScrollRefreshingView'
import Cajoncito from "../components/Cajoncito";
import LoadingView from '../../../components/LoadingView'
import { useSnackBar } from "../../../context/SnackBarContext";

const { width, height } = Dimensions.get("screen")

export default function Inicio({ navigation }) {
  const { emit, on, isConnected } = useWebSocket();

  const { showSnack } = useSnackBar();

  const paper = useTheme();

  const [piso, setPiso] = React.useState(0);
  const [idCar, setIdCar] = React.useState(0);
  const [data, setData] = React.useState(null);

  const [loading, setLoading] = React.useState(false);

  const sendParams = (piso, id) => {
    setLoading(true);
    emit('get', { piso, id });
  };

  React.useEffect(() => {
    if (isConnected) {
      // Cuando Spring notifica que hay cambios
      on('sync', (data) => {
        console.log('Sincronizando:', data);
        // Solicita los datos actualizados
        showSnack("Cajones modificados desde el backend", "Aceptar")
        setLoading(true);
        emit('get', { piso, idCar });
      });

      // Recibe los datos actualizados
      on('response', (data) => {
        setData(data.data);
        setLoading(false);
      });

      sendParams(piso, idCar);
    }
  }, [piso, idCar]);

  function restartValues() {
    setIdCar(0);
    setPiso(0);
    sendParams(piso, idCar);
  }

  const fullWidth = width - 48;

  if (loading || !data) return <LoadingView />;

  return (
    <View style={[BoxStyles.container, BoxStyles.flexCentered]}>
      <Text variant='titleLarge' style={{ fontWeight: "bold", color: paper.colors.primary, width: "100%" }} >Cajones disponibles</Text>
      <SegmentedButtons
        value={idCar}
        onValueChange={setIdCar}
        buttons={[
          {
            value: 0,
            label: 'Todos',
            style: {
              backgroundColor: idCar === 0 ? paper.colors.tertiary : undefined,
            },
            checkedColor: "white",
          },
          {
            value: 1,
            label: 'Coche',
            style: {
              backgroundColor: idCar === 1 ? paper.colors.tertiary : undefined,
            },
            checkedColor: "white",
          },
          {
            value: 2,
            label: 'Camioneta',
            style: {
              backgroundColor: idCar === 2 ? paper.colors.tertiary : undefined,
            },
            checkedColor: "white",
          },
          {
            value: 3,
            label: 'Moto',
            style: {
              backgroundColor: idCar === 3 ? paper.colors.tertiary : undefined,
            },
            checkedColor: "white",
          },
        ]}
        style={{ borderColor: paper.colors.tertiary, marginVertical: 12 }}
        theme={{ roundness: 1 }}
      />
      {/* <ScrollRefreshingView refreshHandler={restartValues} contentContainerStyle={{ gap: 16, flexGrow: 1 }}>
        {
          data && data.map((c) => (
            <Cajoncito key={c.id} cajon={c} />
          ))
        }
      </ScrollRefreshingView> */}
      {
        data &&
        <View style={{ flex: 1, width: "100%" , justifyContent:"center", alignItems: "center"}}>
          <FlatList
            data={data}
            numColumns={5}
            keyExtractor={item => item.id.toString()}
            ListHeaderComponent={() => {
              <View style={{ flex: 1 }}>
                <Text >Entrada</Text>
              </View>
            }}
            contentContainerStyle={{ flexGrow: 1 }}
            renderItem={({ item, index }) => {
              const columnIndex = index % 5;
              const isMiddle = columnIndex === 2;
              return (
                <View>
                  {isMiddle ? (
                    <View style={{
                      flexGrow: 1,
                      borderRadius: 6,
                      backgroundColor: 'yellow',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                      <Text>Medio</Text>
                    </View>
                  ) : (
                    <View style={{ width: fullWidth * .2, marginVertical: 1 }}>
                      <Cajoncito cajon={item} />
                    </View>
                  )}
                </View>
              );
            }}
            columnWrapperStyle={{ gap: 4 }}
          />
        </View>
      }
      <Button theme={{
        colors: {
          primary: paper.colors.tertiary,
        }
      }} mode="contained" style={[BoxStyles.ButtonRadius]} labelStyle={BoxStyles.buttonText}
        onPress={() => navigation.navigate("entradaQR", { folio: 2000 })}>Marcar entrada</Button>
    </View>
  );
}
