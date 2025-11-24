import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Grid } from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
import CustomDialog from "../../../components/CustomDialog";
import CustomInputLabel from "../../../components/inputs/CustomInputLabel";
import CustomInputSelect from "../../../components/inputs/CustomInputSelect";
import { solicitarCodigoEntradaSalida } from "../api/MarcajesUsuario";
import { getAxiosErrorMessage } from "../../../utils/getAxiosMessage";
import sweetAlert from "../../../utils/sweetAlert";
import cochePng from "../../../img/coche.png";

/**
 * Modal para marcar entrada o salida de un vehículo mediante código QR
 */
export default function MarcarEntradaModal({
  showModal,
  vehiculo,
  onClose,
  tipo = "entrada", // "entrada" o "salida"
  horaEntrada = null, // Hora de entrada para mostrar en modal de salida
}) {
  const [codigoQR, setCodigoQR] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const esEntrada = tipo === "entrada";
  const titulo = esEntrada ? "Marcar entrada" : "Marcar salida";
  const mensaje = esEntrada ? "Muestra este código QR para marcar tu entrada" : "Muestra este código QR para marcar tu salida";

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
   * Solicita el código QR cuando se abre el modal
   */
  useEffect(() => {
    if (showModal && vehiculo) {
      solicitarCodigo();
    }
  }, [showModal, vehiculo]);

  /**
   * Función para solicitar el código QR
   */
  const solicitarCodigo = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await solicitarCodigoEntradaSalida();
      
      if (response.data?.success) {
        let codigo = response.data.data?.codigo || response.data.data;
        
        // Si es entrada, concatenar el ID del vehículo al código
        if (esEntrada && vehiculo?.id) {
          codigo = `${codigo}|${vehiculo.id}`;
        }
        
        setCodigoQR(codigo);
      } else {
        const errorMsg = response.data?.message || "No se pudo generar el código QR";
        setError(errorMsg);
        
        await sweetAlert({
          title: "Error",
          text: errorMsg,
          icon: "error",
          confirmText: "Aceptar",
        });
      }
    } catch (err) {
      const errorMessage = getAxiosErrorMessage(err);
      setError(errorMessage);
      
      await sweetAlert({
        title: "Error",
        text: errorMessage,
        icon: "error",
        confirmText: "Aceptar",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    // Limpiar estado
    setCodigoQR("");
    setError(null);
    onClose();
  };

  return (
    <CustomDialog
      isOpen={showModal}
      handleClose={handleCancelar}
      titulo={titulo}
      showActions={true}
      textCancel="Cancelar"
      textConfirm="Confirmar"
      onCancel={handleCancelar}
      isForm={false}
      maxWidth="sm"
      fullWidth
    >
      <Box sx={{ py: 2 }}>
        {/* Mensaje con icono del vehículo */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Box
            component="img"
            src={cochePng}
            alt="Vehículo"
            sx={{ width: 50, height: 50, mr: 2 }}
          />
          <Typography variant="body1" color="text.secondary">
            {mensaje}
          </Typography>
        </Box>

        {/* Código QR o loading */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && codigoQR && (
          <Box 
            sx={{ 
              display: "flex", 
              justifyContent: "center", 
              my: 3,
              p: 3,
              bgcolor: "white",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider"
            }}
          >
            <QRCodeSVG 
              value={codigoQR} 
              size={200}
              level="H"
              includeMargin={true}
            />
          </Box>
        )}

        {!loading && error && !codigoQR && (
          <Typography variant="body2" color="error" sx={{ my: 3, textAlign: "center" }}>
            {error}
          </Typography>
        )}

        {/* Información del vehículo */}
        {vehiculo && (
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <CustomInputLabel
                labelText="Tipo de vehículo:"
                value={vehiculo.tipoVehiculo?.nombre || "Coche"}
                isDisabled
              />
            </Grid>
            
            <Grid item xs={6}>
              <CustomInputLabel
                labelText="Modelo"
                value={vehiculo.modelo || vehiculo.descripcion || "N/A"}
                isDisabled
              />
            </Grid>

            {vehiculo.placa && (
              <Grid item xs={12}>
                <CustomInputLabel
                  labelText="Placa:"
                  value={vehiculo.placa}
                  isDisabled
                />
              </Grid>
            )}

            {!esEntrada && horaEntrada && (
              <Grid item xs={12}>
                <CustomInputLabel
                  labelText="Hora de entrada:"
                  value={formatearHora(horaEntrada)}
                  isDisabled
                />
              </Grid>
            )}
          </Grid>
        )}
      </Box>
    </CustomDialog>
  );
}
