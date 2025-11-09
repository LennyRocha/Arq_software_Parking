import React, { useState } from "react";
import { 
  Box,
  Button, 
  TextField, 
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TablePagination,
  OutlinedInput
} from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import MainHeader from "../../../../components/MainHeader";
import LoadingBackdrop from "../../../../components/LoadingBackdrop";
import HeadingDescription from "../../../../components/HeadingDescription";

const links = [
  { nombre: "Inicio", ruta: "/admin", disabled: false },
  { nombre: "Entradas y salidas", ruta: "/admin/entradas-salidas", disabled: true },
];

// Datos de ejemplo para la tabla
const entradasSalidasData = [
  {
    folio: "456476294328244",
    tipoVehiculo: "Coche",
    fecha: "19/10/2025",
    horaEntradaSalida: "12:00 pm - 1:30 pm",
  },
  {
    folio: "456456412355456",
    tipoVehiculo: "Coche",
    fecha: "19/10/2025",
    horaEntradaSalida: "",
  },
  {
    folio: "455464645454465",
    tipoVehiculo: "Camioneta",
    fecha: "19/10/2025",
    horaEntradaSalida: "12:00 pm - 1:30 pm",
  },
  {
    folio: "245246646456466",
    tipoVehiculo: "Coche",
    fecha: "19/10/2025",
    horaEntradaSalida: "12:00 pm - 1:30 pm",
  },
  {
    folio: "544555345434544",
    tipoVehiculo: "Moto",
    fecha: "19/10/2025",
    horaEntradaSalida: "12:00 pm - 1:30 pm",
  },
];

export default function AdminGestionarEntradasSalidas() {
  const [show, setShow] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [ordenarPor, setOrdenarPor] = useState("recientes");
  const [buscarPor, setBuscarPor] = useState("folio");
  const [buscarTexto, setBuscarTexto] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <LoadingBackdrop isOpen={show} onClose={() => setShow(false)} />
      <MainHeader titulo="Entradas y salidas" breads={links} />
      
      <Box sx={{ padding: { xs: 2, sm: 3, md: 4 }, paddingTop: { xs: 3, sm: 4, md: 6 }, maxWidth: "1200px", margin: "0 auto" }}>
        {/* Título y descripción */}
        <HeadingDescription 
          title="ENTRADAS Y SALIDAS DE VISITANTES Y USUARIOS PENSIONADOS"
          description="Movimientos que registran el momento en que un vehículo ingresa al estacionamiento (entrada) y cuando se retira del mismo (salida).
          Incluyen control de tarifas y tiempo de servicio."
        />

        {/* Controles de búsqueda y filtros */}
        <Box 
          sx={{ 
            display: "flex", 
            gap: 2, 
            mb: 3,
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", flex: 1 }}>
            {/* Ordenar por */}
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Ordenar por</InputLabel>
              <Select
                value={ordenarPor}
                label="Ordenar por"
                onChange={(e) => setOrdenarPor(e.target.value)}
              >
                <MenuItem value="recientes">Más recientes</MenuItem>
                <MenuItem value="antiguos">Más antiguos</MenuItem>
                <MenuItem value="folio">Folio</MenuItem>
              </Select>
            </FormControl>

            {/* Campo de texto para buscar */}
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Buscar por</InputLabel>
              <OutlinedInput
                label="Buscar por"
                placeholder="Folio"
                value={buscarTexto}
                onChange={(e) => setBuscarTexto(e.target.value)}
              />
            </FormControl>

            {/* Botones de acción */}
            <Button variant="outlined" color="primary">
              BUSCAR
            </Button>
            <Button variant="outlined" color="primary">
              LIMPIAR FILTROS
            </Button>
          </Box>

          {/* Botón agregar nueva */}
          <Button 
            color="primary"
            variant="contained"
            sx={{ minWidth: 150 }}
          >
            + AGREGAR NUEVA
          </Button>
        </Box>

        {/* Tabla */}
        <TableContainer component={Paper} elevation={3}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "var(--background)" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Folio</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Tipo de vehículo</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Fecha</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Hora entrada/salida</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">Opciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entradasSalidasData.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': { backgroundColor: 'var(--background)' }
                  }}
                >
                  <TableCell>{row.folio}</TableCell>
                  <TableCell>{row.tipoVehiculo}</TableCell>
                  <TableCell>{row.fecha}</TableCell>
                  <TableCell>{row.horaEntradaSalida || '-'}</TableCell>
                  <TableCell align="center">
                    <IconButton 
                      color="primary" 
                      size="small"
                      aria-label="ver"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton 
                      color="secondary" 
                      size="small"
                      aria-label="editar"
                      sx={{ ml: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* Paginación */}
          <TablePagination
            component="div"
            count={entradasSalidasData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Resultados por página:"
            labelDisplayedRows={({ from, to, count }) => 
              `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
            }
          />
        </TableContainer>
      </Box>
    </>
  );
}
