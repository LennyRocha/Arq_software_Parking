import React from "react";
import {
  Grid,
  TextField,
  Box,
  Typography,
  Paper,
  Button,
  Container,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import MainHeader from "../../../components/MainHeader";
import LoadingBackdrop from "../../../components/LoadingBackdrop";
import CustomSweetAlert from "../../../components/CustomSweetAlert";
import useRegistroEmpleado from "../hooks/useRegistroEmpleado";

const links = [
  { nombre: "Usuarios", ruta: "/admin/gestion_usuarios", disabled: false },
  { nombre: "Registrar empleado", ruta: "/admin/usuarios/registrar-empleado", disabled: true },
];

// Schema de validación según requerimientos
const registroEmpleadoSchema = Yup.object().shape({
  nombre: Yup.string()
    .required("El nombre no puede estar vacío")
    .max(50, "El nombre debe tener una longitud máxima de 50 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo puede contener letras"),
  
  apellidos: Yup.string()
    .required("El apellido no puede estar vacío")
    .max(50, "El apellido debe tener una longitud máxima de 50 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El apellido solo puede contener letras"),
  
  correo: Yup.string()
    .required("El correo electrónico no puede estar vacío")
    .email("El correo electrónico debe tener un formato válido")
    .max(50, "El correo electrónico debe tener una longitud máxima de 50 caracteres"),
  
  telefono: Yup.string()
    .required("El teléfono no puede estar vacío")
    .matches(/^[0-9]{10}$/, "El teléfono debe tener exactamente 10 dígitos numéricos")
    .max(10, "El teléfono debe tener una longitud máxima de 10 caracteres"),
});

const initialValues = {
  nombre: "",
  apellidos: "",
  correo: "",
  telefono: "",
};

export default function RegistroEmpleado() {
  const navigate = useNavigate();
  const { loading, registrar } = useRegistroEmpleado();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // Solicitar confirmación
    const confirmResult = await CustomSweetAlert.confirm({
      title: "Registrar empleado",
      text: "¿Está seguro que desea registrar este empleado?",
      confirmButtonText: "Registrar",
    });

    if (confirmResult.isConfirmed) {
      const response = await registrar(values);
      
      if (response.success) {
        resetForm();
        await CustomSweetAlert.success({
          title: "¡Éxito!",
          text: "Empleado registrado exitosamente"
        });
        navigate("/admin/gestion_usuarios");
      } else {
        await CustomSweetAlert.error({
          text: response.error || "Hubo un problema al completar el registro"
        });
      }
    }
    
    setSubmitting(false);
  };

  const formFieldSx = {
    "& .MuiInputBase-root": {
      borderRadius: 3,
      backgroundColor: "#f9fbff",
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: 3,
    },
  };

  return (
    <>
      <LoadingBackdrop isOpen={loading} onClose={() => {}} />
      <MainHeader titulo="REGISTRAR EMPLEADO" breads={links} icon={true} />

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/admin/gestion_usuarios")}
          sx={{ mb: 3 }}
        >
          Volver a usuarios
        </Button>

        <Paper
          elevation={3}
          sx={{
            borderRadius: 4,
            p: 4,
            backgroundColor: "#ffffff",
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", mb: 1, textAlign: "center" }}
          >
            Registro de Empleado
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, textAlign: "center" }}
          >
            Completa la información del nuevo empleado. La contraseña se generará automáticamente como: Apellido + "123"
          </Typography>

          <Formik
            initialValues={initialValues}
            validationSchema={registroEmpleadoSchema}
            onSubmit={handleSubmit}
            validateOnChange={true}
            validateOnBlur={true}
          >
            {({ values, errors, touched, handleChange, handleBlur, isValid, dirty }) => (
              <Form>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Box sx={{ width: "100%", maxWidth: 800 }}>
                    <Grid container spacing={3}>
                      {/* Nombre */}
                      <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nombre *"
                      name="nombre"
                      value={values.nombre}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.nombre && Boolean(errors.nombre)}
                      helperText={touched.nombre && errors.nombre}
                      placeholder="Ingrese el nombre"
                      inputProps={{ maxLength: 50 }}
                      required
                      sx={formFieldSx}
                      InputProps={{
                        startAdornment: <PersonIcon sx={{ mr: 1, color: "action.active" }} />,
                      }}
                    />
                  </Grid>

                  {/* Apellidos */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Apellidos *"
                      name="apellidos"
                      value={values.apellidos}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.apellidos && Boolean(errors.apellidos)}
                      helperText={touched.apellidos && errors.apellidos}
                      placeholder="Ingrese los apellidos"
                      inputProps={{ maxLength: 50 }}
                      required
                      sx={formFieldSx}
                      InputProps={{
                        startAdornment: <PersonIcon sx={{ mr: 1, color: "action.active" }} />,
                      }}
                    />
                  </Grid>

                  {/* Correo */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Correo electrónico *"
                      name="correo"
                      type="email"
                      value={values.correo}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.correo && Boolean(errors.correo)}
                      helperText={touched.correo && errors.correo}
                      placeholder="correo@ejemplo.com"
                      inputProps={{ maxLength: 50 }}
                      required
                      sx={formFieldSx}
                      InputProps={{
                        startAdornment: <EmailIcon sx={{ mr: 1, color: "action.active" }} />,
                      }}
                    />
                  </Grid>

                  {/* Teléfono */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Teléfono *"
                      name="telefono"
                      value={values.telefono}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.telefono && Boolean(errors.telefono)}
                      helperText={touched.telefono && errors.telefono}
                      placeholder="1234567890"
                      inputProps={{ 
                        maxLength: 10,
                        inputMode: 'numeric',
                        pattern: '[0-9]*'
                      }}
                      required
                      sx={formFieldSx}
                      InputProps={{
                        startAdornment: <PhoneIcon sx={{ mr: 1, color: "action.active" }} />,
                      }}
                    />
                  </Grid>

                  {/* Información de contraseña */}
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: "#e3f2fd",
                        borderRadius: 2,
                        border: "1px solid #90caf9",
                        textAlign: "center",
                      }}
                    >
                      <Typography variant="body2" color="primary">
                        ℹ️ <strong>Contraseña automática:</strong> El empleado podrá acceder con su correo y la contraseña será su apellido seguido de "123"
                        {values.apellidos && (
                          <span style={{ display: "block", marginTop: 8, fontWeight: "bold" }}>
                            Contraseña: {values.apellidos}123
                          </span>
                        )}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Botones */}
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 2,
                        mt: 2,
                      }}
                    >
                      <Button
                        variant="outlined"
                        onClick={() => navigate("/admin/gestion_usuarios")}
                        disabled={loading}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={!isValid || !dirty || loading}
                      >
                        {loading ? "Registrando..." : "Registrar Empleado"}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
                  </Box>
                </Box>
              </Form>
            )}
          </Formik>
        </Paper>
      </Container>
    </>
  );
}