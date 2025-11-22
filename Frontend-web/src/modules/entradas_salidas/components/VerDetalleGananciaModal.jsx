import React from "react";
import { Box, Typography } from "@mui/material";
import CustomDialog from "../../../components/CustomDialog";

// Función para formatear fecha (DD/MM/YYYY)
const formatearFecha = (fechaString) => {
    if (!fechaString) return "-";
    
    const fecha = new Date(fechaString);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    
    return `${dia}/${mes}/${anio}`;
};

// Función para formatear hora (HH:MM am/pm)
const formatearHora = (horaString) => {
    if (!horaString) return "-";
    
    const hora24 = parseInt(horaString.split(':')[0]);
    const minutos = horaString.split(':')[1] || '00';
    const periodo = hora24 >= 12 ? 'pm' : 'am';
    let hora12 = hora24 > 12 ? hora24 - 12 : hora24;
    if (hora12 === 0) hora12 = 12;
    
    return `${String(hora12).padStart(2, '0')}:${minutos} ${periodo}`;
};

const VerDetalleGananciaModal = ({ open, onClose, reporte }) => {
    if (!reporte) return null;

    const handleClose = () => {
        onClose();
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
                            {formatearFecha(reporte?.fechaInicial)}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="body1" component="span" sx={{ fontWeight: "bold" }}>
                            Hora:{" "}
                        </Typography>
                        <Typography variant="body1" component="span">
                            {formatearHora(reporte?.hora)}
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

export default VerDetalleGananciaModal;
