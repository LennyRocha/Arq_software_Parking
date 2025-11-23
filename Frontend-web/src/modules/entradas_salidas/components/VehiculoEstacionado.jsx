import React from "react";
import { Box, Typography, Button } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import cochePng from "../../../img/coche.png";
import motoPng from "../../../img/moto_view.png";
import camionetaPng from "../../../img/camioneta.png";

/**
 * Mapeo de tipos de vehículo a imágenes
 */
const vehiculoImagenes = {
  1: cochePng,
  2: motoPng,
  3: camionetaPng,
};

/**
 * Formatea la fecha a DD/MM/YYYY
 */
const formatearFecha = (fecha) => {
  if (!fecha) return "";
  const date = new Date(fecha);
  const dia = String(date.getDate()).padStart(2, "0");
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const anio = date.getFullYear();
  return `${dia}/${mes}/${anio}`;
};

/**
 * Formatea la hora a HH:MM am/pm
 */
const formatearHora = (hora) => {
  if (!hora) return "";
  
  const [horas, minutos] = hora.split(":");
  const horasNum = parseInt(horas, 10);
  const periodo = horasNum >= 12 ? "PM" : "AM";
  const horas12 = horasNum % 12 || 12;
  
  return `${String(horas12).padStart(2, "0")}:${minutos} ${periodo}`;
};

/**
 * Calcula el tiempo transcurrido desde la hora de entrada
 */
const calcularTiempoEstacionado = (fechaEntrada, horaEntrada) => {
  if (!fechaEntrada || !horaEntrada) return "0 hrs, 0 min";

  try {
    const ahora = new Date();
    const [horas, minutos, segundos] = horaEntrada.split(":");
    const fechaHoraEntrada = new Date(fechaEntrada);
    fechaHoraEntrada.setHours(parseInt(horas), parseInt(minutos), parseInt(segundos || 0));

    const diferenciaMilisegundos = ahora - fechaHoraEntrada;
    const totalMinutos = Math.floor(diferenciaMilisegundos / 1000 / 60);
    
    const hrsTranscurridas = Math.floor(totalMinutos / 60);
    const minTranscurridos = totalMinutos % 60;

    return `${hrsTranscurridas}h transcurridas`;
  } catch (error) {
    return "0 hrs, 0 min";
  }
};

/**
 * Componente para mostrar el vehículo estacionado con opción de marcar salida
 */
export const VehiculoEstacionado = ({ 
  vehiculo, 
  fechaEntrada, 
  horaEntrada, 
  folioTicket,
  onMarcarSalida,
  disabled 
}) => {
  const imagenVehiculo = vehiculoImagenes[vehiculo?.idTipoVehiculo] || cochePng;
  const tiempoEstacionado = calcularTiempoEstacionado(fechaEntrada, horaEntrada);

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        textAlign: "center",
      }}
    >
      {/* Fecha y hora de entrada */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" color="primary" sx={{ mb: 0.5 }}>
          {formatearFecha(fechaEntrada)}
        </Typography>
        <Typography variant="h5" color="primary" fontWeight="bold">
          {formatearHora(horaEntrada)}
        </Typography>
      </Box>

      {/* Modelo del vehículo */}
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
        {vehiculo?.modelo || vehiculo?.descripcion || "N/A"}
      </Typography>

      {/* Folio del ticket */}
      {folioTicket && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Folio: {folioTicket}
        </Typography>
      )}

      {/* Imagen del vehículo */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          height: 250,
          mx: "auto",
          mb: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={imagenVehiculo}
          alt={vehiculo?.modelo || "Vehículo"}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
          }}
        />
      </Box>

      {/* Tiempo transcurrido */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          mb: 3,
        }}
      >
        <AccessTimeIcon color="action" />
        <Typography variant="body1" color="text.secondary">
          {tiempoEstacionado}
        </Typography>
      </Box>

      {/* Botón marcar salida */}
      <Button
        variant="contained"
        size="large"
        fullWidth
        onClick={onMarcarSalida}
        disabled={disabled}
        sx={{
          maxWidth: 400,
          mx: "auto",
          py: 1.5,
        }}
      >
        Marcar salida
      </Button>
    </Box>
  );
};
