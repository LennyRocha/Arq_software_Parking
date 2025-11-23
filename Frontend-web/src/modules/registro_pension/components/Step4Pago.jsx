import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
  Divider,
  alpha,
  useTheme,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import MercadoPagoBrick from "./MercadoPagoBrick";

export default function Step4Pago({
  formData,
  onPagoExitoso,
  onPagoError,
}) {
  const theme = useTheme();
  const [mostrarPago, setMostrarPago] = useState(false);

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

      {/* Formulario de pago integrado */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            💳 Información de pago
          </Typography>
          
          <Alert icon={<InfoIcon />} severity="info" sx={{ mb: 2 }}>
            Completa los datos de tu tarjeta para finalizar el registro.
            El pago es procesado de forma segura por Mercado Pago.
          </Alert>

          <MercadoPagoBrick
            amount={formData.tipoPension?.costo || 0}
            onPaymentSuccess={onPagoExitoso}
            onPaymentError={onPagoError}
            pensionData={formData}
          />
        </CardContent>
      </Card>

      {/* Métodos de pago */}
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          🔒 Pago 100% seguro con Mercado Pago
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Aceptamos todas las tarjetas de crédito y débito
        </Typography>
      </Box>
    </Box>
  );
}
