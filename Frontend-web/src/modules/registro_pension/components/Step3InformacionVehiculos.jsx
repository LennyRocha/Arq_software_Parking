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
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  InputAdornment,
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

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, textAlign: "center" }}>
        Registra tu(s) vehículo(s)
      </Typography>

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

      {/* Formulario para agregar/editar vehículo */}
      <Formik
        initialValues={
          editando !== null
            ? vehiculos[editando]
            : initialValuesVehiculo
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
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {editando !== null ? "Editar vehículo" : "Agregar nuevo vehículo"}
                </Typography>

                <Grid container spacing={3}>
                  {/* Tipo de vehículo */}
                  <Grid item xs={12}>
                    <FormControl
                      fullWidth
                      error={touched.tipoVehiculoId && Boolean(errors.tipoVehiculoId)}
                    >
                      <InputLabel>Tipo de vehículo *</InputLabel>
                      <Select
                        name="tipoVehiculoId"
                        value={values.tipoVehiculoId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Tipo de vehículo *"
                        disabled={loadingTipos}
                        startAdornment={
                          loadingTipos ? (
                            <CircularProgress size={20} sx={{ ml: 1 }} />
                          ) : (
                            <CarIcon sx={{ ml: 1, mr: 1, color: "action.active" }} />
                          )
                        }
                      >
                        {tiposVehiculo.map((tipo) => (
                          <MenuItem key={tipo.id} value={tipo.id}>
                            {tipo.nombre}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.tipoVehiculoId && errors.tipoVehiculoId && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                          {errors.tipoVehiculoId}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>

                  {/* Placa */}
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Placa"
                      name="placa"
                      value={values.placa}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.placa && Boolean(errors.placa)}
                      helperText={touched.placa && errors.placa}
                      placeholder="ABC-123"
                      inputProps={{ maxLength: 7, style: { textTransform: 'uppercase' } }}
                      required
                    />
                  </Grid>

                  {/* Modelo */}
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Modelo"
                      name="modelo"
                      value={values.modelo}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.modelo && Boolean(errors.modelo)}
                      helperText={touched.modelo && errors.modelo}
                      placeholder="Ej: Civic 2020"
                      inputProps={{ maxLength: 50 }}
                      required
                    />
                  </Grid>

                  {/* Descripción */}
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Descripción"
                      name="descripcion"
                      value={values.descripcion}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.descripcion && Boolean(errors.descripcion)}
                      helperText={touched.descripcion && errors.descripcion}
                      placeholder="Ej: Sedán negro"
                      inputProps={{ maxLength: 50 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <DescriptionIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      required
                    />
                  </Grid>

                  {/* Botones */}
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={editando !== null ? <EditIcon /> : <AddIcon />}
                        disabled={!isValid || !dirty}
                        fullWidth
                      >
                        {editando !== null ? "Guardar cambios" : "Agregar vehículo"}
                      </Button>
                      {editando !== null && (
                        <Button
                          variant="outlined"
                          onClick={() => handleCancelarEdicion(resetForm)}
                          fullWidth
                        >
                          Cancelar
                        </Button>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Form>
        )}
      </Formik>

      {/* Lista de vehículos agregados */}
      {vehiculos.length > 0 && (
        <Box>
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
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
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
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
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
        </Box>
      )}
    </Box>
  );
}
