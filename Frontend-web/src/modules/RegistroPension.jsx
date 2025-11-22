import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  alpha,
  IconButton,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  DirectionsCar as CarIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from "@mui/icons-material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDarkContext } from "../context/DarkContext";
import useRegistroPension from "./registro_pension/hooks/useRegistroPension";
import Step1SeleccionPension from "./registro_pension/components/Step1SeleccionPension";
import Step2InformacionPersonal from "./registro_pension/components/Step2InformacionPersonal";
import Step3InformacionVehiculos from "./registro_pension/components/Step3InformacionVehiculos";

export default function RegistroPension() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { isDarkMode, toggleDarkMode } = useDarkContext();
  const tipoPensionInicial = location.state?.tipoPension;

  const {
    activeStep,
    handleNext,
    handleBack,
    tiposPension,
    loadingTiposPension,
    errorTiposPension,
    formData,
    updateFormData,
    seleccionarTipoPension,
    agregarVehiculo,
    removerVehiculo,
    editarVehiculo,
    handleSubmit,
  } = useRegistroPension(tipoPensionInicial);

  const steps = tipoPensionInicial
    ? ["Información Personal", "Información de Vehículos"]
    : ["Seleccionar Plan", "Información Personal", "Información de Vehículos"];

  const handleNextStep = () => {
    // Validaciones antes de avanzar
    if (activeStep === 0 && !tipoPensionInicial && !formData.tipoPension) {
      alert("Por favor selecciona un plan");
      return;
    }
    if (activeStep === (tipoPensionInicial ? 0 : 1)) {
      if (!formData.nombre || !formData.email || !formData.telefono) {
        alert("Por favor completa toda la información personal");
        return;
      }
    }
    handleNext();
  };

  const handleFinalSubmit = async () => {
    if (formData.vehiculos.length === 0) {
      alert("Por favor agrega al menos un vehículo");
      return;
    }
    const resultado = await handleSubmit();
    if (resultado.success) {
      alert("¡Registro completado con éxito!");
      navigate("/");
    } else {
      alert("Error: " + resultado.error);
    }
  };

  const renderStepContent = (step) => {
    const adjustedStep = tipoPensionInicial ? step + 1 : step;
    
    switch (adjustedStep) {
      case 0:
        return (
          <Step1SeleccionPension
            tiposPension={tiposPension}
            tipoPensionSeleccionada={formData.tipoPension}
            onSeleccionar={seleccionarTipoPension}
            loading={loadingTiposPension}
            error={errorTiposPension}
          />
        );
      case 1:
        return (
          <Step2InformacionPersonal
            formData={formData}
            onChange={updateFormData}
          />
        );
      case 2:
        return (
          <Step3InformacionVehiculos
            vehiculos={formData.vehiculos}
            onAgregar={agregarVehiculo}
            onRemover={removerVehiculo}
            onEditar={editarVehiculo}
          />
        );
      default:
        return null;
    }
  };

  const isLastStep = activeStep === steps.length - 1;

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Header */}
      <Box
        component="header"
        sx={{
          py: 2,
          px: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: alpha(theme.palette.primary.main, 0.05),
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <CarIcon /> parKing
        </Typography>
        <IconButton onClick={toggleDarkMode} color="inherit">
          {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Box>

      <Container maxWidth="md" sx={{ py: 6 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
          sx={{ mb: 3 }}
        >
          Volver
        </Button>

        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", mb: 1, textAlign: "center" }}
            >
              Registro de Pensión
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, textAlign: "center" }}
            >
              {tipoPensionInicial
                ? `Completa tu registro para el plan ${tipoPensionInicial.nombre}`
                : "Completa los siguientes pasos para adquirir tu pensión"}
            </Typography>

            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box sx={{ minHeight: "400px" }}>{renderStepContent(activeStep)}</Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
            >
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                Atrás
              </Button>
              {isLastStep ? (
                <Button variant="contained" onClick={handleFinalSubmit}>
                  Confirmar Registro
                </Button>
              ) : (
                <Button variant="contained" onClick={handleNextStep}>
                  Siguiente
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Información del plan seleccionado */}
        {formData.tipoPension && (
          <Card sx={{ mt: 4, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                Plan seleccionado: {formData.tipoPension.nombre}
              </Typography>
              <Typography variant="body1">
                Duración: {formData.tipoPension.duracionDias} días
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold", mt: 1 }}>
                Total: ${formData.tipoPension.costo}/mes
              </Typography>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
}
