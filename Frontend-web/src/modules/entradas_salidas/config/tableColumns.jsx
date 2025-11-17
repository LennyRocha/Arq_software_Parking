import React from 'react';
import { IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';

/**
 * Opciones de ordenamiento para entradas y salidas
 */
export const orderOptions = [
  { value: "fecha", label: "Fecha" },
  { value: "tipoVehiculo", label: "Tipo de vehículo" }
];

/**
 * Configuración de columnas para la tabla de entradas y salidas
 */
export const entradasSalidasColumns = ({ onView, onEdit }) => [
  {
    field: "folioTicket",
    label: "Folio",
    render: (row) => row.folioTicket || "-"
  },
  {
    field: "tipoVehiculo",
    label: "Tipo de vehículo",
    render: (row) => row.tipoVehiculo?.nombre || row.tipoVehiculo || "-"
  },
  {
    field: "usuario",
    label: "Usuario",
    render: (row) => {
      if (row.usuario) {
        return `${row.usuario.nombre || ""} ${row.usuario.apellidoPaterno || ""} ${row.usuario.apellidoMaterno || ""}`.trim() || "-";
      }
      return "Visitante";
    }
  },
  {
    field: "fechaHoraEntrada",
    label: "Fecha y hora de entrada",
    render: (row) => {
      if (row.fechaHoraEntrada) {
        const fecha = new Date(row.fechaHoraEntrada);
        return fecha.toLocaleString('es-MX', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      }
      return "-";
    }
  },
  {
    field: "fechaHoraSalida",
    label: "Fecha y hora de salida",
    render: (row) => {
      if (row.fechaHoraSalida) {
        const fecha = new Date(row.fechaHoraSalida);
        return fecha.toLocaleString('es-MX', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      }
      return "-";
    }
  },
  {
    field: "opciones",
    label: "Opciones",
    align: "center",
    render: (row) => (
      <>
        <IconButton
          onClick={() => onView(row)}
          color="primary"
          size="small"
          aria-label="ver"
        >
          <VisibilityIcon />
        </IconButton>
        <IconButton
          onClick={() => onEdit(row)}
          color="secondary"
          size="small"
          aria-label="editar"
          sx={{ ml: 1 }}
        >
          <EditIcon />
        </IconButton>
      </>
    )
  }
];
