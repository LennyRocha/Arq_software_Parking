//Para perfil de empleado 
import * as React from "react";
import { getInfoUser, getToken, removeAllStorage, removeToken } from "../../../utils/AuthService";

//Components MUI Lists
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import MainHeader from "../../../components/MainHeader";

//Icons
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LogoutIcon from "@mui/icons-material/Logout";

//Material Design Icons Js
import Icon from "@mdi/react";
import { mdiBadgeAccount } from "@mdi/js";

//Logo
import logo from "../../../img/logo_parking_hd_no_titulo.png";

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
import { useDarkContext } from "../../../context/DarkContext";

//Use themes
import { useTheme } from "@mui/material/styles";

//Import Perfil Component
import Perfil from "../../Perfil";

export default function Pages() {
  const location = useLocation();
  const path = location.pathname;
  const goTo = useNavigate();

  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [links, setLinks] = React.useState([]);

  const { isDarkMode, toggleDarkMode } = useDarkContext();

  const [pageTitle, setPageTitle] = React.useState("Mi perfil");
  const [showPerfil, setShowPerfil] = React.useState(false);

  React.useEffect(() => {
    getToken();
    if (!getToken()) {
      goTo("*");
    }
    switch (true) {
      case path.includes("pensiones"):
        setSelectedIndex(1);
        setPageTitle("Pensiones de usuarios");
        setLinks([{ title: "Inicio", path: "/" }, { title: "Pensiones de usuarios" }]);
        setShowPerfil(false);
        break;
      case path.includes("cajones"):
        setSelectedIndex(2);
        setPageTitle("Cajones");
        setLinks([{ title: "Inicio", path: "/" }, { title: "Cajones" }]);
        setShowPerfil(false);
        break;
      case path.includes("nuevo_pensionado"):
        setSelectedIndex(3);
        setPageTitle("Registrar empleado pensionado");
        setLinks([{ title: "Inicio", path: "/" }, { title: "Registrar empleado pensionado" }]);
        setShowPerfil(false);
        break;
      case path.includes("perfil"):
        setSelectedIndex(null);
        setPageTitle("Mi perfil");
        setLinks([{ title: "Inicio", path: "" }, { title: "Mi perfil" }]);
        setShowPerfil(true);
        break;

      default:
        setSelectedIndex(0);
        setPageTitle("Mi perfil");
        setLinks([{ title: "Inicio", path: "" }, { title: "Mi perfil" }]);
        setShowPerfil(false);
    }
  }, [path]);

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

  getInfoUser();
  console.log ("Info User:", getInfoUser().role);

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
          display: "flex",
          flexDirection: "column",
        }}
        className={`no_scroll ${clase.clase}`}
        component="nav"
      >
        <Box>
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
                
                secondary="Empleado"
              />
            </ListItem>
            <Tooltip title="Cambiar modo" cursor="pointer">
              <IconButton
                color={isDarkMode ? "primary" : "tertiary"}
                onClick={toggleDarkMode}
              >
                {isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
            </Tooltip>
            {/* Avatar deshabilitado */}
            <Tooltip title="Ir a mi perfil (deshabilitado)">
              <Avatar
                sx={{
                  backgroundColor: "var(--other)",
                  pointerEvents: "none",
                }}
              >
                UE
              </Avatar>
            </Tooltip>
          </Toolbar>

          <Divider />

          <ListItemButton
            onClick={() => goTo("/empleado")}
            selected={selectedIndex === 0}
            sx={{
              borderRadius: "5px",
              backgroundColor: selectedIndex === 0 ? "var(--other)" : "#fff",
              color: selectedIndex === 0 ? "#fff" : "#000",
              "&:hover": {
                backgroundColor: "gray(--other)",
                color: "#090707ff",
              },
            }}
          >
            <ListItemIcon>
              <ConfirmationNumberIcon
                className={selectedIndex === 0 ? "color-white" : "gray"}
              />
            </ListItemIcon>
            <ListItemText primary="Entradas y salidas" />
          </ListItemButton>

          <ListItemButton
            onClick={() => goTo("/empleado/pensiones")}
            selected={selectedIndex === 1}
            sx={{
              borderRadius: "5px",
              backgroundColor: selectedIndex === 1 ? "var(--other)" : "#fff",
              color: selectedIndex === 1 ? "#fff" : "#000",
              "&:hover": {
                backgroundColor: "gray(--other)",
                color: "#090707ff"
              },
            }}
          >
            <ListItemIcon>
              <Icon
                path={mdiBadgeAccount}
                size={1}
                className={selectedIndex === 1 ? "color-white" : "gray"}
              />
            </ListItemIcon>
            <ListItemText primary="Pensiones de usuarios" />
          </ListItemButton>

          {/* CAJONES */}
          <ListItemButton
            onClick={() => goTo("/empleado/cajones")}
            selected={selectedIndex === 2}
            sx={{
              borderRadius: "5px",
              backgroundColor: selectedIndex === 2 ? "var(--other)" : "#fff",
              color: selectedIndex === 2 ? "#fff" : "#000",
              "&:hover": {
                backgroundColor: "gray(--other)",
                color: "#090707ff"
              },
            }}
          >
            <ListItemIcon>
              <LocalParkingIcon
                className={selectedIndex === 2 ? "color-white" : "gray"}
              />
            </ListItemIcon>
            <ListItemText primary="Cajones" />
          </ListItemButton>

          <ListItemButton
            onClick={() => goTo("/empleado/nuevo_pensionado")}
            selected={selectedIndex === 3}
            sx={{
              borderRadius: "5px",
              backgroundColor: selectedIndex === 3 ? "var(--other)" : "#fff",
              color: selectedIndex === 3 ? "#fff" : "#000",
              "&:hover": {
                backgroundColor: "gray(--other)",
                color: "#090707ff"
              },
            }}
          >
            <ListItemIcon>
              <PersonAddIcon
                className={selectedIndex === 3 ? "color-white" : "gray"}
              />
            </ListItemIcon>
            <ListItemText primary="Registrar empleado pensionado" />
          </ListItemButton>
        </Box>

        <Box sx={{ marginTop: "auto", paddingTop: 2 }}>
          <Divider sx={{ marginBottom: 1 }} />

          <ListItemButton
            sx={{
              borderRadius: "5px",
            }}
            onClick={() => {
              removeAllStorage();
              goTo("/login");
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
              {pageTitle}
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

        <MainHeader titulo={pageTitle} breads={links} />
        {showPerfil ? <Perfil /> : <Outlet />}
      </Box>
    </Box>
  );
}
