//Para perfil de admin
import * as React from "react";
import { Box, Toolbar, AppBar, Typography } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import MainHeader from "../../../components/MainHeader";


import Perfil from "../../Perfil";
import { getToken } from "../../../utils/AuthService";

export default function AdminPages() {
  const location = useLocation();
  const theme = useTheme();
  const bg = theme.palette.background.default;
  const [pageTitle, setPageTitle] = React.useState("Mi perfil");
  const [links, setLinks] = React.useState([]);

  const [showPerfil, setShowPerfil] = React.useState(false);

  React.useEffect(() => {
    setShowPerfil(location.pathname.includes("perfil"));
  }, [location.pathname]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        height: "100vh",
        padding: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >

      <AppBar
        position="sticky"
        sx={{
          bgcolor: bg,
          color: "var(--text)",
        }}
      >
       
      </AppBar>

      <Box
        sx={{
          flex: 1,
          height: "100%",
          overflowY: "auto",
        }}
      >
                <MainHeader titulo={pageTitle} breads={links} />
        
        {showPerfil ? <Perfil /> : <Outlet />}
      </Box>
      
    </Box>
  );
}
