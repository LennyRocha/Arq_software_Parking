import React, { useState } from "react";
import api from "../utils/api";
import { getInfoUser } from "../utils/AuthService";
import Logo from "../img/logo_parking copy.png";
import ciudad from "../img/fondo.png";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import sweetAlert from "../utils/sweetAlert";

import {
    Box,
    TextField,
    Button,
    Typography,
    IconButton,
    InputAdornment,
    Paper,
} from "@mui/material";

// Importamos los iconos necesarios para la validación
import { Visibility, VisibilityOff, CheckCircle, Cancel } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function ActualizacionContra() {
    const navigate = useNavigate();
    const [codigo, setCodigo] = useState(["", "", "", "", "", ""]);
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });

    // Estado para la validación visual (null = sin validar, true = correcto, false = error)
    const [fieldValidation, setFieldValidation] = useState({
        password: null,
        confirmPassword: null,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // --- FUNCIONES DE VALIDACIÓN ---
    const validatePassword = (value) => {
        // Ejemplo: Mínimo 6 caracteres
        return value.length >= 8;
    };

    const validateMatch = (value, compareValue) => {
        if (!value) return null;
        return value === compareValue && value.length >= 6;
    };

    // --- MANEJO DEL CÓDIGO ---
    const handleCodigoChange = (index, value) => {
        if (value.length <= 1 && /^[0-9]*$/.test(value)) {
            const newCodigo = [...codigo];
            newCodigo[index] = value;
            setCodigo(newCodigo);

            if (value && index < 5) {
                const nextInput = document.getElementById(`codigo-${index + 1}`);
                if (nextInput) nextInput.focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !codigo[index] && index > 0) {
            const prevInput = document.getElementById(`codigo-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    // --- MANEJO DE CAMBIOS EN INPUTS ---
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Actualizamos los datos del formulario
        setFormData((prev) => {
            const newData = { ...prev, [name]: value };

            // Validamos en tiempo real basándonos en el NUEVO estado de los datos
            if (name === "password") {
                setFieldValidation((prevValid) => ({
                    ...prevValid,
                    password: validatePassword(value),
                    // Si ya hay algo escrito en confirmar, re-validamos si coinciden
                    confirmPassword: newData.confirmPassword ? validateMatch(newData.confirmPassword, value) : null
                }));
            }

            if (name === "confirmPassword") {
                setFieldValidation((prevValid) => ({
                    ...prevValid,
                    confirmPassword: validateMatch(value, newData.password)
                }));
            }

            return newData;
        });
    };

    const codigoCorrecto = localStorage.getItem("codigoRecuperacion");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const codigoIngresado = codigo.join("");

        if (codigoIngresado !== codigoCorrecto) {
            sweetAlert({
                title: "Código incorrecto",
                text: "El código no coincide",
                icon: "error",
            });
            setLoading(false);
            return;
        }

        // Validación final antes de enviar
        if (!fieldValidation.password || !fieldValidation.confirmPassword) {
            sweetAlert({
                title: "Error de validación",
                text: "Asegúrate de que la contraseña tenga al menos 6 caracteres y coincidan.",
                icon: "error",
            });
            setLoading(false);
            return;
        }

        try {
            const user = getInfoUser();
            const response = await api.post(`/api/auth/actualizarContraUsuario`, {
                id: localStorage.getItem("userId"),
                contra: formData.password,
            });

            const apiResponse = response.data;

            if (!apiResponse.success) {
                const apiMessage = specificContraError || apiResponse.data.contra || "No se pudo actualizar la contraseña";
                console.log("mensaje", apiMessage)
                sweetAlert({
                    title: "Error",
                    text: apiMessage,
                    icon: "error",
                });
                setLoading(false);
                return;
            }

            sweetAlert({
                title: "Contraseña actualizada",
                text: "Tu contraseña se actualizó correctamente",
                icon: "success",
            });
            localStorage.removeItem("userId");
            localStorage.removeItem("codigoRecuperacion");
            navigate("/login");

        } catch (error) {

            const apiMessage = error?.response?.data?.data?.contra;

            sweetAlert({
                title: "Error",
                text: apiMessage,
                icon: "error",
            });
        }
        setLoading(false);
    };

    const isFormValid = () => {
        return (
            codigo.every((digit) => digit !== "") &&
            fieldValidation.password === true &&
            fieldValidation.confirmPassword === true
        );
    };

    return (
        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
                width: "100%",
                flexDirection: { xs: "column", md: "row" },
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    bgcolor: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    overflow: "hidden",
                    paddingX: { xs: 2, sm: 4 },
                    paddingY: { xs: 4, md: 0 },
                }}
            >
                <IconButton
                    onClick={() => navigate("/recuperacion-contraseña")}
                    sx={{
                        position: "absolute",
                        top: { xs: 10, sm: 20 },
                        left: { xs: 10, sm: 20 },
                        color: "#0F4C4C",
                        padding: "12px",
                        width: "48px",
                        height: "48px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        transform: "translateZ(0)",
                    }}
                >
                    <ArrowBackIosNewIcon fontSize="large" />
                </IconButton>

                <Paper
                    elevation={0}
                    sx={{
                        boxShadow: "none",
                        border: "none",
                        padding: { xs: 2, sm: 3, md: 4 },
                        width: "100%",
                        maxWidth: { xs: 380, sm: 450, md: 520 },
                        zIndex: 20,
                        position: "relative",
                        backgroundColor: "transparent",
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            textAlign: "center",
                            fontWeight: "bold",
                            color: "#144e4a",
                            marginBottom: 2,
                        }}
                    >
                        Actualización de contraseña
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            textAlign: "center",
                            color: "#144e4a",
                            marginBottom: 4,
                        }}
                    >
                        Por favor, ingresa el código que te enviamos a tu correo electrónico y
                        actualiza tu contraseña.
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <Typography
                            variant="body2"
                            sx={{
                                textAlign: "center",
                                color: "#2c6f6b",
                                marginBottom: 2,
                                fontWeight: 500,
                            }}
                        >
                            Código de verificación
                        </Typography>

                        {/* INPUTS DEL CÓDIGO */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 1,
                                marginBottom: 4,
                            }}
                        >
                            {codigo.map((digit, index) => (
                                <TextField
                                    key={index}
                                    id={`codigo-${index}`}
                                    value={digit}
                                    onChange={(e) => handleCodigoChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    inputProps={{
                                        maxLength: 1,
                                        style: {
                                            textAlign: "center",
                                            fontSize: "24px",
                                            fontWeight: "bold",
                                        },
                                    }}
                                    sx={{
                                        width: "50px",
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "8px",
                                            backgroundColor: "#f5f5f5",
                                            "& fieldset": {
                                                borderColor: "#2c6f6b",
                                                borderWidth: "2px",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "#144e4a",
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "#103f3d",
                                            },
                                        },
                                    }}
                                />
                            ))}
                        </Box>

                        {/* CONTRASEÑA */}
                        <TextField
                            variant="filled"
                            fullWidth
                            type={showPassword ? "text" : "password"}
                            label="Nueva contraseña*"
                            value={formData.password}
                            name="password"
                            onChange={handleChange}
                            helperText={
                                formData.password && formData.password.length < 8
                                    ? "La contraseña debe tener al menos 8 caracteres"
                                    : " "
                            }
                            FormHelperTextProps={{
                                style: { color:  "red", fontWeight: 500 } // <-- color amarillo
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {fieldValidation.password !== null && (
                                            fieldValidation.password
                                                ? <CheckCircle sx={{ color: "#4caf50", mr: 1, fontSize: "20px" }} />
                                                : <Cancel sx={{ color: "#f44336", mr: 1, fontSize: "20px" }} />
                                        )}
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            InputLabelProps={{ style: { color: "#2c6f6b", fontSize: "17px" } }}
                            sx={{
                                backgroundColor: "#e6e6e6",
                                borderTopLeftRadius: "10px",
                                borderTopRightRadius: "10px",
                                mb: 3,
                                borderBottom: "4px solid #103f3d",
                                "& .MuiFilledInput-root": { backgroundColor: "transparent" },
                                "& .MuiFilledInput-underline:before": { borderBottom: "none" },
                                "& .MuiFilledInput-underline:after": { borderBottom: "none" },
                                transition: "0.3s",
                            }}
                        />


                        <TextField
                            variant="filled"
                            fullWidth
                            type={showConfirmPassword ? "text" : "password"}
                            label="Confirma la nueva contraseña*"
                            value={formData.confirmPassword}
                            name="confirmPassword"
                            onChange={handleChange}
                            helperText={
                                formData.confirmPassword.length < 8
                                    ? "La contraseña debe tener al menos 8 caracteres"
                                    : fieldValidation.confirmPassword === false
                                        ? "Las contraseñas no coinciden"
                                        : " "
                            }
                            FormHelperTextProps={{
                                style: { color:  "red", fontWeight: 500 } // <-- color amarillo
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {fieldValidation.confirmPassword !== null && (
                                            fieldValidation.confirmPassword
                                                ? <CheckCircle sx={{ color: "#4caf50", mr: 1, fontSize: "20px" }} />
                                                : <Cancel sx={{ color: "#f44336", mr: 1, fontSize: "20px" }} />
                                        )}
                                        <IconButton
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            InputLabelProps={{ style: { color: "#2c6f6b", fontSize: "17px" } }}
                            sx={{
                                backgroundColor: "#e6e6e6",
                                borderTopLeftRadius: "10px",
                                borderTopRightRadius: "10px",
                                mb: 3,
                                borderBottom: "4px solid #103f3d",
                                "& .MuiFilledInput-root": { backgroundColor: "transparent" },
                                "& .MuiFilledInput-underline:before": { borderBottom: "none" },
                                "& .MuiFilledInput-underline:after": { borderBottom: "none" },
                                transition: "0.3s",
                            }}
                        />


                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <Button
                                type="submit"
                                disabled={!isFormValid() || loading}
                                variant="contained"
                                sx={{
                                    backgroundColor: !isFormValid() ? "#77acacff" : "#2f6f6f",
                                    color: "#fff",
                                    fontSize: "16px",
                                    padding: "12px 40px",
                                    borderRadius: "8px",
                                    marginBottom: 2,
                                    "&:hover": {
                                        backgroundColor: "#1a4d4d",
                                    }
                                }}
                            >
                                {loading ? "Actualizando..." : "Actualizar"}
                            </Button>
                        </Box>
                    </form>
                </Paper>

                <Box
                    component="img"
                    src={ciudad}
                    alt="city"
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        opacity: 0.95,
                        zIndex: 1,
                        pointerEvents: "none",
                    }}
                />
            </Box>

            <Box
                sx={{
                    flex: 1,
                    bgcolor: "#0f3b3d",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    px: 1,
                    py: { xs: 4, md: 0 },
                }}
            >
                <img
                    src={Logo}
                    alt="logo"
                    style={{ width: "100%", maxWidth: 350, marginBottom: 20 }}
                />
            </Box>
        </Box>
    );
}