import apiToken from '../../../utils/apiToken';

// Registrar empleado
export const registrarEmpleado = async (empleadoData) => {
  return await apiToken.post('/api/auth/private/registrarEmpleado', empleadoData);
};

// Otras funciones de API para usuarios pueden ir aquí
