import * as React from "react";
import api from "../utils/api.js";
import { useState } from "react";
import sweetAlert from "../utils/sweetAlert.js";
import { useTheme } from "@mui/material/styles";
import {
    Box,
    TextField,
    Button,
    Avatar,
    IconButton,
    InputAdornment,
    Paper,
    CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, Edit, CheckCircle, Cancel } from "@mui/icons-material";
import { getInfoUser } from "../utils/AuthService.jsx";
import { set } from "react-hook-form";

export default function Perfil() {
    const theme = useTheme();
    const [showPassword, setShowPassword] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [editableFields, setEditableFields] = React.useState({
        nombre: false,
        apellido: false,
        correo: false,
        telefono: false,
        password: false,
    });

    // Helper para estilos de TextField adaptados al tema
    const getTextFieldStyles = (isEditable, isDisabled = false) => ({
        backgroundColor: isDisabled 
            ? (theme.palette.mode === 'dark' ? theme.palette.action.disabledBackground : "#fafafa")
            : (isEditable 
                ? (theme.palette.mode === 'dark' ? theme.palette.action.hover : "#e6e6e6")
                : (theme.palette.mode === 'dark' ? theme.palette.background.paper : "#fafafa")),
        borderTopLeftRadius: "10px",
        borderTopRightRadius: "10px",
        mb: 3,
        borderBottom: isEditable
            ? `4px solid ${theme.palette.primary.main}`
            : `3px solid ${theme.palette.mode === 'dark' ? theme.palette.divider : "#103f3d"}`,
        "& .MuiFilledInput-root": {
            backgroundColor: "transparent",
            border: "none !important",
            "&::before": {
                borderBottom: "none !important",
            },
            "&::after": {
                borderBottom: "none !important",
            },
            "&.Mui-disabled": {
                backgroundColor: "transparent",
            }
        },
        "& .MuiFilledInput-underline:before": {
            borderBottom: "none !important",
        },
        "& .MuiFilledInput-underline:after": {
            borderBottom: "none !important",
        },
        "& .MuiInputBase-input": {
            color: theme.palette.text.primary,
            WebkitTextFillColor: theme.palette.text.primary,
        },
        "& .MuiInputBase-input.Mui-disabled": {
            color: theme.palette.text.secondary,
            WebkitTextFillColor: theme.palette.text.secondary,
        },
        "& .MuiInputLabel-root": {
            color: theme.palette.text.secondary,
        },
        transition: "0.3s",
    });

    const getLabelProps = () => ({
        style: {
            color: theme.palette.mode === 'dark' ? theme.palette.text.secondary : "#2c6f6b",
            fontSize: "17px",
        },
    });
    const [formData, setFormData] = React.useState({
        status: "",
        nombre: "",
        apellido: "",
        correo: "",
        telefono: "",
        password: "",
    });

    const [fieldValidation, setFieldValidation] = React.useState({
        nombre: null,
        apellido: null,
        correo: null,
        telefono: null,
    });

    const validateNombre = (value) => {
        if (!value) return null;
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        return regex.test(value);
    };

    const validateApellido = (value) => {
        if (!value) return null;
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        return regex.test(value);
    };

    const validateCorreo = (value) => {
        if (!value) return null;
        const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
        const isValid = regex.test(value);
        const hasNoUpperCase = value === value.toLowerCase();
        return isValid && hasNoUpperCase;
    };

    const validateTelefono = (value) => {
        if (!value) return null;
        // Solo números
        const regex = /^\d+$/;
        return regex.test(value);
    };

    React.useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = getInfoUser();

                if (user) {
                    setFormData((prev) => ({
                        ...prev,
                        nombre: user.nombre || user.name || prev.nombre,
                        apellido: user.apellidos || user.apellido || user.lastName || prev.apellido,
                        correo: user.correo || user.email || prev.correo,
                        telefono: user.telefono || user.phone || prev.telefono,
                        status: typeof user.status !== "undefined" ? (user.status ? "Activo" : "Inactivo") : prev.status,
                    }));
                }

                const userId = user && (user.id || user._id);
                if (userId) {
                    const response = await api.get(`/api/auth/consultarDatos/${userId}`);
                    const data = response.data.data;

                    setFormData({
                        status: data.status ? "Activo" : "Inactivo",
                        nombre: data.nombre || "",
                        apellido: data.apellidos || data.apellido || "",
                        correo: data.correo || data.email || "",
                        telefono: data.telefono || data.phone || "",
                        password: "",
                    });
                }

                setLoading(false);
            } catch (e) {
                console.error("Error al consultar los datos:", e);
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (field) => (event) => {
        const value = event.target.value;
        setFormData({
            ...formData,
            [field]: value,
        });

        if (field === "nombre") {
            setFieldValidation({ ...fieldValidation, nombre: validateNombre(value) });
        } else if (field === "apellido") {
            setFieldValidation({ ...fieldValidation, apellido: validateApellido(value) });
        } else if (field === "correo") {
            setFieldValidation({ ...fieldValidation, correo: validateCorreo(value) });
        } else if (field === "telefono") {
            setFieldValidation({ ...fieldValidation, telefono: validateTelefono(value) });
        }
    };

    const handleEditClick = (field) => {
        setEditableFields({
            ...editableFields,
            [field]: !editableFields[field],
        });
    };
const [estado, setEstado]= useState("");
  const handleSubmit = async () => {
    try {
      let errorsFound = [];

      if (editableFields.nombre) {
        const isNombreValid = validateNombre(formData.nombre);
        if (!isNombreValid) {
          errorsFound.push("Nombre: solo letras, espacios, acentos y ñ");
        }
      }

      if (editableFields.apellido) {
        const isApellidoValid = validateApellido(formData.apellido);
        if (!isApellidoValid) {
          errorsFound.push("Apellido: solo letras, espacios, acentos y ñ");
        }
      }

      if (editableFields.correo) {
        const isCorreoValid = validateCorreo(formData.correo);
        if (!isCorreoValid) {
          errorsFound.push("Correo: debe ser un email válido sin mayúsculas");
        }
      }

      if (editableFields.telefono) {
        const isTelefonoValid = validateTelefono(formData.telefono);
        if (!isTelefonoValid) {
          errorsFound.push("Teléfono: solo números permitidos");
        }
      }

      if (errorsFound.length > 0) {
        sweetAlert({
          title: "Validación fallida",
          text: errorsFound.join("\n"),
          icon: "error",
        });
        return;
      }

      const response = await api.post(`/api/auth/actualizarDatosUsuario`, {
        id: getInfoUser().id,
        nombre: formData.nombre,
        apellidos: formData.apellido,
        correo: formData.correo,
        telefono: formData.telefono,
      });
      console.log("Respuesta actualizar datos:", response);

      if (formData.password && formData.password.trim() !== "") {
        const response2 = await api.post(`/api/auth/actualizarContraUsuario`, {
          id: getInfoUser().id,
          contra: formData.password,
        });
        console.log("Respuesta actualizar contraseña:", response2);
      }

      setEditableFields({
        nombre: false,
        apellido: false,
        correo: false,
        telefono: false,
        password: false,
      });

      sweetAlert({
        title: "¡Éxito!",
        text: "Datos actualizados correctamente",
        icon: "success",
      });
    } catch (error) {
      console.error("Error al actualizar datos:", error);

    const backendErrors = error?.response?.data?.data || {};

    let mensajeError = "";
    if (backendErrors.contra) mensajeError += `${backendErrors.contra}\n`;
    if (backendErrors.nombre) mensajeError += `${backendErrors.nombre}\n`;
    if (backendErrors.apellidos) mensajeError += `${backendErrors.apellidos}\n`;
    if (backendErrors.correo) mensajeError += `${backendErrors.correo}\n`;
    if (backendErrors.telefono) mensajeError += `${backendErrors.telefono}\n`;

    if (!mensajeError) mensajeError = error?.response?.data?.message || "No se pudieron actualizar los datos. Intenta de nuevo.";

    sweetAlert({
      title: "Error",
      text: mensajeError,
      icon: "error",
    });
  }
};

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "calc(100vh - 200px)",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
  sx={{
    display: "flex",
    flexDirection: { xs: "column", sm: "row" }, 
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(100vh - 200px)",
    padding: { xs: 2, sm: 3 },
    gap: 2, 
  }}
>
              <Paper
    elevation={0}
    sx={{
      width: { xs: "100%", sm: "100%", md: "80%", lg: "100%" },
      maxWidth: 1000,
      padding: { xs: 2, sm: 4 },
      borderRadius: 2,
      boxSizing: "border-box",
    }}
  >
                <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                    <Box
                        sx={{
                            position: "relative",
                            borderRadius: 2,
                            p: 2,
                            display: "inline-block",
                        }}
                    >
                        <Avatar sx={{ width: 150, height: 150, bgcolor: "#e0e0e0" }} />
                    </Box>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box>
                        <TextField
                            variant="filled"
                            fullWidth
                            label="Estatus"
                            value={formData.status}
                            disabled
                            InputLabelProps={getLabelProps()}
                            sx={getTextFieldStyles(false, true)}
                        />
                    </Box>

                    <Box>

                        <TextField
                            variant="filled"
                            fullWidth
                            label="Nombre (s)"
                            value={formData.nombre}
                            name="nombre"
                            onChange={handleChange("nombre")}
                            disabled={!editableFields.nombre}
                            autoFocus={editableFields.nombre}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {fieldValidation.nombre !== null && (
                                            <>
                                                {fieldValidation.nombre ? (
                                                    <CheckCircle sx={{ color: "#4caf50", mr: 1, fontSize: "20px" }} />
                                                ) : (
                                                    <Cancel sx={{ color: "#f44336", mr: 1, fontSize: "20px" }} />
                                                )}
                                            </>
                                        )}
                                        <IconButton edge="end" size="small" onClick={() => handleEditClick("nombre")}>
                                            <Edit fontSize="small" />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            InputLabelProps={getLabelProps()}
                            sx={getTextFieldStyles(editableFields.nombre)}
                        />
                    </Box>

                    <Box>
                        <TextField
                            variant="filled"
                            fullWidth
                            label="Apellido (s)"
                            value={formData.apellido}
                            onChange={handleChange("apellido")}
                            disabled={!editableFields.apellido}
                            autoFocus={editableFields.apellido}
                            InputLabelProps={getLabelProps()}
                            sx={getTextFieldStyles(editableFields.apellido)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {fieldValidation.apellido !== null && (
                                            <>
                                                {fieldValidation.apellido ? (
                                                    <CheckCircle sx={{ color: "#4caf50", mr: 1, fontSize: "20px" }} />
                                                ) : (
                                                    <Cancel sx={{ color: "#f44336", mr: 1, fontSize: "20px" }} />
                                                )}
                                            </>
                                        )}
                                        <IconButton edge="end" size="small" onClick={() => handleEditClick("apellido")}>
                                            <Edit fontSize="small" />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    <Box>
                        <TextField
                            variant="filled"
                            fullWidth
                            type="email"
                            label="Correo"
                            value={formData.correo}
                            onChange={handleChange("correo")}
                            disabled={!editableFields.correo}
                            autoFocus={editableFields.correo}
                            InputLabelProps={getLabelProps()}
                            sx={getTextFieldStyles(editableFields.correo)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {fieldValidation.correo !== null && (
                                            <>
                                                {fieldValidation.correo ? (
                                                    <CheckCircle sx={{ color: "#4caf50", mr: 1, fontSize: "20px" }} />
                                                ) : (
                                                    <Cancel sx={{ color: "#f44336", mr: 1, fontSize: "20px" }} />
                                                )}
                                            </>
                                        )}
                                        <IconButton edge="end" size="small" onClick={() => handleEditClick("correo")}>
                                            <Edit fontSize="small" />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    <Box>
                        <TextField
                            variant="filled"
                            fullWidth
                            label="Teléfono"
                            value={formData.telefono}
                            onChange={handleChange("telefono")}
                            disabled={!editableFields.telefono}
                            autoFocus={editableFields.telefono}
                            InputLabelProps={getLabelProps()}
                            sx={getTextFieldStyles(editableFields.telefono)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {fieldValidation.telefono !== null && (
                                            <>
                                                {fieldValidation.telefono ? (
                                                    <CheckCircle sx={{ color: "#4caf50", mr: 1, fontSize: "20px" }} />
                                                ) : (
                                                    <Cancel sx={{ color: "#f44336", mr: 1, fontSize: "20px" }} />
                                                )}
                                            </>
                                        )}
                                        <IconButton edge="end" size="small" onClick={() => handleEditClick("telefono")}>
                                            <Edit fontSize="small" />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    <Box>
                        <TextField
                            variant="filled"
                            fullWidth
                            label="Contraseña"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange("password")}
                            disabled={!editableFields.password}
                            autoFocus={editableFields.password}
                            InputLabelProps={getLabelProps()}
                            sx={getTextFieldStyles(editableFields.password)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={editableFields.password ? handleClickShowPassword : () => handleEditClick("password")} edge="end" size="small">
                                            {editableFields.password ? (showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />) : <Edit fontSize="small" />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={!Object.values(editableFields).some(value => value === true)}
                        sx={{
                            backgroundColor: "var(--primary)",
                            color: "#fff",
                            p: 1.5,
                            mt: 2,
                            fontFamily: "Roboto, sans-serif",
                            fontWeight: "bold",
                            "&:hover": { 
                                backgroundColor: "var(--primary)", 
                                opacity: 0.9 
                            },
                            "&:disabled": {
                                backgroundColor: "#cccccc",
                                color: "#999999",
                                opacity: 0.6,
                            },
                        }}
                    >
                        Guardar
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}