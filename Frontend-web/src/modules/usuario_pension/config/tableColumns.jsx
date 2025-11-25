import { Button } from "@mui/material";
import HistoryIcon from '@mui/icons-material/History';
import AutorenewIcon from '@mui/icons-material/Autorenew';

/**
 * Configuración de columnas para la tabla de usuarios pensionados
 */
export const usuarioPensionColumns = ({ onVerHistorial, onAbrirRenovar, setLoading }) => [
  { 
    field: "correo", 
    label: "Correo del usuario"
  },
  { 
    field: "nombrePension", 
    label: "Tipo pensión"
  },
  { 
    field: "costoUltimoPago", 
    label: "Costo pensión ($ MXN)",
    render: (row) => {
      if (row.costoUltimoPago === null || row.costoUltimoPago === undefined) return "N/A";
      return `$${parseFloat(row.costoUltimoPago).toFixed(2)}`;
    }
  },
  { 
    field: "fechaFinalizacion", 
    label: "Fecha finalización",
    render: (row) => {
      if (!row.fechaFinalizacion) return "N/A";
      // Agregar 'T00:00:00' para evitar problemas de zona horaria
      const date = new Date(row.fechaFinalizacion + 'T00:00:00');
      return date.toLocaleDateString("es-MX", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    }
  },
  {
    field: "opciones",
    label: "Opciones",
    align: "center",
    render: (row) => (
      <>
        <Button
          startIcon={<HistoryIcon />}
          onClick={() => onVerHistorial(row)}
          color="primary"
          size="small"
          sx={{ mr: 1 }}
        >
          Historial
        </Button>
        <Button
          startIcon={<AutorenewIcon />}
          onClick={() => onAbrirRenovar(row)}
          color="success"
          size="small"
        >
          Renovar
        </Button>
      </>
    )
  }
];

/**
 * Configuración de columnas para el historial de pagos
 */
export const historialPagosColumns = [
  {
    field: "cantidadPago",
    label: "Costo pagado ($ MXN)",
    render: (row) => {
      if (row.cantidadPago === null || row.cantidadPago === undefined) return "N/A";
      return `$${parseFloat(row.cantidadPago).toFixed(2)}`;
    },
  },
  {
    field: "fechaPago",
    label: "Fecha realización del pago",
    render: (row) => {
      if (!row.fechaPago) return "N/A";
      const date = new Date(row.fechaPago + 'T00:00:00');
      return date.toLocaleDateString("es-MX", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    },
  },
  {
    field: "fechaInicio",
    label: "Fecha de inicio",
    render: (row) => {
      if (!row.fechaInicio) return "N/A";
      const date = new Date(row.fechaInicio + 'T00:00:00');
      return date.toLocaleDateString("es-MX", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    },
  },
  {
    field: "fechaFin",
    label: "Fecha finalización",
    render: (row) => {
      if (!row.fechaFin) return "N/A";
      const date = new Date(row.fechaFin + 'T00:00:00');
      return date.toLocaleDateString("es-MX", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    },
  },
];

/**
 * Opciones de ordenamiento para usuarios pensionados
 */
export const orderOptions = [
  { value: "id", label: "Orden de inserción" },
  { value: "correo", label: "Correo" },
  { value: "nombrePension", label: "Nombre de pensión" },
  { value: "fechaFinalizacion", label: "Fecha finalización" }
];

/**
 * Opciones de ordenamiento para historial de pagos
 */
export const historialOrderOptions = [
  { value: "fechaPago", label: "Fecha de pago" },
  { value: "cantidadPago", label: "Monto pagado" },
  { value: "fechaInicio", label: "Fecha de inicio" },
  { value: "fechaFin", label: "Fecha de finalización" },
];
