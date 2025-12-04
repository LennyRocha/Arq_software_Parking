import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigation = useNavigate();
  console.log(navigation);
  return (
    <Box
      sx={{
        background:
          'linear-gradient(to bottom, #1E3A3E, #1F4D4C, #397974, #4B7C7B)',
        flex: 1,
        alignContent: "center",
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <Typography className="custom-font" sx={{ color: "white", fontWeight: "bold" }} variant="h1">404</Typography>
      <Typography sx={{ color: "white" }} variant="h6"  >¡Lo sentimos, la página que estas buscando no existe!</Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          color="secondary"
          variant="contained"
          onClick={() => window.history.back()}
        >
          Volver atrás
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => navigation("/")}
        >
          Ir al menú principal
        </Button>
      </Box>
    </Box>
  );
}
