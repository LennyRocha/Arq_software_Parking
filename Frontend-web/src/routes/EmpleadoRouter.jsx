import * as React from "react";
import { getInfoUser, getToken, removeToken } from "../utils/AuthService";
import LogoutIcon from "@mui/icons-material/Logout";

import {
  Avatar,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItem,
  ListItemAvatar,
  Toolbar,
  Tooltip,
  Box,
  AppBar,
  Typography,
  IconButton,
  Divider,
  useMediaQuery,
} from "@mui/material";

// MUI Icons
import MenuIcon from "@mui/icons-material/Menu";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";


import Icon from "@mdi/react";
import { mdiBadgeAccount } from "@mdi/js";


import { Outlet, useLocation, useNavigate } from "react-router-dom";


import { useDarkContext } from "../context/DarkContext";


import { useTheme } from "@mui/material/styles";


import logo from "../img/logo_parking_hd_no_titulo.png";

export default function EmpleadoRouter() {
  const location = useLocation();
  const path = location.pathname;
  const goTo = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkContext();
  const theme = useTheme();
  const bg = theme.palette.background.default;
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  React.useEffect(() => {
    if (!getToken()) goTo("*");

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

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    )
      return;
    setDrawerOpen(open);
  };

  const Menu = () => (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ flex: 1, overflowY: "auto", p: 1 }}>
        <Toolbar disableGutters sx={{ mb: 1 }}>
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
                "&:hover": { cursor: "pointer", bgcolor: "var(--primary)" },
                color: "#fff",
              }}
              onClick={() => goTo(`/private/perfil`)}
            >
              UE
            </Avatar>
          </Tooltip>
        </Toolbar>

        <Divider />

        <List>
          <ListItemButton
            onClick={() => goTo("/empleado")}
            selected={selectedIndex === 0}
            sx={{
              borderRadius: "5px",
              "&.Mui-selected": { backgroundColor: "var(--other)", color: "#fff" },
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
              "&.Mui-selected": { backgroundColor: "var(--other)", color: "#fff" },
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

          <ListItemButton
            onClick={() => goTo("/empleado/cajones")}
            selected={selectedIndex === 2}
            sx={{
              borderRadius: "5px",
              "&.Mui-selected": { backgroundColor: "var(--other)", color: "#fff" },
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
              "&.Mui-selected": { backgroundColor: "var(--other)", color: "#fff" },
            }}
          >
            <ListItemIcon>
              <PersonAddIcon
                className={selectedIndex === 3 ? "color-white" : "gray"}
              />
            </ListItemIcon>
            <ListItemText primary="Registrar empleado pensionado" />
          </ListItemButton>
        </List>
      </Box>

      {/* Logout fijo abajo */}
      <Box sx={{ p: 2 }}>
        <Divider sx={{ mb: 1 }} />
        <ListItemButton
          onClick={() => goTo("/empleado/nuevo_pensionado")}
          selected={selectedIndex === 3}
          sx={{
            borderRadius: "5px",
            color: "error.main",
            "&:hover": { backgroundColor: "rgba(211, 47, 47, 0.1)" },
          }}
          onClick={() => {
            removeToken();
            goTo("/login");
          }}
        >
          <ListItemIcon>
            <PersonAddICon
              className={`side-icon ${
                selectedIndex === 3 ? "color-white " : "gray"
              }`}
            />
          </ListItemIcon>
          <ListItemText primary="Cerrar sesión" />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" }, 
        height: "100vh",
      }}
    >
    
      {isMobile ? (
        <Drawer
          anchor="left"
          variant="temporary"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          PaperProps={{ sx: { width: 256, display: "flex", flexDirection: "column" } }}
        >
          <Menu />
        </Drawer>
      ) : (
        <Box
          sx={{
            width: 256,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            borderRight: "1px solid #ddd",
          }}
        >
          <Menu />
        </Box>
      )}

  
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
      
        {isMobile && (
          <AppBar position="sticky" sx={{ bgcolor: bg, color: "var(--text)" }}>
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                sx={{ mr: 2 }}
                onClick={() => setDrawerOpen(!drawerOpen)}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
                Panel de empleados
              </Typography>
            </Toolbar>
          </AppBar>
        )}

        <Box sx={{ flex: 1, overflowY: "auto", p: { xs: 1, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>

    </Box>
  );
}
