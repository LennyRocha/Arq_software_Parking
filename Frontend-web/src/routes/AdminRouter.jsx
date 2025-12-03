import * as React from "react";
import { getToken, removeAllStorage } from "../utils/AuthService";
import sweetAlert from "../utils/sweetAlert";

//Components MUI Lists
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";

//Icons
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import PeopleIcon from "@mui/icons-material/People";
import DirectionsCar from "@mui/icons-material/DirectionsCar";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LogoutIcon from "@mui/icons-material/Logout";

//Material Design Icons Js
import Icon from "@mdi/react";
import { mdiAccountCreditCard } from "@mdi/js";
import { mdiFileChart } from "@mdi/js";
import { mdiCarCog } from "@mdi/js";
import { mdiCash } from "@mdi/js";

//Logo
import logo from "../img/logo_parking_hd_no_titulo.png";

//Components MUI List Items
import {
  Avatar,
  Drawer,
  ListItem,
  ListItemAvatar,
  Toolbar,
  Tooltip,
} from "@mui/material";

//Components MUI AppBar
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

//Router
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDarkContext } from "../context/DarkContext";

//Use themes
import { useTheme } from "@mui/material/styles";

//Obtener usuario
import { getInfoUser } from "../utils/AuthService";
import useInitials from "../utils/getInitials";

