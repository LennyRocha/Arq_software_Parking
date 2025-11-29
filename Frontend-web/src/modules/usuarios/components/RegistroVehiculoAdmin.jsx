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
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Radio,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  DirectionsCar as CarIcon,
  Description as DescriptionIcon,
  Done as DoneIcon,
} from "@mui/icons-material";
import { Formik, Form } from "formik";
import { useNavigate, useLocation } from "react-router-dom";
import { vehiculoSchema, initialValuesVehiculo } from "../../registro_pension/config/validationSchemas";
import { fetchTiposVehiculo } from "../../registro_pension/api/registroPensionApi";
import { fetchTiposPension } from "../../tipo_pension/api/TiposPensionApi";
import { getAxiosErrorMessage } from "../../../utils/getAxiosMessage";
import MainHeader from "../../../components/MainHeader";

const links = [
  { nombre: "Usuarios", ruta: "/admin/usuarios", disabled: false },
  { nombre: "Registrar usuario pensionado", ruta: "/admin/usuarios/registrar", disabled: false },
  { nombre: "Registrar vehículo", ruta: "/admin/usuarios/registrar/vehiculo", disabled: true },
];

export default function RegistroVehiculoAdmin({ onCancel, onFinalizar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [vehiculos, setVehiculos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [tiposVehiculo, setTiposVehiculo] = useState([]);
  const [loadingTipos, setLoadingTipos] = useState(false);
  const [errorTipos, setErrorTipos] = useState(null);
  const [openModalTipoPension, setOpenModalTipoPension] = useState(false);
  const [tiposPension, setTiposPension] = useState([]);
  const [loadingTiposPension, setLoadingTiposPension] = useState(false);
  const [tipoPensionSeleccionado, setTipoPensionSeleccionado] = useState(null);
  const [openModalExito, setOpenModalExito] = useState(false);

  // Obtener datos del usuario desde la ubicación si están disponibles
  const usuarioData = location.state?.usuarioData || null;

  useEffect(() => {
    cargarTiposVehiculo();
    if (openModalTipoPension) {
      cargarTiposPension();
    }
  }, [openModalTipoPension]);

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
      const nuevosVehiculos = [...vehiculos];
      nuevosVehiculos[editando] = values;
      setVehiculos(nuevosVehiculos);
      setEditando(null);
    } else {
      // Modo agregar
      setVehiculos([...vehiculos, values]);
    }
    resetForm();
  };

  const handleEditarClick = (index) => {
    setEditando(index);
  };

  const handleRemoverVehiculo = (index) => {
    setVehiculos(vehiculos.filter((_, i) => i !== index));
    if (editando === index) {
      setEditando(null);
    } else if (editando > index) {
      setEditando(editando - 1);
    }
  };

  const handleCancelarEdicion = (resetForm) => {
    resetForm();
    setEditando(null);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/admin/usuarios/registrar", { state: { usuarioData } });
    }
  };

  const cargarTiposPension = async () => {
    setLoadingTiposPension(true);
    try {
      const response = await fetchTiposPension();
      if (response.data && response.data.data) {
        // Filtrar solo tipos de pensión activos
        const tiposActivos = response.data.data.filter((tipo) => tipo.status === true);
        setTiposPension(tiposActivos);
      }
    } catch (error) {
      console.error("Error al cargar tipos de pensión:", error);
    } finally {
      setLoadingTiposPension(false);
    }
  };

  const handleFinalizar = () => {
    // Abrir modal para seleccionar tipo de pensión
    setOpenModalTipoPension(true);
  };

  const handleCerrarModalTipoPension = () => {
    setOpenModalTipoPension(false);
    setTipoPensionSeleccionado(null);
  };

  const handleConfirmarTipoPension = () => {
    if (tipoPensionSeleccionado) {
      // Cerrar el modal de selección de pensión
      setOpenModalTipoPension(false);
      
      // Abrir modal de éxito
      setOpenModalExito(true);
    }
  };

  const handleCerrarModalExito = () => {
    setOpenModalExito(false);
    // Aquí se puede procesar con el tipo de pensión seleccionado
    console.log("Tipo de pensión seleccionado:", tipoPensionSeleccionado);
    console.log("Vehículos:", vehiculos);
    console.log("Usuario data:", usuarioData);
    
    // Aquí se puede continuar con el registro completo
    if (onFinalizar) {
      onFinalizar({ vehiculos, tipoPensionId: tipoPensionSeleccionado });
    } else {
      navigate("/admin/gestion_usuarios");
    }
  };

  const getTipoVehiculoNombre = (id) => {
    const tipo = tiposVehiculo.find((t) => t.id === id);
    return tipo ? tipo.nombre : "Desconocido";
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

  return (
    <>
      <MainHeader titulo="REGISTRO DE VEHÍCULOS" breads={links} icon={true} />

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
              Registro de Vehículos
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              sx={{ maxWidth: 640, mx: "auto" }}
            >
              Agrega los vehículos del usuario pensionado. Puedes agregar uno o más vehículos.
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
              {vehiculos.length === 0 && (
                <Alert severity="info" sx={{ mb: 3 }}>
                  Agrega al menos un vehículo para el usuario pensionado.
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
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {editando !== null ? "Editar vehículo" : "Agregar nuevo vehículo"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Elige el tipo adecuado para asignar el lugar correcto.
                      </Typography>
                    </Box>

                    <Grid container spacing={3} rowSpacing={4} alignItems="flex-end">
                      {/* Tipo de vehículo */}
                      <Grid item xs={12} md={4}>
                        <FormControl
                          fullWidth
                          error={touched.tipoVehiculoId && Boolean(errors.tipoVehiculoId)}
                          disabled={loadingTipos}
                        >
                          <InputLabel shrink={true}>Tipo de vehículo *</InputLabel>
                          <Select
                            name="tipoVehiculoId"
                            value={values.tipoVehiculoId}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Tipo de vehículo *"
                            displayEmpty
                            disabled={loadingTipos}
                            sx={{
                              borderRadius: 3,
                              backgroundColor: "#fbfbff",
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "rgba(15, 23, 42, 0.08)",
                              },
                            }}
                            startAdornment={
                              loadingTipos ? (
                                <InputAdornment position="start">
                                  <CircularProgress size={20} sx={{ ml: 1 }} />
                                </InputAdornment>
                              ) : (
                                <InputAdornment position="start">
                                  <CarIcon sx={{ ml: 1, mr: 1, color: "action.active" }} />
                                </InputAdornment>
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
                          sx={formFieldSx}
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
                          sx={formFieldSx}
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
                          sx={formFieldSx}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <DescriptionIcon color="action" />
                              </InputAdornment>
                            ),
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
                            sx={{
                              backgroundColor: "var(--primary)",
                              "&:hover": {
                                backgroundColor: "var(--primary)",
                                opacity: 0.9,
                              },
                            }}
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

            {/* Lista de vehículos agregados */}
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
                                onClick={() => handleRemoverVehiculo(index)}
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

            {/* Botones de acción */}
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
                onClick={handleCancel}
                sx={{
                  minWidth: 120,
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                onClick={handleFinalizar}
                disabled={vehiculos.length === 0}
                sx={{
                  minWidth: 120,
                  backgroundColor: "var(--primary)",
                  "&:hover": {
                    backgroundColor: "var(--primary)",
                    opacity: 0.9,
                  },
                }}
              >
                Siguiente
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Modal de Selección de Tipo de Pensión */}
      <Dialog
        open={openModalTipoPension}
        onClose={handleCerrarModalTipoPension}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            color: "var(--primary)",
            fontWeight: "bold",
            fontSize: "1.5rem",
            pb: 2,
          }}
        >
          Registrar vehículo
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
            Selecciona el tipo de pensión para el usuario pensionado
          </Typography>

          {loadingTiposPension ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Tipo pensión</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      Costo pensión ($ MXN)
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tiposPension.map((tipo) => (
                    <TableRow
                      key={tipo.id}
                      onClick={() => setTipoPensionSeleccionado(tipo.id)}
                      sx={{
                        cursor: "pointer",
                        backgroundColor:
                          tipoPensionSeleccionado === tipo.id
                            ? "action.selected"
                            : "transparent",
                        "&:hover": {
                          backgroundColor: "action.hover",
                        },
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Radio
                            checked={tipoPensionSeleccionado === tipo.id}
                            onChange={() => setTipoPensionSeleccionado(tipo.id)}
                            value={tipo.id}
                            sx={{
                              color: "var(--primary)",
                              "&.Mui-checked": {
                                color: "var(--primary)",
                              },
                            }}
                          />
                          {tipo.nombre}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        ${tipo.costo?.toFixed(2) || "0.00"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 2, justifyContent: "space-between" }}>
          <Button
            onClick={handleCerrarModalTipoPension}
            variant="outlined"
            sx={{
              minWidth: 100,
              backgroundColor: "#ffffff",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            Anterior
          </Button>
          <Button
            onClick={handleConfirmarTipoPension}
            variant="contained"
            disabled={!tipoPensionSeleccionado || loadingTiposPension}
            sx={{
              minWidth: 100,
              backgroundColor: "var(--primary)",
              "&:hover": {
                backgroundColor: "var(--primary)",
                opacity: 0.9,
              },
            }}
          >
            Siguiente
          </Button>
        </DialogActions>
      </Dialog>

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
            {/* Círculo con borde verde sin relleno */}
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                border: "3px solid #4caf50",
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
            El pago fue registrado exitosamente.
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

