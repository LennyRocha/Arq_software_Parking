import React from "react";
import { Grid, Box } from "@mui/material";
import CustomDialog from "../../../components/CustomDialog";
import CustomInputLabel from "../../../components/inputs/CustomInputLabel";
import CustomTextArea from "../../../components/inputs/CustomTextArea";

// Función para formatear hora en formato legible (HH:MM am/pm)
const formatearHora = (horaString) => {
    if (!horaString) return "-";

    const [horas, minutos] = horaString.split(':');
    let hora = parseInt(horas);
    const min = minutos;
    const periodo = hora >= 12 ? 'pm' : 'am';

    if (hora > 12) hora -= 12;
    if (hora === 0) hora = 12;

    return `${hora}:${min} ${periodo}`;
};

// Función para formatear fecha (DD/MM/YYYY)
const formatearFecha = (fechaString) => {
    if (!fechaString) return "-";
    
    const fecha = new Date(fechaString + 'T00:00:00');
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    
    return `${dia}/${mes}/${anio}`;
};

const VerDetalleEntradaSalidaModal = ({ open, onClose, entrada }) => {
    if (!entrada) return null;

    const handleClose = () => {
        onClose();
    };

    return (
        <CustomDialog
            isOpen={open}
            handleClose={handleClose}
            titulo="Detalle de entrada/salida"
            maxWidth="sm"
            isForm={false}
            textCancel="Cerrar"
        >
            {/* Folio de reconocimiento */}
            <Box sx={{ mb: 2 }}>
                <CustomInputLabel
                    labelText="Folio de reconocimiento"
                    name="folioTicket"
                    value={entrada?.folioTicket || "-"}
                    isDisabled={true}
                />
            </Box>

            {/* Tipo de vehículo */}
            <Box sx={{ mb: 2 }}>
                <CustomInputLabel
                    labelText="Tipo de vehículo"
                    name="tipoVehiculo"
                    value={entrada?.tipoVehiculo?.nombre || "-"}
                    isDisabled={true}
                />
            </Box>

            {/* Usuario */}
            <Box sx={{ mb: 2 }}>
                <CustomInputLabel
                    labelText="Usuario"
                    name="usuario"
                    value={entrada?.usuario || "Visitante"}
                    isDisabled={true}
                />
            </Box>

            {/* Modelo y Placa en la misma fila */}
            <Grid container spacing={2} sx={{ mb: 0 }}>
                <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                        <CustomInputLabel
                            labelText="Modelo"
                            name="modelo"
                            value={entrada?.vehiculo?.modelo || "-"}
                            isDisabled={true}
                        />
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                        <CustomInputLabel
                            labelText="Placa"
                            name="placa"
                            value={entrada?.vehiculo?.placa || "-"}
                            isDisabled={true}
                        />
                    </Box>
                </Grid>
            </Grid>

            {/* Fecha */}
            <Box sx={{ mb: 2 }}>
                <CustomInputLabel
                    labelText="Fecha"
                    name="fecha"
                    value={formatearFecha(entrada?.fecha)}
                    isDisabled={true}
                />
            </Box>

            {/* Hora de entrada y salida en la misma fila */}
            <Grid container spacing={2} sx={{ mb: 0 }}>
                <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                        <CustomInputLabel
                            labelText="Hora de entrada"
                            name="horaEntrada"
                            value={formatearHora(entrada?.horaEntrada)}
                            isDisabled={true}
                        />
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                        <CustomInputLabel
                            labelText="Hora de salida"
                            name="horaSalida"
                            value={formatearHora(entrada?.horaSalida)}
                            isDisabled={true}
                        />
                    </Box>
                </Grid>
            </Grid>

            {/* Cantidad de pago - Solo si hay horaSalida */}
            {entrada?.horaSalida && (
                <Box sx={{ mb: 2 }}>
                    <CustomInputLabel
                        labelText="Total pagado"
                        name="cantidadPago"
                        value={entrada?.cantidadPago ? `$${entrada.cantidadPago.toFixed(2)}` : "$0.00"}
                        isDisabled={true}
                    />
                </Box>
            )}

            {/* Descripción */}
            <CustomTextArea
                labelText="Descripción"
                name="descripcion"
                value={entrada?.vehiculo?.descripcion || "-"}
                isDisabled={true}
                rows={3}
            />
        </CustomDialog>
    );
};

export default VerDetalleEntradaSalidaModal;
