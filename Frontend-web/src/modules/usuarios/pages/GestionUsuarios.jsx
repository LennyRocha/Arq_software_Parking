import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  OutlinedInput,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  Add as AddIcon,
  FilterList as FilterIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Info as InfoIcon,
  Done as DoneIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import MainHeader from "../../../components/MainHeader";

const links = [
  { nombre: "Usuarios", ruta: "/admin/usuarios", disabled: false },
  { nombre: "Consulta", ruta: "/admin/usuarios", disabled: true },
];

// Datos mock para mostrar el diseño
const mockUsuarios = [
  {
    id: 1,
    nombreCompleto: "Ana López Pérez Gonzales",
    correo: "Analopez@utez.edu.mx",
    tipoUsuario: "Pensionado",
    estatus: "Activo",
  },
  {
    id: 2,
    nombreCompleto: "Carlos Ruiz Soto",
    correo: "Carlosruiz@utez.edu.mx",
    tipoUsuario: "Empleado",
    estatus: "Inactivo",
  },
  {
    id: 3,
    nombreCompleto: "Maria Soto Castañeda Gelis",
    correo: "Mariasoto@utez.edu.mx",
    tipoUsuario: "Empleado",
    estatus: "Activo",
  },
  {
    id: 4,
    nombreCompleto: "Alberto Castro Piñeda",
    correo: "Albertocastro@utez.edu.mx",
    tipoUsuario: "Pensionado",
    estatus: "Activo",
  },
  {
    id: 5,
    nombreCompleto: "Alison Martinez Aguilar",
    correo: "Alisonaguilar@utez.edu.mx",
    tipoUsuario: "Pensionado",
    estatus: "Inactivo",
  },
];

