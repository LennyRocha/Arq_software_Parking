import React from "react";
import {
  Grid,
  TextField,
  Box,
  Typography,
  InputAdornment,
  IconButton,
  Paper,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { Formik, Form } from "formik";
import {
  informacionPersonalSchema,
  initialValuesInformacionPersonal,
} from "../config/validationSchemas";

export default function Step2InformacionPersonal({ formData, onSubmit }) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

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

  const handleSubmit = (values) => {
    // Remover el campo confirmarContra antes de guardar
    const { confirmarContra, ...dataToSave } = values;
    onSubmit(dataToSave);
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
          Completa tu información personal
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          sx={{ maxWidth: 640, mx: "auto" }}
        >
          Esta información nos ayuda a validar tu identidad y activar tu acceso
          sin tarifas adicionales. Todos los campos son requeridos y cuentan con
          protección de datos.
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
              nombre: formData.nombre || initialValuesInformacionPersonal.nombre,
              apellidos:
                formData.apellidos || initialValuesInformacionPersonal.apellidos,
              correo: formData.correo || initialValuesInformacionPersonal.correo,
              telefono:
                formData.telefono || initialValuesInformacionPersonal.telefono,
              contra:
                formData.contra || initialValuesInformacionPersonal.contra,
              confirmarContra: initialValuesInformacionPersonal.confirmarContra,
            }}
            validationSchema={informacionPersonalSchema}
            onSubmit={handleSubmit}
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

                  {/* Contraseña */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Contraseña"
                      name="contra"
                      type={showPassword ? "text" : "password"}
                      value={values.contra}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.contra && Boolean(errors.contra)}
                      helperText={touched.contra && errors.contra}
                      placeholder="Mínimo 6 caracteres"
                      sx={formFieldSx}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Confirmar contraseña */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Confirmar contraseña"
                      name="confirmarContra"
                      type={showConfirmPassword ? "text" : "password"}
                      value={values.confirmarContra}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.confirmarContra && Boolean(errors.confirmarContra)}
                      helperText={touched.confirmarContra && errors.confirmarContra}
                      placeholder="Repite tu contraseña"
                      sx={formFieldSx}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
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
                    if (ref) window.step2SubmitRef = submitForm;
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
