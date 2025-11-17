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
    field: "fecha",
    label: "Fecha",
    render: (row) => {
      if (row.fecha) {
        const fecha = new Date(row.fecha);
        return fecha.toLocaleDateString('es-MX', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
      return "-";
    }
  },
  {
    field: "horaEntradaSalida",
    label: "Hora entrada - Hora salida",
    render: (row) => {
      // Función para convertir hora "HH:MM:SS.mmm" a formato "HH:MM am/pm"
      const formatearHora = (horaString) => {
        if (!horaString) return null;
        
        const [horas, minutos] = horaString.split(':');
        let hora = parseInt(horas);
        const min = minutos;
        const periodo = hora >= 12 ? 'pm' : 'am';
        
        if (hora > 12) hora -= 12;
        if (hora === 0) hora = 12;
        
        return `${hora}:${min} ${periodo}`;
      };

      const horaEntrada = formatearHora(row.horaEntrada);
      const horaSalida = formatearHora(row.horaSalida);
      
      if (horaEntrada && horaSalida) {
        return `${horaEntrada} - ${horaSalida}`;
      } else if (horaEntrada) {
        return horaEntrada;
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
        {!row.horaSalida && (
          <IconButton
            onClick={() => onEdit(row)}
            color="secondary"
            size="small"
            aria-label="editar"
            sx={{ ml: 1 }}
          >
            <EditIcon />
          </IconButton>
        )}
      </>
    )
  }
];