export default function UsuarioTablaAdmin() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [ordenarPor, setOrdenarPor] = useState("masRecientes");
  const [buscarTexto, setBuscarTexto] = useState("");
  const [openModalRestablecer, setOpenModalRestablecer] = useState(false);
  const [openModalConfirmar, setOpenModalConfirmar] = useState(false);
  const [openModalExito, setOpenModalExito] = useState(false);
  const [openModalEditarEstatus, setOpenModalEditarEstatus] = useState(false);
  const [openModalConfirmarEstatus, setOpenModalConfirmarEstatus] = useState(false);
  const [openModalExitoEstatus, setOpenModalExitoEstatus] = useState(false);
  const [openModalEditarUsuario, setOpenModalEditarUsuario] = useState(false);
  const [openModalConfirmarEditarUsuario, setOpenModalConfirmarEditarUsuario] = useState(false);
  const [openModalExitoEditarUsuario, setOpenModalExitoEditarUsuario] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [nuevoEstatus, setNuevoEstatus] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [apellidosUsuario, setApellidosUsuario] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleBuscar = () => {
    // Aquí irá la lógica de búsqueda cuando se conecte el backend
    console.log("Buscando:", buscarTexto);
  };

  const handleLimpiarFiltros = () => {
    setBuscarTexto("");
    setOrdenarPor("masRecientes");
    setPage(0);
  };

  const handleNuevoUsuarioPensionado = () => {
    navigate("/admin/usuarios/registrar");
  };

  const handleNuevoEmpleado = () => {
    navigate("/admin/usuarios/registrar-empleado");
  };

  const handleAbrirModalRestablecer = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setOpenModalRestablecer(true);
  };

  const handleCerrarModalRestablecer = () => {
    setOpenModalRestablecer(false);
    setUsuarioSeleccionado(null);
  };

  const handleConfirmarRestablecer = () => {
    // Cerrar el modal de restablecer y abrir el modal de confirmación
    setOpenModalRestablecer(false);
    setOpenModalConfirmar(true);
  };

  const handleCerrarModalConfirmar = () => {
    setOpenModalConfirmar(false);
    setUsuarioSeleccionado(null);
  };

  const handleConfirmarCambio = () => {
    // Aquí irá la lógica para restablecer la contraseña
    console.log("Confirmar cambio de contraseña para:", usuarioSeleccionado);
    // Cerrar el modal de confirmación y abrir el modal de éxito
    setOpenModalConfirmar(false);
    setOpenModalExito(true);
  };

  const handleCerrarModalExito = () => {
    setOpenModalExito(false);
    setUsuarioSeleccionado(null);
  };

  const handleAbrirModalEditarEstatus = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setNuevoEstatus(""); // Iniciar vacío para mostrar "Seleccionar" por defecto
    setOpenModalEditarEstatus(true);
  };

  const handleCerrarModalEditarEstatus = () => {
    setOpenModalEditarEstatus(false);
    setUsuarioSeleccionado(null);
    setNuevoEstatus("");
  };

  const handleActualizarEstatus = () => {
    // Cerrar el modal de editar estatus y abrir el modal de confirmación
    setOpenModalEditarEstatus(false);
    setOpenModalConfirmarEstatus(true);
  };

  const handleCerrarModalConfirmarEstatus = () => {
    setOpenModalConfirmarEstatus(false);
    setUsuarioSeleccionado(null);
    setNuevoEstatus("");
  };

  const handleConfirmarCambioEstatus = () => {
    // Aquí irá la lógica para actualizar el estatus del usuario
    console.log("Confirmar cambio de estatus para:", usuarioSeleccionado, "Nuevo estatus:", nuevoEstatus);
    // Cerrar el modal de confirmación y abrir el modal de éxito
    setOpenModalConfirmarEstatus(false);
    setOpenModalExitoEstatus(true);
  };

  const handleCerrarModalExitoEstatus = () => {
    setOpenModalExitoEstatus(false);
    setUsuarioSeleccionado(null);
    setNuevoEstatus("");
  };

  const handleAbrirModalEditarUsuario = (usuario) => {
    // Dividir el nombre completo en nombre y apellidos
    // Tomar las primeras dos palabras como nombre, el resto como apellidos
    const partesNombre = usuario.nombreCompleto.trim().split(/\s+/);
    let nombre = partesNombre[0] || "";
    let apellidos = "";
    
    if (partesNombre.length > 1) {
      // Si hay más de una palabra, tomar la segunda como parte del nombre si hay suficientes palabras
      if (partesNombre.length >= 3) {
        nombre = partesNombre[0] + " " + partesNombre[1];
        apellidos = partesNombre.slice(2).join(" ");
      } else {
        // Si solo hay 2 palabras, la primera es nombre y la segunda es apellido
        nombre = partesNombre[0];
        apellidos = partesNombre[1];
      }
    }
    
    setUsuarioSeleccionado(usuario);
    setNombreUsuario(nombre);
    setApellidosUsuario(apellidos);
    setOpenModalEditarUsuario(true);
  };

  const handleCerrarModalEditarUsuario = () => {
    setOpenModalEditarUsuario(false);
    setUsuarioSeleccionado(null);
    setNombreUsuario("");
    setApellidosUsuario("");
  };

  const handleGuardarUsuario = () => {
    // Cerrar el modal de editar usuario y abrir el modal de confirmación
    setOpenModalEditarUsuario(false);
    setOpenModalConfirmarEditarUsuario(true);
  };

  const handleCerrarModalConfirmarEditarUsuario = () => {
    setOpenModalConfirmarEditarUsuario(false);
    setUsuarioSeleccionado(null);
    setNombreUsuario("");
    setApellidosUsuario("");
  };

  const handleConfirmarGuardarUsuario = () => {
    // Aquí irá la lógica para guardar los cambios del usuario
    console.log("Confirmar guardar usuario:", usuarioSeleccionado, "Nombre:", nombreUsuario, "Apellidos:", apellidosUsuario);
    // Cerrar el modal de confirmación y abrir el modal de éxito
    setOpenModalConfirmarEditarUsuario(false);
    setOpenModalExitoEditarUsuario(true);
  };

  const handleCerrarModalExitoEditarUsuario = () => {
    setOpenModalExitoEditarUsuario(false);
    setUsuarioSeleccionado(null);
    setNombreUsuario("");
    setApellidosUsuario("");
  };

  return (
    <>
      <MainHeader 
        titulo="USUARIOS REGISTRADOS" 
        breads={links}
        icon={true}
      />

      <Box
        sx={{
          padding: { xs: 2, sm: 3, md: 4 },
          paddingTop: { xs: 3, sm: 4, md: 6 },
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Botones de acción */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "center",
            mb: 4,
          }}
        >
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNuevoUsuarioPensionado}
            sx={{
              backgroundColor: "var(--primary)",
              color: "white",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "var(--primary)",
                opacity: 0.9,
              },
            }}
          >
            NUEVO USUARIO PENSIONADO
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNuevoEmpleado}
            sx={{
              backgroundColor: "var(--primary)",
              color: "white",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "var(--primary)",
                opacity: 0.9,
              },
            }}
          >
            NUEVO EMPLEADO
          </Button>
        </Box>

        {/* Card de la tabla */}
        <TableContainer component={Paper} elevation={3}>
          {/* Controles de filtros y búsqueda */}
          <Box
            sx={{
              p: 3,
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                alignItems: "center",
                flex: 1,
              }}
            >
              {/* Ordenar por */}
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Ordenar por</InputLabel>
                <Select
                  value={ordenarPor}
                  label="Ordenar por"
                  onChange={(e) => setOrdenarPor(e.target.value)}
                >
                  <MenuItem value="masRecientes">Más recientes</MenuItem>
                  <MenuItem value="nombre">Nombre</MenuItem>
                  <MenuItem value="correo">Correo</MenuItem>
                  <MenuItem value="tipoUsuario">Tipo de usuario</MenuItem>
                </Select>
              </FormControl>

              {/* Icono de filtro */}
              <IconButton
                color="primary"
                sx={{
                  border: "1px solid var(--border)",
                  borderRadius: 1,
                }}
              >
                <FilterIcon />
              </IconButton>

              {/* Buscar por */}
              <FormControl size="small" sx={{ minWidth: 200, flex: 1 }}>
                <InputLabel>Buscar por</InputLabel>
                <OutlinedInput
                  label="Buscar por"
                  placeholder="Correo electrónico"
                  value={buscarTexto}
                  onChange={(e) => setBuscarTexto(e.target.value)}
                />
              </FormControl>

              {/* Botones de acción */}
              <Button
                variant="outlined"
                onClick={handleBuscar}
                sx={{
                  borderColor: "var(--border)",
                  color: "var(--text)",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                BUSCAR
              </Button>
              <Button
                variant="outlined"
                onClick={handleLimpiarFiltros}
                sx={{
                  borderColor: "var(--border)",
                  color: "var(--text)",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                LIMPIAR FILTROS
              </Button>
            </Box>
          </Box>

          {/* Tabla */}
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "var(--background)" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Nombre completo</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Correo electrónico</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Tipo de usuario</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Estatus</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockUsuarios
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((usuario) => (
                  <TableRow
                    key={usuario.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": { backgroundColor: "var(--background)" },
                    }}
                  >
                    <TableCell>{usuario.nombreCompleto}</TableCell>
                    <TableCell>{usuario.correo}</TableCell>
                    <TableCell>{usuario.tipoUsuario}</TableCell>
                    <TableCell>
                      <Chip
                        label={usuario.estatus}
                        color={
                          usuario.estatus === "Activo" ? "success" : "default"
                        }
                        size="small"
                        sx={{
                          fontWeight: "bold",
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="primary"
                        aria-label="editar"
                        onClick={() => handleAbrirModalEditarUsuario(usuario)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="primary"
                        aria-label="editar estatus"
                        onClick={() => handleAbrirModalEditarEstatus(usuario)}
                        sx={{ mr: 1 }}
                      >
                        <RefreshIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="primary"
                        aria-label="restablecer contraseña"
                        onClick={() => handleAbrirModalRestablecer(usuario)}
                      >
                        <LockIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          {/* Paginación */}
          <TablePagination
            component="div"
            count={mockUsuarios.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Rows per page:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
            }
          />
        </TableContainer>
      </Box>

      {/* Modal de Restablecer Contraseña */}
      <Dialog
        open={openModalRestablecer}
        onClose={handleCerrarModalRestablecer}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 4,
            px: 4,
            pt: 5,
            pb: 2,
          }}
        >
          {/* Título */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "var(--primary)",
              mb: 3,
              textAlign: "center",
            }}
          >
            Restablecer contraseña
          </Typography>

          {/* Ícono de candado abierto con fondo circular */}
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              backgroundColor: "rgba(76, 175, 80, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <LockOpenIcon
              sx={{
                fontSize: 56,
                color: "var(--primary)",
              }}
            />
          </Box>

          {/* Mensaje */}
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              textAlign: "center",
              mb: 3,
              lineHeight: 1.6,
              px: 1,
            }}
          >
            Se generará una nueva contraseña temporal y se notificará al usuario. ¿Desea continuar?
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            px: 4,
            pb: 4,
            pt: 0,
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Button
            onClick={handleCerrarModalRestablecer}
            variant="contained"
            sx={{
              flex: 1,
              minWidth: 0,
              maxWidth: "50%",
              py: 1.25,
              borderRadius: 2,
              backgroundColor: "#f5f5f5",
              color: "#424242",
              textTransform: "none",
              fontWeight: 500,
              boxShadow: "none",
              fontSize: "0.875rem",
              whiteSpace: "nowrap",
              "&:hover": {
                backgroundColor: "#e8e8e8",
                boxShadow: "none",
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmarRestablecer}
            variant="contained"
            sx={{
              flex: 1,
              minWidth: 0,
              maxWidth: "50%",
              py: 1.25,
              borderRadius: 2,
              backgroundColor: "var(--primary)",
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
              fontSize: "0.875rem",
              whiteSpace: "nowrap",
              "&:hover": {
                backgroundColor: "var(--primary)",
                opacity: 0.9,
                boxShadow: "0 6px 16px rgba(76, 175, 80, 0.4)",
              },
            }}
          >
            Restablecer contraseña
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Confirmar Cambio de Contraseña */}
      <Dialog
        open={openModalConfirmar}
        onClose={handleCerrarModalConfirmar}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 4,
            px: 4,
            pt: 5,
            pb: 2,
          }}
        >
          {/* Ícono de información con fondo circular azul */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: "#2196f3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <InfoIcon
              sx={{
                fontSize: 48,
                color: "#ffffff",
              }}
            />
          </Box>

          {/* Título */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#000000",
              mb: 2,
              textAlign: "center",
            }}
          >
            Cambiar contraseña del usuario
          </Typography>

          {/* Mensaje */}
          <Typography
            variant="body1"
            sx={{
              color: "#000000",
              textAlign: "center",
              mb: 3,
              lineHeight: 1.6,
            }}
          >
            ¿Deseas cambiar la contraseña de este usuario?
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            px: 4,
            pb: 4,
            pt: 0,
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Button
            onClick={handleCerrarModalConfirmar}
            variant="contained"
            sx={{
              flex: 1,
              minWidth: 0,
              maxWidth: "50%",
              py: 1.25,
              borderRadius: 2,
              backgroundColor: "#f44336",
              color: "#ffffff",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              whiteSpace: "nowrap",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#d32f2f",
                boxShadow: "none",
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmarCambio}
            variant="contained"
            sx={{
              flex: 1,
              minWidth: 0,
              maxWidth: "50%",
              py: 1.25,
              borderRadius: 2,
              backgroundColor: "#4caf50",
              color: "#ffffff",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
              "&:hover": {
                backgroundColor: "#45a049",
                boxShadow: "0 6px 16px rgba(76, 175, 80, 0.4)",
              },
            }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Éxito */}
      <Dialog
        open={openModalExito}
        onClose={handleCerrarModalExito}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 4,
            px: 4,
            pb: 1,
          }}
        >
          {/* Ícono de éxito simple */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2.5,
            }}
          >
            {/* Círculo verde sólido */}
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                backgroundColor: "#4caf50",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DoneIcon
                sx={{
                  fontSize: 48,
                  color: "#ffffff",
                }}
              />
            </Box>
          </Box>

          {/* Título */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#000000",
              mb: 1.5,
            }}
          >
            ¡Éxito!
          </Typography>

          {/* Mensaje */}
          <Typography
            variant="body2"
            sx={{
              color: "#000000",
              textAlign: "center",
              mb: 3,
            }}
          >
            Contraseña restablecida exitosamente.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 3.5, pt: 0, justifyContent: "center" }}>
          <Button
            onClick={handleCerrarModalExito}
            variant="contained"
            sx={{
              backgroundColor: "#4caf50",
              color: "#ffffff",
              py: 0.75,
              px: 3,
              borderRadius: 1.5,
              minWidth: 100,
              textTransform: "none",
              fontSize: "0.875rem",
              "&:hover": {
                backgroundColor: "#45a049",
              },
            }}
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Editar Estatus */}
      <Dialog
        open={openModalEditarEstatus}
        onClose={handleCerrarModalEditarEstatus}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            color: "var(--primary)",
            fontSize: "1.5rem",
            pb: 1,
            pt: 3,
            px: 4,
            textAlign: "center",
          }}
        >
          Editar estatus
        </DialogTitle>
        <DialogContent
          sx={{
            px: 4,
            pb: 2,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              mb: 3,
              textAlign: "center",
            }}
          >
            Seleccione el nuevo estatus del usuario
          </Typography>

          {/* Campo Select con placeholder "Seleccionar" */}
          <FormControl fullWidth>
            <Select
              value={nuevoEstatus || ""}
              onChange={(e) => setNuevoEstatus(e.target.value)}
              displayEmpty
              sx={{
                borderRadius: 2,
                backgroundColor: "#fbfbff",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(15, 23, 42, 0.08)",
                },
              }}
              renderValue={(selected) => {
                if (!selected) {
                  return "Seleccionar";
                }
                return selected;
              }}
            >
              <MenuItem value="" disabled>
                Seleccionar
              </MenuItem>
              <MenuItem value="Activo">Activo</MenuItem>
              <MenuItem value="Inactivo">Inactivo</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions
          sx={{
            px: 4,
            pb: 4,
            pt: 0,
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Button
            onClick={handleCerrarModalEditarEstatus}
            variant="contained"
            sx={{
              flex: 1,
              minWidth: 0,
              maxWidth: "50%",
              py: 1.25,
              borderRadius: 2,
              backgroundColor: "#f5f5f5",
              color: "#424242",
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.875rem",
              whiteSpace: "nowrap",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#e8e8e8",
                boxShadow: "none",
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleActualizarEstatus}
            variant="contained"
            sx={{
              flex: 1,
              minWidth: 0,
              maxWidth: "50%",
              py: 1.25,
              borderRadius: 2,
              backgroundColor: "var(--primary)",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
              "&:hover": {
                backgroundColor: "var(--primary)",
                opacity: 0.9,
                boxShadow: "0 6px 16px rgba(76, 175, 80, 0.4)",
              },
            }}
          >
            Actualizar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Confirmar Cambio de Estatus */}
      <Dialog
        open={openModalConfirmarEstatus}
        onClose={handleCerrarModalConfirmarEstatus}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 4,
            px: 4,
            pt: 5,
            pb: 2,
          }}
        >
          {/* Ícono de información con fondo circular azul */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: "#2196f3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <InfoIcon
              sx={{
                fontSize: 48,
                color: "#ffffff",
              }}
            />
          </Box>

          {/* Título */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#000000",
              mb: 2,
              textAlign: "center",
            }}
          >
            Editar estatus del usuario
          </Typography>

          {/* Mensaje */}
          <Typography
            variant="body1"
            sx={{
              color: "#000000",
              textAlign: "center",
              mb: 3,
              lineHeight: 1.6,
            }}
          >
            ¿Deseas cambiar el estatus de este usuario?
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            px: 4,
            pb: 4,
            pt: 0,
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Button
            onClick={handleCerrarModalConfirmarEstatus}
            variant="contained"
            sx={{
              flex: 1,
              minWidth: 0,
              maxWidth: "50%",
              py: 1.25,
              borderRadius: 2,
              backgroundColor: "#f44336",
              color: "#ffffff",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              whiteSpace: "nowrap",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#d32f2f",
                boxShadow: "none",
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmarCambioEstatus}
            variant="contained"
            sx={{
              flex: 1,
              minWidth: 0,
              maxWidth: "50%",
              py: 1.25,
              borderRadius: 2,
              backgroundColor: "#4caf50",
              color: "#ffffff",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
              "&:hover": {
                backgroundColor: "#45a049",
                boxShadow: "0 6px 16px rgba(76, 175, 80, 0.4)",
              },
            }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Éxito - Estatus */}
      <Dialog
        open={openModalExitoEstatus}
        onClose={handleCerrarModalExitoEstatus}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 4,
            px: 4,
            pb: 1,
          }}
        >
          {/* Ícono de éxito simple */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2.5,
            }}
          >
            {/* Círculo verde sólido */}
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                backgroundColor: "#4caf50",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DoneIcon
                sx={{
                  fontSize: 48,
                  color: "#ffffff",
                }}
              />
            </Box>
          </Box>

          {/* Título */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#000000",
              mb: 1.5,
            }}
          >
            ¡Éxito!
          </Typography>

          {/* Mensaje */}
          <Typography
            variant="body2"
            sx={{
              color: "#000000",
              textAlign: "center",
              mb: 3,
            }}
          >
            Estatus de usuario registrado exitosamente.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 3.5, pt: 0, justifyContent: "center" }}>
          <Button
            onClick={handleCerrarModalExitoEstatus}
            variant="contained"
            sx={{
              backgroundColor: "#4caf50",
              color: "#ffffff",
              py: 0.75,
              px: 3,
              borderRadius: 1.5,
              minWidth: 100,
              textTransform: "none",
              fontSize: "0.875rem",
              "&:hover": {
                backgroundColor: "#45a049",
              },
            }}
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Editar Usuario */}
      <Dialog
        open={openModalEditarUsuario}
        onClose={handleCerrarModalEditarUsuario}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            color: "var(--primary)",
            fontSize: "1.5rem",
            pb: 2,
            pt: 3,
            px: 4,
            textAlign: "center",
          }}
        >
          Editar usuario
        </DialogTitle>
        <DialogContent
          sx={{
            px: 4,
            pb: 2,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
            {/* Campo Nombre */}
            <TextField
              fullWidth
              label="Nombre"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              variant="standard"
              sx={{
                "& .MuiInputLabel-root": {
                  color: "var(--primary)",
                  "&.Mui-focused": {
                    color: "var(--primary)",
                  },
                },
                "& .MuiInput-underline:before": {
                  borderBottomColor: "rgba(0, 0, 0, 0.2)",
                },
                "& .MuiInput-underline:hover:before": {
                  borderBottomColor: "rgba(0, 0, 0, 0.4)",
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: "var(--primary)",
                },
              }}
            />

            {/* Campo Apellidos */}
            <TextField
              fullWidth
              label="Apellidos"
              value={apellidosUsuario}
              onChange={(e) => setApellidosUsuario(e.target.value)}
              variant="standard"
              sx={{
                "& .MuiInputLabel-root": {
                  color: "var(--primary)",
                  "&.Mui-focused": {
                    color: "var(--primary)",
                  },
                },
                "& .MuiInput-underline:before": {
                  borderBottomColor: "rgba(0, 0, 0, 0.2)",
                },
                "& .MuiInput-underline:hover:before": {
                  borderBottomColor: "rgba(0, 0, 0, 0.4)",
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: "var(--primary)",
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            px: 4,
            pb: 4,
            pt: 2,
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Button
            onClick={handleCerrarModalEditarUsuario}
            variant="contained"
            sx={{
              flex: 1,
              minWidth: 0,
              maxWidth: "50%",
              py: 1.25,
              borderRadius: 2,
              backgroundColor: "#f5f5f5",
              color: "#424242",
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.875rem",
              whiteSpace: "nowrap",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#e8e8e8",
                boxShadow: "none",
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleGuardarUsuario}
            variant="contained"
            sx={{
              flex: 1,
              minWidth: 0,
              maxWidth: "50%",
              py: 1.25,
              borderRadius: 2,
              backgroundColor: "var(--primary)",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
              "&:hover": {
                backgroundColor: "var(--primary)",
                opacity: 0.9,
                boxShadow: "0 6px 16px rgba(76, 175, 80, 0.4)",
              },
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Confirmar Editar Usuario */}
      <Dialog
        open={openModalConfirmarEditarUsuario}
        onClose={handleCerrarModalConfirmarEditarUsuario}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 4,
            px: 4,
            pt: 5,
            pb: 2,
          }}
        >
          {/* Ícono de información con fondo circular azul */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: "#2196f3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <InfoIcon
              sx={{
                fontSize: 48,
                color: "#ffffff",
              }}
            />
          </Box>

          {/* Título */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#000000",
              mb: 2,
              textAlign: "center",
            }}
          >
            Modificar datos del usuario
          </Typography>

          {/* Mensaje */}
          <Typography
            variant="body1"
            sx={{
              color: "#000000",
              textAlign: "center",
              mb: 3,
              lineHeight: 1.6,
            }}
          >
            ¿Deseas cambiar los datos de este usuario?
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            px: 4,
            pb: 4,
            pt: 0,
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Button
            onClick={handleCerrarModalConfirmarEditarUsuario}
            variant="contained"
            sx={{
              flex: 1,
              minWidth: 0,
              maxWidth: "50%",
              py: 1.25,
              borderRadius: 2,
              backgroundColor: "#f44336",
              color: "#ffffff",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              whiteSpace: "nowrap",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#d32f2f",
                boxShadow: "none",
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmarGuardarUsuario}
            variant="contained"
            sx={{
              flex: 1,
              minWidth: 0,
              maxWidth: "50%",
              py: 1.25,
              borderRadius: 2,
              backgroundColor: "#4caf50",
              color: "#ffffff",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
              "&:hover": {
                backgroundColor: "#45a049",
                boxShadow: "0 6px 16px rgba(76, 175, 80, 0.4)",
              },
            }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Éxito - Editar Usuario */}
      <Dialog
        open={openModalExitoEditarUsuario}
        onClose={handleCerrarModalExitoEditarUsuario}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 4,
            px: 4,
            pb: 1,
          }}
        >
          {/* Ícono de éxito simple */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2.5,
            }}
          >
            {/* Círculo verde sólido */}
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                backgroundColor: "#4caf50",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DoneIcon
                sx={{
                  fontSize: 48,
                  color: "#ffffff",
                }}
              />
            </Box>
          </Box>

          {/* Título */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#000000",
              mb: 1.5,
            }}
          >
            ¡Éxito!
          </Typography>

          {/* Mensaje */}
          <Typography
            variant="body2"
            sx={{
              color: "#000000",
              textAlign: "center",
              mb: 3,
            }}
          >
            Datos del usuario actualizados exitosamente.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 3.5, pt: 0, justifyContent: "center" }}>
          <Button
            onClick={handleCerrarModalExitoEditarUsuario}
            variant="contained"
            sx={{
              backgroundColor: "#4caf50",
              color: "#ffffff",
              py: 0.75,
              px: 3,
              borderRadius: 1.5,
              minWidth: 100,
              textTransform: "none",
              fontSize: "0.875rem",
              "&:hover": {
                backgroundColor: "#45a049",
              },
            }}
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
