import { Image, View } from 'react-native'
import React from 'react'
import { Card, RadioButton, Text, useTheme } from 'react-native-paper'

export default function VehiculoSheetCard({ vehic, useRadios = false, currentValue, list }) {
    const vehiculos = {
        moto: require('../../../img/moto_view_small.png'),
        coche: require('../../../img/coche_view_small.png'),
        camioneta: require('../../../img/camioneta_view_small.png'),
    }
    const paper = useTheme()
    return (
        <Card style={[{ backgroundColor: paper.colors.surface, borderWidth: 2, borderColor: currentValue === vehic.id ? paper.colors.primary : "transparent" }]} >
            <Card.Content style={{ gap: 8, marginBottom: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Image
                    source={vehiculos[list[vehic.idTipoVehiculo - 1].nombre.toLowerCase()]}
                    style={{
                        width: "25%",
                        aspectRatio: 16 / 9,
                        height: undefined
                    }}
                    resizeMode="stretch"
                />
                <View style={{ flex: 1, gap: 8 }}>
                    <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "flex-start" }}>
                        <Text variant='labelSmall' style={{ fontWeight: "bold" }} lineBreakMode='clip'>{vehic.modelo}</Text>
                        <Text variant='labelSmall' style={{ color: vehic.placa ? paper.colors.secondary : paper.colors.error }}>{vehic.placa ? vehic.placa : "Sin placa"}</Text>
                    </View>
                    <Text variant='bodySmall' numberOfLines={3} lineBreakMode='clip'>{vehic.descripcion}</Text>
                </View>
                {useRadios && <RadioButton value={vehic.id} />}
            </Card.Content>
        </Card>
    )
}