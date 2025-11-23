import React, { useEffect } from "react";
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
import Step4Pago from "./registro_pension/components/Step4Pago";
import Step5Confirmacion from "./registro_pension/components/Step5Confirmacion";
import Swal from "sweetalert2";

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
    cargarMasTiposPension,
    paginationInfo,
    formData,
    updateFormData,
    seleccionarTipoPension,
    agregarVehiculo,
    removerVehiculo,
    editarVehiculo,
    iniciarPago,
    actualizarDatosMercadoPago,
    handleSubmit,
    loadingRegistro,
    errorRegistro,
    registroExitoso,
    datosRegistro,
  } = useRegistroPension(tipoPensionInicial);

  const steps = [
    "Seleccionar Plan",
    "Información Personal",
    "Información de Vehículos",
    "Pago",
    "Confirmación",
  ];

  // Validaciones
  const validarStep1 = () => {
    if (!formData.tipoPension) {
      Swal.fire({
        icon: "warning",
        title: "Selecciona un plan",
        text: "Debes seleccionar un tipo de pensión para continuar",
      });
      return false;
    }
    return true;
  };

  const validarStep3 = () => {
    if (formData.vehiculos.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Agrega un vehículo",
        text: "Debes registrar al menos un vehículo para continuar",
      });
      return false;
    }
    return true;
  };

  const handleNextWithValidation = () => {
    if (activeStep === 0 && !validarStep1()) return;
    if (activeStep === 2 && !validarStep3()) return;
    handleNext();
  };

  const handleStep2Submit = (values) => {
    updateFormData(values);
    handleNext();
  };

  const handlePagoExitoso = async (datosPago) => {
    console.log('=== PAGO EXITOSO ===', datosPago);
    
    // Actualizar datos de Mercado Pago
    actualizarDatosMercadoPago(datosPago);
    
    // Registrar el pensionado en el backend
    const result = await handleSubmit();
    
    if (result.success) {
      Swal.fire({
        icon: "success",
        title: "¡Pago exitoso!",
        text: "Tu pago ha sido procesado correctamente. Completando registro...",
        timer: 2000,
        showConfirmButton: false,
      });
      handleNext();
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al registrar",
        text: result.error || "Hubo un problema al completar el registro",
      });
    }
  };

  const handlePagoError = (error) => {
    console.error('=== ERROR EN PAGO ===', error);
    Swal.fire({
      icon: "error",
      title: "Error en el pago",
      text: error || "No se pudo procesar el pago. Intenta nuevamente.",
    });
  };

  const handleIniciarPago = async () => {
    const result = await iniciarPago();
    if (result.success) {
      window.location.href = result.initPoint;
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al iniciar pago",
        text: result.error,
      });
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentId = urlParams.get("payment_id");
    const status = urlParams.get("status");
    const paymentType = urlParams.get("payment_type");
    const externalReference = urlParams.get("external_reference");

    console.log('=== URL PARAMS DETECTADOS ===');
    console.log('payment_id:', paymentId);
    console.log('status:', status);
    console.log('payment_type:', paymentType);
    console.log('external_reference:', externalReference);

    // Si viene el status approved (aunque no venga payment_id en sandbox)
    if (status === "approved") {
      actualizarDatosMercadoPago({
        payment_id: paymentId || 'sandbox-test-' + Date.now(),
        status: status,
        payment_type: paymentType || 'credit_card',
        external_reference: externalReference,
      });

      if (activeStep === 3) {
        handleNext();
      }

      handleSubmit().then((result) => {
        if (result.success) {
          handleNext();
        }
      });
    } else if (status && status !== "approved") {
      Swal.fire({
        icon: "error",
        title: "Pago no aprobado",
        text: "Tu pago no fue aprobado. Por favor, intenta nuevamente.",
      });
    }
  }, []);

  const handleIrALogin = () => {
    navigate("/login");
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Step1SeleccionPension
            tiposPension={tiposPension}
            tipoPensionSeleccionada={formData.tipoPension}
            onSeleccionar={seleccionarTipoPension}
            loading={loadingTiposPension}
            error={errorTiposPension}
            onLoadMore={cargarMasTiposPension}
            hasMore={paginationInfo.hasMore}
          />
        );
      case 1:
        return (
          <Step2InformacionPersonal
            formData={formData}
            onSubmit={handleStep2Submit}
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
      case 3:
        return (
          <Step4Pago
            formData={formData}
            onPagoExitoso={handlePagoExitoso}
            onPagoError={handlePagoError}
          />
        );
      case 4:
        return (
          <Step5Confirmacion
            datosRegistro={datosRegistro}
            onIrALogin={handleIrALogin}
          />
        );
      default:
        return null;
    }
  };

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

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {activeStep < 4 && (
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => (activeStep === 0 ? navigate("/") : handleBack())}
            sx={{ mb: 3 }}
          >
            {activeStep === 0 ? "Volver al inicio" : "Atrás"}
          </Button>
        )}

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
              {activeStep < 4
                ? "Completa los siguientes pasos para adquirir tu pensión"
                : "¡Felicidades! Tu registro ha sido completado"}
            </Typography>

            {/* Stepper */}
            {activeStep < 4 && (
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.slice(0, 4).map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            )}

            {/* Contenido del step */}
            <Box sx={{ minHeight: 400 }}>{renderStepContent(activeStep)}</Box>

            {/* Botones de navegación */}
            {activeStep < 4 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 4,
                }}
              >
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="outlined"
                >
                  Atrás
                </Button>

                {activeStep === 1 ? (
                  <Button
                    variant="contained"
                    onClick={() => {
                      if (window.step2SubmitRef) {
                        window.step2SubmitRef();
                      }
                    }}
                  >
                    Siguiente
                  </Button>
                ) : activeStep === 3 ? null : (
                  <Button variant="contained" onClick={handleNextWithValidation}>
                    Siguiente
                  </Button>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
