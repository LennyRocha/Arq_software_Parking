import React from "react";
import { Box, Card, CardContent, Typography, Button } from "@mui/material";
import cochePng from "../../../img/coche.png";
import motoPng from "../../../img/moto_view.png";
import camionetaPng from "../../../img/camioneta.png";

/**
 * Mapeo de tipos de vehículo a imágenes
 * 1 = Auto, 2 = Moto, 3 = Camioneta (ajustar según tu configuración)
 */
const vehiculoImagenes = {
  1: cochePng,
  2: motoPng,
  3: camionetaPng,
};

/**
 * Componente para mostrar un vehículo disponible para marcar entrada
 */
export const TarjetaVehiculo = ({ vehiculo, onMarcarEntrada, disabled }) => {
  const imagenVehiculo = vehiculoImagenes[vehiculo.idTipoVehiculo] || cochePng;

  return (
    <Card
      sx={{
        minWidth: 250,
        maxWidth: 300,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" component="div" gutterBottom>
          {vehiculo.modelo || vehiculo.descripcion}
        </Typography>
        
        <Box
          sx={{
            width: "100%",
            height: 150,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            my: 2,
          }}
        >
          <img
            src={imagenVehiculo}
            alt={vehiculo.modelo}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {vehiculo.descripcion}
        </Typography>
        
        {vehiculo.placa && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Placa: {vehiculo.placa}
          </Typography>
        )}

        <Button
          variant="contained"
          fullWidth
          onClick={() => onMarcarEntrada(vehiculo.id)}
          disabled={disabled}
          sx={{ mt: "auto" }}
        >
          Marcar entrada
        </Button>
      </CardContent>
    </Card>
  );
};
