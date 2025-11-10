import React from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { Button, Link, Typography } from "@mui/material";
import { useDarkContext } from "../context/DarkContext";

export default function LandingPage() {
  const { toggleDarkMode } = useDarkContext();
  return (
    <div style={{ 
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
      alignItems: "center"
    }}>
      LandingPage
      <br />

      <Link href="/admin">Ir al Menu admin</Link>
      <Link href="/empleado">Ir al Menu Empleado</Link>
      <Link href="/pensionados">Ir al Menu Pensionados</Link>

      <Stack spacing={1} sx={{ maxWidth: "500px" }}>
        {/* For variant="text", adjust the height via font-size */}
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
        {/* For other variants, adjust the size with `width` and `height` */}
        <Skeleton variant="circular" width={120} height={120} />
        <Skeleton variant="rectangular" width={500} height={60} />
        <Skeleton variant="rounded" width={500} height={60} />
      </Stack>
      <Button onClick={() => toggleDarkMode()}>Modo</Button>
      <Typography>Podemos usar esto para animaiones de carga</Typography>
      <Link href="https://mui.com/material-ui/react-skeleton/">
        Documentación: https://mui.com/material-ui/react-skeleton/
      </Link>

      
    </div>
  );
}
