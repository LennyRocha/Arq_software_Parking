import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import MainHeader from "../../../components/MainHeader";
import HeadingDescription from "../../../components/HeadingDescription";
import LoadingBackdrop from "../../../components/LoadingBackdrop";
import { useEstacionamientoPensionado } from "../hooks/useEstacionamientoPensionado";
import { VehiculoEstacionado } from "../components/VehiculoEstacionado";
import { TarjetaVehiculo } from "../components/TarjetaVehiculo";
import MarcarEntradaModal from "../components/MarcarEntradaModal";
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
    verificacionInicial,
    verificarEstacionamiento,
    marcarEntrada,
    marcarSalida,
  } = useEstacionamientoPensionado();

  // Estado para controlar los modales
  const [showModalEntrada, setShowModalEntrada] = useState(false);
  const [showModalSalida, setShowModalSalida] = useState(false);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);

  // Verificar estado al cargar la página
  useEffect(() => {
    verificarEstacionamiento();
  }, [verificarEstacionamiento]);

  /**
   * Maneja la acción de marcar entrada para un vehículo
   * Abre el modal con el código QR
   */
  const handleMarcarEntrada = (vehiculoId) => {
    const vehiculo = vehiculosDisponibles.find(v => v.id === vehiculoId);
    setVehiculoSeleccionado(vehiculo);
    setShowModalEntrada(true);
  };

  /**
   * Maneja el cierre del modal de marcar entrada
   * Recarga la página para verificar si se marcó la entrada
   */
  const handleCloseModalEntrada = () => {
    setShowModalEntrada(false);
    setVehiculoSeleccionado(null);
    // Recargar el estado para verificar si se marcó la entrada
    verificarEstacionamiento();
  };

  /**
   * Maneja la acción de marcar salida
   * Abre el modal con el código QR
   */
  const handleMarcarSalida = () => {
    setVehiculoSeleccionado(vehiculoEstacionado);
    setShowModalSalida(true);
  };

  /**
   * Maneja el cierre del modal de marcar salida
   * Recarga la página para verificar si se marcó la salida
   */
  const handleCloseModalSalida = () => {
    setShowModalSalida(false);
    setVehiculoSeleccionado(null);
    // Recargar el estado para verificar si se marcó la salida
    verificarEstacionamiento();
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
          title={
            !verificacionInicial
              ? "Cargando información..."
              : tieneVehiculoEstacionado
              ? "ESTACIONAMIENTO - MARCAR SALIDA DE VEHÍCULO"
              : "ESTACIONAMIENTO - ESTACIONAR VEHÍCULO"
          }
          description={
            !verificacionInicial
              ? "Por favor espera mientras verificamos tu información..."
              : tieneVehiculoEstacionado
              ? "Actualmente tienes un vehículo estacionado, en este apartado puedes marcar la salida de tu vehículo."
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

      {/* Modal para marcar entrada con código QR */}
      <MarcarEntradaModal
        showModal={showModalEntrada}
        vehiculo={vehiculoSeleccionado}
        onClose={handleCloseModalEntrada}
        tipo="entrada"
      />

      {/* Modal para marcar salida con código QR */}
      <MarcarEntradaModal
        showModal={showModalSalida}
        vehiculo={vehiculoSeleccionado}
        onClose={handleCloseModalSalida}
        tipo="salida"
        horaEntrada={datosEntrada?.horaEntrada}
      />
    </>
  );
};

export default PensionadoEstacionamiento;
