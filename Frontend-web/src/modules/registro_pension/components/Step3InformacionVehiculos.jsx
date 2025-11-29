import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Alert,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  InputAdornment,
  Paper,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  DirectionsCar as CarIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import { Formik, Form } from "formik";
import { vehiculoSchema, initialValuesVehiculo } from "../config/validationSchemas";
import { fetchTiposVehiculo } from "../api/registroPensionApi";
import { getAxiosErrorMessage } from "../../../utils/getAxiosMessage";

export default function Step3InformacionVehiculos({
  vehiculos,
  onAgregar,
  onRemover,
  onEditar,
}) {
  const [editando, setEditando] = useState(null);
  const [tiposVehiculo, setTiposVehiculo] = useState([]);
  const [loadingTipos, setLoadingTipos] = useState(false);
  const [errorTipos, setErrorTipos] = useState(null);

  // Cargar tipos de vehículo al montar
  useEffect(() => {
    cargarTiposVehiculo();
  }, []);

  const cargarTiposVehiculo = async () => {
    setLoadingTipos(true);
    setErrorTipos(null);
    try {
      const response = await fetchTiposVehiculo();
      setTiposVehiculo(response.data.data || []);
    } catch (error) {
      setErrorTipos(getAxiosErrorMessage(error));
    } finally {
      setLoadingTipos(false);
    }
  };

  const handleSubmitVehiculo = (values, { resetForm }) => {
    if (editando !== null) {
      // Modo edición
      onEditar(editando, values);
      setEditando(null);
    } else {
      // Modo agregar
      onAgregar(values);
    }
    resetForm();
  };

  const handleEditarClick = (index) => {
    setEditando(index);
  };

  const handleCancelarEdicion = (resetForm) => {
    resetForm();
    setEditando(null);
  };

  const getTipoVehiculoNombre = (id) => {
    const tipo = tiposVehiculo.find((t) => t.id === id);
    return tipo ? tipo.nombre : "Desconocido";
  };

  const stepSummaryText =
    "Selecciona el tipo de vehículo que ingresarás y añade al menos un auto o moto para validar tu acceso.";

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#f4f5fb",
        py: { xs: 4, md: 6 },
        px: { xs: 2, md: 4 },
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1080,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Paper
          elevation={5}
          sx={{
            borderRadius: 4,
            px: { xs: 3, md: 4 },
            py: { xs: 3, md: 5 },
            backgroundColor: "#ffffff",
            boxShadow: "0 20px 30px rgba(15,23,42,0.1)",
          }}
        >
          <Box textAlign="center" mb={2}>
            <Typography variant="h4" fontWeight={700}>
              Registro de Vehículos
            </Typography>
            <Typography variant="body1" color="text.secondary" mt={1}>
              {stepSummaryText}
            </Typography>
          </Box>

          {vehiculos.length === 0 && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Agrega al menos un vehículo para continuar con tu registro.
            </Alert>
          )}

          {errorTipos && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorTipos}
            </Alert>
          )}

          <Formik
            initialValues={
              editando !== null ? vehiculos[editando] : initialValuesVehiculo
            }
            validationSchema={vehiculoSchema}
            onSubmit={handleSubmitVehiculo}
            enableReinitialize
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              resetForm,
              isValid,
              dirty,
            }) => (
              <Form>
                <Box
                  sx={{
                    mb: 3,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    {editando !== null ? "Editar vehículo" : "Agregar nuevo vehículo"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                    Paso 3 de 4
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Elige el tipo adecuado para que podamos asignarte el lugar correcto.
                  </Typography>
                </Box>
                <Grid container spacing={3} rowSpacing={4} alignItems="flex-end">
                  {/* Tipo de vehículo */}
                  <Grid item xs={12} md={4}>
                    <FormControl
                      fullWidth
                      error={touched.tipoVehiculoId && Boolean(errors.tipoVehiculoId)}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mb: 0.5, fontWeight: 600 }}
                      >
                        Tipo de vehículo *
                      </Typography>
                      <Select
                        name="tipoVehiculoId"
                        value={values.tipoVehiculoId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        displayEmpty
                        disabled={loadingTipos}
                        sx={{
                          borderRadius: 3,
                          backgroundColor: "#f9fbff",
                          minHeight: 56,
                        }}
                        startAdornment={
                          loadingTipos ? (
                            <CircularProgress size={20} sx={{ ml: 1 }} />
                          ) : (
                            <CarIcon sx={{ ml: 1, mr: 1, color: "action.active" }} />
                          )
                        }
                      >
                        <MenuItem value="" disabled>
                          Selecciona el tipo de vehículo
                        </MenuItem>
                        {tiposVehiculo.map((tipo) => (
                          <MenuItem key={tipo.id} value={tipo.id}>
                            {tipo.nombre}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.tipoVehiculoId && errors.tipoVehiculoId && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                          {errors.tipoVehiculoId}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>

                  {/* Placa */}
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Placa *"
                      name="placa"
                      value={values.placa}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.placa && Boolean(errors.placa)}
                      helperText={touched.placa && errors.placa}
                      placeholder="ABC-123"
                      inputProps={{
                        maxLength: 7,
                        style: { textTransform: "uppercase" },
                      }}
                      required
                      sx={{
                        borderRadius: 3,
                        backgroundColor: "#f9fbff",
                      }}
                    />
                  </Grid>

                  {/* Modelo */}
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Modelo *"
                      name="modelo"
                      value={values.modelo}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.modelo && Boolean(errors.modelo)}
                      helperText={touched.modelo && errors.modelo}
                      placeholder="Ej: Civic 2020"
                      inputProps={{ maxLength: 50 }}
                      required
                      sx={{
                        borderRadius: 3,
                        backgroundColor: "#f9fbff",
                      }}
                    />
                  </Grid>

                  {/* Descripción */}
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      label="Descripción *"
                      name="descripcion"
                      value={values.descripcion}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.descripcion && Boolean(errors.descripcion)}
                      helperText={touched.descripcion && errors.descripcion}
                      placeholder="Ej: Sedán negro"
                      inputProps={{ maxLength: 50 }}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <DescriptionIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        borderRadius: 3,
                        backgroundColor: "#f9fbff",
                      }}
                    />
                  </Grid>

                  {/* Botones */}
                  <Grid item xs={12} md={4}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: { xs: "flex-start", md: "flex-end" },
                        alignItems: "flex-end",
                        gap: 2,
                        height: "100%",
                      }}
                    >
                      {editando !== null && (
                        <Button
                          variant="outlined"
                          onClick={() => handleCancelarEdicion(resetForm)}
                        >
                          Cancelar
                        </Button>
                      )}
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={editando !== null ? <EditIcon /> : <AddIcon />}
                        disabled={!isValid || !dirty}
                      >
                        {editando !== null ? "Guardar cambios" : "Agregar vehículo"}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Paper>

        {vehiculos.length > 0 && (
          <Paper
            elevation={2}
            sx={{
              borderRadius: 3,
              p: { xs: 3, md: 4 },
              backgroundColor: "#ffffff",
              boxShadow: "0 12px 24px rgba(15,23,42,0.08)",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Vehículos registrados ({vehiculos.length})
            </Typography>
            <Grid container spacing={2}>
              {vehiculos.map((vehiculo, index) => (
                <Grid item xs={12} key={index}>
                  <Card
                    sx={{
                      border: 1,
                      borderColor: "divider",
                      "&:hover": { boxShadow: 3 },
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 2,
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 1,
                            }}
                          >
                            <CarIcon color="primary" />
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                              {getTipoVehiculoNombre(vehiculo.tipoVehiculoId)}
                            </Typography>
                          </Box>
                          <Typography variant="body1" sx={{ mb: 0.5 }}>
                            <strong>Modelo:</strong> {vehiculo.modelo}
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 0.5 }}>
                            <strong>Placa:</strong> {vehiculo.placa}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Descripción:</strong> {vehiculo.descripcion}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                          }}
                        >
                          <IconButton
                            onClick={() => handleEditarClick(index)}
                            color="primary"
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => onRemover(index)}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}
      </Box>
    </Box>
  );
}
