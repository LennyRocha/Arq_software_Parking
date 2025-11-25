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

  // Funciones removidas - ya no se necesitan con Checkout Pro simplificado
  
  const procesarRegistroAprobado = (datosGuardados) => {
    const { formData: savedFormData } = JSON.parse(datosGuardados);
    
    // Restaurar formData
    if (savedFormData) {
      Object.keys(savedFormData).forEach(key => {
        if (!formData[key] || (Array.isArray(formData[key]) && formData[key].length === 0)) {
          updateFormData({ [key]: savedFormData[key] });
        }
      });
    }
    
    // Limpiar localStorage
    localStorage.removeItem('registroPensionEnProgreso');
    
    // Limpiar URL
    window.history.replaceState({}, document.title, window.location.pathname);
    
    // Mostrar mensaje de procesamiento
    Swal.fire({
      icon: "info",
      title: "Procesando tu registro...",
      text: "Por favor espera un momento.",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
    // Realizar el registro
    setTimeout(() => {
      handleSubmit().then((result) => {
        if (result.success) {
          Swal.fire({
            icon: "success",
            title: "¡Pago exitoso!",
            text: "Tu registro ha sido completado exitosamente.",
            timer: 3000,
            showConfirmButton: false,
          }).then(() => {
            // Avanzar al paso de confirmación
            for(let i = activeStep; i < 4; i++) {
              handleNext();
            }
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error al registrar",
            text: result.error || "Hubo un problema al completar el registro. Por favor contacta a soporte.",
          });
        }
      });
    }, 1000);
  };
  
  const handleIniciarPago = async () => {
    const result = await iniciarPago();
    if (result.success) {
      // Guardar el estado actual en localStorage
      localStorage.setItem('registroPensionEnProgreso', JSON.stringify({
        activeStep: 3,
        formData: formData,
        preferenceId: result.id,
        timestamp: Date.now()
      }));
      
      // ABRIR en NUEVA VENTANA - NO redirigir
      window.open(result.initPoint, '_blank');
      
      // Mostrar mensaje
      Swal.fire({
        icon: "info",
        title: "Completa tu pago",
        html: `
          <p>Se abrió Mercado Pago en una nueva ventana.</p>
          <p><strong>Después de pagar, regresa aquí y haz clic en "Ya pagué".</strong></p>
        `,
        confirmButtonText: "Entendido",
      });
      
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al iniciar pago",
        text: result.error,
      });
    }
  };

  const handleVerificarPago = () => {
    console.log("=== VERIFICAR PAGO LLAMADO ===");
    const datosGuardados = localStorage.getItem('registroPensionEnProgreso');
    console.log("Datos guardados:", datosGuardados);
    
    if (!datosGuardados) {
      Swal.fire({
        icon: "warning",
        title: "No hay pago pendiente",
        text: "No encontramos un pago en proceso.",
      });
      return;
    }

    Swal.fire({
      icon: "question",
      title: "¿Completaste el pago?",
      text: "Confirma que ya realizaste el pago en Mercado Pago",
      showCancelButton: true,
      confirmButtonText: "Sí, ya pagué",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      console.log("Resultado confirmación:", result);
      if (result.isConfirmed) {
        console.log("Usuario confirmó pago, procesando...");
        procesarRegistroAprobado(datosGuardados);
      }
    });
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("status");
    const collection_status = urlParams.get("collection_status");

    console.log('=== URL PARAMS DETECTADOS ===');
    console.log('status:', status);
    console.log('collection_status:', collection_status);

    const datosGuardados = localStorage.getItem('registroPensionEnProgreso');
    
    // Si viene de Mercado Pago con pago aprobado
    if ((status === "approved" || collection_status === "approved") && datosGuardados) {
      procesarRegistroAprobado(datosGuardados);
      
    } else if (status === "rejected" || collection_status === "rejected") {
      localStorage.removeItem('registroPensionEnProgreso');
      window.history.replaceState({}, document.title, window.location.pathname);
      
      Swal.fire({
        icon: "error",
        title: "Pago rechazado",
        text: "Intenta nuevamente.",
      });
      
    } else if (status === "pending" || collection_status === "pending") {
      localStorage.removeItem('registroPensionEnProgreso');
      window.history.replaceState({}, document.title, window.location.pathname);
      
      Swal.fire({
        icon: "info",
        title: "Pago pendiente",
        text: "Te notificaremos cuando se confirme.",
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
            onIniciarPago={handleIniciarPago}
            onVerificarPago={handleVerificarPago}
            loading={loadingRegistro}
            error={errorRegistro}
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
