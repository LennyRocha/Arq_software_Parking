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

export default function Vehiculos({ navigation }) {
  const paper = useTheme();
  const [isFocused, setIsFocused] = React.useState(false);

  const { getVehiculos, data, isLoading, errorData, restoreValues, restartCall, query, setQuery, idCar, setIdCar, active, setActive, conPlacas, setConPlacas } = useVehiculos(1);
  const { data: list, error: errorTipos, load } = useTiposVehiculos();

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

  const onRefresh = async () => {
    setRefreshing(true);
    await getVehiculos();   // tu función para recargar datos
    setRefreshing(false);
  };

  if (errorData?.tipo === "Error de Axios") return <ErrorAxios error={errorData.detalles} callback={restartCall} />

  if (!data || isLoading || load) return <LoadingView />;

  return (
    <View style={{ flex: 1, padding: 24, gap: 8 }}>
      <Text variant='titleLarge' style={{ fontWeight: "bold", color: paper.colors.primary }} >Mis vehículos</Text>
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
              onPress={() => {
                getVehiculos();
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
      <FlatList
        data={data.data}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={() => (
          <EmptyListView message={data.message} icon={"car-off"} />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <VehiculoCard navigation={navigation} vehiculo={item} list={list} />
        )}
        ItemSeparatorComponent={() => (
          <View style={{ height: 8 }} />
        )}
        columnWrapperStyle={{ gap: 8 }}
        contentContainerStyle={{ flexGrow: 1, padding: 2 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[paper.colors.primary]}
          />
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

const DialogFilter = ({ visible, hideDialog, restoreValues }) => {
  const [checkedActive, setCheckedActive] = React.useState(false);
  const [checkedPlaca, setCheckedPlaca] = React.useState(false);
  const [value, setValue] = React.useState("todos");

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Title>Filtros</Dialog.Title>
        <Dialog.Content style={{ gap: 12 }}>
          <Text variant='labelLarge'>Tipo de vehículo</Text>
          <RadioButton.Group onValueChange={setValue} value={value}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadioButton value="todos" />
              <Text>Todos</Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadioButton value="coche" />
              <Text>Coche</Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadioButton value="camioneta" />
              <Text>Camioneta</Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadioButton value="moto" />
              <Text>Moto</Text>
            </View>
          </RadioButton.Group>
          <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
            <Text variant='labelLarge'>Vehículos activos</Text>
            <Checkbox
              status={checkedActive ? "checked" : "unchecked"}
              onPress={() => setCheckedActive(!checkedActive)}
            />
          </View>
          <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
            <Text variant='labelLarge'>Vehículos con placa</Text>
            <Checkbox
              status={checkedPlaca ? "checked" : "unchecked"}
              onPress={() => setCheckedPlaca(!checkedPlaca)}
            />
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog} style={{ borderRadius: 5 }}>Cerrar</Button>
          <Button onPress={() => {
            restoreValues();
            hideDialog();
          }} style={{ borderRadius: 5 }}>Limpiar filtros</Button>
          <Button onPress={hideDialog} style={{ borderRadius: 5 }}>Aplicar</Button>
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