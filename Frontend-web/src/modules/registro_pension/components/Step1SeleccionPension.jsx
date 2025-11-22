import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Radio,
  alpha,
  useTheme,
  CircularProgress,
  Alert,
} from "@mui/material";
import { CheckCircle as CheckCircleIcon } from "@mui/icons-material";

export default function Step1SeleccionPension({
  tiposPension,
  tipoPensionSeleccionada,
  onSeleccionar,
  loading,
  error,
}) {
  const theme = useTheme();

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  if (tiposPension.length === 0) {
    return (
      <Alert severity="warning" sx={{ mb: 3 }}>
        No hay tipos de pensión disponibles en este momento.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, textAlign: "center" }}>
        Selecciona el plan que mejor se adapte a tus necesidades
      </Typography>
      <Grid container spacing={3}>
        {tiposPension.map((pension) => {
          const isSelected = tipoPensionSeleccionada?.id === pension.id;
          return (
            <Grid item xs={12} sm={6} md={4} key={pension.id}>
              <Card
                onClick={() => onSeleccionar(pension)}
                sx={{
                  cursor: "pointer",
                  border: isSelected
                    ? `3px solid ${theme.palette.primary.main}`
                    : `2px solid ${alpha(theme.palette.divider, 0.2)}`,
                  transition: "all 0.3s",
                  position: "relative",
                  "&:hover": {
                    boxShadow: 4,
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <Box
                  sx={{
                    bgcolor: isSelected ? "primary.main" : "grey.200",
                    color: isSelected ? "white" : "text.primary",
                    py: 2,
                    textAlign: "center",
                    position: "relative",
                  }}
                >
                  <Radio
                    checked={isSelected}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      color: "white",
                      "&.Mui-checked": {
                        color: "white",
                      },
                    }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {pension.nombre}
                  </Typography>
                </Box>
                <CardContent sx={{ textAlign: "center", p: 3 }}>
                  <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                    ${pension.costo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Por {pension.duracionDias} días
                  </Typography>
                  <Box sx={{ textAlign: "left" }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <CheckCircleIcon
                        sx={{ color: "success.main", mr: 1, fontSize: 20 }}
                      />
                      <Typography variant="body2">Lugar reservado</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <CheckCircleIcon
                        sx={{ color: "success.main", mr: 1, fontSize: 20 }}
                      />
                      <Typography variant="body2">Sin costos extra</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <CheckCircleIcon
                        sx={{ color: "success.main", mr: 1, fontSize: 20 }}
                      />
                      <Typography variant="body2">Acceso ilimitado</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
