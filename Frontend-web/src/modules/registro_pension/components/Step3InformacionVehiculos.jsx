import React, { useState } from "react";
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
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";

export default function Step3InformacionVehiculos({
  vehiculos,
  onAgregar,
  onRemover,
  onEditar,
}) {
  const [nuevoVehiculo, setNuevoVehiculo] = useState({
    tipoVehiculo: "",
    marca: "",
    modelo: "",
    color: "",
    placa: "",
  });
  const [editando, setEditando] = useState(null);

  const handleChange = (e) => {
    setNuevoVehiculo({
      ...nuevoVehiculo,
      [e.target.name]: e.target.value,
    });
  };

  const handleAgregar = () => {
    if (editando !== null) {
      // Modo edición
      onEditar(editando, nuevoVehiculo);
      setEditando(null);
    } else {
      // Modo agregar
      onAgregar(nuevoVehiculo);
    }
    // Limpiar formulario
    setNuevoVehiculo({
      tipoVehiculo: "",
      marca: "",
      modelo: "",
      color: "",
      placa: "",
    });
  };

  const handleEditar = (index) => {
    setNuevoVehiculo(vehiculos[index]);
    setEditando(index);
  };

  const handleCancelarEdicion = () => {
    setNuevoVehiculo({
      tipoVehiculo: "",
      marca: "",
      modelo: "",
      color: "",
      placa: "",
    });
    setEditando(null);
  };

  const formularioCompleto =
    nuevoVehiculo.tipoVehiculo &&
    nuevoVehiculo.marca &&
    nuevoVehiculo.modelo &&
    nuevoVehiculo.color &&
    nuevoVehiculo.placa;

  return (
    <Box>
      {vehiculos.length === 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Agrega al menos un vehículo para continuar con tu registro.
        </Alert>
      )}

      {/* Formulario para agregar/editar vehículo */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {editando !== null ? "Editar vehículo" : "Agregar nuevo vehículo"}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tipo de vehículo"
                name="tipoVehiculo"
                value={nuevoVehiculo.tipoVehiculo}
                onChange={handleChange}
                placeholder="Ej: Automóvil, Motocicleta, Camioneta"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Marca"
                name="marca"
                value={nuevoVehiculo.marca}
                onChange={handleChange}
                placeholder="Ej: Toyota, Honda, Ford"
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Modelo"
                name="modelo"
                value={nuevoVehiculo.modelo}
                onChange={handleChange}
                placeholder="Ej: Corolla, Civic"
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Color"
                name="color"
                value={nuevoVehiculo.color}
                onChange={handleChange}
                placeholder="Ej: Rojo, Azul, Negro"
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Número de placa"
                name="placa"
                value={nuevoVehiculo.placa}
                onChange={handleChange}
                placeholder="Ej: ABC-123"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={editando !== null ? <EditIcon /> : <AddIcon />}
                  onClick={handleAgregar}
                  disabled={!formularioCompleto}
                  fullWidth
                >
                  {editando !== null ? "Guardar cambios" : "Agregar vehículo"}
                </Button>
                {editando !== null && (
                  <Button
                    variant="outlined"
                    onClick={handleCancelarEdicion}
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

      {/* Lista de vehículos agregados */}
      {vehiculos.length > 0 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Vehículos registrados ({vehiculos.length})
          </Typography>
          <Grid container spacing={2}>
            {vehiculos.map((vehiculo, index) => (
              <Grid item xs={12} key={index}>
                <Card>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                          {vehiculo.marca} {vehiculo.modelo} - {vehiculo.color}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {vehiculo.tipoVehiculo} • Placa: {vehiculo.placa}
                        </Typography>
                      </Box>
                      <Box>
                        <IconButton
                          onClick={() => handleEditar(index)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => onRemover(index)}
                          color="error"
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
