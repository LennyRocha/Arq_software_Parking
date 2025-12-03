import { View } from "react-native";
import { TextInput, Text, useTheme } from "react-native-paper";
import BoxStyles from "../../../utils/genericScreenStyles";

function DetalleMarcaje({ entrada }) {
    const theme = useTheme();

    const formatearFecha = (fecha) => {
        if (!fecha) return "-";
        const f = new Date(fecha + "T00:00:00");
        return f.toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const formatearHora = (hora) => {
        if (!hora) return "-";
        const [h, m] = hora.split(":");
        let horas = parseInt(h);
        const periodo = horas >= 12 ? "pm" : "am";

        if (horas > 12) horas -= 12;
        if (horas === 0) horas = 12;

        return `${horas}:${m} ${periodo}`;
    };

    return (
        <View style={{ gap: 16 }}>
            <Text style={[{ color: theme.colors.primary }, BoxStyles.font700]} variant="headlineSmall"  >Detalles del marcaje</Text>

            {/* Folio */}
            <TextInput
                label="Folio de reconocimiento"
                mode="outlined"
                value={String(entrada?.folioTicket ?? "-")}
                editable={false}
            />

            {/* Tipo de vehículo */}
            <TextInput
                label="Tipo de vehículo"
                mode="outlined"
                value={entrada?.tipoVehiculo?.nombre || "-"}
                editable={false}
            />

            {/* Usuario */}
            <TextInput
                label="Usuario"
                mode="outlined"
                value={`${entrada?.usuario.nombre} ${entrada?.usuario.apellidos}` || "Visitante"}
                editable={false}
            />

            {/* Modelo + Placa */}
            <View style={{ flexDirection: "row", gap: 16 }}>
                <View style={{ flex: 1 }}>
                    <TextInput
                        label="Modelo"
                        mode="outlined"
                        value={entrada?.vehiculo?.modelo || "-"}
                        editable={false}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <TextInput
                        label="Placa"
                        mode="outlined"
                        value={entrada?.vehiculo?.placa || "-"}
                        editable={false}
                    />
                </View>
            </View>

            {/* Fecha */}
            <TextInput
                label="Fecha"
                mode="outlined"
                value={formatearFecha(entrada?.fecha)}
                editable={false}
            />

            {/* Hora de entrada y salida */}
            <View style={{ flexDirection: "row", gap: 16 }}>
                <View style={{ flex: 1 }}>
                    <TextInput
                        label="Hora de entrada"
                        mode="outlined"
                        value={formatearHora(entrada?.horaEntrada)}
                        editable={false}
                    />
                </View>

                <View style={{ flex: 1 }}>
                    <TextInput
                        label="Hora de salida"
                        mode="outlined"
                        value={formatearHora(entrada?.horaSalida)}
                        editable={false}
                    />
                </View>
            </View>

            {/* Total pagado */}
            {entrada?.horaSalida && (
                <TextInput
                    label="Total pagado"
                    mode="outlined"
                    value={
                        entrada?.cantidadPago
                            ? `$${entrada.cantidadPago.toFixed(2)}`
                            : "$0.00"
                    }
                    editable={false}
                />
            )}

            {/* Descripción */}
            <TextInput
                label="Descripción"
                mode="outlined"
                value={entrada?.vehiculo?.descripcion || "-"}
                editable={false}
                multiline
                numberOfLines={3}
            />
        </View>
    );
}

export default DetalleMarcaje;