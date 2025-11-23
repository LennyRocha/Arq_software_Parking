import React, { useEffect } from "react";
import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import MainHeader from "../../../components/MainHeader";
import HeadingDescription from "../../../components/HeadingDescription";
import LoadingBackdrop from "../../../components/LoadingBackdrop";
import { useEstacionamientoPensionado } from "../hooks/useEstacionamientoPensionado";
import { VehiculoEstacionado } from "../components/VehiculoEstacionado";
import { TarjetaVehiculo } from "../components/TarjetaVehiculo";
import sweetAlert from "../../../utils/sweetAlert";

/**
 * Muestra una alerta de éxito
 */
const mostrarAlertaExito = (title, text) => {
  return sweetAlert({
    title,
    text,
    icon: "success",
    confirmText: "Aceptar",
  });
};

/**
 * Muestra una alerta de error
 */
const mostrarAlertaError = (title, text) => {
  return sweetAlert({
    title,
    text,
    icon: "error",
    confirmText: "Aceptar",
  });
};

/**
 * Muestra una alerta de confirmación con botones Sí/No
 */
const mostrarAlertaConfirmacion = (title, text, confirmText = "Sí", cancelText = "No") => {
  return sweetAlert({
    title,
    text,
    icon: "question",
    showCancelButton: true,
    confirmText,
    cancelText,
    reverseButtons: true,
  });
};

/**
 * Página de estacionamiento para usuarios pensionados
 * Permite marcar entrada o salida según el estado actual
 */
const PensionadoEstacionamiento = () => {
  const {
    loading,
    error,
    tieneVehiculoEstacionado,
    vehiculoEstacionado,
    vehiculosDisponibles,
    datosEntrada,
    verificarEstacionamiento,
    marcarEntrada,
    marcarSalida,
  } = useEstacionamientoPensionado();

  // Verificar estado al cargar la página
  useEffect(() => {
    verificarEstacionamiento();
  }, [verificarEstacionamiento]);

  /**
   * Maneja la acción de marcar entrada para un vehículo
   */
  const handleMarcarEntrada = async (vehiculoId) => {
    const vehiculoSeleccionado = vehiculosDisponibles.find(v => v.id === vehiculoId);
    
    const confirmacion = await mostrarAlertaConfirmacion(
      "¿Marcar entrada?",
      `¿Deseas marcar la entrada del vehículo ${vehiculoSeleccionado?.modelo || vehiculoSeleccionado?.descripcion}?`,
      "Sí, marcar entrada",
      "Cancelar"
    );

    if (confirmacion.isConfirmed) {
      const resultado = await marcarEntrada(vehiculoId);

      if (resultado.success) {
        await mostrarAlertaExito(
          "Entrada marcada",
          resultado.message || "La entrada del vehículo ha sido registrada exitosamente"
        );
        // Recargar el estado
        verificarEstacionamiento();
      } else {
        mostrarAlertaError(
          "Error",
          resultado.error || "No se pudo marcar la entrada del vehículo"
        );
      }
    }
  };

  /**
   * Maneja la acción de marcar salida
   */
  const handleMarcarSalida = async () => {
    const confirmacion = await mostrarAlertaConfirmacion(
      "¿Marcar salida?",
      `¿Deseas marcar la salida del vehículo ${vehiculoEstacionado?.modelo || vehiculoEstacionado?.descripcion}?`,
      "Sí, marcar salida",
      "Cancelar"
    );

    if (confirmacion.isConfirmed) {
      const resultado = await marcarSalida();

      if (resultado.success) {
        await mostrarAlertaExito(
          "Salida marcada",
          resultado.message || "La salida del vehículo ha sido registrada exitosamente"
        );
        // Recargar el estado
        verificarEstacionamiento();
      } else {
        mostrarAlertaError(
          "Error",
          resultado.error || "No se pudo marcar la salida del vehículo"
        );
      }
    }
  };

  // Mostrar error si existe
  useEffect(() => {
    if (error) {
      mostrarAlertaError("Error", error);
    }
  }, [error]);

  return (
    <>
      <MainHeader 
        titulo="ESTACIONAMIENTO"
        breads={[
          { nombre: "Entradas y salidas", ruta: "/pensionados", disabled: false },
          { nombre: "Estacionamiento", ruta: "/pensionados/estacionamiento", disabled: true }
        ]}
      />
      <LoadingBackdrop open={loading} />

      <Box sx={{ p: 3 }}>
        <HeadingDescription
          titulo="ESTACIONAMIENTO"
          subtitulo={
            tieneVehiculoEstacionado
              ? "ESTACIONAMIENTO - MARCAR SALIDA DE VEHÍCULO"
              : "ESTACIONAMIENTO - ESTACIONAR VEHÍCULO"
          }
          descripcion={
            tieneVehiculoEstacionado
              ? "Actualmente tienes un vehículo estacionado, en este apartado puedes marcar la salida de tu vehículo mediante el código QR."
              : "En este apartado puedes elegir el vehículo que deseas estacionar."
          }
        />

        {/* Mostrar loading inicial */}
        {loading && !tieneVehiculoEstacionado && vehiculosDisponibles.length === 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Mostrar vehículo estacionado */}
        {tieneVehiculoEstacionado && vehiculoEstacionado && (
          <Box sx={{ mt: 4 }}>
            <VehiculoEstacionado
              vehiculo={vehiculoEstacionado}
              fechaEntrada={datosEntrada?.fechaEntrada || new Date().toISOString()}
              horaEntrada={datosEntrada?.horaEntrada || "15:00:00"}
              folioTicket={datosEntrada?.folio || "0000001"}
              onMarcarSalida={handleMarcarSalida}
              disabled={loading}
            />
          </Box>
        )}

        {/* Mostrar vehículos disponibles para estacionar */}
        {!tieneVehiculoEstacionado && vehiculosDisponibles.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Grid container spacing={3} justifyContent="center">
              {vehiculosDisponibles.map((vehiculo) => (
                <Grid item key={vehiculo.id}>
                  <TarjetaVehiculo
                    vehiculo={vehiculo}
                    onMarcarEntrada={handleMarcarEntrada}
                    disabled={loading}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Mensaje cuando no hay vehículos disponibles */}
        {!tieneVehiculoEstacionado && !loading && vehiculosDisponibles.length === 0 && (
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              No tienes vehículos registrados para estacionar
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
};

export default PensionadoEstacionamiento;
