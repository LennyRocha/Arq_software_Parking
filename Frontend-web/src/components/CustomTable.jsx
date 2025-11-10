import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography
} from '@mui/material';

/**
 * CustomTable - Componente de tabla reutilizable
 * 
 * @param {Object} props
 * @param {Array} props.columns - Configuración de columnas [{field, label, render}]
 * @param {Array} props.data - Datos a mostrar en la tabla
 * @param {number} props.page - Página actual
 * @param {number} props.rowsPerPage - Resultados por página
 * @param {number} props.totalElements - Total de elementos
 * @param {function} props.onPageChange - Manejador de cambio de página
 * @param {function} props.onRowsPerPageChange - Manejador de cambio de resultados por página
 * @param {boolean} props.loading - Indica si la tabla está cargando
 * @param {string} props.error - Mensaje de error si existe
 * @param {string} props.emptyMessage - Mensaje cuando no hay datos
 */
export default function CustomTable({
  columns,
  data,
  page,
  rowsPerPage,
  totalElements,
  onPageChange,
  onRowsPerPageChange,
  loading = false,
  error = null,
  emptyMessage = "No hay datos disponibles"
}) {
  return (
    <TableContainer component={Paper} elevation={3}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "var(--background)" }}>
            {columns.map((column, index) => (
              <TableCell 
                key={column.field || index} 
                align={column.align || "left"}
                sx={{ fontWeight: "bold" }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                <Typography>Cargando datos...</Typography>
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                <Typography color="error">{error}</Typography>
              </TableCell>
            </TableRow>
          ) : !data || data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                <Typography>{emptyMessage}</Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow
                key={row.id || index}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': { backgroundColor: 'var(--background)' }
                }}
              >
                {columns.map((column, cellIndex) => (
                  <TableCell 
                    key={`${row.id || index}-${column.field || cellIndex}`}
                    align={column.align || "left"}
                  >
                    {column.render ? column.render(row) : row[column.field]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Paginación */}
      <TablePagination
        component="div"
        count={totalElements}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Resultados por página:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
      />
    </TableContainer>
  );
}