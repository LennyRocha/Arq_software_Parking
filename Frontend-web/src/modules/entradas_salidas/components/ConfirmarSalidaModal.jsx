import React from "react";
import { Box, Button, Typography } from "@mui/material";
import CustomDialog from "../../../components/CustomDialog";

const ConfirmarSalidaModal = ({ open, onClose, datosSalida, onConfirmar }) => {
    if (!datosSalida) return null;

    const handleConfirmar = () => {
        onClose();
        onConfirmar(datosSalida.folioTicket);
    };

    const handleCancel = () => {
        onClose();
    };

    const formatearHora = (horaString) => {
        if (!horaString) return null;

        const [horas, minutos] = horaString.split(':');
        let hora = parseInt(horas);
        const min = minutos;
        const periodo = hora >= 12 ? 'pm' : 'am';

        if (hora > 12) hora -= 12;
        if (hora === 0) hora = 12;

        return `${hora}:${min} ${periodo}`;
    };

    const crearHorario = (row) => {

        const horaEntrada = formatearHora(row.horaEntrada);
        const horaSalida = formatearHora(row.horaSalida);

        if (horaEntrada && horaSalida) {
            return `${horaEntrada} - ${horaSalida}`;
        } else if (horaEntrada) {
            return horaEntrada;
        }
        return "-";
    }

    const calcularTiempoUso = (horaEntrada, horaSalida) => {
        if (!horaEntrada || !horaSalida) return "-";

        // Crear fechas con las horas
        const [horasE, minutosE, segundosE] = horaEntrada.split(':');
        const [horasS, minutosS, segundosS] = horaSalida.split(':');

        const entrada = new Date();
        entrada.setHours(parseInt(horasE), parseInt(minutosE), parseInt(segundosE?.split('.')[0] || 0));

        const salida = new Date();
        salida.setHours(parseInt(horasS), parseInt(minutosS), parseInt(segundosS?.split('.')[0] || 0));

        // Calcular diferencia en milisegundos
        let diferencia = salida - entrada;

        // Si la salida es menor que la entrada, significa que pasó a otro día
        if (diferencia < 0) {
            diferencia += 24 * 60 * 60 * 1000; // Agregar 24 horas
        }

        // Convertir a horas y minutos
        const horas = Math.floor(diferencia / (1000 * 60 * 60));
        const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));

        if (horas > 0 && minutos > 0) {
            return `${horas} hrs, ${minutos} min`;
        } else if (horas > 0) {
            return `${horas} hrs`;
        } else if (minutos > 0) {
            return `${minutos} min`;
        }
        return "0 min";
    }

    return (
        <CustomDialog
            isOpen={open}
            handleClose={handleCancel}
            titulo="Confirmar"
            maxWidth="sm"
            isForm={true}
            onSubmit={(e) => {
                e.preventDefault();
                handleConfirmar();
            }}
            textSubmit="Confirmar"
            textCancel="Cancelar"
        >
            <Box sx={{ py: 2 }}>
                <Typography variant="body1" sx={{ mb: 2, textAlign: "center" }}>
                    Antes de confirmar la salida, revisa que los siguientes datos sean correctos:
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 3 }}>
                    <Box>
                        <Typography variant="body1" component="span" sx={{ fontWeight: "bold" }}>
                            Número de folio:{" "}
                        </Typography>
                        <Typography variant="body1" component="span">
                            {datosSalida.folioTicket}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="body1" component="span" sx={{ fontWeight: "bold" }}>
                            Horario de entrada/salida:{" "}
                        </Typography>
                        <Typography variant="body1" component="span">
                            {crearHorario(datosSalida)}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="body1" component="span" sx={{ fontWeight: "bold" }}>
                            Tiempo de uso:{" "}
                        </Typography>
                        <Typography variant="body1" component="span">
                            {calcularTiempoUso(datosSalida.horaEntrada, datosSalida.horaSalida)}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="body1" component="span" sx={{ fontWeight: "bold" }}>
                            Tipo de vehículo:{" "}
                        </Typography>
                        <Typography variant="body1" component="span">
                            {typeof datosSalida.tipoVehiculo === 'object' ? datosSalida.tipoVehiculo?.nombre : datosSalida.tipoVehiculo}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="body1" component="span" sx={{ fontWeight: "bold" }}>
                            Total a pagar:{" "}
                        </Typography>
                        <Typography variant="body1" component="span">
                            ${datosSalida.cantidadPago}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </CustomDialog>
    );
};

export default ConfirmarSalidaModal;
