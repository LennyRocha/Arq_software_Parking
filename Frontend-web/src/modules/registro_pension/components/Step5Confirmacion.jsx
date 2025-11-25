import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  alpha,
  useTheme,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Login as LoginIcon,
  QrCode as QrCodeIcon,
} from "@mui/icons-material";

export default function Step5Confirmacion({ datosRegistro, onIrALogin }) {
  const theme = useTheme();

  return (
    <Box sx={{ textAlign: "center" }}>
      {/* Ícono de éxito */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            bgcolor: alpha(theme.palette.success.main, 0.1),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CheckCircleIcon
            sx={{
              fontSize: 80,
              color: "success.main",
            }}
          />
        </Box>
      </Box>

      {/* Mensaje de éxito */}
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
        ¡Registro exitoso!
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Tu cuenta ha sido creada correctamente. Ya puedes iniciar sesión y
        disfrutar de tu pensión de estacionamiento.
      </Typography>

      {/* Información del registro */}
      {datosRegistro && (
        <>
          <Card sx={{ mb: 3, textAlign: "left" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Detalles de tu registro
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Usuario
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {datosRegistro.nombreCompleto}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Correo electrónico
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {datosRegistro.correo}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Fecha de finalización
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {new Date(datosRegistro.fechaFinalizacion).toLocaleDateString(
                      "es-MX",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </Typography>
                </Box>
                {datosRegistro.cantidadPago && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Monto pagado
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      ${datosRegistro.cantidadPago}
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Información de código QR */}
          {datosRegistro.uuidCodigoQR && (
            <Alert
              icon={<QrCodeIcon />}
              severity="success"
              sx={{ mb: 3, textAlign: "left" }}
            >
              Tu código QR de acceso ha sido generado. Podrás visualizarlo y
              usarlo una vez que inicies sesión en tu cuenta.
            </Alert>
          )}

          {/* Vehículos registrados */}
          {datosRegistro.vehiculos && datosRegistro.vehiculos.length > 0 && (
            <Card sx={{ mb: 3, textAlign: "left" }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                  Vehículos registrados ({datosRegistro.vehiculos.length})
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {datosRegistro.vehiculos.map((vehiculo, index) => (
                    <Box
                      key={vehiculo.id}
                      sx={{
                        p: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        {vehiculo.tipoVehiculo} - {vehiculo.placa}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {vehiculo.modelo} | {vehiculo.descripcion}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Botón para ir al login */}
      <Button
        variant="contained"
        size="large"
        fullWidth
        startIcon={<LoginIcon />}
        onClick={onIrALogin}
        sx={{
          py: 2,
          fontSize: "1.1rem",
          fontWeight: "bold",
        }}
      >
        Iniciar sesión
      </Button>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Usa tu correo electrónico y la contraseña que registraste para acceder
      </Typography>
    </Box>
  );
}
