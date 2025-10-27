import { Box, Breadcrumbs, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import logo from "../img/logo_parking_hd_no_titulo.png";
import React from "react";

export default function MainHeader({ titulo, breads }) {
  const BreadCrumbs = (
    <Breadcrumbs aria-label="breadcrumb">
      {breads.map((bread, index) => (
        <Link
          key={index}
          to={bread.ruta}
          className="link"
          style={{
            color: bread.disabled ? "var(--gray)" : "var(--primary)",
            pointerEvents: bread.disabled ? "none" : "auto",
            cursor: bread.disabled ? "default" : "pointer",
            textDecoration: "none",
          }}
        >
          {bread.nombre}
        </Link>
      ))}
    </Breadcrumbs>
  );

  return (
    <Box
      sx={{
        padding: "2rem .25rem",
        borderBottom: "1px solid var(--border)",
        bgcolor: "var(--background)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
      }}
    >
      {BreadCrumbs}
      <Box
        display={"flex"}
        sx={{
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          gap: 1,
          justifyContent: "center",
          width: "100%",
          paddingTop: 1,
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="Logo"
          sx={{ height: "3.5rem", mb: 1 }}
        />
        <Typography
          component="div"
          className="custom-font other"
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "1.5rem", md: "2rem" }, // h6 en xs, h3 en md
          }}
        >
          {titulo}
        </Typography>
      </Box>
    </Box>
  );
}
