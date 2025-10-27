import * as React from "react";

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
import PaymentsIcon from "@mui/icons-material/Payments";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import PeopleIcon from "@mui/icons-material/People";
import DirectionsCar from "@mui/icons-material/DirectionsCar";
import Settings from "@mui/icons-material/Settings";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import PersonIcon from "@mui/icons-material/Person";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";

//Material Design Icons Js
import Icon from "@mdi/react";
import { mdiAccountTie } from "@mdi/js";
import { mdiCash } from "@mdi/js";
import { mdiAccountCreditCard } from "@mdi/js";
import { mdiFileChart } from "@mdi/js";
import { mdiCarCog } from "@mdi/js";

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

export default function AdminRouter() {
  const location = useLocation();
  const path = location.pathname;
  const goTo = useNavigate();
  const [openPension, setOpenPension] = React.useState(false);
  const [openUsers, setOpenUsers] = React.useState(false);
  const [openReports, setOpenReports] = React.useState(true);

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
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
        setSelectedIndex(5);
        break;
      case path.includes("gestion_empleados"):
        setSelectedIndex(6);
        break;
      case path.includes("gestion_pensionados"):
        setSelectedIndex(7);
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
                fontFamily: "Exo 2, sans-serif", // tu fuente personalizada
                fontWeight: "bold",
                fontSize: 20,
                color: "var(--other)",
              }}
              secondary="Administrador"
            />
          </ListItem>
          <Tooltip title="Ir a mi perfil" cursor="pointer">
            <Avatar
              sx={{
                bgcolor: "var(--other)",
                "&:hover": {
                  cursor: "pointer",
                  bgcolor: "var(--primary)",
                },
              }}
              onClick={() => goTo(`/private/perfil/${24}`)}
            >
              UA
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
              onClick={() => goTo("/admin/ver_pensiones")}
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

        <ListItemButton onClick={() => handleClick("users")}>
          <ListItemIcon>
            <PeopleIcon className="gray" />
          </ListItemIcon>
          <ListItemText primary="Usuarios" />
          {openUsers ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openUsers} timeout="auto" unmountOnExit>
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
              onClick={() => goTo("/admin/gestion_empleados")}
              selected={selectedIndex === 6}
              className="side-item"
            >
              <ListItemIcon>
                <Icon
                  path={mdiAccountTie}
                  size={1}
                  className={`side-icon ${
                    selectedIndex === 6 ? "color-white " : "gray"
                  }`}
                />
              </ListItemIcon>
              <ListItemText primary="Empleados" />
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
              onClick={() => goTo("/admin/gestion_pensionados")}
              selected={selectedIndex === 7}
              className="side-item"
            >
              <ListItemIcon>
                <PersonIcon
                  className={`side-icon ${
                    selectedIndex === 7 ? "color-white " : "gray"
                  }`}
                />
              </ListItemIcon>
              <ListItemText primary="Pensionados" />
            </ListItemButton>
          </List>
        </Collapse>

        <ListItemButton
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
        </ListItemButton>
      </List>
    );
  };

  return (
    <Box
      sx={{ flexGrow: 1, height: "100vh", padding: 0 }}
      className="grid-side"
    >
      <Menu clase="side-bar-layout" />
      <Box sx={{ flex: 1, overflowY: "auto", height: "100vh" }}>
        <AppBar position="static" sx={{ display: { md: "none", xs: "flex" } }}>
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
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              News
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
