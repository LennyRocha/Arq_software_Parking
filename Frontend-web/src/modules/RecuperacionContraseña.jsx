import React, { useState } from "react";
import api from "../utils/api";
import Logo from "../img/logo_parking copy.png";
import ciudad from "../img/fondo.png";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import sweetAlert from "../utils/sweetAlert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

import {
    Box,
    TextField,
    Button,
    Typography,
    IconButton,
    InputAdornment,
    Paper,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

export default function RecuperacionContraseña() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value.toLowerCase(),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post(
                `/api/email/send/${formData.email.trim()}`,
                {
                    subject: "Recuperación de contraseña",
                    message: "Tu código de verificación es:",
                }
            );

            const apiResponse = response.data;

            if (!apiResponse.success) {
                sweetAlert({
                    title: "Error al enviar el correo",
                    text: apiResponse.message,
                    icon: "error",
                });
                setLoading(false);
                return;
            }

            const code = apiResponse.data.code;
            localStorage.setItem("codigoRecuperacion", code);

            sweetAlert({
                title: "Código enviado",
                text: "Revisa tu correo",
                icon: "success",
            });

            navigate("/actualizacion-contra");

        } catch (error) {
            sweetAlert({
                title: "Error",
                text: "No se pudo enviar el correo",
                icon: "error",
            });
        }

        setLoading(false);
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
                    onClick={() => navigate("/login")}
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
                            width: "104%",
                        }}
                    >
                        Recuperación de contraseña
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            textAlign: "center",
                            color: "#144e4a",
                            marginBottom: 4,
                            width: "100%",
                            maxWidth: "100%",
                        }}
                    >
                        Por favor, ingresa tu correo electrónico. Te enviaremos un código para
                        restablecer tu contraseña.
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <TextField
                            variant="filled"
                            fullWidth
                            type="email"
                            label="Correo electrónico*"
                            value={formData.email}
                            name="email"
                            onChange={handleChange}
                            InputProps={{
                                endAdornment: formData.email.trim() !== "" && (
                                    <InputAdornment position="end">
                                        {/\S+@\S+\.\S+/.test(formData.email) ? (
                                            <CheckCircleIcon sx={{ color: "green" }} />
                                        ) : (
                                            <ErrorIcon sx={{ color: "red" }} />
                                        )}
                                    </InputAdornment>
                                ),
                            }}
                            InputLabelProps={{
                                style: {
                                    color: "#2c6f6b",
                                    fontSize: "17px",
                                },
                            }}
                            sx={{
                                backgroundColor: "#e6e6e6",
                                borderTopLeftRadius: "10px",
                                borderTopRightRadius: "10px",
                                mb: 3,
                                borderBottom:
                                    formData.email.trim() === ""
                                        ? "4px solid #103f3d"
                                        : /\S+@\S+\.\S+/.test(formData.email)
                                        ? "4px solid #2ecc71"
                                        : "4px solid #e74c3c",
                                "& .MuiFilledInput-root": {
                                    backgroundColor: "transparent",
                                },
                                "& .MuiFilledInput-underline:before": {
                                    borderBottom: "none",
                                },
                                "& .MuiFilledInput-underline:after": {
                                    borderBottom: "none",
                                },
                                transition: "0.3s",
                            }}
                        />

                        <Button
                            type="submit"
                            disabled={formData.email.trim() === ""}
                            variant="contained"
                            sx={{
                                backgroundColor:
                                    formData.email.trim() === "" ? "#77acacff" : "#2f6f6f",
                                color: "#fff",
                                fontSize: "16px",
                                padding: "10px",
                                width: "50%",
                                marginBottom: 2,
                                ":hover": {
                                    backgroundColor:
                                        formData.email.trim() === "" ? "#77acacac" : "#255b5b",
                                },
                                transition: "0.3s ease",
                            }}
                        >
                            {loading ? "Enviando..." : "Enviar código"}
                        </Button>
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
