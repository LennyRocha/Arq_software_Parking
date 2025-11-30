import { Button, Chip } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import LockResetIcon from '@mui/icons-material/LockReset';
import UsuarioStatusSwitch from "../components/UsuarioStatusSwitch";

export const usuarioColumns = ({ onEdit, onChangeStatus, onRestablecerContrasena, setLoading }) => [
  { 
    field: "nombreCompleto", 
    label: "Nombre completo",
    render: (row) => `${row.nombre} ${row.apellidos}`
  },
  { field: "correo", label: "Correo electrónico" },
  { 
    field: "tipoUsuario", 
    label: "Tipo de usuario",
    render: (row) => row.esPensionado ? "Pensionado" : "Empleado"
  },
  {
    field: "status",
    label: "Estatus",
    render: (row) => (
      <Chip 
        label={row.status ? "Activo" : "Inactivo"}
        color={row.status ? "success" : "default"}
        size="small"
      />
    )
  },
  {
    field: "opciones",
    label: "Acciones",
    align: "center",
    render: (row) => (
      <>
        <Button
          startIcon={<EditIcon />}
          onClick={() => onEdit(row)}
          color="secondary"
          size="small"
          sx={{ mr: 1 }}
        >
          Editar
        </Button>
        <Button
          startIcon={<LockResetIcon />}
          onClick={() => onRestablecerContrasena(row)}
          color="warning"
          size="small"
          sx={{ mr: 1 }}
        >
          Restablecer
        </Button>
        <UsuarioStatusSwitch
          id={row.id}
          status={row.status}
          onStatusChange={onChangeStatus}
          setLoading={setLoading}
        />
      </>
    )
  }
];

export const orderOptions = [
  { value: "id", label: "Orden de inserción" },
  { value: "nombre", label: "Nombre" },
  { value: "apellidos", label: "Apellidos" },
  { value: "correo", label: "Correo" }
];

export const tipoUsuarioOptions = [
  { value: "", label: "Todos" },
  { value: "pensionado", label: "Pensionados" },
  { value: "empleado", label: "Empleados" }
];
