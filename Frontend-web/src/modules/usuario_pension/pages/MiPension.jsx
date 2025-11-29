import { Box, Card, CardContent, Typography, Grid, Chip, Button, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { AutorenewRounded as AutorenewIcon, CalendarToday, CreditCard, EventAvailable } from "@mui/icons-material";
import MainHeader from "../../../components/MainHeader";
import LoadingBackdrop from "../../../components/LoadingBackdrop";
import HeadingDescription from "../../../components/HeadingDescription";
import CustomTable from "../../../components/CustomTable";
import TableFilters from "../../../components/TableFilters";
import { historialPagosColumns, historialOrderOptions } from "../config/tableColumns";
import useMiPension from "../hooks/useMiPension";
import RenovarMiPensionModal from "../components/RenovarMiPensionModal";

export default function MiPension() {
  const [loading, setLoading] = useState(false);

  const {
    pension,
    loadingPension,
    errorPension,
    cargarMiPension,
    historial,
    loadingHistorial,
    errorHistorial,
    cargarMiHistorial,
    page,
    rowsPerPage,
    totalElements,
    ordenarPor,
    ordenDireccion,
    buscarTexto,
    setOrdenarPor,
    setOrdenDireccion,
    setBuscarTexto,
    handleChangePage,
    handleChangeRowsPerPage,
    renovarModalOpen,
    handleAbrirRenovar,
    handleCerrarRenovar,
    iniciarPagoRenovacion,
    confirmarRenovacion,
  } = useMiPension();

  useEffect(() => {
    cargarMiPension();
  }, [cargarMiPension]);

  useEffect(() => {
    if (pension && !errorPension) {
      cargarMiHistorial();
    }
  }, [pension, errorPension, page, rowsPerPage, ordenarPor, ordenDireccion, buscarTexto, cargarMiHistorial]);

  const links = [
    { 
      nombre: "Mi pensión de usuario", 
      ruta: "/cliente/mi-pension", 
      disabled: true
    },
  ];

  const formatFecha = (fecha) => {
    if (!fecha) return "N/A";
    const date = new Date(fecha + 'T00:00:00');
    return date.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getEstadoPension = () => {
    if (!pension?.fechaFinalizacion) return { label: "Desconocido", color: "default" };
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaFin = new Date(pension.fechaFinalizacion + 'T00:00:00');
    fechaFin.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((fechaFin - hoy) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: "Vencida", color: "error" };
    } else if (diffDays === 0) {
      return { label: "Vence hoy", color: "warning" };
    } else if (diffDays <= 7) {
      return { label: `Vence en ${diffDays} día${diffDays > 1 ? 's' : ''}`, color: "warning" };
    } else {
      return { label: "Activa", color: "success" };
    }
  };

  const handleLimpiarFiltros = () => {
    setOrdenarPor("fechaPago");
    setOrdenDireccion("desc");
    setBuscarTexto("");
  };

  const handleSearch = () => {
    // La búsqueda se ejecuta automáticamente por el useEffect
  };

  return (
    <>
      <LoadingBackdrop open={loading || loadingPension} onClose={() => {}} />
      <MainHeader titulo="MI PENSIÓN" breads={links} />

      <Box sx={{ padding: { xs: 2, sm: 3, md: 4 }, paddingTop: { xs: 3, sm: 4, md: 6 }, maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Sección de información de pensión */}
        <HeadingDescription
          title="PENSIÓN ACTUAL"
        />

        {errorPension ? (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography color="error">{errorPension}</Typography>
            </CardContent>
          </Card>
        ) : pension ? (
          <Card sx={{ mb: 4, boxShadow: 3 }}>
            <CardContent sx={{ p: 3 }}>
              {/* Header con estado y botón renovar */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      {pension.correo}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {pension.nombrePension}
                      </Typography>
                      <Chip 
                        label={getEstadoPension().label} 
                        color={getEstadoPension().color}
                        size="small"
                      />
                    </Box>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<AutorenewIcon />}
                  onClick={handleAbrirRenovar}
                  size="large"
                  sx={{ fontWeight: "bold" }}
                >
                  Renovar
                </Button>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Información de la pensión */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <CreditCard color="primary" />
                    <Typography variant="subtitle2" color="text.secondary">
                      Costo último pago
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    ${pension.costoUltimoPago ? parseFloat(pension.costoUltimoPago).toFixed(2) : "N/A"} MXN
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <EventAvailable color="primary" />
                    <Typography variant="subtitle2" color="text.secondary">
                      Fecha finalización
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {formatFecha(pension.fechaFinalizacion)}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <AutorenewIcon color="primary" />
                    <Typography variant="subtitle2" color="text.secondary">
                      Próxima renovación comenzaría en:
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {formatFecha(pension.fechaInicioProximaRenovacion)}
                  </Typography>
                </Grid>
              </Grid>

              {/* Nota informativa */}
              <Box sx={{ mt: 3, p: 2, bgcolor: "rgba(var(--primary-rgb), 0.1)", borderRadius: 1, border: "1px solid var(--primary)" }}>
                <Typography variant="body2" color="text.secondary">
                   <strong>Nota:</strong> La fecha de inicio de la próxima renovación se calcula automáticamente. 
                  Si renuevas antes de que termine tu pensión actual, la nueva comenzará el día siguiente a la fecha de finalización actual.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ) : null}

        {/* Sección de historial de pagos */}
        <HeadingDescription
          title="HISTORIAL DE PAGOS"
          description="Recuerda que los pagos se pueden hacer por adelantado, por lo que la fecha de realización de pago puede ser anterior a la fecha de inicio del período de la pensión."
        />

        {/* Filtros */}
        <Box sx={{ mb: 3 }}>
          <TableFilters
            orderOptions={historialOrderOptions}
            orderBy={ordenarPor}
            orderDirection={ordenDireccion}
            searchPlaceholder="Costo,fecha(pago,inicio,fin)"
            searchText={buscarTexto}
            onOrderByChange={setOrdenarPor}
            onOrderDirectionChange={setOrdenDireccion}
            onSearchChange={(e) => setBuscarTexto(e.target.value)}
            onSearch={handleSearch}
            onClearFilters={handleLimpiarFiltros}
          />
        </Box>

        {/* Tabla de historial */}
        {(errorHistorial || errorPension) ? (
          <Card>
            <CardContent>
              <Typography color="error">{errorHistorial || errorPension}</Typography>
            </CardContent>
          </Card>
        ) : (
          <CustomTable
            columns={historialPagosColumns}
            data={historial}
            loading={loadingHistorial}
            page={page}
            rowsPerPage={rowsPerPage}
            totalElements={totalElements}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            emptyMessage="Sin pagos realizados"
          />
        )}
      </Box>

      {/* Modal de renovar pensión */}
      <RenovarMiPensionModal
        open={renovarModalOpen}
        onClose={handleCerrarRenovar}
        pension={pension}
        onIniciarPago={iniciarPagoRenovacion}
        onConfirmarRenovacion={confirmarRenovacion}
        setLoading={setLoading}
      />
    </>
  );
}
