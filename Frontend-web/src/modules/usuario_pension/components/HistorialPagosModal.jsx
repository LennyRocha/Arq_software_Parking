import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from "@mui/material";
import CustomTable from "../../../components/CustomTable";
import TableFilters from "../../../components/TableFilters";
import { historialPagosColumns, historialOrderOptions } from "../config/tableColumns";
import { fetchHistorialPagos } from "../api/usuarioPensionApi";

export default function HistorialPagosModal({ open, onClose, usuario }) {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [ordenarPor, setOrdenarPor] = useState("fechaPago");
  const [ordenDireccion, setOrdenDireccion] = useState("desc");

  useEffect(() => {
    if (open && usuario) {
      loadHistorial();
    }
  }, [open, usuario, page, rowsPerPage, ordenarPor, ordenDireccion]);

  const loadHistorial = async () => {
    if (!usuario?.id) return;

    setLoading(true);
    try {
      const sort = `${ordenarPor},${ordenDireccion}`;
      const response = await fetchHistorialPagos(usuario.id, {
        page,
        size: rowsPerPage,
        sort
      });
      
      if (response.data && response.data.data) {
        setHistorial(response.data.data.content || []);
        setTotalElements(response.data.data.totalElements || 0);
      }
    } catch (error) {
      console.error("Error al cargar historial:", error);
      setHistorial([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClose = () => {
    setPage(0);
    setRowsPerPage(10);
    setOrdenarPor("fechaPago");
    setOrdenDireccion("desc");
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: { minHeight: "70vh" }
      }}
    >
      <DialogContent sx={{ p: 4 }}>
        {/* Título estilo HeadingDescription */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: "bold",
              color: "primary.main",
              textTransform: "uppercase"
            }}
          >
            Consulta de historial de pensión
          </Typography>
          {usuario && (
            <Typography variant="body1" color="text.secondary">
              HISTORIAL DE PAGOS DE: <strong>{usuario.correo}</strong>
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Recuerda que los pagos se pueden hacer por adelantado, por el día de la fecha de realización de pago puede ser anterior a la fecha de inicio del período de la pensión.
          </Typography>
        </Box>

        {/* Filtros */}
        <Box sx={{ mb: 3 }}>
          <TableFilters
            orderOptions={historialOrderOptions}
            orderBy={ordenarPor}
            orderDirection={ordenDireccion}
            searchPlaceholder="Buscar"
            searchText=""
            onOrderByChange={setOrdenarPor}
            onOrderDirectionChange={setOrdenDireccion}
            onSearchChange={() => {}}
            onSearch={() => {}}
            onClearFilters={() => {
              setOrdenarPor("fechaPago");
              setOrdenDireccion("desc");
            }}
          />
        </Box>

        {/* Tabla */}
        <CustomTable
          columns={historialPagosColumns}
          data={historial}
          loading={loading}
          page={page}
          rowsPerPage={rowsPerPage}
          totalElements={totalElements}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          emptyMessage="No hay historial de pagos registrado"
        />
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} variant="contained" color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
