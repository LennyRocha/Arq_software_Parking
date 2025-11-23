import React, { useEffect } from "react";
import { Box, Button } from "@mui/material";
import MainHeader from "../../../components/MainHeader";
import LoadingBackdrop from "../../../components/LoadingBackdrop";
import HeadingDescription from "../../../components/HeadingDescription";
import CustomTable from "../../../components/CustomTable";
import TableFilters from "../../../components/TableFilters";
import useDialogController from "../../../hooks/useDialogController";
import useTiposPension from "../hooks/useTiposPension";
import TipoPensionFormModal from "../components/TipoPensionFormModal";
import { tipoPensionColumns, orderOptions } from "../config/tableColumns.jsx";

const links = [
  { nombre: "Pensiones", ruta: "/admin/tipos_de_pension", disabled: false },
  {
    nombre: "Tipos de pensión",
    ruta: "/admin/tipos_de_pension",
    disabled: true,
  },
];

export default function GestionTiposPension() {
  const { open, openDialog, closeDialog } = useDialogController();
  const [tipoPensionSeleccionado, setTipoPensionSeleccionado] = React.useState(null);

  const {
    tiposPension,
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
    setLoading,
    cargarTiposPensionPaginados,
    crearTipoPension,
    actualizarTipoPension,
    actualizarEstadoTipoPension
  } = useTiposPension();

  // Cargar datos al montar el componente o cambiar parámetros
  useEffect(() => {
    setTimeout(() => {
      cargarTiposPensionPaginados();
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
      cargarTiposPensionPaginados();
    }, 500);
  };

  const handleLimpiarFiltros = () => {
    setBuscarTexto("");
    setOrdenarPor("id");
    setOrdenDireccion("desc");
    setPage(0);
  };

  const handleAbrirModal = (tipoPension = null) => {
    setTipoPensionSeleccionado(tipoPension);
    openDialog();
  };

  // Función para determinar el mensaje vacío
  const getEmptyMessage = () => {
    if (buscarTexto.trim() !== "" || ordenarPor !== "id" || ordenDireccion !== "desc") {
      return "No se encontraron pensiones que coincidan con los criterios de búsqueda";
    }
    return "No hay tipos de pensión registrados";
  };

  return (
    <>
      <LoadingBackdrop isOpen={loading} onClose={() => {}} />
      <MainHeader titulo="TIPOS DE PENSIÓN" breads={links} />

      <Box sx={{ padding: { xs: 2, sm: 3, md: 4 }, paddingTop: { xs: 3, sm: 4, md: 6 }, maxWidth: "1200px", margin: "0 auto" }}>
        <HeadingDescription
          title="GESTIÓN DE TIPOS DE PENSIÓN"
          description="Los tipos de pensión son las opciones de contratación que aparecen para convertirse en usuario pensionado."
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
            searchPlaceholder={"Nombre, duración o costo"}
            searchText={buscarTexto}
            onOrderByChange={setOrdenarPor}
            onOrderDirectionChange={setOrdenDireccion}
            onSearchChange={setBuscarTexto}
            onSearch={handleBuscar}
            onClearFilters={handleLimpiarFiltros}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={() => handleAbrirModal()}
            sx={{ minWidth: 150 }}
          >
            + AGREGAR NUEVO
          </Button>
        </Box>

        {/* Tabla */}
        <CustomTable
          columns={tipoPensionColumns({
            onEdit: handleAbrirModal,
            onChangeStatus: actualizarEstadoTipoPension,
            setLoading: setLoading
          })}
          data={tiposPension}
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

      {/* Modal para crear/editar */}
      <TipoPensionFormModal
        isOpen={open}
        onClose={closeDialog}
        tipoPension={tipoPensionSeleccionado}
        setLoading={setLoading}
        onSubmit={async (values) => {
          const esEdicion = !!tipoPensionSeleccionado;
          const resultado = esEdicion
            ? await actualizarTipoPension(tipoPensionSeleccionado.id, values)
            : await crearTipoPension(values);

          if (resultado.success) {
            cargarTiposPensionPaginados();
          }
          return resultado;
        }}
      />
    </>
  );
}
