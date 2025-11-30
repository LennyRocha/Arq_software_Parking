//Formulario para los perfiles de todos los usuarios
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
    Tooltip
} from "@mui/material";
import { Visibility, VisibilityOff, Edit, CheckCircle, Cancel } from "@mui/icons-material";
import { getInfoUser, getToken } from "../utils/AuthService.jsx";

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
        tipoPension: "",
        expiracionPension: "",
    });

    const [fieldValidation, setFieldValidation] = useState({
        nombre: null,
        apellido: null,
        correo: null,
        telefono: null,
    });

    const validationMessages = {
        nombre: "El nombre debe tener entre 3 y 25 caracteres y solo letras.",
        correo: "El correo debe tener entre 5 y 30 caracteres y un formato válido.",
        apellido: "Los apellidos deben tener entre 3 y 25 caracteres y solo letras.",
        telefono: "El teléfono debe tener entre 10 y 15 dígitos.",
    };

    const validateNombre = (value) =>
        value.length >= 3 && value.length <= 25 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value);

    const validateApellido = (value) =>
        value.length >= 3 && value.length <= 25 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value);

    const validateCorreo = (value) => {
        const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
        return (
            value.length >= 5 &&
            value.length <= 30 &&
            regex.test(value) &&
            value === value.toLowerCase()
        );
    };

    const validateTelefono = (value) =>
        value.length >= 10 && value.length <= 15 && /^\d+$/.test(value);

    React.useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = getInfoUser();
                if (user) {
                    setFormData(prev => ({
                        ...prev,
                        nombre: user.nombre || user.name || prev.nombre,
                        apellido: user.apellidos || user.apellido || prev.apellido,
                        correo: user.correo || user.email || prev.correo,
                        telefono: user.telefono || user.phone || prev.telefono,
                        status: user.status ? "Activo" : "Inactivo",
                    }));
                }

                const userId = user?.id || user?._id;

                if (userId) {
                    const response = await api.get(`/api/auth/consultarDatos/${userId}`);
                    const data = response.data.data;

                    setFormData(prev => ({
                        ...prev,
                        status: data.status ? "Activo" : "Inactivo",
                        nombre: data.nombre,
                        apellido: data.apellidos || data.apellido,
                        correo: data.correo,
                        telefono: data.telefono,
                    }));
                }

                if (getInfoUser().role === "CLIENTE_PENSIONADO") {
                    try {
                        const respuesta = await api.get("/api/pensionado/cliente/mi-pension", {
                            headers: { Authorization: `Bearer ${getToken()}` },
                        });

                        setFormData(prev => ({
                            ...prev,
                            tipoPension: respuesta.data.data.nombrePension || "",
                            expiracionPension: respuesta.data.data.fechaFinalizacion || "",
                        }));
                    } catch (e) { }
                }

                setLoading(false);
            } catch (e) {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const refs = {
        nombre: React.useRef(null),
        apellido: React.useRef(null),
        correo: React.useRef(null),
        telefono: React.useRef(null),
        password: React.useRef(null),
    };

    React.useEffect(() => {
        Object.keys(editableFields).forEach(field => {
            if (editableFields[field]) {
                refs[field]?.current?.focus();
            }
        });
    }, [editableFields]);

    const handleChange = (field) => (event) => {
        const value = event.target.value;
        setFormData({ ...formData, [field]: value });

        if (field === "nombre") setFieldValidation(prev => ({ ...prev, nombre: validateNombre(value) }));
        if (field === "apellido") setFieldValidation(prev => ({ ...prev, apellido: validateApellido(value) }));
        if (field === "correo") setFieldValidation(prev => ({ ...prev, correo: validateCorreo(value) }));
        if (field === "telefono") setFieldValidation(prev => ({ ...prev, telefono: validateTelefono(value) }));
    };

    const handleEditClick = (field) => {
        setEditableFields(prev => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleSubmit = async () => {
        try {

            const response = await api.post(`/api/auth/actualizarDatosUsuario`, {
                id: getInfoUser().id,
                nombre: formData.nombre,
                apellidos: formData.apellido,
                correo: formData.correo,
                telefono: formData.telefono,
            });

            if (formData.password.trim() !== "") {
                await api.post(`/api/auth/actualizarContraUsuario`, {
                    id: getInfoUser().id,
                    contra: formData.password,
                });
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

        } catch (error) { }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
                <CircularProgress />
            </Box>
        );
    }


    const isAnyFieldEditable = Object.values(editableFields).some(value => value === true);



    return (
        <Box sx={{ display: "flex", justifyContent: "center", padding: 3 }}>
            <Paper sx={{ width: "100%", maxWidth: 900, padding: 4, borderRadius: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                    <Avatar sx={{ width: 150, height: 150, bgcolor: "#e0e0e0" }} />
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
                )}

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