export default function AdminRouter() {
  const location = useLocation();
  const path = location.pathname;
  const goTo = useNavigate();
  const [openPension, setOpenPension] = React.useState(false);
  const [openReports, setOpenReports] = React.useState(true);

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const { isDarkMode, toggleDarkMode } = useDarkContext();

  const { loading, concated } = useInitials();

  React.useEffect(() => {
    getToken();
    if (!getToken()) goTo("*");
    switch (true) {
      case path.includes("reportes"):
        setSelectedIndex(1);
        break;
      case path.includes("tipos_de_pension"):
        setSelectedIndex(2);
        break;
      case path.includes("pensiones_de_usuarios"):
        setSelectedIndex(3);
        break;
      case path.includes("tarifas"):
        setSelectedIndex(4);
        break;
      case path.includes("cajones"):
      case path.includes("cajon"):
      case path.includes("estacionamiento"):
        setSelectedIndex(5);
        break;
      case path.includes("gestion_usuarios"):
        setSelectedIndex(6);
        break;
      case path.includes("/usuarios"):
        setSelectedIndex(6);
        break;
      case path.includes("gestion_vehiculos"):
        setSelectedIndex(8);
        break;
      default:
        setSelectedIndex(0);
    }
  }, [path]);

  const handleClick = (opt) => {
    switch (opt) {
      case "pension":
        setOpenPension(!openPension);
        break;
      case "reports":
        setOpenReports(!openReports);
        break;
      default:
        break;
    }
  };

  const handleLogout = async () => {
    const result = await sweetAlert({
      title: "¿Cerrar sesión?",
      text: "¿Está seguro de que desea cerrar sesión?",
      icon: "question",
      showDenyButton: true,
      denyText: "Cancelar",
      confirmText: "Aceptar",
      showCloseButton: true,
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      removeAllStorage();
      goTo("/");
    }
  };

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setDrawerOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const Menu = (clase) => {
    return (
      <List
        sx={{
          width: "100%",
          maxWidth: 256,
          padding: "10px",
          boxSizing: "border-box",
          height: "100vh",
          overflowY: "auto",
        }}
        className={`no_scroll ${clase.clase}`}
      >
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            mb: 1,
          }}
        >
          <ListItem sx={{ gap: 1, padding: 1, borderRadius: 2 }}>
            <ListItemAvatar>
              <Avatar
                alt="logo"
                src={logo}
                variant="square"
                sx={{ width: 50, height: 40, objectFit: "fill" }}
              />
            </ListItemAvatar>
            <ListItemText
              primary="parKing"
              primaryTypographyProps={{
                fontFamily: "Exo 2, sans-serif",
                fontWeight: "bold",
                fontSize: 20,
                color: isDarkMode ? "var(--secondary)" : "var(--other)",
              }}
              secondary="Admin"
            />
          </ListItem>
          <Tooltip title="Cambiar modo" cursor="pointer">
            <IconButton
              color={isDarkMode ? "primary" : "tertiary"}
              onClick={toggleDarkMode}
            >
              {!isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Ir a mi perfil" cursor="pointer">
            <Avatar
              sx={{
                bgcolor: "var(--other)",
                "&:hover": {
                  cursor: "pointer",
                  bgcolor: "var(--primary)",
                },
                color: "#fff",
              }}
              onClick={() => goTo(`/admin/perfil`)}
            >
              {loading ? "UA" : concated}
            </Avatar>
          </Tooltip>
        </Toolbar>
        <Divider />
        <ListItemButton onClick={() => handleClick("reports")}>
          <ListItemIcon>
            <ConfirmationNumberIcon className="gray" />
          </ListItemIcon>
          <ListItemText primary="Entradas y salidas" />
          {openReports ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openReports} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{
                pl: 4,
                borderRadius: "5px",
                "&.Mui-selected": {
                  backgroundColor: "var(--other)",
                  color: "#ffffff",
                },
              }}
              onClick={() => goTo("/admin")}
              selected={selectedIndex === 0}
              className="side-item"
            >
              <ListItemIcon>
                <Icon
                  path={mdiCarCog}
                  size={1}
                  className={`side-icon ${
                    selectedIndex === 0 ? "color-white " : "gray"
                  }`}
                />
              </ListItemIcon>
              <ListItemText primary="Gestionar" />
            </ListItemButton>
            <ListItemButton
              sx={{
                pl: 4,
                borderRadius: "5px",
                "&.Mui-selected": {
                  backgroundColor: "var(--other)",
                  color: "#ffffff",
                },
              }}
              className="side-item"
              onClick={() => goTo("/admin/reportes")}
              selected={selectedIndex === 1}
            >
              <ListItemIcon>
                <Icon
                  path={mdiFileChart}
                  size={1}
                  className={`side-icon ${
                    selectedIndex === 1 ? "color-white " : "gray"
                  }`}
                />
              </ListItemIcon>
              <ListItemText primary="Reportes" />
            </ListItemButton>
          </List>
        </Collapse>

        <ListItemButton onClick={() => handleClick("pension")}>
          <ListItemIcon>
            <ViewCarouselIcon className="gray" />
          </ListItemIcon>
          <ListItemText primary="Pensiones" />
          {openPension ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openPension} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{
                pl: 4,
                borderRadius: "5px",
                "&.Mui-selected": {
                  backgroundColor: "var(--other)",
                  color: "#ffffff",
                },
              }}
              onClick={() => goTo("/admin/tipos_de_pension")}
              selected={selectedIndex === 2}
              className="side-item"
            >
              <ListItemIcon>
                <Icon
                  path={mdiAccountCreditCard}
                  size={1}
                  className={`side-icon ${
                    selectedIndex === 2 ? "color-white " : "gray"
                  }`}
                />
              </ListItemIcon>
              <ListItemText primary="Tipos de pensión" />
            </ListItemButton>
            <ListItemButton
              sx={{
                pl: 4,
                borderRadius: "5px",
                "&.Mui-selected": {
                  backgroundColor: "var(--other)",
                  color: "#ffffff",
                },
              }}
              onClick={() => goTo("/admin/pensiones_de_usuarios")}
              selected={selectedIndex === 3}
              className="side-item"
            >
              <ListItemIcon>
                <FolderSharedIcon
                  className={`side-icon ${
                    selectedIndex === 3 ? "color-white " : "gray"
                  }`}
                />
              </ListItemIcon>
              <ListItemText primary="Pensiones de usuarios" />
            </ListItemButton>
          </List>
        </Collapse>

        <ListItemButton
          onClick={() => goTo("/admin/tarifas")}
          selected={selectedIndex === 4}
          sx={{
            borderRadius: "5px",
            "&.Mui-selected": {
              backgroundColor: "var(--other)",
              color: "#ffffff",
            },
          }}
          className="side-item"
        >
          <ListItemIcon>
            <Icon
              path={mdiCash}
              size={1}
              className={`side-icon ${
                selectedIndex === 4 ? "color-white " : "gray"
              }`}
            />
          </ListItemIcon>
          <ListItemText primary="Tarifas" />
        </ListItemButton>
        <ListItemButton
          onClick={() => goTo("/admin/cajones")}
          selected={selectedIndex === 5}
          sx={{
            borderRadius: "5px",
            "&.Mui-selected": {
              backgroundColor: "var(--other)",
              color: "#ffffff",
            },
          }}
          className="side-item"
        >
          <ListItemIcon>
            <LocalParkingIcon
              className={`side-icon ${
                selectedIndex === 5 ? "color-white " : "gray"
              }`}
            />
          </ListItemIcon>
          <ListItemText primary="Cajones" />
        </ListItemButton>

        <ListItemButton
          onClick={() => goTo("/admin/gestion_usuarios")}
          selected={selectedIndex === 6}
          sx={{
            borderRadius: "5px",
            "&.Mui-selected": {
              backgroundColor: "var(--other)",
              color: "#ffffff",
            },
          }}
          className="side-item"
        >
          <ListItemIcon>
            <PeopleIcon
              className={`side-icon ${
                selectedIndex === 6 ? "color-white " : "gray"
              }`}
            />
          </ListItemIcon>
          <ListItemText primary="Usuarios" />
        </ListItemButton>

        {/* <ListItemButton
          onClick={() => goTo("/admin/gestion_vehiculos")}
          selected={selectedIndex === 8}
          sx={{
            borderRadius: "5px",
            "&.Mui-selected": {
              backgroundColor: "var(--other)",
              color: "#ffffff",
            },
          }}
          className="side-item"
        >
          <ListItemIcon>
            <DirectionsCar
              className={`side-icon ${
                selectedIndex === 8 ? "color-white " : "gray"
              }`}
            />
          </ListItemIcon>
          <ListItemText primary="Vehículos" />
        </ListItemButton> */}

        <Box sx={{ py: 1 }}>
          <Divider sx={{ mb: 1 }} />
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: "5px",
              color: "error.main",
              "&:hover": { backgroundColor: "rgba(211, 47, 47, 0.1)" },
            }}
          >
            <ListItemIcon>
              <LogoutIcon sx={{ color: "error.main" }} />
            </ListItemIcon>
            <ListItemText primary="Cerrar sesión" />
          </ListItemButton>
        </Box>
      </List>
    );
  };

  const theme = useTheme();
  const bg = theme.palette.background.default;

  return (
    <Box
      sx={{ flexGrow: 1, height: "100vh", padding: 0 }}
      className="grid-side"
    >
      <Menu clase="side-bar-layout" />
      <Box sx={{ flex: 1, overflowY: "auto", height: "100vh" }}>
        <AppBar
          position="sticky"
          sx={{
            bgcolor: bg,
            color: "var(--text)",
          }}
          className="appbar"
        >
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => {
                setDrawerOpen(!drawerOpen);
                console.log("click", drawerOpen);
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                textAlign: "left",
                fontWeight: "bold",
              }}
              className="custom-font"
            >
              Panel de administración
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          anchor="left"
          variant="temporary"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
        >
          <Menu clase="" />
        </Drawer>
        <Outlet />
      </Box>
    </Box>
  );
}
