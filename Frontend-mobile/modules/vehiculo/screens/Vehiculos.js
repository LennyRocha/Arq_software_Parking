import { View, StyleSheet } from 'react-native'
import React from 'react'
import { Button, TextInput, useTheme, FAB, Text, TouchableRipple, Icon, Dialog, Portal, Checkbox, RadioButton, RadioGroup, List } from 'react-native-paper'
import VehiculoCard from '../components/VehiculoCard';

export default function Vehiculos({ navigation }) {
  const paper = useTheme();
  const [isFocused, setIsFocused] = React.useState(false);

  //Control del dialog de filtros
  const [visible, setVisible] = React.useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  return (
    <View style={{ flex: 1, padding: 24, gap: 8 }}>
      <Text variant='titleLarge' style={{ fontWeight: "bold", color: paper.colors.primary }} >Mis vehículos</Text>
      <View style={{ flexDirection: "row", width: "100%", alignItems: "center", gap: 4 }}>
        <TextInput
          label={"Buscar por modelo o descripción"}
          mode='outlined'
          style={{ flex: 1, height: 50 }}
          contentStyle={{ padding: 0, marginVertical: 0, alignSelf: "flex-start" }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          left={
            <TextInput.Icon
              icon="car-search"
              color={isFocused ? paper.colors.primary : paper.colors.onSurfaceVariant}
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
      <FAB
        icon="plus"
        color='white'
        style={[styles.fab, { backgroundColor: paper.colors.tertiary }]}
        onPress={() => navigation.navigate("newCar")}
      />
      <View style={{ flexDirection: "row", gap: 8 }}>
        <VehiculoCard navigation={navigation} />
        <VehiculoCard navigation={navigation} />
      </View>
      <DialogFilter visible={visible} hideDialog={hideDialog} />
    </View>
  )
}

const DialogFilter = ({ visible, hideDialog }) => {
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