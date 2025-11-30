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
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import MainHeader from "../../../components/MainHeader";
import useRegistroPensionadoAdmin from "../hooks/useRegistroPensionadoAdmin";
import Step1InformacionPersonal from "./Step1InformacionPersonal";
import Step3InformacionVehiculos from "../../registro_pension/components/Step3InformacionVehiculos";
import Step0SeleccionPension from "./Step0SeleccionPension";
import Step3Confirmacion from "./Step3Confirmacion";
import Swal from "sweetalert2";

const linksAdmin = [
  { nombre: "Usuarios", ruta: "/admin/gestion_usuarios", disabled: false },
  { nombre: "Registrar usuario pensionado", ruta: "/admin/usuarios/registrar", disabled: true },
];

export default function RegistroPensionadoAdmin() {
  const navigate = useNavigate();

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
    handleSubmit,
    loadingRegistro,
    errorRegistro,
    registroExitoso,
    datosRegistro,
    cargarTiposPension,
  } = useRegistroPensionadoAdmin();

  const steps = [
    "Seleccionar Pensión",
    "Información Personal",
    "Información de Vehículos",
    "Confirmación",
  ];

  // Validaciones
  const validarStep2 = () => {
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

  const validarStep0 = () => {
    if (!formData.tipoPension) {
      Swal.fire({
        icon: "warning",
        title: "Selecciona una pensión",
        text: "Debes seleccionar un tipo de pensión para continuar",
      });
      return false;
    }
    return true;
  };

  const handleNextWithValidation = () => {
    if (activeStep === 0 && !validarStep0()) return;
    if (activeStep === 2 && !validarStep2()) return;
    handleNext();
  };

  const handleStep1Submit = (values) => {
    updateFormData(values);
    handleNext();
  };

  const handleConfirmarRegistro = async () => {
    if (!validarStep0()) return;

    Swal.fire({
      title: "¿Confirmar registro?",
      text: "Se creará el usuario pensionado con la información proporcionada",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, registrar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await handleSubmit();
        if (response.success) {
          Swal.fire({
            icon: "success",
            title: "¡Registro exitoso!",
            text: "El usuario pensionado ha sido registrado correctamente",
            timer: 3000,
            showConfirmButton: false,
          }).then(() => {
            handleNext();
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error al registrar",
            text: response.error || "Hubo un problema al completar el registro",
          });
        }
      }
    });
  };

  const handleVolverAUsuarios = () => {
    navigate("/admin/gestion_usuarios");
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Step0SeleccionPension
            tiposPension={tiposPension}
            tipoPensionSeleccionada={formData.tipoPension}
            onSeleccionar={seleccionarTipoPension}
            loading={loadingTiposPension}
            error={errorTiposPension}
            onLoadMore={cargarMasTiposPension}
            hasMore={paginationInfo.hasMore}
            onCargarInicial={cargarTiposPension}
          />
        );
      case 1:
        return (
          <Step1InformacionPersonal
            formData={formData}
            onSubmit={handleStep1Submit}
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
          <Step3Confirmacion
            datosRegistro={datosRegistro}
            formData={formData}
            onVolverAUsuarios={handleVolverAUsuarios}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <MainHeader
        titulo="REGISTRO DE USUARIO PENSIONADO"
        breads={linksAdmin}
        icon={true}
      />

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {activeStep < 3 && (
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() =>
              activeStep === 0 ? navigate("/admin/gestion_usuarios") : handleBack()
            }
            sx={{ mb: 3 }}
          >
            {activeStep === 0 ? "Volver a usuarios" : "Atrás"}
          </Button>
        )}

        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", mb: 1, textAlign: "center" }}
            >
              Registro de Usuario Pensionado
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, textAlign: "center" }}
            >
              {activeStep < 3
                ? "Completa los siguientes pasos para registrar al usuario"
                : "¡Registro completado exitosamente!"}
            </Typography>

            {/* Stepper */}
            {activeStep < 3 && (
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            )}

            {/* Contenido del step */}
            <Box sx={{ minHeight: 400 }}>{renderStepContent(activeStep)}</Box>

            {/* Botones de navegación */}
            {activeStep < 3 && (
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
                      if (window.step1SubmitRef) {
                        window.step1SubmitRef();
                      }
                    }}
                  >
                    Siguiente
                  </Button>
                ) : activeStep === 2 ? (
                  <Button
                    variant="contained"
                    onClick={handleConfirmarRegistro}
                    disabled={loadingRegistro || !formData.tipoPension}
                  >
                    {loadingRegistro ? "Registrando..." : "Confirmar Registro"}
                  </Button>
                ) : (
                  <Button variant="contained" onClick={handleNextWithValidation}>
                    Siguiente
                  </Button>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
