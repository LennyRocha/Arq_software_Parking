import React from "react";
import { Box, Typography, Button } from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

export default function Step3Confirmacion({ datosRegistro, formData, onVolverAUsuarios, textoBoton = "Volver a Gestión de Usuarios" }) {
  // Usar formData si está disponible, sino usar datosRegistro
  const datos = formData || datosRegistro || {};
  
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        py: 4,
      }}
    >
      <CheckCircleIcon
        sx={{ fontSize: 100, color: "success.main", mb: 3 }}
      />
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
        ¡Registro Exitoso!
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        El usuario pensionado ha sido registrado correctamente en el sistema.
      </Typography>

      {datos && datos.nombre && (
        <Box sx={{ mb: 4, textAlign: "left", width: "100%", maxWidth: 500 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Detalles del registro:
          </Typography>
          <Box
            sx={{
              bgcolor: "background.paper",
              p: 2,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="body2">
              <strong>Nombre:</strong> {datos.nombre} {datos.apellidos}
            </Typography>
            <Typography variant="body2">
              <strong>Correo:</strong> {datos.correo}
            </Typography>
            <Typography variant="body2">
              <strong>Teléfono:</strong> {datos.telefono}
            </Typography>
          </Box>

          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 3, mb: 1 }}>
            Credenciales de acceso:
          </Typography>
          <Box
            sx={{
              bgcolor: "info.light",
              p: 2,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "info.main",
            }}
          >
            <Typography variant="body2">
              <strong>Correo:</strong> {datos.correo}
            </Typography>
            <Typography variant="body2">
              <strong>Contraseña:</strong> {datos.apellidos?.trim()}123
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
              El usuario podrá acceder a su cuenta con estas credenciales. Se recomienda que al iniciar sesión en su cuenta, cambie dicha contraseña desde su perfil de usuario.
            </Typography>
          </Box>
        </Box>
      )}

      <Button
        variant="contained"
        size="large"
        onClick={onVolverAUsuarios}
        sx={{ mt: 2 }}
      >
        {textoBoton}
      </Button>
    </Box>
  );
}
