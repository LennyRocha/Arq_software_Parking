import React, { useState } from "react";
import api from "../utils/api";
import { saveAllStorage } from "../utils/AuthService";
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
  Card,
  CardContent,
  Link,
  IconButton,
  InputAdornment,
  Paper,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { set } from "react-hook-form";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/api/auth/public/login", {
        correo: formData.email,
        contra: formData.password,
      });

      const apiResponse = response.data;

      if (!apiResponse.success) {
        sweetAlert({
          title: "Error de autenticación",
          text: "Correo o contraseña incorrectos.",
          icon: "error",
        });

        setLoading(false);
        return;
      }


      const { token, expiration, user } = apiResponse.data;

      saveAllStorage(token, expiration, user);

      switch (user.role) {
        case "ADMINISTRADOR":
          navigate("/admin");
          break;
        case "EMPLEADO":
          navigate("/empleado");
          break;
        case "CLIENTE_PENSIONADO":
          navigate("/pensionados");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      sweetAlert({
        title: "Error de inicio de sesión",
        text: "Correo o contraseña incorrectos.",
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
          onClick={() => navigate("/")}
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
            maxWidth: 420,
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
              marginBottom: 4,
            }}
          >
            Iniciar sesión
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              variant="filled"
              fullWidth
              label="Correo electrónico*"
              value={formData.email}
              type="email"
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

            <TextField
              variant="filled"
              fullWidth
              label="Contraseña*"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              InputLabelProps={{
                style: {
                  color: "#2c6f6b",
                  fontSize: "17px",
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                backgroundColor: "#e6e6e6",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
                mb: 3,
                borderBottom: "4px solid #103f3d",

                "& .MuiFilledInput-root": {
                  backgroundColor: "transparent",
                },
                "& .MuiFilledInput-underline:before": {
                  borderBottom: "none",
                },
                "& .MuiFilledInput-underline:after": {
                  borderBottom: "none",
                },
              }}
            />

            <Button
              type="submit"
              disabled={formData.email.trim() === "" || formData.password.trim() === "" || loading}
              variant="contained"
              sx={{
                backgroundColor:
                  formData.email.trim() === "" ? "#77acacff" : "#2f6f6f",
                color: "#fff",
                fontSize: "16px",
                padding: "10px",
                width: "100%",
                marginBottom: 2,
                ":hover": {
                  backgroundColor:
                    formData.email.trim() === "" ? "#77acacff" : "#255b5b",
                },
                transition: "0.3s ease",
              }}
            >
              {loading ? "Iniciando..." : "Acceder"}
            </Button>

            <Typography
              sx={{
                textAlign: "center",
                color: "#4b6d6b",
                marginBottom: 3,
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              <Link href="#" underline="hover" color="#4b6d6b" onClick={() => navigate('/recuperacion-contraseña')}>
                ¿Olvidaste tu contraseña?
              </Link>
            </Typography>

            <Box
              sx={{
                width: "100%",
                height: "1px",
                backgroundColor: "#b4d2d0",
                marginBottom: 3,
              }}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: "#77c5c0",
                color: "#fff",
                fontSize: "16px",
                padding: "10px",
                ":hover": { backgroundColor: "#6ab3ae" },
              }}
            >
              ¿No tienes cuenta?
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
    </Box>
  );
}
