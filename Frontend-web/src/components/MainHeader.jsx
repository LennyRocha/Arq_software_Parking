/**
 * MainHeader - Componente de encabezado principal con breadcrumbs
 * 
 * @description
 * Componente que muestra el encabezado principal de la aplicación con:
 * - Breadcrumbs (migas de pan) para navegación
 * - Logo del sistema
 * - Título de la página actual
 * 
 * Se adapta a diferentes tamaños de pantalla (responsive).
 * 
 * @example
 * // Uso básico
 * <MainHeader 
 *   titulo="Gestión de Cajones"
 *   breads={[
 *     { nombre: "Inicio", ruta: "/", disabled: false },
 *     { nombre: "Cajones", ruta: "/cajones", disabled: true }
 *   ]}
 * />
 * 
 * @example
 * // Con múltiples niveles de navegación
 * <MainHeader 
 *   titulo="Editar Vehículo"
 *   breads={[
 *     { nombre: "Inicio", ruta: "/", disabled: false },
 *     { nombre: "Vehículos", ruta: "/vehiculos", disabled: false },
 *     { nombre: "Editar", ruta: "/vehiculos/editar", disabled: true }
 *   ]}
 * />
 * 
 * @param {string} titulo - Título principal a mostrar en el encabezado
 * @param {Array<Object>} breads - Array de objetos para las migas de pan
 * @param {string} breads[].nombre - Nombre del breadcrumb
 * @param {string} breads[].ruta - Ruta de navegación del breadcrumb
 * @param {boolean} breads[].disabled - Si el breadcrumb está deshabilitado (no clickeable)
 * @param {React.ReactNode} icon - Icono opcional a mostrar al lado del título
 */
import { Box, Breadcrumbs, Typography} from "@mui/material";
import logo from "../img/logo_parking_hd_no_titulo.png";
import React from "react";
import { Link } from "react-router-dom";

export default function MainHeader({ titulo, breads, icon }) {
  const BreadCrumbs = (
    <Breadcrumbs
      aria-label="breadcrumb"
      sx={{ "& .MuiBreadcrumbs-separator": { color: "var(--other)" } }}
    >
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
        sx={{
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          gap: 1,
          justifyContent: "center",
          width: "100%",
          paddingTop: 1,
        }}
        className="bread_head"
      >
        {icon ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              justifyContent: "center",
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{ height: "3.5rem" }}
            />
            <Typography
              component="div"
              className="custom-font other"
              sx={{
                fontWeight: "bold",
                fontSize: { xs: "1.5rem", md: "2rem" }, // h6 en xs, h3 en md
                textAlign: "center",
              }}
            >
              {titulo}
            </Typography>
          </Box>
        ) : (
          <>
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
          </>
        )}
      </Box>
    </Box>
  );
}
