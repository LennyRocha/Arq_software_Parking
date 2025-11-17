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
import EditarEntradaSalidaModal from "../components/EditarEntradaSalidaModal";
import ConfirmarSalidaModal from "../components/ConfirmarSalidaModal";
import VerDetalleEntradaSalidaModal from "../components/VerDetalleEntradaSalidaModal";
import sweetAlert from "../../../utils/sweetAlert";

const links = [
  { nombre: "Inicio", ruta: "/admin", disabled: false },
  { nombre: "Entradas y salidas", ruta: "/admin/entradas-salidas", disabled: true },
];

export default function AdminGestionarEntradasSalidas() {
  const [showModalAgregarEntrada, setShowModalAgregarEntrada] = useState(false);
  const [showModalEditarEntrada, setShowModalEditarEntrada] = useState(false);
  const [showModalConfirmarSalida, setShowModalConfirmarSalida] = useState(false);
  const [showModalVerDetalle, setShowModalVerDetalle] = useState(false);
  const [entradaSeleccionada, setEntradaSeleccionada] = useState(null);
  const [datosSalida, setDatosSalida] = useState(null);

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
    agregarNuevaEntrada,
    actualizarEntradaSalida,
    consultarDatosSalida,
    marcarSalida
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

  const handleVerDetalle = (entrada) => {
    setEntradaSeleccionada(entrada);
    setShowModalVerDetalle(true);
  };

  const handleEditar = (entrada) => {
    setEntradaSeleccionada(entrada);
    // Cargar tipos de vehículos antes de abrir el modal
    setTimeout(() => {
      cargarTiposVehiculos();
    }, 500);
    setShowModalEditarEntrada(true);
  };

  const handleActualizarEntrada = async (id, datosActualizados) => {
    const resultado = await actualizarEntradaSalida(id, datosActualizados);
    
    if (resultado.success) {
      await sweetAlert({
        title: "Actualización exitosa",
        text: "La entrada/salida ha sido actualizada correctamente",
        icon: "success",
      });
      setShowModalEditarEntrada(false);
      setEntradaSeleccionada(null);
    } else {
      await sweetAlert({
        title: "Error",
        text: resultado.error || "No se pudo actualizar la entrada",
        icon: "error",
      });
    }
  };

  const handleMarcarSalida = async (entrada) => {
    // Consultar datos de salida
    const resultado = await consultarDatosSalida(entrada.folioTicket);
    
    if (resultado.success) {
      setDatosSalida(resultado.datos);
      setShowModalConfirmarSalida(true);
    } else {
      await sweetAlert({
        title: "Error",
        text: resultado.error || "No se pudieron consultar los datos de salida",
        icon: "error",
        zIndex: 1400,
      });
    }
  };

  const handleConfirmarSalida = async (folioTicket) => {
    const resultado = await marcarSalida(folioTicket);
    
    if (resultado.success) {
      await sweetAlert({
        title: "Salida registrada",
        text: "La salida ha sido marcada exitosamente",
        icon: "success",
      });
      setShowModalConfirmarSalida(false);
      setDatosSalida(null);
      setEntradaSeleccionada(null);
    } else {
      await sweetAlert({
        title: "Error",
        text: resultado.error || "No se pudo marcar la salida",
        icon: "error",
      });
    }
  };

  const handleCloseModalEditarEntrada = () => {
    setShowModalEditarEntrada(false);
    setEntradaSeleccionada(null);
  };

  const handleCloseModalConfirmarSalida = () => {
    setShowModalConfirmarSalida(false);
    setDatosSalida(null);
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

      {/* Modal de editar entrada */}
      {showModalEditarEntrada && (
        <EditarEntradaSalidaModal
          open={showModalEditarEntrada}
          onClose={handleCloseModalEditarEntrada}
          entrada={entradaSeleccionada}
          tiposVehiculos={tiposVehiculos}
          onActualizar={handleActualizarEntrada}
          onMarcarSalida={handleMarcarSalida}
        />
      )}

      {/* Modal de confirmar salida */}
      {showModalConfirmarSalida && (
        <ConfirmarSalidaModal
          open={showModalConfirmarSalida}
          onClose={handleCloseModalConfirmarSalida}
          datosSalida={datosSalida}
          onConfirmar={handleConfirmarSalida}
        />
      )}

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
