/**
 * HeadingDescription - Componente de encabezado con título y descripción opcional
 * 
 * @description
 * Componente que muestra un título principal y una descripción opcional.
 * Útil para secciones de contenido que necesitan un encabezado descriptivo.
 * El texto está alineado a la izquierda y usa los colores del tema.
 * 
 * @example
 * // Uso básico con título y descripción
 * <HeadingDescription 
 *   title="ENTRADAS Y SALIDAS DE VISITANTES Y USUARIOS PENSIONADOS"
 *   description="Movimientos que registran el momento en que un vehículo ingresa al estacionamiento (entrada) y cuando se retira del mismo (salida). Incluyen control de tarifas y tiempo de servicio."
 * />
 * 
 * @example
 * // Solo con título (sin descripción)
 * <HeadingDescription 
 *   title="Gestión de Cajones"
 * />
 * 
 * @param {string} [title="titulo"] - Título principal a mostrar en el encabezado
 * @param {string} [description] - Descripción opcional a mostrar debajo del título
 */

import { Box, Breadcrumbs, Typography, Link } from "@mui/material";
import React from "react";

export default function HeadingDescription({ title = "titulo", description }) {


    return (
        <>
            {/* Título y descripción */}
            <Typography
                variant="h5"
                sx={{
                    fontWeight: "bold",
                    color: "var(--primary)",
                    mb: 1,
                    textAlign: "left"
                }}
                className="custom-font"
            >
                {title}
            </Typography>

            {description && (
                <Typography
                    variant="body2"
                    sx={{
                        color: "var(--gray)",
                        mb: 3,
                        textAlign: "left"
                    }}
                >
                    {description}
                </Typography>
            )}
        </>
    );
}
