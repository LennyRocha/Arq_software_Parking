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
import { useGlobalContext } from '../../../context/GlobalContext';

export default function Vehiculos({ navigation }) {
  const paper = useTheme();
  const { idUsuario: id } = useGlobalContext();

  const {
    data,
    isLoading,
    errorData,
    query, setQuery,
    idCar, setIdCar,
    active, setActive,
    conPlacas, setConPlacas,
    applyFilters,
    restoreValues,
    refetch
  } = useVehiculos(id);

  const { data: list, load, error: errorTipos } = useTiposVehiculos();
  const { activeData, isLoading: loadingUsed } = useVehiculosEstacionados();

  const [visible, setVisible] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (errorData?.tipo === "Error de Axios") {
    return <ErrorAxios error={errorData.detalles} callback={refetch} />;
  }

  if (!data || isLoading || load || loadingUsed) {
    return <LoadingView />;
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data.data}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={<EmptyListView message={data.message} icon="car-off" />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <VehiculoCard
            navigation={navigation}
            vehiculo={item}
            list={list}
            current={activeData?.data?.vehiculo}
            date={activeData?.data?.fechaEntrada}
          />
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
            <Text variant="titleLarge" style={{ fontWeight: "bold", color: paper.colors.primary }}>
              Mis vehículos
            </Text>

            <View style={{ flexDirection: "row", width: "100%", alignItems: "center", gap: 4 }}>
              <TextInput
                label="Modelo o descripción"
                mode="outlined"
                style={{ flex: 1, height: 50 }}
                value={query}
                onChangeText={setQuery}
                contentStyle={{ padding: 0 }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                left={
                  <TextInput.Icon
                    icon="car-search"
                    color={isFocused ? paper.colors.primary : paper.colors.onSurfaceVariant}
                    onPress={() => {
                      setQuery("");
                      setIsFocused(false);
                    }}
                  />
                }
              />

              <TouchableRipple
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: 5,
                  borderWidth: 2,
                  borderColor: paper.colors.primary,
                  justifyContent: "center",
                  alignItems: "center"
                }}
                rippleColor={paper.colors.primary}
                onPress={() => setVisible(true)}
              >
                <Icon source="filter-variant" size={24} color={paper.colors.primary} />
              </TouchableRipple>
            </View>
          </>
        }
      />

      <FAB
        icon="plus"
        color="white"
        style={[styles.fab, { backgroundColor: paper.colors.tertiary }]}
        onPress={() => navigation.navigate("newCar")}
      />

      <DialogFilter
        visible={visible}
        hideDialog={() => setVisible(false)}
        idCar={idCar}
        active={active}
        conPlacas={conPlacas}
        setIdCar={setIdCar}
        setActive={setActive}
        setConPlacas={setConPlacas}
        applyFilters={applyFilters}
        restoreValues={restoreValues}
      />
    </View>
  );
}

const DialogFilter = ({
  visible,
  hideDialog,
  idCar, setIdCar,
  active, setActive,
  conPlacas, setConPlacas,
  applyFilters,
  restoreValues
}) => {

  const aplicar = () => {
    applyFilters(idCar, active, conPlacas);
    hideDialog();
  };

  const limpiar = () => {
    restoreValues();
    hideDialog();
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Title>Filtros</Dialog.Title>

        <Dialog.Content style={{ gap: 12 }}>
          <Text variant="labelLarge">Tipo de vehículo</Text>

          <RadioButton.Group onValueChange={setIdCar} value={idCar}>
            <List.Item style={{ paddingVertical: 0, marginVertical: 0 }} contentStyle={{ paddingVertical: 0, marginVertical: 0 }} title="Todos" left={() => <RadioButton value={0} />} />
            <List.Item style={{ paddingVertical: 0, marginVertical: 0 }} contentStyle={{ paddingVertical: 0, marginVertical: 0 }} title="Coche" left={() => <RadioButton value={1} />} />
            <List.Item style={{ paddingVertical: 0, marginVertical: 0 }} contentStyle={{ paddingVertical: 0, marginVertical: 0 }} title="Camioneta" left={() => <RadioButton value={2} />} />
            <List.Item style={{ paddingVertical: 0, marginVertical: 0 }} contentStyle={{ paddingVertical: 0, marginVertical: 0 }} title="Moto" left={() => <RadioButton value={3} />} />
          </RadioButton.Group>

          <List.Item
            title="Vehículos activos"
            style={{ paddingVertical: 0, marginVertical: 0 }}
            contentStyle={{ paddingVertical: 0, marginVertical: 0 }}
            right={() => (
              <Checkbox
                status={active ? "checked" : "unchecked"}
                onPress={() => setActive(!active)}
              />
            )}
          />

          <List.Item
            title="Vehículos con placa"
            style={{ paddingVertical: 0, marginVertical: 0 }}
            contentStyle={{ paddingVertical: 0, marginVertical: 0 }}
            right={() => (
              <Checkbox
                status={conPlacas ? "checked" : "unchecked"}
                onPress={() => setConPlacas(!conPlacas)}
              />
            )}
          />
        </Dialog.Content>

        <Dialog.Actions>
          <Button onPress={hideDialog}>Cerrar</Button>
          <Button onPress={limpiar}>Limpiar</Button>
          <Button onPress={aplicar}>Aplicar</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
})