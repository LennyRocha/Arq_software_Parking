import React from "react";
import { Box, Button } from "@mui/material";
import MainHeader from "../../../components/MainHeader";
import "../styles/cajon.css";
import ParkingGrid from "../components/ParkingGrid";

export default function CajonesPage({ isPensionado = true }) {
  return (
    <div className="overflow-y-auto">
      <MainHeader
        titulo="CAJONES DISPONIBLES"
        breads={[
          {
            nombre: isPensionado ?  "Usuario pensionado" :  "Empleados",
            ruta: isPensionado ? "/pensionados" : "/empleado",
            disabled: false,
          },
          {
            nombre: "Consultar cajones",
            ruta: "/",
            disabled: true,
          },
        ]}
      />
      <Box
        sx={{
          padding: "24px",
          gap: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
        component={"div"}
      >
        <ParkingGrid/>
        {isPensionado && (
          <Button color="tertiary" variant="contained" sx={{ width: "100%" , maxWidth: 1200}}>
            Marcar entrada
          </Button>
        )}
      </Box>
    </div>
  );
}
