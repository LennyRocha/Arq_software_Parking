import React from "react";
import { Box, Typography, Button } from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

export default function Step3Confirmacion({ datosRegistro, onVolverAUsuarios, textoBoton = "Volver a Gestión de Usuarios" }) {
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

      {datosRegistro && (
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
              <strong>Nombre:</strong> {datosRegistro.nombre} {datosRegistro.apellidos}
            </Typography>
            <Typography variant="body2">
              <strong>Correo:</strong> {datosRegistro.correo}
            </Typography>
            <Typography variant="body2">
              <strong>Teléfono:</strong> {datosRegistro.telefono}
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
