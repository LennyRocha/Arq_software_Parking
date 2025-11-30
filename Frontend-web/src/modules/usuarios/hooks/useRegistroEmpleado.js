import { useState } from 'react';
import { registrarEmpleado } from '../api/usuariosApi';
import { getAxiosErrorMessage } from '../../../utils/getAxiosMessage';

export default function useRegistroEmpleado() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const registrar = async (empleadoData) => {
    setLoading(true);
    setError(null);
    
    try {
      const payload = {
        nombre: empleadoData.nombre,
        apellidos: empleadoData.apellidos,
        correo: empleadoData.correo,
        telefono: empleadoData.telefono
      };

      const response = await registrarEmpleado(payload);
      return { 
        success: true, 
        data: response.data.data 
      };
    } catch (error) {
      const errorMessage = getAxiosErrorMessage(error);
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    registrar
  };
}
