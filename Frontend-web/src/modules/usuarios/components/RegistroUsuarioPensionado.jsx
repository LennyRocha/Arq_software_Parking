import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Box,
  Typography,
  InputAdornment,
  IconButton,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  CheckCircle as CheckCircleIcon,
  CalendarToday as CalendarIcon,
  Add as AddIcon,
  DirectionsCar as CarIcon,
} from "@mui/icons-material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { fetchTiposPension } from "../../tipo_pension/api/TiposPensionApi";
import { getAxiosErrorMessage } from "../../../utils/getAxiosMessage";
import MainHeader from "../../../components/MainHeader";

const links = [
  { nombre: "Usuarios", ruta: "/admin/usuarios", disabled: false },
  { nombre: "Registrar usuario pensionado", ruta: "/admin/usuarios/registrar", disabled: true },
];

// Schema de validación
const registroUsuarioSchema = Yup.object().shape({
  nombre: Yup.string()
    .required("El nombre es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres"),
  apellidos: Yup.string()
    .required("Los apellidos son requeridos")
    .min(2, "Los apellidos deben tener al menos 2 caracteres"),
  correo: Yup.string()
    .email("Correo electrónico inválido")
    .required("El correo es requerido"),
  telefono: Yup.string()
    .required("El teléfono es requerido")
    .matches(/^[0-9]{10}$/, "El teléfono debe tener 10 dígitos"),
  contra: Yup.string()
    .required("La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmarContra: Yup.string()
    .required("Debes confirmar la contraseña")
    .oneOf([Yup.ref("contra")], "Las contraseñas no coinciden"),
  estatus: Yup.string()
    .required("El estatus es requerido"),
  tipoPensionId: Yup.mixed()
    .required("El tipo de pensión es requerido"),
  fechaExpiracion: Yup.date()
    .required("La fecha de expiración es requerida")
    .min(new Date(), "La fecha de expiración debe ser futura"),
});

const initialValues = {
  nombre: "",
  apellidos: "",
  correo: "",
  telefono: "",
  contra: "",
  confirmarContra: "",
  estatus: "Activo",
  tipoPensionId: "",
  fechaExpiracion: "",
};

export default function RegistroUsuarioPensionado({ onCancel, onSubmit }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tiposPension, setTiposPension] = useState([]);
  const [loadingTipos, setLoadingTipos] = useState(false);
  const [errorTipos, setErrorTipos] = useState(null);

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/admin/gestion_usuarios");
    }
  };

  useEffect(() => {
    cargarTiposPension();
  }, []);

  const cargarTiposPension = async () => {
    setLoadingTipos(true);
    setErrorTipos(null);
    try {
      const response = await fetchTiposPension();
      if (response.data && response.data.data) {
        // Filtrar solo tipos de pensión activos
        const tiposActivos = response.data.data.filter((tipo) => tipo.status === true);
        setTiposPension(tiposActivos);
      }
    } catch (error) {
      setErrorTipos(getAxiosErrorMessage(error));
    } finally {
      setLoadingTipos(false);
    }
  };

  const handleAgregarVehiculo = (formValues) => {
    // Remover el campo confirmarContra antes de guardar
    const { confirmarContra, ...usuarioData } = formValues;
    // Navegar a la página de registro de vehículos con los datos del usuario
    navigate("/admin/usuarios/registrar/vehiculo", {
      state: { usuarioData },
    });
  };

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
    if (onSubmit) {
      onSubmit(dataToSave);
    }
  };

  return (
    <>
      <MainHeader titulo="REGISTRO DE USUARIO PENSIONADO" breads={links} icon={true} />

      <Box
        sx={{
          padding: { xs: 2, sm: 3, md: 4 },
          paddingTop: { xs: 3, sm: 4, md: 6 },
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
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
              Completa todos los campos para registrar un nuevo usuario pensionado en el sistema.
              Todos los campos son requeridos.
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
              <Formik
                initialValues={initialValues}
                validationSchema={registroUsuarioSchema}
                onSubmit={handleSubmit}
                validateOnChange={true}
                validateOnBlur={true}
              >
                {({ values, errors, touched, handleChange, handleBlur, submitForm }) => (
                  <Form>
                    {/* Botón Agregar Vehículo */}
                    <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleAgregarVehiculo(values)}
                        sx={{
                          textTransform: "none",
                          backgroundColor: "var(--primary)",
                          "&:hover": {
                            backgroundColor: "var(--primary)",
                            opacity: 0.9,
                          },
                        }}
                      >
                        Agregar vehículo
                      </Button>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        gap: { xs: 3, md: 4 },
                        width: "100%",
                        mb: { xs: 0, md: 0 },
                      }}
                    >
                      {/* Estatus */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <FormControl
                          fullWidth
                          error={touched.estatus && Boolean(errors.estatus)}
                        >
                          <InputLabel>Estatus *</InputLabel>
                          <Select
                            name="estatus"
                            value={values.estatus}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Estatus *"
                            sx={{
                              borderRadius: 3,
                              backgroundColor: "#fbfbff",
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "rgba(15, 23, 42, 0.08)",
                              },
                            }}
                          >
                            <MenuItem value="Activo">Activo</MenuItem>
                            <MenuItem value="Inactivo">Inactivo</MenuItem>
                          </Select>
                          {touched.estatus && errors.estatus && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                              {errors.estatus}
                            </Typography>
                          )}
                        </FormControl>
                      </Box>

                      {/* Tipo de pensión */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <FormControl
                          fullWidth
                          error={touched.tipoPensionId && Boolean(errors.tipoPensionId)}
                          disabled={loadingTipos}
                        >
                          <InputLabel shrink={true}>Tipo de pensión *</InputLabel>
                          <Select
                            name="tipoPensionId"
                            value={values.tipoPensionId}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Tipo de pensión *"
                            displayEmpty
                            sx={{
                              borderRadius: 3,
                              backgroundColor: "#fbfbff",
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "rgba(15, 23, 42, 0.08)",
                              },
                            }}
                          >
                            <MenuItem value="" disabled>
                              {loadingTipos
                                ? "Cargando tipos de pensión..."
                                : "Selecciona el tipo de pensión"}
                            </MenuItem>
                            {tiposPension.map((tipo) => (
                              <MenuItem key={tipo.id} value={String(tipo.id)}>
                                {tipo.nombre}
                              </MenuItem>
                            ))}
                          </Select>
                          {touched.tipoPensionId && errors.tipoPensionId && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                              {errors.tipoPensionId}
                            </Typography>
                          )}
                          {errorTipos && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                              {errorTipos}
                            </Typography>
                          )}
                        </FormControl>
                      </Box>

                      {/* Fecha de expiración */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <TextField
                          fullWidth
                          label="Fecha de expiración *"
                          name="fechaExpiracion"
                          type="date"
                          value={values.fechaExpiracion}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.fechaExpiracion && Boolean(errors.fechaExpiracion)}
                          helperText={touched.fechaExpiracion && errors.fechaExpiracion}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          sx={formFieldSx}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarIcon color="action" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Título Datos del Usuario */}
                    <Box sx={{ mt: 4, mb: 2, pl: 0 }}>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ textAlign: "left" }}>
                        Datos del Usuario
                      </Typography>
                    </Box>

                    <Grid container spacing={3} rowSpacing={3}>
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
                      <Grid item xs={12} md={6}>
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
                      <Grid item xs={12} md={6}>
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

                    {/* Botones de acción */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 2,
                        mt: 4,
                      }}
                    >
                      <Button
                        variant="outlined"
                        onClick={handleCancel}
                        sx={{
                          minWidth: 120,
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        onClick={submitForm}
                        sx={{
                          minWidth: 120,
                          backgroundColor: "var(--primary)",
                          "&:hover": {
                            backgroundColor: "var(--primary)",
                            opacity: 0.9,
                          },
                        }}
                      >
                        Registrar
                      </Button>
                    </Box>
                  </Form>
                )}
              </Formik>
            </Paper>
          </Box>
        </Box>
      </Box>
    </>
  );
}

