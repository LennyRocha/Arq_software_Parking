import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  Divider,
  alpha,
  useTheme,
} from "@mui/material";
import {
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

export default function Step4Pago({
  formData,
  onIniciarPago,
  onVerificarPago,
  loading,
  error,
}) {
  const theme = useTheme();
  const [mostrarBotonVerificar, setMostrarBotonVerificar] = useState(false);

  useEffect(() => {
    // Verificar si hay un pago en progreso
    const datosGuardados = localStorage.getItem('registroPensionEnProgreso');
    if (datosGuardados) {
      setMostrarBotonVerificar(true);
    }
  }, []);

  const handlePago = async () => {
    await onIniciarPago();
    // Mostrar botón de verificar después de 5 segundos
    setTimeout(() => {
      setMostrarBotonVerificar(true);
    }, 5000);
  };

  const handleVerificar = () => {
    console.log("=== HANDLE VERIFICAR LLAMADO ===");
    console.log("onVerificarPago existe?", !!onVerificarPago);
    if (onVerificarPago) {
      onVerificarPago();
    } else {
      console.error("onVerificarPago NO ESTÁ DEFINIDO");
      alert("Error: La función de verificar no está disponible");
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, textAlign: "center" }}>
        Resumen de tu registro
      </Typography>

      {/* Resumen del plan */}
      <Card
        sx={{
          mb: 3,
          border: 2,
          borderColor: "primary.main",
          bgcolor: alpha(theme.palette.primary.main, 0.05),
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <CheckCircleIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Plan seleccionado
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
            parKing {formData.tipoPension?.nombre}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Duración: {formData.tipoPension?.duracionDias} días
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            ${formData.tipoPension?.costo}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Pago único por todo el periodo
          </Typography>
        </CardContent>
      </Card>

      {/* Información personal */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Información personal
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography>
              <strong>Nombre:</strong> {formData.nombre} {formData.apellidos}
            </Typography>
            <Typography>
              <strong>Correo:</strong> {formData.correo}
            </Typography>
            <Typography>
              <strong>Teléfono:</strong> {formData.telefono}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Vehículos registrados */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Vehículos registrados ({formData.vehiculos.length})
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {formData.vehiculos.map((vehiculo, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  borderRadius: 1,
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  Vehículo #{index + 1}
                </Typography>
                <Typography variant="body2">
                  Placa: {vehiculo.placa} | Modelo: {vehiculo.modelo}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {vehiculo.descripcion}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Información de pago */}
      <Alert
        icon={<InfoIcon />}
        severity="info"
        sx={{ mb: 3 }}
      >
        Serás redirigido a Mercado Pago. Después de pagar, regresa aquí y haz clic en "Ya pagué".
      </Alert>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Botón de pago */}
      <Button
        variant="contained"
        size="large"
        fullWidth
        startIcon={loading ? <CircularProgress size={20} /> : <PaymentIcon />}
        onClick={handlePago}
        disabled={loading || mostrarBotonVerificar}
        sx={{
          py: 2,
          fontSize: "1.1rem",
          fontWeight: "bold",
          mb: 2,
        }}
      >
        {loading ? "Procesando..." : "Proceder al pago"}
      </Button>

      {/* Botón para verificar pago */}
      {mostrarBotonVerificar && (
        <Button
          variant="outlined"
          size="large"
          fullWidth
          startIcon={<CheckCircleIcon />}
          onClick={handleVerificar}
          disabled={loading}
          sx={{
            py: 2,
            fontSize: "1.1rem",
            fontWeight: "bold",
            borderColor: "success.main",
            color: "success.main",
            "&:hover": {
              borderColor: "success.dark",
              bgcolor: alpha(theme.palette.success.main, 0.1),
            },
          }}
        >
          Ya pagué - Completar registro
        </Button>
      )}

      {/* Métodos de pago */}
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Métodos de pago disponibles con Mercado Pago:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          💳 Tarjetas de crédito/débito • 💰 Efectivo • 🏦 Transferencias
        </Typography>
      </Box>
    </Box>
  );
}
