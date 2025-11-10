import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TablePagination,
  OutlinedInput,
  Switch
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import MainHeader from "../../../components/MainHeader";
import LoadingBackdrop from "../../../components/LoadingBackdrop";
import HeadingDescription from "../../../components/HeadingDescription";
import sweetAlert from "../../../utils/sweetAlert";
import { useTarifas } from "./../hooks/useTarifas";
import AgregarTarifaModal from "../components/AgregarTarifaModal";

const links = [
  { nombre: "Inicio", ruta: "/admin", disabled: false },
  { nombre: "Tarifas", ruta: "/tarifas", disabled: true },
];

export default function AdminGestionTarifas() {
  // Estados para el modal
  const [showModalAgregarTarifa, setShowModalAgregarTarifa] = useState(false);

  const {
    tarifas, setTarifas,
    tiposVehiculos, setTiposVehiculos,
    loading, setLoading,
    error, setError,
    retry, setRetry,
    vacio, setVacio,
    page, setPage,
    rowsPerPage, setRowsPerPage,
    totalElements, setTotalElements,
    ordenarPor, setOrdenarPor,
    ordenDireccion, setOrdenDireccion,
    buscarTexto, setBuscarTexto,
    cargarTarifas, cargarTarifasPaginado, actualizarEstadoTarifa,
    cargarTiposVehiculos
  } = useTarifas();


  // Cargar tarifas al montar el componente o cambiar parámetros de paginación
  useEffect(() => {
    // Se le pone un pequeño delay para que no se haga tan rapido
    setTimeout(() => {
      cargarTarifasPaginado();
    }, 500); // Espera 500ms antes de hacer la petición
  }, [page, rowsPerPage]); // Solo recarga cuando cambia página o tamaño de página

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleBuscar = () => {
    setPage(0);
    // Se le pone un pequeño delay para que no se haga tan rapido
    setTimeout(() => {
      cargarTarifasPaginado();
    }, 500); // Espera 500ms antes de hacer la petición
  };

  const handleLimpiarFiltros = () => {
    setBuscarTexto("");
    setOrdenarPor("tipoVehiculo");
    setOrdenDireccion("asc");
    setPage(0);
  };

  const handleOrdenarChange = (e) => {
    const value = e.target.value;
    setOrdenarPor(value);
    // No resetea página ni hace búsqueda automática
  };

  const handleCloseModalAgregarTarifa = () => {
    setShowModalAgregarTarifa(false);
  };

  const handleShowModalAgregarTarifa = () => {
    // Se le pone un pequeño delay para que no se haga tan rapido
    setTimeout(() => {
      cargarTiposVehiculos();
    }, 500); // Espera 500ms antes de hacer la petición
    setShowModalAgregarTarifa(true);
  };

  const handleChangeEstatus = (idTarifa, estatus) => {
    sweetAlert({
      title: `${estatus ? "Desactivar" : "Activar"} tarifa`,
      text: `¿Está seguro que desea ${estatus ? "desactivar" : "activar"} esta tarifa?`,
      icon: "warning",
      denyText: "Cancelar",
      showDenyButton: true,
      showCloseButton: true,
      reverseButtons: true,
    })
      .then(async (result) => {
        // result.isConfirmed = true si hizo clic en confirmar
        if (result.isConfirmed) {
          // Ejecutar la función de actualización
          const resultado = await actualizarEstadoTarifa(idTarifa);

          if (resultado.success) {
            // Mostrar mensaje de éxito
            sweetAlert({
              title: "¡Éxito!",
              text: `La tarifa se ha ${estatus ? "desactivado" : "activado"} correctamente`,
              icon: "success",
              confirmText: "Aceptar",
            });
          } else {
            // Mostrar mensaje de error
            sweetAlert({
              title: "Error",
              text: resultado.error || "No se pudo actualizar el estado de la tarifa",
              icon: "error"
            });
          }
        }
      });
  }

  return (
    <>
      <LoadingBackdrop isOpen={loading} onClose={() => { }} />
      <MainHeader titulo="Tarifas" breads={links} />

      <Box sx={{ padding: { xs: 2, sm: 3, md: 4 }, paddingTop: { xs: 3, sm: 4, md: 6 }, maxWidth: "1200px", margin: "0 auto" }}>

        {/* Título y descripción */}
        <HeadingDescription
          title="TARIFAS DE VISITANTES"
          description="Costos establecidos que deben pagar las clientes que utilizan
           temporalmente el estacionamiento, determinados según el tiempo de estancia y el tipo de vehículo."
        />

        {/* Controles de búsqueda y filtros */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 3,
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", flex: 1 }}>
            {/* Ordenar por */}
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Ordenar por</InputLabel>
              <Select
                value={ordenarPor}
                label="Ordenar por"
                onChange={handleOrdenarChange}
              >
                <MenuItem value="tipoVehiculo">Tipo de vehículo</MenuItem>
                <MenuItem value="tiempo">Tiempo</MenuItem>
                <MenuItem value="costo">Costo</MenuItem>
              </Select>
            </FormControl>

            {/* Dirección de orden */}
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Dirección</InputLabel>
              <Select
                value={ordenDireccion}
                label="Dirección"
                onChange={(e) => {
                  setOrdenDireccion(e.target.value);
                  // No resetea página ni hace búsqueda automática
                }}
              >
                <MenuItem value="asc">Ascendente</MenuItem>
                <MenuItem value="desc">Descendente</MenuItem>
              </Select>
            </FormControl>

            {/* Campo de texto para buscar */}
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Buscar por</InputLabel>
              <OutlinedInput
                label="Buscar por"
                placeholder={"Tiempo, costo"}
                value={buscarTexto}
                onChange={(e) => setBuscarTexto(e.target.value)}
                type="number"
              />
            </FormControl>

            {/* Botones de acción */}
            <Button variant="outlined" color="primary" onClick={handleBuscar}>
              BUSCAR
            </Button>
            <Button variant="outlined" color="primary" onClick={handleLimpiarFiltros}>
              LIMPIAR FILTROS
            </Button>
          </Box>

          {/* Botón agregar nueva */}
          <Button
            color="primary"
            variant="contained"
            sx={{ minWidth: 150 }}
            onClick={handleShowModalAgregarTarifa}
          >
            + AGREGAR NUEVA
          </Button>
        </Box>

        {/* Tabla */}
        <TableContainer component={Paper} elevation={3}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "var(--background)" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Tipo de vehículo</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Tiempo</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Costo</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">Opciones</TableCell>
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
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': { backgroundColor: 'var(--background)' }
                    }}
                  >
                    <TableCell>{row.tipoVehiculo?.nombre || row.tipoVehiculo || '-'}</TableCell>
                    <TableCell>{row.tiempo ? `${row.tiempo} min` : '-'}</TableCell>
                    <TableCell>${row.costo || '-'}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="secondary"
                        size="small"
                        aria-label="editar"
                      >
                        <EditIcon />
                      </IconButton>
                      <Switch
                        onClick={() => handleChangeEstatus(row.id, row.estatus)}
                        checked={row.estatus || false}
                        color="primary"
                        sx={{ ml: 1 }}
                      />
                    </TableCell>
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

      {/* Modal de agregar una tarifa */}
      {showModalAgregarTarifa && (
        <AgregarTarifaModal
          showModal={showModalAgregarTarifa}
          tiposVehiculos={tiposVehiculos}
          onClose={handleCloseModalAgregarTarifa}
        />
      )}
    </>
  );
}
