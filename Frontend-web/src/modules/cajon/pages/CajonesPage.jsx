import React from "react";
import { Box, Button } from "@mui/material";
import MainHeader from "../../../components/MainHeader";
import "../styles/cajon.css";
import ParkingGrid from "../components/ParkingGrid";

export default function CajonesPage({ isPensionado = true, isAdmin = false }) {
  return (
    <div className="overflow-y-auto">
      <MainHeader
        titulo="CAJONES DISPONIBLES"
        breads={
          isAdmin
            ? [
                {
                  nombre: "Inicio",
                  ruta: isPensionado
                    ? "/pensionados"
                    : isAdmin
                    ? "/admin"
                    : "/empleado",
                  disabled: false,
                },
                {
                  nombre: "Gestión de cajones",
                  ruta: "/admin/cajones",
                  disabled: false,
                },
                {
                  nombre: isAdmin ? "Estacionamiento" : "Consultar cajones",
                  ruta: "/",
                  disabled: true,
                },
              ]
            : [
                {
                  nombre: "Inicio",
                  ruta: isPensionado
                    ? "/pensionados"
                    : isAdmin
                    ? "/admin"
                    : "/empleado",
                  disabled: false,
                },
                {
                  nombre: isAdmin ? "Estacionamiento" : "Consultar cajones",
                  ruta: "/",
                  disabled: true,
                },
              ]
        }
      />
      <Box
        sx={{
          padding: "24px",
          gap: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
        component={"div"}
      >
        <ParkingGrid />
        {/* {isPensionado && (
          <Button
            color="tertiary"
            variant="contained"
            sx={{ width: "100%", maxWidth: 1200 }}
          >
            Marcar entrada
          </Button>
        )} */}
      </Box>
    </div>
  );
}
