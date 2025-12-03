import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
} from "@mui/material";
import { useTarifas } from "../hooks/useTarifas";

export default function VerTarifas() {

  const {
    tarifas,
    loading,
    error,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    totalElements,
    cargarTarifasPaginadoPublic,
  } = useTarifas();

  // Cargar tarifas al montar el componente o cambiar parámetros de paginación
  useEffect(() => {
    // Se le pone un pequeño delay para que no se haga tan rapido
    setTimeout(() => {
      cargarTarifasPaginadoPublic();
    }, 500); // Espera 500ms antes de hacer la petición
  }, [page, rowsPerPage]); // Solo recarga cuando cambia página o tamaño de página

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  return (
    <>

      <Box
        sx={{
          padding: { xs: 2, sm: 3, md: 4 },
          paddingTop: { xs: 3, sm: 4, md: 6 },
          width: "auto",
          margin: "0 auto",
        }}
      >
        {/* Tabla */}
        <TableContainer component={Paper} elevation={3}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "var(--other)"}}>
                <TableCell sx={{ fontWeight: "bold",  color: "white"  }}>
                  Tipo de vehículo
                </TableCell>
                <TableCell sx={{ fontWeight: "bold",  color: "white"  }}>Tiempo</TableCell>
                <TableCell sx={{ fontWeight: "bold",  color: "white"  }}>Costo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography>Cargando tarifas...</Typography>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography color="error">{error}</Typography>
                  </TableCell>
                </TableRow>
              ) : !tarifas || tarifas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography>No hay tarifas disponibles</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                tarifas.map((row, index) => (
                  <TableRow
                    key={row.id || index}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": { backgroundColor: "var(--surface)" },
                    }}
                  >
                    <TableCell>
                      {row.tipoVehiculo?.nombre || row.tipoVehiculo || "-"}
                    </TableCell>
                    <TableCell>
                      {row.tiempo ? `${row.tiempo} min` : "-"}
                    </TableCell>
                    <TableCell>${row.costo || "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Paginación */}
          <TablePagination
            component="div"
            count={totalElements}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Resultados por página:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
            }
          />
        </TableContainer>
      </Box>
    </>
  );
}
