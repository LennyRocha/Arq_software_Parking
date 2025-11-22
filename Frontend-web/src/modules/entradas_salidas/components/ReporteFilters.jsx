import React from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

/**
 * Componente de filtros para reportes de ganancias
 * @param {Object} props
 * @param {Array} props.orderOptions - Opciones de ordenamiento [{value, label}]
 * @param {string} props.orderBy - Campo por el que se ordena
 * @param {string} props.fechaInicial - Fecha inicial
 * @param {string} props.fechaFinal - Fecha final
 * @param {function} props.onOrderByChange - Manejador de cambio de campo de ordenamiento
 * @param {function} props.onFechaInicialChange - Manejador de cambio de fecha inicial
 * @param {function} props.onFechaFinalChange - Manejador de cambio de fecha final
 * @param {function} props.onSearch - Manejador de búsqueda
 * @param {function} props.onClearFilters - Manejador de limpiar filtros 
 */
export default function ReporteFilters({
  orderOptions,
  orderBy,
  fechaInicial,
  fechaFinal,
  onOrderByChange,
  onFechaInicialChange,
  onFechaFinalChange,
  onSearch,
  onClearFilters,
}) {
  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", flex: 1 }}>
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Ordenar por</InputLabel>
        <Select
          value={orderBy}
          label="Ordenar por"
          onChange={(e) => onOrderByChange(e.target.value)}
        >
          {orderOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Fecha inicial"
        type="date"
        size="small"
        value={fechaInicial}
        onChange={(e) => onFechaInicialChange(e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ minWidth: 200 }}
      />

      <TextField
        label="Fecha final"
        type="date"
        size="small"
        value={fechaFinal}
        onChange={(e) => onFechaFinalChange(e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ minWidth: 200 }}
      />

      <Button variant="outlined" onClick={onSearch}>
        BUSCAR
      </Button>
      <Button variant="outlined" onClick={onClearFilters}>
        LIMPIAR FILTROS
      </Button>
    </Box>
  );
}
