import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import MainHeader from "../../../components/MainHeader";
import LoadingBackdrop from "../../../components/LoadingBackdrop";
import HeadingDescription from "../../../components/HeadingDescription";
import CustomTable from "../../../components/CustomTable";
import TableFilters from "../../../components/TableFilters";
import { useEntradasSalidas } from "../hooks/useEntradasSalidas";
import { entradasSalidasColumns, orderOptions } from "../config/tableColumns";
import AgregarEntradaModal from "../components/AgregarEntradaModal";

const links = [
  { nombre: "Inicio", ruta: "/admin", disabled: false },
  { nombre: "Entradas y salidas", ruta: "/admin/entradas-salidas", disabled: true },
];

export default function AdminGestionarEntradasSalidas() {
  const [showModalAgregarEntrada, setShowModalAgregarEntrada] = useState(false);

  const {
    entradasSalidas,
    tiposVehiculos,
    loading,
    error,
    page,
    rowsPerPage,
    totalElements,
    ordenarPor,
    ordenDireccion,
    buscarTexto,
    setPage,
    setRowsPerPage,
    setOrdenarPor,
    setOrdenDireccion,
    setBuscarTexto,
    cargarEntradasSalidasPaginado,
    cargarTiposVehiculos,
    agregarNuevaEntrada
  } = useEntradasSalidas();

  // Cargar datos al montar el componente o cambiar parámetros
  useEffect(() => {
    setTimeout(() => {
      cargarEntradasSalidasPaginado();
    }, 500);
  }, [page, rowsPerPage]);

  // Manejadores
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleBuscar = () => {
    setPage(0);
    setTimeout(() => {
      cargarEntradasSalidasPaginado();
    }, 500);
  };

  const handleLimpiarFiltros = () => {
    setBuscarTexto("");
    setOrdenarPor("fecha");
    setOrdenDireccion("desc");
    setPage(0);
  };

  const handleVerDetalle = (entradaSalida) => {
    console.log("Ver detalle:", entradaSalida);
    // TODO: Implementar modal de detalle
  };

  const handleEditar = (entradaSalida) => {
    console.log("Editar:", entradaSalida);
    // TODO: Implementar edición
  };

  const handleShowModalAgregarEntrada = () => {
    // Cargar tipos de vehículos antes de abrir el modal
    setTimeout(() => {
      cargarTiposVehiculos();
    }, 500);
    setShowModalAgregarEntrada(true);
  };

  const handleCloseModalAgregarEntrada = () => {
    setShowModalAgregarEntrada(false);
  };

  return (
    <>
      <LoadingBackdrop isOpen={loading} onClose={() => {}} />
      <MainHeader titulo="Entradas y salidas" breads={links} />
      
      <Box sx={{ padding: { xs: 2, sm: 3, md: 4 }, paddingTop: { xs: 3, sm: 4, md: 6 }, maxWidth: "1200px", margin: "0 auto" }}>
        {/* Título y descripción */}
        <HeadingDescription 
          title="ENTRADAS Y SALIDAS DE VISITANTES Y USUARIOS PENSIONADOS"
          description="Movimientos que registran el momento en que un vehículo ingresa al estacionamiento (entrada) y cuando se retira del mismo (salida).
          Incluyen control de tarifas y tiempo de servicio."
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
          <TableFilters
            orderOptions={orderOptions}
            orderBy={ordenarPor}
            orderDirection={ordenDireccion}
            searchText={buscarTexto}
            searchPlaceholder="Folio o nombre de usuario"
            onOrderByChange={setOrdenarPor}
            onOrderDirectionChange={setOrdenDireccion}
            onSearchChange={setBuscarTexto}
            onSearch={handleBuscar}
            onClearFilters={handleLimpiarFiltros}
          />

          {/* Botón agregar nueva */}
          <Button 
            color="primary"
            variant="contained"
            sx={{ minWidth: 150 }}
            onClick={handleShowModalAgregarEntrada}
          >
            + AGREGAR NUEVA
          </Button>
        </Box>

        {/* Tabla */}
        <CustomTable
          columns={entradasSalidasColumns({
            onView: handleVerDetalle,
            onEdit: handleEditar
          })}
          data={entradasSalidas}
          page={page}
          rowsPerPage={rowsPerPage}
          totalElements={totalElements}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          loading={loading}
          error={error}
          emptyMessage="No hay entradas y salidas disponibles"
        />
      </Box>

      {/* Modal de agregar entrada */}
      {showModalAgregarEntrada && (
        <AgregarEntradaModal
          showModal={showModalAgregarEntrada}
          tiposVehiculos={tiposVehiculos}
          onClose={handleCloseModalAgregarEntrada}
          onAgregar={agregarNuevaEntrada}
        />
      )}
    </>
  );
}
