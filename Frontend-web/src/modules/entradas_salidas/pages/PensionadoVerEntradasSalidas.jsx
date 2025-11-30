import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import MainHeader from "../../../components/MainHeader";
import LoadingBackdrop from "../../../components/LoadingBackdrop";
import HeadingDescription from "../../../components/HeadingDescription";
import CustomTable from "../../../components/CustomTable";
import TableFilters from "../../../components/TableFilters";
import { useEntradasSalidasPensionado } from "../hooks/useEntradasSalidasPensionado";
import { entradasSalidasPensionadoColumns, orderOptions } from "../config/tableColumns";
import VerDetalleEntradaSalidaModal from "../components/VerDetalleEntradaSalidaModal";

const links = [
  { nombre: "Inicio", ruta: "/pensionados", disabled: false },
  { nombre: "Historial de marcajes", ruta: "/pensionados/historial", disabled: true },
];

export default function PensionadoVerEntradasSalidas() {
  const [showModalVerDetalle, setShowModalVerDetalle] = useState(false);
  const [entradaSeleccionada, setEntradaSeleccionada] = useState(null);

  const {
    entradasSalidas,
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
    cargarEntradasSalidasPaginado
  } = useEntradasSalidasPensionado();

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

  const handleVerDetalle = (entrada) => {
    setEntradaSeleccionada(entrada);
    setShowModalVerDetalle(true);
  };

  return (
    <>
      <LoadingBackdrop isOpen={loading} onClose={() => {}} />
      <MainHeader titulo="Historial de marcajes" breads={links} />
      
      <Box sx={{ padding: { xs: 2, sm: 3, md: 4 }, paddingTop: { xs: 3, sm: 4, md: 6 }, maxWidth: "1200px", margin: "0 auto" }}>
        {/* Título y descripción */}
        <HeadingDescription 
          title="HISTORIAL DE ENTRADAS Y SALIDAS"
          description="Visualiza el historial completo de tus entradas y salidas del estacionamiento. Aquí puedes consultar las fechas, horas y detalles de cada marcaje."
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
            searchPlaceholder="Buscar por folio"
            onOrderByChange={setOrdenarPor}
            onOrderDirectionChange={setOrdenDireccion}
            onSearchChange={setBuscarTexto}
            onSearch={handleBuscar}
            onClearFilters={handleLimpiarFiltros}
          />
        </Box>

        {/* Tabla */}
        <CustomTable
          columns={entradasSalidasPensionadoColumns({
            onView: handleVerDetalle
          })}
          data={entradasSalidas}
          page={page}
          rowsPerPage={rowsPerPage}
          totalElements={totalElements}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          loading={loading}
          error={error}
          emptyMessage="No hay entradas y salidas registradas"
        />
      </Box>

      {/* Modal de ver detalle */}
      {showModalVerDetalle && (
        <VerDetalleEntradaSalidaModal
          open={showModalVerDetalle}
          onClose={() => {
            setShowModalVerDetalle(false);
            setEntradaSeleccionada(null);
          }}
          entrada={entradaSeleccionada}
        />
      )}
    </>
  );
}
