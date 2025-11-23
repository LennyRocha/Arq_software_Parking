import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  IconButton,
  TablePagination,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Search as SearchIcon,
  DirectionsCar as CarIcon,
  CreditCard as CreditCardIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from "@mui/icons-material";
import { useDarkContext } from "../context/DarkContext";
import { Link, useNavigate } from "react-router-dom";
import { searchTiposPensionPaginados } from "./tipo_pension/api/TiposPensionApi";
import LoadingBackdrop from "../components/LoadingBackdrop";

export default function LandingPage() {
  const { isDarkMode, toggleDarkMode } = useDarkContext();
  const theme = useTheme();
  const navigate = useNavigate();

  // Estado para tipos de pensión
  const [tiposPension, setTiposPension] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [totalElements, setTotalElements] = useState(0);

  // Cargar tipos de pensión
  useEffect(() => {
    cargarTiposPension();
  }, [page, rowsPerPage]);

  const cargarTiposPension = async () => {
    setLoading(true);
    try {
      const response = await searchTiposPensionPaginados({
        page,
        size: rowsPerPage,
        sort: "duracionDias,asc",
      });
      const { content, totalElements: total } = response.data.data;
      setTiposPension(content);
      setTotalElements(total);
    } catch (error) {
      console.error("Error al cargar tipos de pensión:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleUnirseAhora = (tipoPension) => {
    navigate(`/registro-pension/${tipoPension.id}`, { state: { tipoPension } });
  };

  // Preguntas frecuentes
  const faqs = [
    { pregunta: "¿Qué?", respuesta: "Ofrecemos servicio de estacionamiento con diferentes opciones de tarifas y pensiones." },
    { pregunta: "¿Quién?", respuesta: "Nuestro servicio está dirigido a cualquier persona que necesite estacionar su vehículo de manera segura." },
    { pregunta: "¿Cómo?", respuesta: "Puedes pagar una tarifa por uso o contratar una pensión con código QR para acceso rápido." },
    { pregunta: "¿Dónde?", respuesta: "Contamos con múltiples ubicaciones en la ciudad para tu comodidad." },
    { pregunta: "¿Cuánto?", respuesta: "Las tarifas varían según el tiempo de uso. Consulta nuestra sección de tarifas para más detalles." },
    { pregunta: "¿Por qué?", respuesta: "Porque tu vehículo merece un lugar seguro y accesible en todo momento." },
  ];

  return (
    <Box sx={{ bgcolor: "background.default", width: "100%", overflow: "visible" }}>
      <LoadingBackdrop open={loading} />
      
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
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Button color="inherit" onClick={() => document.getElementById('inicio')?.scrollIntoView({ behavior: 'smooth' })}>Inicio</Button>
          <Button color="inherit" onClick={() => document.getElementById('tarifas')?.scrollIntoView({ behavior: 'smooth' })}>Tarifas</Button>
          <Button color="inherit" onClick={() => document.getElementById('pensiones')?.scrollIntoView({ behavior: 'smooth' })}>Pensiones</Button>
          <Button color="inherit" onClick={() => document.getElementById('faqs')?.scrollIntoView({ behavior: 'smooth' })}>FAQs</Button>
          <Button variant="contained" color="primary" onClick={() => navigate('/login')}>INGRESAR</Button>
          <IconButton onClick={toggleDarkMode} color="inherit">
            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Box>
      </Box>

      {/* Hero Section */}
      <Box
        id="inicio"
        sx={{
          position: "relative",
          py: 10,
          backgroundImage: 'url("/img/parking-hero.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: alpha(theme.palette.background.default, 0.7),
          },
        }}
      >
        <Container sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bold",
              color: "text.primary",
              mb: 2,
              maxWidth: "600px",
            }}
          >
            Estacionamiento cerca de ti
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: "text.secondary", mb: 3, maxWidth: "500px" }}
          >
            Ofrecemos un servicio de estacionamiento diario para tu vehículo
            pagando una tarifa, o contrata una pensión y obtén un espacio
            reservado para ti en cualquier momento.
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              sx={{ bgcolor: "secondary.main" }}
              onClick={() => navigate('/registro-pension')}
            >
              Comprar pensión
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              onClick={() => document.getElementById('pensiones')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Ver pensiones
            </Button>
          </Box>
        </Container>
      </Box>

      <Link href="/admin">Ir al Menu admin</Link>
      <Link href="/empleado">Ir al Menu Empleado</Link>
      <Link href="/pensionados">Ir al Menu Pensionados</Link>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <SearchIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                Encuentra un lugar
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Localiza un lugar disponible en nuestro estacionamiento
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <CarIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                Estaciona tu vehículo
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Localiza un lugar disponible en nuestro estacionamiento
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <CreditCardIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                Paga al salir
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Localiza un lugar disponible en nuestro estacionamiento
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Visualización en tiempo real */}
      <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), py: 8, width: "100%" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", textAlign: "center", mb: 2 }}
          >
            Visualiza en tiempo real
          </Typography>
          <Typography
            variant="body1"
            sx={{ textAlign: "center", color: "text.secondary", mb: 4 }}
          >
            Tenemos cajones disponibles tanto para coches y camionetas como para
            motocicletas, en distintos pisos para cubrir la demanda
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              mb: 3,
            }}
          >
            <Chip label="COCHE" color="primary" />
            <Chip label="CAMIONETA" />
            <Chip label="MOTO" />
          </Box>
          <Typography variant="h6" sx={{ textAlign: "center", mb: 3 }}>
            Cajones disponibles: <strong>10</strong>
          </Typography>
          {/* Aquí podrías agregar la visualización del estacionamiento */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              minHeight: "200px",
              alignItems: "center",
            }}
          >
            <Typography color="text.secondary">
              [Visualización del estacionamiento]
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Tarifas Section */}
      <Container id="tarifas" maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", textAlign: "center", mb: 4 }}
        >
          Nuestras tarifas
        </Typography>
        <Typography
          variant="body1"
          sx={{ textAlign: "center", color: "text.secondary", mb: 4 }}
        >
          Ofrecemos distintas tarifas de uso dependiendo del tiempo con el que
          ingresarán nuestros visitantes
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Button variant="contained" sx={{ mx: 1 }}>ENTRAR AL ESTACIONAMIENTO</Button>
        </Box>
      </Container>

      {/* Pensiones Section */}
      <Box
        id="pensiones"
        sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), py: 8, width: "100%" }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", textAlign: "center", mb: 2 }}
          >
            Pensiones parKing
          </Typography>
          <Typography
            variant="body1"
            sx={{ textAlign: "center", color: "text.secondary", mb: 4 }}
          >
            Únete a nuestro programa de pensiones. Asegura un lugar para guardar
            tu vehículo. No pagues tarifas. Accede mediante código QR.
          </Typography>

          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", textAlign: "center", mb: 4, mt: 6 }}
          >
            Elige el mejor plan para ti
          </Typography>

          {tiposPension.length === 0 && !loading ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                Lo sentimos, en este momento no podemos cargar los tipos de pensión.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Por favor, intenta más tarde.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3} justifyContent="center">
              {tiposPension.map((pension) => (
              <Grid item xs={12} sm={6} md={4} key={pension.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    border: `2px solid ${theme.palette.primary.main}`,
                    borderRadius: 2,
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: "primary.main",
                      color: "white",
                      py: 2,
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      parKing {pension.nombre}
                    </Typography>
                  </Box>
                  <CardContent sx={{ flexGrow: 1, textAlign: "center", p: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                      ${pension.costo}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 3 }}
                    >
                      Por un periodo de {pension.duracionDias} días
                    </Typography>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{
                        bgcolor: "text.primary",
                        color: "background.paper",
                        mb: 3,
                        "&:hover": {
                          bgcolor: "text.secondary",
                        },
                      }}
                      onClick={() => handleUnirseAhora(pension)}
                    >
                      Unirse ahora
                    </Button>
                    <Box sx={{ textAlign: "left" }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <CheckCircleIcon
                          sx={{ color: "success.main", mr: 1, fontSize: 20 }}
                        />
                        <Typography variant="body2">
                          Lugar reservado para ti
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <CheckCircleIcon
                          sx={{ color: "success.main", mr: 1, fontSize: 20 }}
                        />
                        <Typography variant="body2">Sin costos extra</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <CheckCircleIcon
                          sx={{ color: "success.main", mr: 1, fontSize: 20 }}
                        />
                        <Typography variant="body2">Acceso ilimitado</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <CheckCircleIcon
                          sx={{ color: "success.main", mr: 1, fontSize: 20 }}
                        />
                        <Typography variant="body2">
                          Registra los vehículos que puedes utilizar
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              ))}
            </Grid>
          )}

          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <TablePagination
              component="div"
              count={totalElements}
              page={page}
              onPageChange={handlePageChange}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPageOptions={[3, 6, 9]}
              labelRowsPerPage="Planes por página:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
              }
              sx={{
                "& .MuiTablePagination-toolbar": {
                  justifyContent: "center",
                },
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* FAQs Section */}
      <Container id="faqs" maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", textAlign: "center", mb: 4 }}
        >
          Preguntas frecuentes
        </Typography>
        <Box sx={{ maxWidth: "800px", mx: "auto" }}>
          {faqs.map((faq, index) => (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: "bold" }}>
                  {faq.pregunta}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">{faq.respuesta}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          py: 4,
          textAlign: "center",
          width: "100%",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © 2025 parKing Todos los derechos reservados.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Powered by UTEZ
        </Typography>
      </Box>
    </Box>
  );
}
