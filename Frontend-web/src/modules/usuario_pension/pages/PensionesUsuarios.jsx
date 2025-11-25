import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import MainHeader from "../../../components/MainHeader";
import LoadingBackdrop from "../../../components/LoadingBackdrop";
import HeadingDescription from "../../../components/HeadingDescription";
import CustomTable from "../../../components/CustomTable";
import TableFilters from "../../../components/TableFilters";
import HistorialPagosModal from "../components/HistorialPagosModal";
import RenovarPensionModal from "../components/RenovarPensionModal";
import { usuarioPensionColumns, orderOptions } from "../config/tableColumns";
import useUsuariosPension from "../hooks/useUsuariosPension";

export default function PensionesUsuarios() {
  const location = useLocation();
  const isEmpleado = location.pathname.includes("/empleado");

  const {
    usuarios,
    loading,
    error,
    page,
    rowsPerPage,
    totalElements,
    ordenarPor,
    ordenDireccion,
    buscarTexto,
    historialModalOpen,
    renovarModalOpen,
    usuarioSeleccionado,
    setPage,
    setRowsPerPage,
    setOrdenarPor,
    setOrdenDireccion,
    setBuscarTexto,
    setLoading,
    cargarUsuariosPensionadosPaginados,
    handleVerHistorial,
    handleAbrirRenovar,
    handleCerrarHistorial,
    handleCerrarRenovar,
    renovarPensionUsuario,
  } = useUsuariosPension();

  // Cargar datos al montar el componente o cambiar parámetros
  useEffect(() => {
    setTimeout(() => {
      cargarUsuariosPensionadosPaginados();
    }, 500);
  }, [page, rowsPerPage, ordenarPor, ordenDireccion]);

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
      cargarUsuariosPensionadosPaginados();
    }, 500);
  };

  const handleLimpiarFiltros = () => {
    setBuscarTexto("");
    setOrdenarPor("id");
    setOrdenDireccion("desc");
    setPage(0);
  };

  const links = isEmpleado ? [
    { 
      nombre: "Pensiones de usuarios", 
      ruta: "/empleado/pensiones", 
      disabled: true
    },
  ] : [
    { 
      nombre: "Tipos de pensión", 
      ruta: "/admin/tipos_de_pension", 
      disabled: false
    },
    { 
      nombre: "Pensiones de usuarios", 
      ruta: "/admin/pensiones_de_usuarios", 
      disabled: true
    },
  ];

  const getEmptyMessage = () => {
    if (buscarTexto.trim() !== "" || ordenarPor !== "id" || ordenDireccion !== "desc") {
      return "No se encontraron usuarios que coincidan con los criterios de búsqueda";
    }
    return "No hay usuarios pensionados registrados";
  };

  return (
    <>
      <LoadingBackdrop isOpen={loading} onClose={() => {}} />
      <MainHeader titulo="PENSIONES DE USUARIOS" breads={links} />

      <Box sx={{ padding: { xs: 2, sm: 3, md: 4 }, paddingTop: { xs: 3, sm: 4, md: 6 }, maxWidth: "1200px", margin: "0 auto" }}>
        <HeadingDescription
          title="GESTIÓN DE PENSIONES DE USUARIOS"
          description="Gestión de pensiones de usuarios con registro de pagos y renovaciones."
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
            searchPlaceholder={"Buscar por correo o nombre de pensión..."}
            searchText={buscarTexto}
            onOrderByChange={setOrdenarPor}
            onOrderDirectionChange={setOrdenDireccion}
            onSearchChange={setBuscarTexto}
            onSearch={handleBuscar}
            onClearFilters={handleLimpiarFiltros}
          />
        </Box>

        {/* Tabla */}
        <CustomTable
          columns={usuarioPensionColumns({
            onVerHistorial: handleVerHistorial,
            onAbrirRenovar: handleAbrirRenovar,
            setLoading: setLoading
          })}
          data={usuarios}
          page={page}
          rowsPerPage={rowsPerPage}
          totalElements={totalElements}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          loading={loading}
          error={error}
          emptyMessage={getEmptyMessage()}
        />
      </Box>

      {/* Modal de historial de pagos */}
      <HistorialPagosModal
        open={historialModalOpen}
        onClose={handleCerrarHistorial}
        usuario={usuarioSeleccionado}
      />

      {/* Modal de renovar pensión */}
      <RenovarPensionModal
        open={renovarModalOpen}
        onClose={handleCerrarRenovar}
        usuario={usuarioSeleccionado}
        onRenovar={renovarPensionUsuario}
        setLoading={setLoading}
      />
    </>
  );
}
