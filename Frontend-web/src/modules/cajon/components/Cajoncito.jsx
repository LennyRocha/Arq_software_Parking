import React from "react";
import moto from "../../../img/motoViewUp.png";
import coche from "../../../img/coche.png";
import camioneta from "../../../img/camioneta.png";
import { Box, Paper } from "@mui/material";

export default function Cajoncito({ cajon, sx, positions }) {
  const vehiculos = {
    1: coche,
    2: camioneta,
    3: moto,
  };
  console.log(positions);
  return (
    <Paper sx={sx}>
      {!cajon.disponible && (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "visible", // <<< IMPORTANTE
          }}
        >
          <Box
            component="img"
            src={vehiculos[cajon.tipoVehiculo.id]}
            sx={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              transform: "rotate(90deg)",
              transformOrigin: "center",
            }}
          />
        </Box>
      )}
    </Paper>
  );
}
