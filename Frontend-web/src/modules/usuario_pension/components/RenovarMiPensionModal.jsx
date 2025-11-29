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
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { 
  ExpandMore as ExpandMoreIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon 
} from "@mui/icons-material";
import { useFormik } from "formik";
import CustomSweetAlert from "../../../components/CustomSweetAlert";
import { renovarPensionSchema, renovarPensionInitialValues } from "../config/renovarYup";
import { fetchTiposPension } from "../../tipo_pension/api/TiposPensionApi";

const STEPS = ['Seleccionar pensión', 'Realizar pago', 'Confirmación'];

export default function RenovarMiPensionModal({ 
  open, 
  onClose, 
  pension, 
  onIniciarPago, 
  onConfirmarRenovacion,
  setLoading 
}) {
  const [tiposPension, setTiposPension] = useState([]);
  const [loadingTipos, setLoadingTipos] = useState(false);
  const [tipoPensionSeleccionado, setTipoPensionSeleccionado] = useState(null);
  
  // Estados para el flujo de pago
  const [activeStep, setActiveStep] = useState(0);
  const [mostrarBotonVerificar, setMostrarBotonVerificar] = useState(false);
  const [procesandoPago, setProcesandoPago] = useState(false);

  useEffect(() => {
    if (open) {
      loadTiposPension();
      setTipoPensionSeleccionado(null);
      setActiveStep(0);
      setMostrarBotonVerificar(false);
    }
  }, [open]);

  const loadTiposPension = async () => {
    setLoadingTipos(true);
    try {
      const response = await fetchTiposPension();
      if (response.data && response.data.data) {
        // Filtrar solo tipos de pensión activos
        const tiposActivos = response.data.data.filter(tipo => tipo.status === true);
        setTiposPension(tiposActivos);
      }
    } catch (error) {
      console.error("Error al cargar tipos de pensión:", error);
      setTiposPension([]);
    } finally {
      setLoadingTipos(false);
    }
  };

  const handleTipoPensionChange = (event) => {
    const tipoPensionId = event.target.value;
    formik.setFieldValue("tipoPensionId", tipoPensionId);
    
    const tipoSeleccionado = tiposPension.find(tipo => tipo.id === tipoPensionId);
    setTipoPensionSeleccionado(tipoSeleccionado);
  };

  const calcularFechaFin = () => {
    if (!pension?.fechaInicioProximaRenovacion || !tipoPensionSeleccionado?.duracionDias) {
      return "N/A";
    }

    const fechaInicio = new Date(pension.fechaInicioProximaRenovacion + 'T00:00:00');
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

  // Paso 1: Continuar al pago
  const handleContinuarAlPago = () => {
    if (tipoPensionSeleccionado) {
      setActiveStep(1);
    }
  };

  // Paso 2: Iniciar pago con Mercado Pago
  const handleIniciarPago = async () => {
    setProcesandoPago(true);
    
    const resultado = await onIniciarPago(tipoPensionSeleccionado);
    
    if (resultado.success) {
      // Abrir Mercado Pago en nueva ventana
      window.open(resultado.initPoint, '_blank');
      
      // Mostrar botón de verificar después de 5 segundos
      setTimeout(() => {
        setMostrarBotonVerificar(true);
        setProcesandoPago(false);
      }, 5000);
    } else {
      setProcesandoPago(false);
      await CustomSweetAlert.error({
        text: resultado.error
      });
    }
  };

  // Paso 3: Verificar pago y confirmar renovación
  const handleVerificarPago = async () => {
    // Cerrar el modal primero para que el SweetAlert sea visible
    onClose();
    
    // Pequeño delay para que el modal se cierre completamente
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Confirmación del usuario
    const confirmResult = await CustomSweetAlert.confirm({
      title: "Confirmar pago",
      text: "¿Ya completaste el pago en Mercado Pago?",
      confirmButtonText: "Sí, ya pagué",
      cancelButtonText: "Aún no"
    });

    if (!confirmResult.isConfirmed) {
      // Si cancela, no hacer nada (el modal ya está cerrado)
      return;
    }

    // Mostrar loading
    setLoading(true);

    // Confirmar la renovación en el backend
    const resultado = await onConfirmarRenovacion(tipoPensionSeleccionado.id);
    
    setLoading(false);

    // Resetear el formulario
    formik.resetForm();
    setTipoPensionSeleccionado(null);
    setActiveStep(0);
    setMostrarBotonVerificar(false);

    if (resultado.success) {
      await CustomSweetAlert.success({
        title: "¡Éxito!",
        text: "Pensión renovada correctamente"
      });
    } else {
      await CustomSweetAlert.error({
        text: resultado.error
      });
    }
  };

  const formik = useFormik({
    initialValues: renovarPensionInitialValues,
    validationSchema: renovarPensionSchema,
    onSubmit: () => {}, // No se usa submit tradicional
    enableReinitialize: true
  });

  // Resetear formulario cuando se abre el modal
  useEffect(() => {
    if (open) {
      formik.resetForm();
    }
  }, [open]);

  const handleClose = () => {
    formik.resetForm();
    setTipoPensionSeleccionado(null);
    setActiveStep(0);
    setMostrarBotonVerificar(false);
    onClose();
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        // Paso 1: Seleccionar tipo de pensión
        return (
          <>
            {/* FAQs */}
            <Box sx={{ mb: 3 }}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                    ¿Qué pasa si renuevo la pensión antes de que termine el período actual?
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
                    ¿Qué pasa si renuevo cuando el período ya terminó?
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
                <strong>Correo:</strong> {pension?.correo}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>La renovación comenzaría el:</strong>{" "}
                {formatFecha(pension?.fechaInicioProximaRenovacion)}
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
                  {formatFecha(pension?.fechaInicioProximaRenovacion)}
                </Typography>
                <Typography variant="body2">
                  <strong>Fecha de finalización:</strong> {calcularFechaFin()}
                </Typography>
              </Box>
            )}
          </>
        );

      case 1:
        // Paso 2: Realizar pago
        return (
          <Box>
            {/* Resumen de la pensión seleccionada */}
            <Box 
              sx={{ 
                p: 3, 
                mb: 3,
                bgcolor: "primary.light", 
                borderRadius: 2,
                border: 2,
                borderColor: "primary.main"
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Resumen de renovación
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Plan:</strong> parKing {tipoPensionSeleccionado?.nombre}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Duración:</strong> {tipoPensionSeleccionado?.duracionDias} días
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "primary.main", mt: 2 }}>
                ${tipoPensionSeleccionado?.costo} MXN
              </Typography>
            </Box>

            {/* Instrucciones */}
            <Alert icon={<PaymentIcon />} severity="info" sx={{ mb: 3 }}>
              Serás redirigido a Mercado Pago. Después de pagar, regresa aquí y haz clic en "Ya pagué".
            </Alert>

            {/* Botón de pago */}
            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={procesandoPago ? <CircularProgress size={20} color="inherit" /> : <PaymentIcon />}
              onClick={handleIniciarPago}
              disabled={procesandoPago || mostrarBotonVerificar}
              sx={{
                py: 2,
                fontSize: "1.1rem",
                fontWeight: "bold",
                mb: 2,
              }}
            >
              {procesandoPago ? "Abriendo Mercado Pago..." : "Proceder al pago"}
            </Button>

            {/* Botón para verificar pago */}
            {mostrarBotonVerificar && (
              <Button
                variant="outlined"
                size="large"
                fullWidth
                startIcon={<CheckCircleIcon />}
                onClick={handleVerificarPago}
                sx={{
                  py: 2,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  borderColor: "success.main",
                  color: "success.main",
                  "&:hover": {
                    borderColor: "success.dark",
                    bgcolor: "success.light",
                  },
                }}
              >
                Ya pagué - Completar renovación
              </Button>
            )}

            {/* Métodos de pago */}
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Métodos de pago disponibles con Mercado Pago:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                💳 Tarjetas de crédito/débito • 💰 Efectivo • 🏦 Transferencias
              </Typography>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
    >
      <DialogContent sx={{ p: 4 }}>
        {/* Título */}
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
            Renovar mi pensión
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Selecciona el tipo de pensión deseada y realiza el pago para renovar tu pensión.
          </Typography>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Contenido del paso actual */}
        {renderStepContent()}
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1, justifyContent: "space-between" }}>
        <Button onClick={handleClose} variant="outlined">
          {mostrarBotonVerificar ? "Cancelar" : "Cerrar"}
        </Button>
        
        {activeStep === 0 && (
          <Button 
            variant="contained" 
            onClick={handleContinuarAlPago}
            disabled={!tipoPensionSeleccionado || loadingTipos}
          >
            Continuar al pago
          </Button>
        )}
        
        {activeStep === 1 && !mostrarBotonVerificar && (
          <Button 
            variant="outlined" 
            onClick={() => setActiveStep(0)}
          >
            Volver
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
