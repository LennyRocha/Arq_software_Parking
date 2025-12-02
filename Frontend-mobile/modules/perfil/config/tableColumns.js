import { IconButton } from "react-native-paper";

export const orderOptions = [
    { value: "fecha", label: "Fecha" },
    { value: "tipoVehiculo", label: "Tipo de vehículo" }
];

export const entradasSalidasPensionadoColumns = ({ onView }) => [
    {
        field: "folioTicket",
        label: "Folio",
        width: 80,
        render: (row) => row.folioTicket || "-",
    },
    {
        field: "tipoVehiculo",
        label: "Tipo de vehículo",
        width: 120,
        render: (row) => row.tipoVehiculo?.nombre || row.tipoVehiculo || "-",
    },
    {
        field: "fecha",
        label: "Fecha",
        width: 120,
        render: (row) => {
            if (row.fecha) {
                const date = new Date(row.fecha + "T00:00:00");
                return date.toLocaleDateString("es-MX", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                });
            }
            return "-";
        },
    },
    {
        field: "horaEntradaSalida",
        label: "Hora entrada - Hora salida",
        width: 165,
        render: (row) => {
            const formatearHora = (horaString) => {
                if (!horaString) return null;

                const [horas, minutos] = horaString.split(":");
                let h = parseInt(horas, 10);

                const periodo = h >= 12 ? "pm" : "am";

                if (h > 12) h -= 12;
                if (h === 0) h = 12;

                return `${h}:${minutos} ${periodo}`;
            };

            const entrada = formatearHora(row.horaEntrada);
            const salida = formatearHora(row.horaSalida);

            if (entrada && salida) return `${entrada} - ${salida}`;
            if (entrada) return entrada;

            return "-";
        },
    },
    {
        field: "opciones",
        label: "Opciones",
        width: 75,
        render: (row) => ({
            type: "icon", // Indicador para la tabla RN
            element: (
                <IconButton
                    icon="eye"
                    size={22}
                    onPress={() => onView(row)}
                />
            ),
        }),
    },
];
