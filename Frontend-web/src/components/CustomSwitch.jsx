import React from 'react';
import { FormControlLabel, Switch, Typography, Box } from '@mui/material';

/**
 * CustomSwitch - Componente de switch personalizado
 * 
 * @param {Object} props
 * @param {string} props.label - Etiqueta del switch
 * @param {boolean} props.checked - Estado del switch
 * @param {function} props.onChange - Función que se ejecuta al cambiar el estado
 * @param {string} props.color - Color del switch (primary, secondary, etc.)
 * @param {boolean} props.disabled - Si el switch está deshabilitado
 */
export default function CustomSwitch({
  label,
  checked,
  onChange,
  color = "primary",
  disabled = false
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <FormControlLabel
        control={
          <Switch
            checked={checked}
            onChange={onChange}
            color={color}
            disabled={disabled}
          />
        }
        label={
          <Typography variant="body1">
            {label}
          </Typography>
        }
      />
    </Box>
  );
}
