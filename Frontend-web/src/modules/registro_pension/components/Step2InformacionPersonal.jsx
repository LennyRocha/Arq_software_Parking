import React from "react";
import {
  Grid,
  TextField,
  Box,
  Typography,
  InputAdornment,
  IconButton,
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

  const handleSubmit = (values) => {
    // Remover el campo confirmarContra antes de guardar
    const { confirmarContra, ...dataToSave } = values;
    onSubmit(dataToSave);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, textAlign: "center" }}>
        Completa tu información personal
      </Typography>

      <Formik
        initialValues={{
          nombre: formData.nombre || initialValuesInformacionPersonal.nombre,
          apellidos: formData.apellidos || initialValuesInformacionPersonal.apellidos,
          correo: formData.correo || initialValuesInformacionPersonal.correo,
          telefono: formData.telefono || initialValuesInformacionPersonal.telefono,
          contra: formData.contra || initialValuesInformacionPersonal.contra,
          confirmarContra: initialValuesInformacionPersonal.confirmarContra,
        }}
        validationSchema={informacionPersonalSchema}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({ values, errors, touched, handleChange, handleBlur, submitForm }) => (
          <Form>
            <Grid container spacing={3}>
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
            <button type="submit" style={{ display: "none" }} ref={(ref) => {
              if (ref) window.step2SubmitRef = submitForm;
            }} />
          </Form>
        )}
      </Formik>
    </Box>
  );
}
