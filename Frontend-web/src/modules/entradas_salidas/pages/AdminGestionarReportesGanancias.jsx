import React, { useEffect, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import MainHeader from "../../../components/MainHeader";
import LoadingBackdrop from "../../../components/LoadingBackdrop";
import HeadingDescription from "../../../components/HeadingDescription";
import CustomTable from "../../../components/CustomTable";
import ReporteFilters from "../components/ReporteFilters";
import { useReportesGanancias } from "../hooks/useReportesGanancias";
import { reporteGananciasColumns, reporteGananciasOrderOptions } from "../config/tableColumns";
import VerDetalleGananciaModal from "../components/VerDetalleGananciaModal";
import VerReportePersonalizadoModal from "../components/VerReportePersonalizadoModal";
import sweetAlert from "../../../utils/sweetAlert";

const links = [
  { nombre: "Inicio", ruta: "/admin", disabled: false },
  { nombre: "Entradas y salidas", ruta: "/admin/entradas-salidas", disabled: false },
  { nombre: "Reportes", ruta: "/admin/entradas-salidas/reportes", disabled: true },
];

export default function AdminGestionarReportesGanancias() {
  const [showModalVerDetalle, setShowModalVerDetalle] = useState(false);
  const [showModalReportePersonalizado, setShowModalReportePersonalizado] = useState(false);
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const [reportePersonalizado, setReportePersonalizado] = useState(null);
  
  // Estados para reporte personalizado
  const [fechaInicialPersonalizado, setFechaInicialPersonalizado] = useState("");
  const [fechaFinalPersonalizado, setFechaFinalPersonalizado] = useState("");

  const {
    reportes,
    loading,
    error,
    page,
    rowsPerPage,
    totalElements,
    fechaInicial,
    fechaFinal,
    ordenDireccion,
    setPage,
    setRowsPerPage,
    setFechaInicial,
    setFechaFinal,
    setOrdenDireccion,
    cargarReportesGananciasPaginado,
    consultarReporteTotales,
  } = useReportesGanancias();

  // Cargar reportes solo al cambiar la página
  useEffect(() => {
    setTimeout(() => {
      cargarReportesGananciasPaginado();
    }, 500);
  }, [page, rowsPerPage]);

  const handleVerDetalle = (reporte) => {
    setReporteSeleccionado(reporte);
    setShowModalVerDetalle(true);
  };

  const handleBuscarPersonalizado = async () => {
    const resultado = await consultarReporteTotales(fechaInicialPersonalizado, fechaFinalPersonalizado);
    
    if (resultado.success) {
      setReportePersonalizado(resultado.datos);
      setShowModalReportePersonalizado(true);
    } else {
      await sweetAlert({
        title: "Error",
        text: resultado.error || "No se pudieron consultar los datos del reporte",
        icon: "error",
      });
    }
  };

  const handleLimpiarFiltrosPersonalizado = () => {
    setFechaInicialPersonalizado("");
    setFechaFinalPersonalizado("");
  };

  const handleBuscar = () => {
    setPage(0); // Resetear a la primera página
    setTimeout(() => {
      cargarReportesGananciasPaginado();
    }, 500);
  };

  const handleLimpiarFiltros = () => {
    setFechaInicial("");
    setFechaFinal("");
    setOrdenDireccion("desc");
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <LoadingBackdrop isOpen={loading} onClose={() => {}} />
      <MainHeader titulo="Reporte de ganancias" breads={links} />
      
      <Box sx={{ padding: { xs: 2, sm: 3, md: 4 }, paddingTop: { xs: 3, sm: 4, md: 6 }, maxWidth: "1200px", margin: "0 auto" }}>
        {/* Título y descripción de generar reporte personalizado */}
        <HeadingDescription 
          title="GENERAR REPORTE PERSONALIZADO"
          description="Genera un reporte personalizado en un rango de fechas determinado."
        />

        {/* Filtros de fecha para reporte personalizado */}
        <Box 
          sx={{ 
            display: "flex", 
            gap: 2, 
            mb: 4,
            flexWrap: "wrap",
            alignItems: "center"
          }}
        >
          <TextField
            label="Fecha inicial"
            type="date"
            size="small"
            value={fechaInicialPersonalizado}
            onChange={(e) => setFechaInicialPersonalizado(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 200 }}
          />
          <TextField
            label="Fecha final"
            type="date"
            size="small"
            value={fechaFinalPersonalizado}
            onChange={(e) => setFechaFinalPersonalizado(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 200 }}
          />
          <Button
            variant="outlined"
            onClick={handleBuscarPersonalizado}
            sx={{
              borderColor: "var(--primary)",
              color: "var(--primary)",
              "&:hover": {
                borderColor: "var(--primary-dark)",
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            BUSCAR
          </Button>
          <Button
            variant="outlined"
            onClick={handleLimpiarFiltrosPersonalizado}
            sx={{
              borderColor: "var(--primary)",
              color: "var(--primary)",
              "&:hover": {
                borderColor: "var(--primary-dark)",
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            LIMPIAR FILTROS
          </Button>
        </Box>

        {/* Título y descripción de ganancias por hora */}
        <HeadingDescription 
          title="GANANCIAS POR HORA"
          description="Cantidad de dinero por determinada hora del día, generada en base a la compra de pensiones y la entrada de visitantes al estacionamiento."
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
          <ReporteFilters
            orderOptions={reporteGananciasOrderOptions}
            orderBy={ordenDireccion}
            fechaInicial={fechaInicial}
            fechaFinal={fechaFinal}
            onOrderByChange={setOrdenDireccion}
            onFechaInicialChange={setFechaInicial}
            onFechaFinalChange={setFechaFinal}
            onSearch={handleBuscar}
            onClearFilters={handleLimpiarFiltros}
          />
        </Box>

        {/* Tabla de reportes */}
        <CustomTable
          columns={reporteGananciasColumns({ onView: handleVerDetalle })}
          data={reportes}
          page={page}
          rowsPerPage={rowsPerPage}
          totalElements={totalElements}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          loading={loading}
          error={error}
          emptyMessage="No hay reportes de ganancias disponibles"
        />
      </Box>

      {/* Modal de ver detalle */}
      {showModalVerDetalle && (
        <VerDetalleGananciaModal
          open={showModalVerDetalle}
          onClose={() => {
            setShowModalVerDetalle(false);
            setReporteSeleccionado(null);
          }}
          reporte={reporteSeleccionado}
        />
      )}

      {/* Modal de reporte personalizado */}
      {showModalReportePersonalizado && (
        <VerReportePersonalizadoModal
          open={showModalReportePersonalizado}
          onClose={() => {
            setShowModalReportePersonalizado(false);
            setReportePersonalizado(null);
          }}
          reporte={reportePersonalizado}
        />
      )}
    </>
  );
}
