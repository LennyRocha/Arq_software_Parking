import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Link,
  IconButton,
  TablePagination,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Drawer,
  Icon,
  useTheme,
  alpha,
  Divider,
} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
//
import MenuIcon from "@mui/icons-material/Menu";
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
import { useNavigate } from "react-router-dom";
import { searchTiposPensionActivasPaginados } from "./tipo_pension/api/TiposPensionApi";
import LoadingBackdrop from "../components/LoadingBackdrop";
import ParkingGrid from "./cajon/components/ParkingGrid";
import fondo from "../img/parking_back.jpg";
import logo_chiquito from "../img/logo_parking_hd_no_titulo.png";
import ganamos from "../img/ganamos_pose_coches.png";

export default function LandingPage() {
  const { isDarkMode, toggleDarkMode } = useDarkContext();
  const theme = useTheme();
  const navigate = useNavigate();

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  //Controles del drawer
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleDrawer = (event) => {
    if (
      event?.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsOpen((prev) => !prev);
  };

  const list = () => (
    <Box
      sx={{ width: "auto" }}
      role="presentation"
      onClick={toggleDrawer}
      onKeyDown={toggleDrawer}
    >
      <List>
        {["Inicio", "Tarifas", "Pensiones", "FAQs", "Cambiar tema"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["Ingresar"].map((text, index) => (
          <ListItem key={text}>
            <Button color="tertiary" variant="contained" sx={{ flex: 1 }} >{text}</Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const CustomDrawer = () => (
    <Drawer
      anchor="top"
      open={isOpen}
      onClose={toggleDrawer}
      sx={{ zIndex: 1300}}
      variant="persistent"
    >
      {list()}
    </Drawer>
  );

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
      const response = await searchTiposPensionActivasPaginados({
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
    {
      pregunta: "¿Qué?",
      respuesta:
        "Ofrecemos servicio de estacionamiento con diferentes opciones de tarifas y pensiones.",
    },
    {
      pregunta: "¿Quién?",
      respuesta:
        "Nuestro servicio está dirigido a cualquier persona que necesite estacionar su vehículo de manera segura.",
    },
    {
      pregunta: "¿Cómo?",
      respuesta:
        "Puedes pagar una tarifa por uso o contratar una pensión con código QR para acceso rápido.",
    },
    {
      pregunta: "¿Dónde?",
      respuesta:
        "Contamos con múltiples ubicaciones en la ciudad para tu comodidad.",
    },
    {
      pregunta: "¿Cuánto?",
      respuesta:
        "Las tarifas varían según el tiempo de uso. Consulta nuestra sección de tarifas para más detalles.",
    },
    {
      pregunta: "¿Por qué?",
      respuesta:
        "Porque tu vehículo merece un lugar seguro y accesible en todo momento.",
    },
  ];

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        width: "100%",
        flex: 1,
      }}
    >
      <LoadingBackdrop open={loading} />

      {/* Header */}
      <Box
        component="header"
        sx={{
          px: 3,
          py: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "fixed",
          width: "100%",
          flexDirection: "row",
          zIndex: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.5),
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          transition: "backdrop-filter 0.3s ease",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
          className="custom-font"
        >
          <Icon
            fontSize="large"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={logo_chiquito}
              alt="logo"
              style={{ width: 36, height: 36 }}
            />
          </Icon>
          parKing
        </Typography>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="end"
          onClick={toggleDrawer}
          sx={{ display: { xs: "block", md: "none" }, color: "white" }}
        >
          <MenuIcon />
        </IconButton>
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            color="inherit"
            onClick={() =>
              document
                .getElementById("inicio")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Inicio
          </Button>
          <Button
            color="inherit"
            onClick={() =>
              document
                .getElementById("tarifas")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Tarifas
          </Button>
          <Button
            color="inherit"
            onClick={() =>
              document
                .getElementById("pensiones")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Pensiones
          </Button>
          <Button
            color="inherit"
            onClick={() =>
              document
                .getElementById("faqs")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            FAQs
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/login")}
          >
            INGRESAR
          </Button>
          <IconButton onClick={toggleDarkMode} color="inherit">
            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Box>
      </Box>

      <CustomDrawer />

      {/* Hero Section */}
      <Box
        id="inicio"
        sx={{
          position: "relative",
          py: { xs: 18, xl: 54 },
          backgroundImage: {
            xs: `
          linear-gradient(to bottom, var(--other), rgba(0,0,0,0)), 
          url(${fondo})`,
            md: `
          linear-gradient(to right, var(--other), color-mix(in srgb, var(--other) 50%, transparent),  color-mix(in srgb, var(--other) 25%, transparent), rgba(0,0,0,0)), 
          url(${fondo})`,
          },
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          display: "flex",
          alignItems: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          },
        }}
      >
        <Container
          sx={{
            position: "relative",
            zIndex: 1,
            gap: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              color: "white",
              textAlign: { xs: "center", md: "left", xl: "center" },
              fontSize: {
                xs: "1.8rem",
                sm: "2.2rem",
                md: "2.8rem",
                lg: "3.2rem",
                xl: "4rem",
              },
            }}
          >
            Estacionamiento cerca de ti
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "white",
              textAlign: { sm: "center", md: "left", xl: "center" },
              maxWidth: { sm: "100%", md: "50%" },
              fontSize: {
                xs: "0.95rem",
                sm: "1.05rem",
                md: "1.15rem",
                lg: "1.25rem",
                xl: "1.35rem",
              },
              lineHeight: 1.5,
            }}
          >
            Ofrecemos un servicio de estacionamiento diario para tu vehículo
            pagando una tarifa, o contrata una pensión y obtén un espacio
            reservado para ti en cualquier momento.
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={() => navigate("/registro-pension")}
            >
              Comprar pensión
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() =>
                document
                  .getElementById("pensiones")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
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
              <SearchIcon
                sx={{ fontSize: 64, color: "tertiary.main", mb: 2 }}
              />
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
              <CarIcon sx={{ fontSize: 64, color: "tertiary.main", mb: 2 }} />
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
              <CreditCardIcon
                sx={{ fontSize: 64, color: "tertiary.main", mb: 2 }}
              />
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
      <Box
        sx={{
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          py: 8,
          width: "100%",
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
            py: 2,
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: "600", textAlign: "center" }}
            className="custom-font"
          >
            Visualiza en tiempo real
          </Typography>
          <Typography
            variant="h6"
            sx={{ textAlign: "center", color: "text.secondary", width: "80%" }}
          >
            Tenemos cajones disponibles tanto para coches y camionetas como para
            motocicletas, en distintos pisos para cubrir la demanda
          </Typography>
          {/* Aquí podrías agregar la visualización del estacionamiento */}
          <ParkingGrid />
          {/*Ya we */}
        </Container>
      </Box>

      <Divider />

      {/* Tarifas Section */}
      <Container
        id="tarifas"
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "center",
          py: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "600", textAlign: "center" }}
          className="custom-font"
        >
          Nuestras tarifas
        </Typography>
        <Typography
          variant="h6"
          sx={{ textAlign: "center", color: "text.secondary", width: "80%" }}
        >
          Ofrecemos distintas tarifas de uso dependiendo del tiempo con el que
          ingresarán nuestros visitantes
        </Typography>
        {/*Tabla de tarifas */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Button variant="contained" sx={{ mx: 1 }}>
            ENTRAR AL ESTACIONAMIENTO
          </Button>
        </Box>
      </Container>

      <Divider />

      {/* Pensiones Section */}
      <Box
        id="pensiones"
        sx={{
          backgroundImage: !isDarkMode
            ? "linear-gradient(to bottom, var(--background), rgba(0,0,0,0))"
            : "linear-gradient(to bottom, var(--surface_claro), rgba(0,0,0,0))",
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
            py: 2,
          }}
        >
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", textAlign: "center" }}
            className="custom-font"
          >
            Pensiones parKing
          </Typography>
          <Typography
            variant="h6"
            sx={{ textAlign: "center", color: "text.secondary", width: "80%" }}
          >
            Únete a nuestro programa de pensiones. Asegura un lugar para guardar
            tu vehículo. No pagues tarifas. Accede mediante código QR.
          </Typography>

          <img
            src={ganamos}
            alt="pose_epica_coches"
            style={{ aspectRatio: 16 / 6 }}
            id="ganamos"
          />

          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", textAlign: "center", mb: 4, mt: 6 }}
          >
            Elige el mejor plan para ti
          </Typography>

          {tiposPension.length === 0 && !loading ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                Lo sentimos, en este momento no podemos cargar los tipos de
                pensión.
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
                    <CardContent
                      sx={{ flexGrow: 1, textAlign: "center", p: 3 }}
                    >
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: "bold", mb: 1 }}
                      >
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
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <CheckCircleIcon
                            sx={{ color: "success.main", mr: 1, fontSize: 20 }}
                          />
                          <Typography variant="body2">
                            Lugar reservado para ti
                          </Typography>
                        </Box>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <CheckCircleIcon
                            sx={{ color: "success.main", mr: 1, fontSize: 20 }}
                          />
                          <Typography variant="body2">
                            Sin costos extra
                          </Typography>
                        </Box>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <CheckCircleIcon
                            sx={{ color: "success.main", mr: 1, fontSize: 20 }}
                          />
                          <Typography variant="body2">
                            Acceso ilimitado
                          </Typography>
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

          <Divider />

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

      <Divider />

      {/* FAQs Section */}
      <Container
        id="faqs"
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "center",
          py: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "600", textAlign: "center" }}
          className="custom-font"
        >
          Preguntas frecuentes
        </Typography>
        <Box sx={{ maxWidth: { xs: "100%", md: "800px" }, mx: "auto" }}>
          {faqs.map((faq, index) => (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: "bold" }}>
                  {faq.pregunta}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary" sx={{ textAlign: "left" }}>
                  {faq.respuesta}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>

      <Divider />

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
          Powered by{" "}
          <a className="link" href="https://www.utez.edu.mx">
            UTEZ
          </a>
        </Typography>
      </Box>
    </Box>
  );
}
