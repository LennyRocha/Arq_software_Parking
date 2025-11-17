import React from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  MenuItem,
  Select,
} from "@mui/material";

/**
 * Componente reutilizable para filtros de tabla
 * @param {Object} props
 * @param {Array} props.orderOptions - Opciones de ordenamiento [{value, label}]
 * @param {string} props.orderBy - Campo por el que se ordena
 * @param {string} props.orderDirection - Dirección del ordenamiento (asc/desc)
 * @param {string} props.searchText - Texto de búsqueda
 * @param {string} props.searchPlaceholder - Placeholder para el campo de búsqueda
 * @param {function} props.onOrderByChange - Manejador de cambio de campo de ordenamiento
 * @param {function} props.onOrderDirectionChange - Manejador de cambio de dirección
 * @param {function} props.onSearchChange - Manejador de cambio de texto de búsqueda
 * @param {function} props.onSearch - Manejador de búsqueda
 * @param {function} props.onClearFilters - Manejador de limpiar filtros 
 */
export default function TableFilters({
  orderOptions,
  orderBy,
  orderDirection,
  searchText,
  searchPlaceholder = "Buscar",
  onOrderByChange,
  onOrderDirectionChange,
  onSearchChange,
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

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Dirección</InputLabel>
        <Select
          value={orderDirection}
          label="Dirección"
          onChange={(e) => onOrderDirectionChange(e.target.value)}
        >
          <MenuItem value="asc">Ascendente</MenuItem>
          <MenuItem value="desc">Descendente</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Buscar</InputLabel>
        <OutlinedInput
          label="Buscar"
          placeholder={searchPlaceholder}
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </FormControl>

      <Button variant="outlined" onClick={onSearch}>
        BUSCAR
      </Button>
      <Button variant="outlined" onClick={onClearFilters}>
        LIMPIAR FILTROS
      </Button>
    </Box>
  );
}