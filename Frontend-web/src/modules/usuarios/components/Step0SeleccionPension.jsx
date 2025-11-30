import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Radio,
  alpha,
  useTheme,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";

export default function Step0SeleccionPension({
  tiposPension,
  tipoPensionSeleccionada,
  onSeleccionar,
  loading,
  error,
  onLoadMore,
  hasMore,
  onCargarInicial,
}) {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;

  // Cargar pensiones al montar el componente
  useEffect(() => {
    if (tiposPension.length === 0 && !loading && onCargarInicial) {
      onCargarInicial();
    }
  }, []);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - itemsPerPage));
  };

  const handleNext = () => {
    const nextIndex = currentIndex + itemsPerPage;
    setCurrentIndex(nextIndex);
    
    // Si estamos cerca del final y hay más elementos, cargar más
    if (nextIndex + itemsPerPage >= tiposPension.length && hasMore && !loading) {
      onLoadMore?.();
    }
  };

  if (loading && tiposPension.length === 0) {
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

  const visibleItems = tiposPension.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );
  const canGoPrevious = currentIndex > 0;
  const canGoNext =
    currentIndex + itemsPerPage < tiposPension.length || hasMore;

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 4, textAlign: "center" }}>
        Selecciona el tipo de pensión para el usuario
      </Typography>

      {/* Carrusel */}
      <Box sx={{ position: "relative", px: 6 }}>
        {/* Botón anterior */}
        <IconButton
          onClick={handlePrevious}
          disabled={!canGoPrevious}
          sx={{
            position: "absolute",
            left: -8,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            bgcolor: "background.paper",
            boxShadow: 2,
            "&:hover": { bgcolor: "background.paper", boxShadow: 4 },
            "&.Mui-disabled": { opacity: 0.3 },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>

        {/* Cards */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            overflow: "hidden",
            minHeight: 420,
          }}
        >
          {visibleItems.map((pension) => {
            const isSelected = tipoPensionSeleccionada?.id === pension.id;
            return (
              <Card
                key={pension.id}
                onClick={() => onSeleccionar(pension)}
                sx={{
                  flex: "1 1 0",
                  minWidth: 0,
                  cursor: "pointer",
                  border: isSelected
                    ? `3px solid ${theme.palette.primary.main}`
                    : `2px solid ${alpha(theme.palette.divider, 0.2)}`,
                  transition: "all 0.3s",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "translateY(-8px)",
                  },
                }}
              >
                {/* Header con título */}
                <Box
                  sx={{
                    bgcolor: isSelected
                      ? "primary.main"
                      : theme.palette.mode === "dark"
                      ? "grey.800"
                      : "grey.200",
                    color: isSelected
                      ? "white"
                      : theme.palette.mode === "dark"
                      ? "white"
                      : "text.primary",
                    py: 2.5,
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
                      color: isSelected
                        ? "white"
                        : theme.palette.mode === "dark"
                        ? "grey.400"
                        : "grey.600",
                      "&.Mui-checked": {
                        color: "white",
                      },
                    }}
                  />
                  <Typography variant="h5" sx={{ fontWeight: "bold", px: 1 }}>
                    {pension.nombre}
                  </Typography>
                </Box>

                {/* Contenido */}
                <CardContent
                  sx={{
                    textAlign: "center",
                    p: 3,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: "bold",
                      mb: 1,
                      color: "primary.main",
                    }}
                  >
                    ${pension.costo}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 4 }}
                  >
                    Por {pension.duracionDias} días
                  </Typography>

                  {/* Beneficios */}
                  <Box sx={{ textAlign: "left", mt: "auto" }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <CheckCircleIcon
                        sx={{ color: "success.main", mr: 1.5, fontSize: 24 }}
                      />
                      <Typography variant="body1">Lugar reservado</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <CheckCircleIcon
                        sx={{ color: "success.main", mr: 1.5, fontSize: 24 }}
                      />
                      <Typography variant="body1">Sin costos extra</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CheckCircleIcon
                        sx={{ color: "success.main", mr: 1.5, fontSize: 24 }}
                      />
                      <Typography variant="body1">Acceso ilimitado</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>

        {/* Botón siguiente */}
        <IconButton
          onClick={handleNext}
          disabled={!canGoNext || loading}
          sx={{
            position: "absolute",
            right: -8,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            bgcolor: "background.paper",
            boxShadow: 2,
            "&:hover": { bgcolor: "background.paper", boxShadow: 4 },
            "&.Mui-disabled": { opacity: 0.3 },
          }}
        >
          {loading && canGoNext ? (
            <CircularProgress size={24} />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </Box>

      {/* Indicador de posición */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3, gap: 1 }}>
        {Array.from({
          length: Math.ceil(tiposPension.length / itemsPerPage),
        }).map((_, index) => (
          <Box
            key={index}
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor:
                index === Math.floor(currentIndex / itemsPerPage)
                  ? "primary.main"
                  : "grey.400",
              transition: "all 0.3s",
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
