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
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import DirectionsCar from "@mui/icons-material/DirectionsCar";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LogoutIcon from "@mui/icons-material/Logout";

//Material Design Icons Js
import Icon from "@mdi/react";
import { mdiCarCog } from "@mdi/js";
import { mdiCarClock } from "@mdi/js";

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
import useInitials from "../utils/getInitials";

export default function AdminRouter() {
  const location = useLocation();
  const path = location.pathname;
  const goTo = useNavigate();
  const [openPension, setOpenPension] = React.useState(true);
  const [openUsers, setOpenUsers] = React.useState(false);
  const [openReports, setOpenReports] = React.useState(false);

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const { isDarkMode, toggleDarkMode } = useDarkContext();

  const { loading, concated } = useInitials();

  React.useEffect(() => {
    getToken();
    if (!getToken()) {
      goTo("*");
    }
    switch (true) {
      case path.includes("entradas"):
        setSelectedIndex(1);
        break;
      case path.includes("historial"):
        setSelectedIndex(2);
        break;
      case path.includes("mi_pension"):
        setSelectedIndex(3);
        break;
      case path.includes("vehiculos"):
      case path.includes("vehiculo"):
        setSelectedIndex(4);
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
      case "users":
        setOpenUsers(!openUsers);
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
            position: "sticky",
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
              secondary="Pensionado"
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
              onClick={() => goTo(`/pensionados/perfil`)}
            >
              {loading ? "UP" : concated}
            </Avatar>
          </Tooltip>
        </Toolbar>
        <Divider />
        <ListItemButton
          onClick={() => goTo("/pensionados")}
          selected={selectedIndex === 0}
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
                selectedIndex === 0 ? "color-white " : "gray"
              }`}
            />
          </ListItemIcon>
          <ListItemText primary="Cajones disponibles" />
        </ListItemButton>

        <ListItemButton onClick={() => handleClick("pension")}>
          <ListItemIcon>
            <MenuBookIcon className="gray" />
          </ListItemIcon>
          <ListItemText primary="Mis marcajes" />
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
              onClick={() => goTo("/pensionados/entradas")}
              selected={selectedIndex === 1}
              className="side-item"
            >
              <ListItemIcon>
                <Icon
                  path={mdiCarCog}
                  size={1}
                  className={`side-icon ${
                    selectedIndex === 1 ? "color-white " : "gray"
                  }`}
                />
              </ListItemIcon>
              <ListItemText primary="Actuales" />
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
              onClick={() => goTo("/pensionados/historial")}
              selected={selectedIndex === 2}
              className="side-item"
            >
              <ListItemIcon>
                <Icon
                  path={mdiCarClock}
                  size={1}
                  className={`side-icon ${
                    selectedIndex === 2 ? "color-white " : "gray"
                  }`}
                />
              </ListItemIcon>
              <ListItemText primary="Historial de marcajes" />
            </ListItemButton>
          </List>
        </Collapse>

        <ListItemButton
          onClick={() => goTo("/pensionados/mi_pension")}
          selected={selectedIndex === 3}
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
            <ViewCarouselIcon
              className={`side-icon ${
                selectedIndex === 3 ? "color-white " : "gray"
              }`}
            />
          </ListItemIcon>
          <ListItemText primary="Mi pensión" />
        </ListItemButton>

        <ListItemButton
          onClick={() => goTo("/pensionados/mis_vehiculos")}
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
            <DirectionsCar
              className={`side-icon ${
                selectedIndex === 4 ? "color-white " : "gray"
              }`}
            />
          </ListItemIcon>
          <ListItemText primary="Mis vehículos" />
        </ListItemButton>
        {/* CERRAR SESIÓN */}

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
              Panel de usuarios pensionados
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
