import React from "react";
import {
  Select,
  MenuItem,
  FormControl,
  Typography,
  Box,
  FormHelperText
} from "@mui/material";

/**
 * CustomInputSelect - Componente de select personalizado con label
 * 
 * @description
 * Select reutilizable con label superior, estilos consistentes y validación de errores.
 * Diseñado para formularios con el diseño moderno del sistema.
 * 
 * @example
 * <CustomInputSelect
 *   labelText="Tipo de vehículo"
 *   value={tipoVehiculo}
 *   onChange={(e) => setTipoVehiculo(e.target.value)}
 *   options={tiposVehiculos}
 *   isObligatory={true}
 *   placeholder="Seleccione un tipo de vehículo"
 * />
 * 
 * @param {string} labelText - Texto del label que aparece sobre el select
 * @param {string|number} value - Valor actual del select
 * @param {Function} onChange - Función que se ejecuta al cambiar el valor
 * @param {Array} options - Array de opciones para el select [{id, nombre}, ...]
 * @param {boolean} [isObligatory=false] - Si el campo es obligatorio (muestra asterisco rojo)
 * @param {boolean} [isDisabled=false] - Si el campo está deshabilitado
 * @param {string} [placeholder="Seleccione una opción"] - Texto del placeholder
 * @param {boolean} [isWrong=false] - Si hay un error (muestra mensaje de error)
 * @param {string} [errorMessage=""] - Mensaje de error a mostrar
 * @param {string} [name=""] - Nombre del select para formularios
 * @param {string} [optionValue="id"] - Nombre de la propiedad que se usará como value
 * @param {string} [optionLabel="nombre"] - Nombre de la propiedad que se mostrará como texto
 */
const CustomInputSelect = ({
  labelText,
  value = "",
  onChange,
  options = [],
  isObligatory = false,
  isDisabled = false,
  setPlaceholder = true,
  placeholder = "Seleccione una opción",
  isWrong = false,
  errorMessage = "",
  name = "",
  optionValue = "id",
  optionLabel = "nombre",
  ...selectProps
}) => {
  return (
    <Box>
      <Typography
        component="label"
        sx={{
          color: "var(--primary)",
          fontWeight: "500",
          fontSize: "1rem",
          marginBottom: 1,
          display: "block"
        }}
      >
        {labelText} {isObligatory && <span style={{ color: "red" }}>*</span>}
      </Typography>
      <FormControl
        fullWidth
        size="small"
        error={isWrong}
        disabled={isDisabled}
      >
        <Select
          name={name}
          value={value}
          onChange={onChange}
          displayEmpty
          disabled={isDisabled}
          sx={{
            backgroundColor: isDisabled ? "#f0f0f0" : "#f5f5f5",
            borderRadius: 1,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: isWrong ? "red" : "#e0e0e0"
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: isWrong ? "red" : "var(--primary)"
            }
          }}
          {...selectProps}
        >
          {setPlaceholder && (
            <MenuItem value="" disabled>
              <em>{placeholder}</em>
            </MenuItem>)
          }

          {options?.map((option) => (
            <MenuItem key={option[optionValue]} value={option[optionValue]}>
              {option[optionLabel]}
            </MenuItem>
          ))}
        </Select>
        {isWrong && <FormHelperText>{errorMessage}</FormHelperText>}
      </FormControl>
    </Box>
  );
};

export default CustomInputSelect;
