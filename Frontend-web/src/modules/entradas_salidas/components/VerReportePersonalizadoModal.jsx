import React from "react";
import { Box, Typography } from "@mui/material";
import CustomDialog from "../../../components/CustomDialog";

// Función para formatear fecha (DD/MM/YYYY)
const formatearFecha = (fechaString) => {
    if (!fechaString) return "-";
    
    const fecha = new Date(fechaString + 'T00:00:00');
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    
    return `${dia}/${mes}/${anio}`;
};

const VerReportePersonalizadoModal = ({ open, onClose, reporte }) => {
    if (!reporte) return null;

    const handleClose = () => {
        onClose();
    };

    // Determinar el formato de fecha a mostrar
    const formatearRangoFecha = () => {
        if (reporte.fechaInicial && reporte.fechaFinal) {
            // Si son la misma fecha, mostrar solo una
            if (reporte.fechaInicial === reporte.fechaFinal) {
                return formatearFecha(reporte.fechaInicial);
            }
            // Si son diferentes, mostrar el rango
            return `${formatearFecha(reporte.fechaInicial)} - ${formatearFecha(reporte.fechaFinal)}`;
        } else if (reporte.fechaInicial) {
            return formatearFecha(reporte.fechaInicial);
        } else if (reporte.fechaFinal) {
            return formatearFecha(reporte.fechaFinal);
        }
        return "-";
    };

    return (
        <CustomDialog
            isOpen={open}
            handleClose={handleClose}
            titulo="Ganancias"
            maxWidth="sm"
            isForm={false}
            showActions={false}
        >
            <Box sx={{ py: 2 }}>
                <Typography variant="body1" sx={{ mb: 2, textAlign: "center" }}>
                    Información de ganancias generadas:
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 3 }}>
                    <Box>
                        <Typography variant="body1" component="span" sx={{ fontWeight: "bold" }}>
                            Fecha:{" "}
                        </Typography>
                        <Typography variant="body1" component="span">
                            {formatearRangoFecha()}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="body1" component="span" sx={{ fontWeight: "bold" }}>
                            Ganancias generadas por pensiones:{" "}
                        </Typography>
                        <Typography variant="body1" component="span">
                            ${(reporte?.gananciasPensionados || 0).toFixed(2)}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="body1" component="span" sx={{ fontWeight: "bold" }}>
                            Ganancias generadas por visitantes:{" "}
                        </Typography>
                        <Typography variant="body1" component="span">
                            ${(reporte?.gananciasVisitantes || 0).toFixed(2)}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="body1" component="span" sx={{ fontWeight: "bold" }}>
                            Total de ganancias:{" "}
                        </Typography>
                        <Typography variant="body1" component="span">
                            ${(reporte?.gananciasTotales || 0).toFixed(2)}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </CustomDialog>
    );
};

export default VerReportePersonalizadoModal;
