//Formulario para los perfiles de todos los usuarios
import * as React from "react";
import api from "../utils/api.js";
import { useState } from "react";
import sweetAlert from "../utils/sweetAlert.js";
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

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(true);

    const [editableFields, setEditableFields] = useState({
        nombre: false,
        apellido: false,
        correo: false,
        telefono: false,
        password: false,
    });

    const [formData, setFormData] = useState({
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

                <TextField
                    variant="filled"
                    fullWidth
                    label="Estatus"
                    value={formData.status}
                    disabled
                    sx={{ mb: 3 }}
                />

                {getInfoUser().role === "CLIENTE_PENSIONADO" && (
                    <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                        <TextField variant="filled" fullWidth label="Tipo de pensión" value={formData.tipoPension} disabled />
                        <TextField variant="filled" fullWidth label="Expiración" value={formData.expiracionPension} disabled />
                    </Box>
                )}

                <TextField
                    inputRef={refs.nombre}
                    variant="filled"
                    fullWidth
                    label="Nombre"
                    value={formData.nombre}
                    onChange={handleChange("nombre")}
                    disabled={!editableFields.nombre}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">

                                {fieldValidation.nombre !== null && (
                                    fieldValidation.nombre ? (
                                        <Tooltip title="Correcto">
                                            <CheckCircle sx={{ color: "green" }} />
                                        </Tooltip>
                                    ) : (
                                        <Tooltip title={validationMessages.nombre}>
                                            <Cancel sx={{ color: "red" }} />
                                        </Tooltip>
                                    )
                                )}

                                <IconButton onClick={() => handleEditClick("nombre")}>
                                    <Edit />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    sx={{ mb: 3 }}
                />

                <TextField
                    inputRef={refs.apellido}
                    variant="filled"
                    fullWidth
                    label="Apellido"
                    value={formData.apellido}
                    onChange={handleChange("apellido")}
                    disabled={!editableFields.apellido}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">

                                {fieldValidation.apellido !== null && (
                                    fieldValidation.apellido ? (
                                        <Tooltip title="Correcto">
                                            <CheckCircle sx={{ color: "green" }} />
                                        </Tooltip>
                                    ) : (
                                        <Tooltip title={validationMessages.apellido}>
                                            <Cancel sx={{ color: "red" }} />
                                        </Tooltip>
                                    )
                                )}

                                <IconButton onClick={() => handleEditClick("apellido")}>
                                    <Edit />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    sx={{ mb: 3 }}
                />

                <TextField
                    inputRef={refs.correo}
                    variant="filled"
                    fullWidth
                    label="Correo"
                    value={formData.correo}
                    onChange={handleChange("correo")}
                    disabled={!editableFields.correo}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">

                                {fieldValidation.correo !== null && (
                                    fieldValidation.correo ? (
                                        <Tooltip title="Correcto">
                                            <CheckCircle sx={{ color: "green" }} />
                                        </Tooltip>
                                    ) : (
                                        <Tooltip title={validationMessages.correo}>
                                            <Cancel sx={{ color: "red" }} />
                                        </Tooltip>
                                    )
                                )}

                                <IconButton onClick={() => handleEditClick("correo")}>
                                    <Edit />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    sx={{ mb: 3 }}
                />

                <TextField
                    inputRef={refs.telefono}
                    variant="filled"
                    fullWidth
                    label="Teléfono"
                    value={formData.telefono}
                    onChange={handleChange("telefono")}
                    disabled={!editableFields.telefono}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">

                                {fieldValidation.telefono !== null && (
                                    fieldValidation.telefono ? (
                                        <Tooltip title="Correcto">
                                            <CheckCircle sx={{ color: "green" }} />
                                        </Tooltip>
                                    ) : (
                                        <Tooltip title={validationMessages.telefono}>
                                            <Cancel sx={{ color: "red" }} />
                                        </Tooltip>
                                    )
                                )}

                                <IconButton onClick={() => handleEditClick("telefono")}>
                                    <Edit />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    sx={{ mb: 3 }}
                />

                <TextField
                    inputRef={refs.password}
                    variant="filled"
                    fullWidth
                    label="Nueva contraseña"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange("password")}
                    disabled={!editableFields.password}
                    InputProps={{
                        endAdornment: (
                            <>
                                <IconButton onClick={() => setShowPassword(prev => !prev)}>
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>

                                <IconButton onClick={() => handleEditClick("password")}>
                                    <Edit />
                                </IconButton>
                            </>
                        ),
                    }}
                    sx={{ mb: 4 }}
                />

                
                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleSubmit}
                    disabled={!isAnyFieldEditable}   
                    sx={{ padding: 1.5, bgcolor: "#0c4b4b" }}
                >
                    Guardar cambios
                </Button>



            </Paper>
        </Box>
    );
}
