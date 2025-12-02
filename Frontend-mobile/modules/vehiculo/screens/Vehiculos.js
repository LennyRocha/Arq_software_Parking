import { View, StyleSheet, Keyboard, RefreshControl } from 'react-native'
import React from 'react'
import { Button, TextInput, useTheme, FAB, Text, TouchableRipple, Icon, Dialog, Portal, Checkbox, RadioButton, RadioGroup, List } from 'react-native-paper'
import VehiculoCard from '../components/VehiculoCard';
import { FlatList } from 'react-native-gesture-handler';
import EmptyListView from '../../errores/screens/EmptyListView';
import useVehiculos from '../hooks/useVehículos';
import LoadingView from '../../../components/LoadingView'
import ErrorAxios from '../../errores/screens/ErroresScreens';
import useTiposVehiculos from '../hooks/useTiposVehiculos';
import { useFocusEffect } from '@react-navigation/native';
import useUserIdByEmail from '../../acceso/hooks/getIdByEmail';
import useVehiculosEstacionados from '../hooks/useVehiculosEstacionados';

export default function Vehiculos({ navigation }) {
  const paper = useTheme();
  const [isFocused, setIsFocused] = React.useState(false);
  const { id, loading, error } = useUserIdByEmail();

  const { getVehiculos, data, isLoading, errorData, restoreValues, restartCall, query, setQuery, idCar, setIdCar, active, setActive, conPlacas, setConPlacas } = useVehiculos(id);
  const { data: list, error: errorTipos, load } = useTiposVehiculos();
  const {  activeData, isLoading: loadingUsed} = useVehiculosEstacionados();

  //Control del dialog de filtros
  const [visible, setVisible] = React.useState(false);
  const showDialog = () => {
    setVisible(true);
    Keyboard.isVisible && Keyboard.dismiss();
  };
  const hideDialog = () => {
    setVisible(false);
    Keyboard.isVisible && Keyboard.dismiss();
  };

  const [refreshing, setRefreshing] = React.useState(false);


  useFocusEffect(
    React.useCallback(() => {
      getVehiculos();

      return () => {
        // opcional: cleanup cuando la pantalla pierde foco
      };
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await getVehiculos();
    setRefreshing(false);
  };

  if (errorData?.tipo === "Error de Axios") return <ErrorAxios error={errorData.detalles} callback={restartCall} />

  if (!data || isLoading || load || loading || loadingUsed) return <LoadingView />;

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data.data}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={() => (
          <EmptyListView message={data.message} icon={"car-off"} />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <VehiculoCard navigation={navigation} vehiculo={item} list={list} current={activeData.data.vehiculo} date={activeData.data.fechaEntrada} />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        columnWrapperStyle={{ gap: 8 }}
        contentContainerStyle={{ padding: 24, gap: 8, flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[paper.colors.primary]}
          />
        }
        ListHeaderComponent={
          <>
            <Text variant='titleLarge' style={{ fontWeight: "bold", color: paper.colors.primary }} >
              Mis vehículos
            </Text>

            <View style={{ flexDirection: "row", width: "100%", alignItems: "center", gap: 4 }}>
              <TextInput
                label={"Modelo o descripción"}
                mode='outlined'
                style={{ flex: 1, height: 50 }}
                value={query}
                onChangeText={(text) => setQuery(text)}
                contentStyle={{ padding: 0, marginVertical: 0, alignSelf: "flex-start" }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                left={
                  <TextInput.Icon
                    icon="car-search"
                    color={isFocused ? paper.colors.primary : paper.colors.onSurfaceVariant}
                    onPress={async () => {
                      await getVehiculos();
                      setQuery("");
                      setIsFocused(false);
                    }
                    }
                  />
                }
              />
              <TouchableRipple
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: 5,
                  borderWidth: 2,
                  marginTop: 6,
                  borderColor: paper.colors.primary,
                  justifyContent: "center",
                  alignItems: "center",
                  margin: 0,
                  padding: 0,
                  backgroundColor: "transparent"
                }}
                rippleColor={paper.colors.primary}
                onPress={showDialog}
              >
                <Icon source="filter-variant" size={24} color={paper.colors.primary} />
              </TouchableRipple>
            </View>
          </>
        }
      />
      <FAB
        icon="plus"
        color='white'
        style={[styles.fab, { backgroundColor: paper.colors.tertiary }]}
        onPress={() => navigation.navigate("newCar")}
      />
      <DialogFilter
        visible={visible}
        hideDialog={hideDialog}
        active={active}
        setActive={setActive}
        conPlacas={conPlacas}
        setConPlacas={setConPlacas}
        idCar={idCar}
        setIdCar={setIdCar}
        restoreValues={restoreValues}
        onApply={getVehiculos} />
    </View>
  )
}

const DialogFilter = ({ visible, hideDialog, restoreValues, active, setActive, setConPlacas, conPlacas, idCar, setIdCar, onApply }) => {
  async function sendFilter() {
    await onApply();
    hideDialog();
  }

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Title>Filtros</Dialog.Title>
        <Dialog.Content style={{ gap: 12 }}>
          <Text variant='labelLarge'>Tipo de vehículo</Text>
          <RadioButton.Group onValueChange={setIdCar} value={idCar}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadioButton value={0} />
              <Text>Todos</Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadioButton value={1} />
              <Text>Coche</Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadioButton value={2} />
              <Text>Camioneta</Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadioButton value={3} />
              <Text>Moto</Text>
            </View>
          </RadioButton.Group>
          <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
            <Text variant='labelLarge'>Vehículos activos</Text>
            <Checkbox
              status={active ? "checked" : "unchecked"}
              onPress={() => setActive(!active)}
            />
          </View>
          <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
            <Text variant='labelLarge'>Vehículos con placa</Text>
            <Checkbox
              status={conPlacas ? "checked" : "unchecked"}
              onPress={() => setConPlacas(!conPlacas)}
            />
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog} style={{ borderRadius: 5 }}>Cerrar</Button>
          <Button onPress={async () => {
            restoreValues();
            await onApply();
            hideDialog();
          }} style={{ borderRadius: 5 }}>Limpiar filtros</Button>
          <Button onPress={async () => sendFilter()} style={{ borderRadius: 5 }} >Aplicar</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
})