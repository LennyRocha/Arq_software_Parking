import React from "react";
import {
  Grid,
  TextField,
  Box,
  Typography,
  InputAdornment,
  Paper,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";
import { Formik, Form } from "formik";
import * as Yup from "yup";

// Esquema de validación sin contraseñas
const informacionPersonalSchema = Yup.object({
  nombre: Yup.string()
    .trim()
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre debe contener solo letras")
    .max(50, "El nombre debe tener máximo 50 caracteres")
    .required("El nombre no puede estar vacío"),
  apellidos: Yup.string()
    .trim()
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El apellido debe contener solo letras")
    .max(50, "El apellido debe tener máximo 50 caracteres")
    .required("El apellido no puede estar vacío"),
  correo: Yup.string()
    .trim()
    .email("El correo electrónico debe ser válido")
    .max(50, "El correo electrónico debe tener máximo 50 caracteres")
    .required("El correo electrónico no puede estar vacío"),
  telefono: Yup.string()
    .trim()
    .matches(/^[0-9]{10}$/, "El teléfono debe contener exactamente 10 dígitos")
    .required("El teléfono no puede estar vacío"),
});

export default function Step1InformacionPersonal({ formData, onSubmit }) {
  const formFieldSx = {
    "& .MuiInputBase-root": {
      borderRadius: 3,
      backgroundColor: "#fbfbff",
      border: "1px solid rgba(15, 23, 42, 0.08)",
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: 3,
    },
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 960,
          display: "flex",
          flexDirection: "column",
          gap: { xs: 2.5, md: 3.5 },
          px: { xs: 0, md: 1 },
        }}
      >
        <Typography variant="h5" fontWeight={700} textAlign="center">
          Información del usuario pensionado
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          sx={{ maxWidth: 640, mx: "auto" }}
        >
          Completa la información del nuevo usuario pensionado. La contraseña se generará automáticamente.
        </Typography>

        <Paper
          elevation={6}
          sx={{
            borderRadius: { xs: 3, md: 4 },
            px: { xs: 3, md: 5 },
            py: { xs: 4, md: 5 },
            backgroundColor: "#ffffff",
            boxShadow: "0 24px 40px rgba(15,23,42,0.08)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 1,
              mb: 3,
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Datos Personales
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Paso 2 de 4
            </Typography>
          </Box>

          <Formik
            initialValues={{
              nombre: formData.nombre || "",
              apellidos: formData.apellidos || "",
              correo: formData.correo || "",
              telefono: formData.telefono || "",
            }}
            validationSchema={informacionPersonalSchema}
            onSubmit={onSubmit}
            validateOnChange={true}
            validateOnBlur={true}
          >
            {({ values, errors, touched, handleChange, handleBlur, submitForm }) => (
              <Form>
                <Grid container spacing={3} rowSpacing={4}>
                  {/* Nombre */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nombre(s)"
                      name="nombre"
                      value={values.nombre}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.nombre && Boolean(errors.nombre)}
                      helperText={touched.nombre && errors.nombre}
                      placeholder="Ej: Juan Carlos"
                      inputProps={{ maxLength: 50 }}
                      sx={formFieldSx}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Apellidos */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Apellidos"
                      name="apellidos"
                      value={values.apellidos}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.apellidos && Boolean(errors.apellidos)}
                      helperText={touched.apellidos && errors.apellidos}
                      placeholder="Ej: Pérez García"
                      inputProps={{ maxLength: 50 }}
                      sx={formFieldSx}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Correo */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Correo electrónico"
                      name="correo"
                      type="email"
                      value={values.correo}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.correo && Boolean(errors.correo)}
                      helperText={touched.correo && errors.correo}
                      placeholder="ejemplo@correo.com"
                      inputProps={{ maxLength: 50 }}
                      sx={formFieldSx}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Teléfono */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Teléfono"
                      name="telefono"
                      value={values.telefono}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.telefono && Boolean(errors.telefono)}
                      helperText={touched.telefono && errors.telefono}
                      placeholder="7771234567"
                      inputProps={{ maxLength: 10 }}
                      sx={formFieldSx}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Botón invisible para poder hacer submit con submitForm */}
                <button
                  type="submit"
                  style={{ display: "none" }}
                  ref={(ref) => {
                    if (ref) window.step1SubmitRef = submitForm;
                  }}
                />
              </Form>
            )}
          </Formik>
        </Paper>
      </Box>
    </Box>
  );
}
