import { Button } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import TipoPensionStatusSwitch from "../components/TipoPensionStatusSwitch";

export const tipoPensionColumns = ({ onEdit, onChangeStatus, setLoading }) => [
  { field: "nombre", label: "Nombre" },
  { 
    field: "duracionDias", 
    label: "Duración",
    render: (row) => `${row.duracionDias} días`
  },
  { 
    field: "costo", 
    label: "Costo",
    render: (row) => `$${row.costo}`
  },
  {
    field: "status",
    label: "Estatus",
    render: (row) => row.status ? "Activa" : "Inactiva"
  },
  {
    field: "opciones",
    label: "Opciones",
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
        <TipoPensionStatusSwitch
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
  { value: "duracionDias", label: "Duración" },
  { value: "costo", label: "Costo" }
];