import { useState, useCallback } from "react";
import { 
  verificarVehiculoEstacionado, 
  fetchVehiculosDePensionado,
  marcarEntradaVehiculo,
  marcarSalidaVehiculo
} from "../api/MarcajesUsuario";
import { getAxiosErrorMessage } from "../../../utils/getAxiosMessage";

/**
 * Hook personalizado para manejar el estacionamiento de vehículos de pensionados
 */
export const useEstacionamientoPensionado = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tieneVehiculoEstacionado, setTieneVehiculoEstacionado] = useState(false);
  const [vehiculoEstacionado, setVehiculoEstacionado] = useState(null);
  const [vehiculosDisponibles, setVehiculosDisponibles] = useState([]);
  const [datosEntrada, setDatosEntrada] = useState(null); // Almacena toda la info de entrada
  const [verificacionInicial, setVerificacionInicial] = useState(false); // Indica si ya se hizo la primera verificación

  /**
   * Verificar si el usuario tiene un vehículo estacionado
   */
  const verificarEstacionamiento = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await verificarVehiculoEstacionado();

      if (response.data?.success) {
        const data = response.data.data;
        setTieneVehiculoEstacionado(data.tieneVehiculoEstacionado);

        if (data.tieneVehiculoEstacionado) {
          setVehiculoEstacionado(data.vehiculo);
          // Guardar los datos completos de la entrada si vienen en el response
          setDatosEntrada( { 
            fechaEntrada: data.fechaEntrada,
            horaEntrada: data.horaEntrada,
            folio: data.folio
           } 
            || null);
        } else {
          // Si no tiene vehículo estacionado, cargar vehículos disponibles
          await cargarVehiculosDisponibles();
        }
        
        setVerificacionInicial(true);
        return { success: true };
      } else {
        setError("No se pudo verificar el estacionamiento");
        setVerificacionInicial(true);
        return { success: false, error: "No se pudo verificar el estacionamiento" };
      }
    } catch (err) {
      const errorMessage = getAxiosErrorMessage(err);
      setError(errorMessage);
      setVerificacionInicial(true);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cargar vehículos disponibles del usuario pensionado
   */
  const cargarVehiculosDisponibles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchVehiculosDePensionado();

      if (response.data?.success) {
        setVehiculosDisponibles(response.data.data || []);
        return { success: true };
      } else {
        setError("No se pudieron cargar los vehículos");
        return { success: false, error: "No se pudieron cargar los vehículos" };
      }
    } catch (err) {
      const errorMessage = getAxiosErrorMessage(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Marcar entrada de vehículo
   */
  const marcarEntrada = useCallback(async (vehiculoId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await marcarEntradaVehiculo(vehiculoId);
      
      if (response.data?.success) {
        return { 
          success: true,
          message: response.data.message || "Entrada marcada exitosamente" 
        };
      } else {
        const errorMsg = response.data?.message || "No se pudo marcar la entrada";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMessage = getAxiosErrorMessage(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Marcar salida de vehículo
   */
  const marcarSalida = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await marcarSalidaVehiculo();
      
      if (response.data?.success) {
        return { 
          success: true,
          message: response.data.message || "Salida marcada exitosamente" 
        };
      } else {
        const errorMsg = response.data?.message || "No se pudo marcar la salida";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMessage = getAxiosErrorMessage(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // Estado
    loading,
    error,
    tieneVehiculoEstacionado,
    vehiculoEstacionado,
    vehiculosDisponibles,
    datosEntrada,
    verificacionInicial,
    
    // Funciones
    verificarEstacionamiento,
    cargarVehiculosDisponibles,
    marcarEntrada,
    marcarSalida,
  };
};
