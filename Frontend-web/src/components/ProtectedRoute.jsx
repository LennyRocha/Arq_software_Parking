import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Block as BlockIcon } from '@mui/icons-material';
import { getToken, getInfoUser } from '../utils/AuthService';

/**
 * Componente para proteger rutas según el rol del usuario
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente hijo a renderizar si tiene acceso
 * @param {Array<string>} props.allowedRoles - Roles permitidos para acceder a esta ruta
 */
export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const token = getToken();
  const userInfo = getInfoUser();

  // Si no hay token, redirigir al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si no hay información del usuario, redirigir al login
  if (!userInfo || !userInfo.role) {
    return <Navigate to="/login" replace />;
  }

  // Verificar si el rol del usuario está en los roles permitidos
  const userRole = userInfo.role;
  const hasAccess = allowedRoles.length === 0 || allowedRoles.includes(userRole);

  // Si no tiene acceso, mostrar mensaje de no autorizado
  if (!hasAccess) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: 'background.default',
          p: 3,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            maxWidth: 500,
            textAlign: 'center',
            borderRadius: 2,
          }}
        >
          <BlockIcon
            sx={{
              fontSize: 80,
              color: 'error.main',
              mb: 2,
            }}
          />
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'error.main' }}>
            Acceso Denegado
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            No tienes autorización para acceder a esta página.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.href = '/'}
            sx={{ mt: 2 }}
          >
            Volver al inicio
          </Button>
        </Paper>
      </Box>
    );
  }

  // Si tiene acceso, renderizar el componente hijo
  return children;
}
