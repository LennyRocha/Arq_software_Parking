import React from "react";
import moto from "../../../img/motoViewUp.png";
import coche from "../../../img/coche.png";
import camioneta from "../../../img/camioneta.png";
import { Box, Paper } from "@mui/material";
import getCajonDireccion from "../hooks/getCajonDireccion";

export default function Cajoncito({ cajon, sx, positions }) {
  const vehiculos = {
    1: coche,
    2: camioneta,
    3: moto,
  };

  const rotacion = getCajonDireccion(positions)

  return (
    <Paper sx={sx} elevation={cajon.disponible ? 1 : 0} >
      {!cajon.disponible && (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            component="img"
            src={vehiculos[cajon.tipoVehiculo.id]}
            sx={{
              height: "175%",
              width: "auto",
              objectFit: "contain",
              transform: rotacion,
              transformOrigin: "center",
            }}
          />
        </Box>
      )}
    </Paper>
  );
}
