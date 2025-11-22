import { useState, useEffect } from 'react';
import { fetchTiposPensionActivos } from '../api/registroPensionApi';
import { getAxiosErrorMessage } from '../../../utils/getAxiosMessage';

export default function useRegistroPension(tipoPensionInicial = null) {
  // Estado para el stepper
  const [activeStep, setActiveStep] = useState(tipoPensionInicial ? 1 : 0);

  // Estado para tipos de pensión
  const [tiposPension, setTiposPension] = useState([]);
  const [loadingTiposPension, setLoadingTiposPension] = useState(false);
  const [errorTiposPension, setErrorTiposPension] = useState(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    // Paso 1: Tipo de pensión
    tipoPensionId: tipoPensionInicial?.id || null,
    tipoPension: tipoPensionInicial || null,
    
    // Paso 2: Información personal
    nombre: "",
    email: "",
    telefono: "",
    
    // Paso 3: Vehículos (array para soportar múltiples)
    vehiculos: [],
  });

  // Cargar tipos de pensión al montar el componente
  useEffect(() => {
    if (!tipoPensionInicial) {
      cargarTiposPension();
    }
  }, [tipoPensionInicial]);

  const cargarTiposPension = async () => {
    setLoadingTiposPension(true);
    setErrorTiposPension(null);
    try {
      const response = await fetchTiposPensionActivos();
      setTiposPension(response.data.data || []);
    } catch (error) {
      setErrorTiposPension(getAxiosErrorMessage(error));
    } finally {
      setLoadingTiposPension(false);
    }
  };

  // Navegación del stepper
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleReset = () => {
    setActiveStep(tipoPensionInicial ? 1 : 0);
    setFormData({
      tipoPensionId: tipoPensionInicial?.id || null,
      tipoPension: tipoPensionInicial || null,
      nombre: "",
      email: "",
      telefono: "",
      vehiculos: [],
    });
  };

  // Actualizar datos del formulario
  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Seleccionar tipo de pensión
  const seleccionarTipoPension = (pension) => {
    setFormData((prev) => ({
      ...prev,
      tipoPensionId: pension.id,
      tipoPension: pension,
    }));
  };

  // Agregar vehículo
  const agregarVehiculo = (vehiculo) => {
    setFormData((prev) => ({
      ...prev,
      vehiculos: [...prev.vehiculos, vehiculo],
    }));
  };

  // Remover vehículo
  const removerVehiculo = (index) => {
    setFormData((prev) => ({
      ...prev,
      vehiculos: prev.vehiculos.filter((_, i) => i !== index),
    }));
  };

  // Editar vehículo
  const editarVehiculo = (index, vehiculo) => {
    setFormData((prev) => ({
      ...prev,
      vehiculos: prev.vehiculos.map((v, i) => (i === index ? vehiculo : v)),
    }));
  };

  // Enviar formulario (implementar después)
  const handleSubmit = async () => {
    try {
      console.log("Datos a enviar:", formData);
      // Aquí irá la lógica para enviar el formulario
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: getAxiosErrorMessage(error),
      };
    }
  };

  return {
    // Estado del stepper
    activeStep,
    setActiveStep,
    handleNext,
    handleBack,
    handleReset,

    // Tipos de pensión
    tiposPension,
    loadingTiposPension,
    errorTiposPension,
    cargarTiposPension,

    // Datos del formulario
    formData,
    updateFormData,
    seleccionarTipoPension,

    // Manejo de vehículos
    agregarVehiculo,
    removerVehiculo,
    editarVehiculo,

    // Envío del formulario
    handleSubmit,
  };
}
