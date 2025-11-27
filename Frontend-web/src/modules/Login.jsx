import React, { useState } from "react";
import api from "../utils/api"; 
import { saveAllStorage } from "../utils/AuthService";

import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Link,
  useTheme,
  alpha,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  DirectionsCar as CarIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Visibility,
  VisibilityOff,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDarkContext } from "../context/DarkContext";

export default function Login() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkContext();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
      alert(apiResponse.message || "Credenciales incorrectas");
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
    console.error("Error en login:", error);
console.log("datos enviados:", formData.email, formData.password);

    alert("Error al iniciar sesión");
  }

  setLoading(false);
};



  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Header */}
      <Box
        component="header"
        sx={{
          py: 2,
          px: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: alpha(theme.palette.primary.main, 0.05),
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <CarIcon /> parKing
        </Typography>
        <IconButton onClick={toggleDarkMode} color="inherit">
          {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Box>

      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: "calc(100vh - 80px)",
          py: 4,
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
          sx={{ mb: 3, alignSelf: "flex-start" }}
        >
          Volver al inicio
        </Button>

        <Card
          sx={{
            p: 2,
            boxShadow: 3,
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <CarIcon
                sx={{
                  fontSize: 60,
                  color: "primary.main",
                  mb: 2,
                }}
              />
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", mb: 1, color: "primary.main" }}
              >
                Iniciar Sesión
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Accede a tu cuenta de parKing
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Correo electrónico"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
                autoComplete="email"
              />

              <TextField
                fullWidth
                label="Contraseña"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mb: 2,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                }}
              >
                {loading ? "Iniciando sesión..." : "INGRESAR"}
              </Button>

              <Box sx={{ textAlign: "center" }}>
                <Link
                  href="#"
                  variant="body2"
                  sx={{ textDecoration: "none", color: "primary.main" }}
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            ¿No tienes una cuenta?{" "}
            <Link
              href="#"
              sx={{ color: "primary.main", textDecoration: "none" }}
            >
              Regístrate aquí
            </Link>
          </Typography>
        </Box>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          py: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © 2025 parKing. Todos los derechos reservados.
        </Typography>
      </Box>
    </Box>
  );
}