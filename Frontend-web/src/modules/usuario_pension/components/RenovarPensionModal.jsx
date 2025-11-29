import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { useFormik } from "formik";
import CustomSweetAlert from "../../../components/CustomSweetAlert";
import { renovarPensionSchema, renovarPensionInitialValues } from "../config/renovarYup";
import { fetchTiposPension } from "../../tipo_pension/api/TiposPensionApi";

export default function RenovarPensionModal({ open, onClose, usuario, onRenovar, setLoading }) {
  const [tiposPension, setTiposPension] = useState([]);
  const [loadingTipos, setLoadingTipos] = useState(false);
  const [tipoPensionSeleccionado, setTipoPensionSeleccionado] = useState(null);

  useEffect(() => {
    if (open) {
      loadTiposPension();
      setTipoPensionSeleccionado(null);
    }
  }, [open]);

  const loadTiposPension = async () => {
    setLoadingTipos(true);
    try {
      const response = await fetchTiposPension();
      console.log("Tipos de pensión response:", response);
      if (response.data && response.data.data) {
        // Filtrar solo tipos de pensión activos
        const tiposActivos = response.data.data.filter(tipo => tipo.status === true);
        console.log("Tipos activos:", tiposActivos);
        setTiposPension(tiposActivos);
      }
    } catch (error) {
      console.error("Error al cargar tipos de pensión:", error);
      setTiposPension([]);
    } finally {
      setLoadingTipos(false);
    }
  };

  const handleSubmit = async (values) => {
    // Primero cerramos el modal
    onClose();
    
    // Mostrar diálogo de confirmación
    const confirmResult = await CustomSweetAlert.confirm({
      title: "Renovar pensión",
      text: `¿Está seguro que desea renovar la pensión del usuario ${usuario?.correo}?`,
      confirmButtonText: "Renovar",
    });

    if (confirmResult.isConfirmed) {
      setLoading(true);
      const resultado = await onRenovar(values.tipoPensionId);
      setLoading(false);
      
      if (resultado.success) {
        formik.resetForm();
        setTipoPensionSeleccionado(null);
        await CustomSweetAlert.success({
          title: "¡Éxito!",
          text: "Pensión renovada correctamente"
        });
      } else {
        await CustomSweetAlert.error({
          text: resultado.error
        });
        // Si hay error, volvemos a abrir el modal
        setTimeout(() => onClose(false), 100);
      }
    } else {
      // Si cancela, volvemos a abrir el modal
      setTimeout(() => onClose(false), 100);
    }
  };

  const formik = useFormik({
    initialValues: renovarPensionInitialValues,
    validationSchema: renovarPensionSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true
  });

  // Resetear formulario cuando se abre el modal
  useEffect(() => {
    if (open) {
      formik.resetForm();
    }
  }, [open]);

  const handleTipoPensionChange = (event) => {
    const tipoPensionId = event.target.value;
    formik.setFieldValue("tipoPensionId", tipoPensionId);
    
    const tipoSeleccionado = tiposPension.find(tipo => tipo.id === tipoPensionId);
    setTipoPensionSeleccionado(tipoSeleccionado);
  };

  const calcularFechaFin = () => {
    if (!usuario?.fechaInicioProximaRenovacion || !tipoPensionSeleccionado?.duracionDias) {
      return "N/A";
    }

    const fechaInicio = new Date(usuario.fechaInicioProximaRenovacion + 'T00:00:00');
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + tipoPensionSeleccionado.duracionDias - 1);

    return fechaFin.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatFecha = (fecha) => {
    if (!fecha) return "N/A";
    const date = new Date(fecha + 'T00:00:00');
    return date.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleClose = () => {
    formik.resetForm();
    setTipoPensionSeleccionado(null);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
    >
      <form onSubmit={formik.handleSubmit}>
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
              Renovar pensión
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Selecciona el tipo de pensión deseada para renovar la pensión del usuario.
            </Typography>
          </Box>

          {/* FAQs */}
          <Box sx={{ mb: 3 }}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                  ¿Qué pasa si se renueva la pensión antes de que termine el período actual?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  El nuevo registro de pensión tendrá como fecha de inicio el día siguiente al que termina la pensión actual. Se respetan las fechas de cada registro de pensión.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                  ¿Qué pasa si se renueva cuando el período ya terminó?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  El nuevo registro de pensión tendrá fecha de inicio el mismo día en el que se hace el pago.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>

          {/* Selector de tipo de pensión */}
          <TextField
            select
            fullWidth
            label="Selecciona el tipo de pensión *"
            name="tipoPensionId"
            value={formik.values.tipoPensionId}
            onChange={handleTipoPensionChange}
            error={formik.touched.tipoPensionId && Boolean(formik.errors.tipoPensionId)}
            helperText={formik.touched.tipoPensionId && formik.errors.tipoPensionId}
            disabled={loadingTipos}
            sx={{ mb: 3 }}
          >
            <MenuItem value="">
              <em>Seleccione un tipo de pensión</em>
            </MenuItem>
            {tiposPension.map((tipo) => (
              <MenuItem key={tipo.id} value={tipo.id}>
                {tipo.nombre} - {tipo.duracionDias} días - ${tipo.costo} MXN
              </MenuItem>
            ))}
          </TextField>

          {/* Información del período actual */}
          <Box 
            sx={{ 
              p: 2, 
              bgcolor: "action.hover", 
              borderRadius: 1,
              mb: 3
            }}
          >
            <Typography variant="body2" gutterBottom>
              <strong>Correo:</strong> {usuario?.correo}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>La pensión actual finaliza el:</strong>{" "}
              {formatFecha(usuario?.fechaFinalizacion)}
            </Typography>
          </Box>

          {/* Información de renovación */}
          {tipoPensionSeleccionado && (
            <Box 
              sx={{ 
                p: 2, 
                bgcolor: "success.light", 
                borderRadius: 1,
                border: "1px solid",
                borderColor: "success.main"
              }}
            >
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: "bold" }}>
                Con la pensión seleccionada, la renovación tendría:
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Costo:</strong> ${tipoPensionSeleccionado.costo} MXN
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Fecha de inicio:</strong>{" "}
                {formatFecha(usuario?.fechaInicioProximaRenovacion)}
              </Typography>
              <Typography variant="body2">
                <strong>Fecha de finalización:</strong> {calcularFechaFin()}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1, justifyContent: "center" }}>
          <Button onClick={handleClose} variant="outlined" sx={{ minWidth: 120 }}>
            Cerrar
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={!tipoPensionSeleccionado || loadingTipos}
            sx={{ minWidth: 120 }}
          >
            Renovar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
