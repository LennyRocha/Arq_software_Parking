import { View } from 'react-native'
import React from 'react'
import { useTheme, Text, Button, Card, List } from 'react-native-paper'
import BoxStyles from '../../../utils/genericScreenStyles';
import { LinearGradient } from 'expo-linear-gradient';

export default function PensionCard({ isActive = false, pension, onPress, myPension = null }) {
    const paper = useTheme();
    const obtenerPeriodo = (dias) => {
        switch (dias) {
            case 7:
                return "semanal";
            case 15:
                return "quincenal";
            case 30:
                return "mensual";
            case 60:
                return "bimestral";
            case 90:
                return "trimestral";
            case 365:
                return "anual";
            default:
                return `${dias} dias`;
        }
    }
    return (
        <Card style={{ backgroundColor: paper.colors.surface, borderRadius: 5 }}>
            <Card.Content style={{ gap: 8 }}>
                {isActive ? <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Text
                        style={{
                            borderColor: paper.colors.tertiary,
                            borderWidth: 2,
                            fontFamily: "Exo2_700Bold",
                            borderRadius: 2,
                            paddingHorizontal: 4,
                            color: paper.colors.tertiary,
                            alignSelf: "flex-start",
                        }}
                        variant="titleMedium"
                    >
                        {pension.nombre}
                    </Text>
                    <Text variant='labelSmall' style={{ backgroundColor: paper.colors.cardSurface, padding: 4, color: paper.colors.onCardSurface }}>Exp: {myPension ? myPension.fechaFinalizacion : "" }</Text>
                </View> : <Text
                    style={{
                        borderColor: paper.colors.tertiary,
                        borderWidth: 2,
                        fontFamily: "Exo2_700Bold",
                        borderRadius: 2,
                        paddingHorizontal: 4,
                        color: paper.colors.tertiary,
                        alignSelf: "flex-start",
                    }}
                    variant="titleMedium"
                >
                    {pension.nombre}
                </Text>}
                <Text variant="headlineSmall" style={{ color: paper.colors.primary, fontWeight: "bold" }}>${pension.costo}/{obtenerPeriodo(pension.duracionDias)}</Text>
                <Text variant="labelSmall" style={{ color: paper.colors.secondary, fontWeight: "400" }}>Se renueva automáticamente por ${pension.costo}/{obtenerPeriodo(pension.duracionDias)}</Text>
                <List.Item
                    title="Lugar reservado garantizado"
                    left={props => (
                        <List.Icon
                            {...props}
                            icon="check"
                            color={paper.colors.tertiary}
                            style={{ margin: 0, padding: 0 }}
                        />
                    )}
                    style={{
                        paddingHorizontal: 0,
                        paddingVertical: 4,
                    }}
                    contentStyle={{ paddingLeft: 8 }}
                    titleStyle={{ margin: 0, padding: 0 }}
                />
                <List.Item
                    title="Sin costos extra"
                    left={props => (
                        <List.Icon
                            {...props}
                            icon="check"
                            color={paper.colors.tertiary}
                            style={{ margin: 0, padding: 0 }}
                        />
                    )}
                    style={{
                        paddingHorizontal: 0,
                        paddingVertical: 4,
                    }}
                    contentStyle={{ paddingLeft: 8 }}
                    titleStyle={{ margin: 0, padding: 0 }}
                />
                <List.Item
                    title="Acceso ilimitado"
                    left={props => (
                        <List.Icon
                            {...props}
                            icon="check"
                            color={paper.colors.tertiary}
                            style={{ margin: 0, padding: 0 }}
                        />
                    )}
                    style={{
                        paddingHorizontal: 0,
                        paddingVertical: 4,
                    }}
                    contentStyle={{ paddingLeft: 8 }}
                    titleStyle={{ margin: 0, padding: 0 }}
                />
                <List.Item
                    title="Sin límite de vehículos"
                    left={props => (
                        <List.Icon
                            {...props}
                            icon="check"
                            color={paper.colors.tertiary}
                            style={{ margin: 0, padding: 0 }}
                        />
                    )}
                    style={{
                        paddingHorizontal: 0,
                        paddingVertical: 4,
                    }}
                    contentStyle={{ paddingLeft: 8 }}
                    titleStyle={{ margin: 0, padding: 0 }}
                />
            </Card.Content>
            <Card.Actions>
                <LinearGradient style={{ width: "100%", borderRadius: 5 }} colors={[paper.colors.secondary, paper.colors.primary]} start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}>
                    <Button mode='outlined' style={[BoxStyles.ButtonRadius, { width: "100%", backgroundColor: "transparent", borderColor: "transparent" }]} labelStyle={[BoxStyles.buttonTextAuto, { color: "white" }]} onPress={onPress}>{isActive ? "Administrar" : "Unirme"}</Button>
                </LinearGradient>
            </Card.Actions>
        </Card>
    )
}