import * as React from "react";

//Components MUI Lists
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

//Icons
import PersonAddICon from "@mui/icons-material/PersonAdd";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

//Material Design Icons Js
import Icon from "@mdi/react";
import { mdiBadgeAccount } from "@mdi/js";

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

export default function EmpleadoRouter() {
  const location = useLocation();
  const path = location.pathname;
  const goTo = useNavigate();

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const { isDarkMode, toggleDarkMode } = useDarkContext();

  React.useEffect(() => {
    switch (true) {
      case path.includes("pensiones"):
        setSelectedIndex(1);
        break;
      case path.includes("cajones"):
        setSelectedIndex(2);
        break;
      case path.includes("nuevo_pensionado"):
        setSelectedIndex(3);
        break;
      default:
        setSelectedIndex(0);
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
        component="nav"
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
              onClick={() => goTo(`/private/perfil/${24}`)}
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
            "&.Mui-selected": {
              backgroundColor: "var(--other)",
              color: "#ffffff",
            },
          }}
          className="side-item"
        >
          <ListItemIcon>
            <ConfirmationNumberIcon
              className={`side-icon ${
                selectedIndex === 0 ? "color-white " : "gray"
              }`}
            />
          </ListItemIcon>
          <ListItemText primary="Entradas y salidas" />
        </ListItemButton>

        <ListItemButton
          onClick={() => goTo("/empleado/pensiones")}
          selected={selectedIndex === 1}
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
              path={mdiBadgeAccount}
              size={1}
              className={`side-icon ${
                selectedIndex === 1 ? "color-white " : "gray"
              }`}
            />
          </ListItemIcon>
          <ListItemText primary="Pensiones de usuarios" />
        </ListItemButton>

        <ListItemButton
          onClick={() => goTo("/empleado/cajones")}
          selected={selectedIndex === 2}
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
                selectedIndex === 2 ? "color-white " : "gray"
              }`}
            />
          </ListItemIcon>
          <ListItemText primary="Cajones" />
        </ListItemButton>
        <ListItemButton
          onClick={() => goTo("/empleado/nuevo_pensionado")}
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
            <PersonAddICon
              className={`side-icon ${
                selectedIndex === 3 ? "color-white " : "gray"
              }`}
            />
          </ListItemIcon>
          <ListItemText primary="Registrar empleado pensionado" />
        </ListItemButton>
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
              Panel de empleados
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
