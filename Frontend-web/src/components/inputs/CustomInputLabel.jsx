import React from "react";
import {
  TextField,
  Typography,
  Box
} from "@mui/material";

/**
 * CustomInputLabel - Componente de input personalizado con label
 * 
 * @description
 * Input reutilizable con label superior, estilos consistentes y validación de errores.
 * Diseñado para formularios con el diseño moderno del sistema.
 * 
 * @example
 * <CustomInputLabel
 *   labelText="Nombre"
 *   value={nombre}
 *   onChange={(e) => setNombre(e.target.value)}
 *   isObligatory={true}
 *   placeholder="Ingrese su nombre"
 * />
 * 
 * @param {string} labelText - Texto del label que aparece sobre el input
 * @param {string} value - Valor actual del input
 * @param {Function} onChange - Función que se ejecuta al cambiar el valor
 * @param {boolean} [isObligatory=false] - Si el campo es obligatorio (muestra asterisco rojo)
 * @param {boolean} [isDisabled=false] - Si el campo está deshabilitado
 * @param {string} [placeholder=""] - Texto de placeholder
 * @param {boolean} [isWrong=false] - Si hay un error (muestra mensaje de error)
 * @param {string} [errorMessage=""] - Mensaje de error a mostrar
 * @param {string} [name=""] - Nombre del input para formularios
 * @param {string} [type="text"] - Tipo de input (text, number, email, password, etc.)
 * @param {number} [max=null] - Valor máximo para inputs tipo number
 * @param {number} [maxLength=null] - Longitud máxima de caracteres
 * @param {number} [min=null] - Valor mínimo para inputs tipo number
 * @param {boolean} [readOnly=false] - Si el campo es de solo lectura
 */
const CustomInputLabel = ({
  labelText,
  value = "",
  onChange,
  isObligatory = false,
  isDisabled = false,
  placeholder = "",
  isWrong = false,
  errorMessage = "",
  name = "",
  type = "text",
  max = null,
  maxLength = null,
  min = null,
  readOnly = false,
  ...inputProps
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
      <TextField
        fullWidth
        size="small"
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={isDisabled}
        error={isWrong}
        helperText={isWrong ? errorMessage : ""}
        inputProps={{
          max: max,
          maxLength: maxLength,
          min: min,
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

export default CustomInputLabel;
