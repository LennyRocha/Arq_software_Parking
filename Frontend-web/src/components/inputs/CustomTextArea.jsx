import React from "react";
import {
  TextField,
  Typography,
  Box
} from "@mui/material";

/**
 * CustomTextArea - Componente de textarea personalizado con label
 * 
 * @description
 * TextArea reutilizable con label superior, estilos consistentes y validación de errores.
 * Diseñado para formularios con el diseño moderno del sistema.
 * 
 * @example
 * <CustomTextArea
 *   labelText="Descripción"
 *   value={descripcion}
 *   onChange={(e) => setDescripcion(e.target.value)}
 *   isObligatory={true}
 *   placeholder="Ingrese una descripción"
 *   rows={4}
 * />
 * 
 * @param {string} labelText - Texto del label que aparece sobre el textarea
 * @param {string} value - Valor actual del textarea
 * @param {Function} onChange - Función que se ejecuta al cambiar el valor
 * @param {boolean} [isObligatory=false] - Si el campo es obligatorio (muestra asterisco rojo)
 * @param {boolean} [isDisabled=false] - Si el campo está deshabilitado
 * @param {string} [placeholder=""] - Texto de placeholder
 * @param {boolean} [isWrong=false] - Si hay un error (muestra mensaje de error)
 * @param {string} [errorMessage=""] - Mensaje de error a mostrar
 * @param {string} [name=""] - Nombre del textarea para formularios
 * @param {number} [rows=4] - Número de filas del textarea
 * @param {number} [maxLength=null] - Longitud máxima de caracteres
 * @param {boolean} [readOnly=false] - Si el campo es de solo lectura
 */
const CustomTextArea = ({
  labelText,
  value = "",
  onChange,
  isObligatory = false,
  isDisabled = false,
  placeholder = "",
  isWrong = false,
  errorMessage = "",
  name = "",
  rows = 4,
  maxLength = null,
  readOnly = false,
  ...inputProps
}) => {
  return (
    <Box sx={{ mb: 2 }}>
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
      <TextField
        fullWidth
        multiline
        rows={rows}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={isDisabled}
        error={isWrong}
        helperText={isWrong ? errorMessage : ""}
        inputProps={{
          maxLength: maxLength,
          readOnly: readOnly,
          ...inputProps
        }}
        sx={{
          backgroundColor: isDisabled ? "#f0f0f0" : "#f5f5f5",
          borderRadius: 1,
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: isWrong ? "red" : "#e0e0e0"
            },
            "&:hover fieldset": {
              borderColor: isWrong ? "red" : "var(--primary)"
            }
          }
        }}
      />
    </Box>
  );
};

export default CustomTextArea;
