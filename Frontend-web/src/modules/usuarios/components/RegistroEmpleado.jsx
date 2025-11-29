import React, { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Done as DoneIcon,
} from "@mui/icons-material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import MainHeader from "../../../components/MainHeader";

const links = [
  { nombre: "Usuarios", ruta: "/admin/usuarios", disabled: false },
  { nombre: "Registrar empleado", ruta: "/admin/usuarios/registrar-empleado", disabled: true },
];

// Roles disponibles (se pueden cargar del backend después)
const rolesDisponibles = [
  { id: 1, name: "ADMINISTRADOR", label: "Administrador" },
  { id: 2, name: "EMPLEADO", label: "Empleado" },
];

// Schema de validación
const registroEmpleadoSchema = Yup.object().shape({
  estatus: Yup.string().required("El estatus es requerido"),
  rolId: Yup.mixed().required("El rol es requerido"),
  nombreCompleto: Yup.string()
    .required("El nombre completo es requerido")
    .min(2, "El nombre completo debe tener al menos 2 caracteres"),
  correo: Yup.string()
    .email("Correo electrónico inválido")
    .required("El correo es requerido"),
  telefono: Yup.string()
    .required("El teléfono es requerido")
    .matches(/^[0-9]{10}$/, "El teléfono debe tener 10 dígitos"),
  contra: Yup.string()
    .required("La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

const initialValues = {
  estatus: "Activo",
  rolId: "",
  nombreCompleto: "",
  correo: "",
  telefono: "",
  contra: "",
};

export default function RegistroEmpleado({ onCancel, onSubmit }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [openModalExito, setOpenModalExito] = useState(false);

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/admin/gestion_usuarios");
    }
  };

  const handleCerrarModalExito = () => {
    setOpenModalExito(false);
    navigate("/admin/gestion_usuarios");
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
    if (onSubmit) {
      onSubmit(values);
    } else {
      // Aquí irá la lógica para enviar al backend
      console.log("Datos del empleado:", values);
      // Después de registrar exitosamente, mostrar el modal
      setOpenModalExito(true);
    }
  };

  return (
    <>
      <MainHeader titulo="REGISTRAR EMPLEADO" breads={links} icon={true} />

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
              Información del empleado
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              sx={{ maxWidth: 640, mx: "auto" }}
            >
              Completa todos los campos para registrar un nuevo empleado en el sistema.
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
                validationSchema={registroEmpleadoSchema}
                onSubmit={handleSubmit}
                validateOnChange={true}
                validateOnBlur={true}
              >
                {({ values, errors, touched, handleChange, handleBlur, submitForm }) => (
                  <Form>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        gap: { xs: 3, md: 4 },
                        width: "100%",
                        mb: 4,
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

                      {/* Rol */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <FormControl
                          fullWidth
                          error={touched.rolId && Boolean(errors.rolId)}
                        >
                          <InputLabel shrink={true}>Rol *</InputLabel>
                          <Select
                            name="rolId"
                            value={values.rolId}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Rol *"
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
                              Selecciona el rol
                            </MenuItem>
                            {rolesDisponibles.map((rol) => (
                              <MenuItem key={rol.id} value={String(rol.id)}>
                                {rol.label}
                              </MenuItem>
                            ))}
                          </Select>
                          {touched.rolId && errors.rolId && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                              {errors.rolId}
                            </Typography>
                          )}
                        </FormControl>
                      </Box>
                    </Box>

                    {/* Título Datos del Usuario */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ textAlign: "left" }}>
                        Datos del Usuario
                      </Typography>
                    </Box>

                    <Grid container spacing={3} rowSpacing={3}>
                      {/* Nombre Completo */}
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Nombre completo"
                          name="nombreCompleto"
                          value={values.nombreCompleto}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.nombreCompleto && Boolean(errors.nombreCompleto)}
                          helperText={touched.nombreCompleto && errors.nombreCompleto}
                          placeholder="Ej: Juan Carlos Pérez García"
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

      {/* Modal de Éxito */}
      <Dialog
        open={openModalExito}
        onClose={handleCerrarModalExito}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 4,
            px: 4,
            pb: 1,
          }}
        >
          {/* Ícono de éxito simple */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2.5,
            }}
          >
            {/* Círculo verde sólido */}
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                backgroundColor: "#4caf50",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DoneIcon
                sx={{
                  fontSize: 48,
                  color: "#ffffff",
                }}
              />
            </Box>
          </Box>

          {/* Título */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#000000",
              mb: 1.5,
            }}
          >
            ¡Éxito!
          </Typography>

          {/* Mensaje */}
          <Typography
            variant="body2"
            sx={{
              color: "#000000",
              textAlign: "center",
              mb: 3,
            }}
          >
            Usuario registrado exitosamente.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 3.5, pt: 0, justifyContent: "center" }}>
          <Button
            onClick={handleCerrarModalExito}
            variant="contained"
            sx={{
              backgroundColor: "#4caf50",
              color: "#ffffff",
              py: 0.75,
              px: 3,
              borderRadius: 1.5,
              minWidth: 100,
              textTransform: "none",
              fontSize: "0.875rem",
              "&:hover": {
                backgroundColor: "#45a049",
              },
            }}
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

