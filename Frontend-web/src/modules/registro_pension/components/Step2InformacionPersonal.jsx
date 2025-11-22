import React from "react";
import { Grid, TextField, Box } from "@mui/material";

export default function Step2InformacionPersonal({ formData, onChange }) {
  const handleChange = (e) => {
    onChange(e.target.name, e.target.value);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Nombre completo"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            placeholder="Ej: Juan Pérez García"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Correo electrónico"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="ejemplo@correo.com"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Teléfono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
            placeholder="777 123 4567"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
