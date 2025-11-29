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
  Grid,
  Paper,
  Stack,
} from "@mui/material";
import {
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
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
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f4f5fb",
        py: { xs: 4, md: 6 },
        px: { xs: 2, md: 4 },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1100,
          mx: "auto",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, textAlign: "center", mb: 1 }}
        >
          Resumen y pago
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 4 }}
        >
          Revisa tu selección y procede al pago para asegurar tu pensión.
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Stack spacing={3}>
              <Card
                sx={{
                  border: 2,
                  borderColor: "primary.main",
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
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

              <Card>
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

              <Card>
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
            </Stack>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper
              elevation={4}
              sx={{
                borderRadius: 3,
                p: { xs: 3, md: 4 },
                position: "sticky",
                top: 32,
                alignSelf: "flex-start",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1,
                }}
              >
                <PaymentIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Proceder al pago
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Serás redirigido a Mercado Pago. Después de pagar, regresa aquí y haz clic en "Ya pagué".
              </Typography>

                <Alert
                  icon={<InfoIcon />}
                  severity="info"
                >
                  Puedes usar tarjetas, efectivo o transferencias compatibles con Mercado Pago.
                </Alert>

                {error && (
                  <Alert severity="error">
                    {error}
                  </Alert>
                )}

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
                }}
              >
                {loading ? "Procesando..." : "Proceder al pago"}
              </Button>

              {mostrarBotonVerificar && (
                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  startIcon={<CheckCircleIcon />}
                  onClick={handleVerificar}
                  disabled={loading}
                  sx={{
                    mt: 2,
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

              <Divider sx={{ mt: 3 }} />

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Métodos de pago disponibles:
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  💳 Tarjetas • 💰 Efectivo • 🏦 Transferencias
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
