import { Image, View, Dimensions } from 'react-native'
import React from 'react'
import { Card, Text, Button, useTheme } from 'react-native-paper'
import BoxStyles from '../../../utils/genericScreenStyles';

const { width, height } = Dimensions.get("screen");

export default function VehiculoCard({ navigation, vehiculo, list, current, date }) {
    const paper = useTheme();
    const vehiculos = {
        moto: require('../../../img/moto_view_small.png'),
        coche: require('../../../img/coche_view_small.png'),
        camioneta: require('../../../img/camioneta_view_small.png'),
    }
    return (
        <Card style={{ maxWidth: "50%", flex: 1, backgroundColor: paper.colors.background, borderRadius: 5 }}>
            <Card.Content style={{ gap: 8, marginBottom: 8 }}>
                <Image
                    source={vehiculos[list[vehiculo.idTipoVehiculo - 1].nombre.toLowerCase()]}
                    style={{
                        width: "100%",
                        aspectRatio: 16 / 9,
                        height: undefined
                    }}
                    resizeMode="stretch"
                />
                <Text variant="titleMedium" style={{ fontWeight: "bold" }}>{vehiculo.modelo}</Text>
                <Text variant='bodySmall'  style={{ color: vehiculo.placa ? paper.colors.secondary : paper.colors.error }} >{vehiculo.placa ? vehiculo.placa : "Sin placa"}</Text>
                <Text variant='labelSmall' style={{ color: paper.colors.gray }}>{vehiculo.estatus ? "Activo" : "Inactivo"} {current && current.id === vehiculo.id && "| En uso" }</Text>
            </Card.Content>
            <Card.Actions style={{ padding: 0 }}>
                <Button mode='contained-tonal' buttonColor={paper.colors.cardDark} style={[BoxStyles.ButtonBottomRadius, { width: "100%" }]} labelStyle={[BoxStyles.buttonTextAuto, { color: paper.colors.tertiary }]} onPress={() => navigation.navigate("detallesCar", { vehic: vehiculo, tipo: list[vehiculo.idTipoVehiculo - 1], current: current })} >Ver más</Button>
            </Card.Actions>
        </Card>
    )
}