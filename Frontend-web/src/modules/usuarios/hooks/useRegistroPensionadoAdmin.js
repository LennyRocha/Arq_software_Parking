import { useState, useEffect } from 'react';
import {
  fetchTiposPensionPaginados,
  registrarPensionado,
} from '../../registro_pension/api/registroPensionApi';
import { getAxiosErrorMessage } from '../../../utils/getAxiosMessage';

export default function useRegistroPensionadoAdmin() {
  // Estado para el stepper (0: Pensión, 1: Personal, 2: Vehículos, 3: Confirmación)
  const [activeStep, setActiveStep] = useState(0); // Empezamos en paso 0 (Pensión)

  // Estado para tipos de pensión
  const [tiposPension, setTiposPension] = useState([]);
  const [loadingTiposPension, setLoadingTiposPension] = useState(false);
  const [errorTiposPension, setErrorTiposPension] = useState(null);
  const [paginationInfo, setPaginationInfo] = useState({
    page: 0,
    size: 9,
    totalPages: 0,
    totalElements: 0,
    hasMore: true,
  });

  // Estado del formulario
  const [formData, setFormData] = useState({
    // Paso 0: Tipo de pensión (se selecciona al final)
    pensionId: null,
    tipoPension: null,
    
    // Paso 1: Información personal
    nombre: "",
    apellidos: "",
    correo: "",
    telefono: "",
    contra: "",
    
    // Paso 2: Vehículos
    vehiculos: [],
  });

  // Estado para el proceso de registro
  const [loadingRegistro, setLoadingRegistro] = useState(false);
  const [errorRegistro, setErrorRegistro] = useState(null);
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [datosRegistro, setDatosRegistro] = useState(null);

  const cargarTiposPension = async (append = false) => {
    setLoadingTiposPension(true);
    setErrorTiposPension(null);
    try {
      const response = await fetchTiposPensionPaginados({
        page: append ? paginationInfo.page + 1 : 0,
        size: paginationInfo.size,
        sort: "duracionDias,asc",
      });

      const data = response.data.data;
      const newTipos = data.content || [];
      
      setTiposPension(append ? [...tiposPension, ...newTipos] : newTipos);
      setPaginationInfo({
        page: data.number,
        size: data.size,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
        hasMore: !data.last,
      });
    } catch (error) {
      setErrorTiposPension(getAxiosErrorMessage(error));
    } finally {
      setLoadingTiposPension(false);
    }
  };

  const cargarMasTiposPension = () => {
    if (paginationInfo.hasMore && !loadingTiposPension) {
      cargarTiposPension(true);
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
    setActiveStep(0); // Reset al paso 0 (Pensión)
    setFormData({
      pensionId: null,
      tipoPension: null,
      nombre: "",
      apellidos: "",
      correo: "",
      telefono: "",
      contra: "",
      vehiculos: [],
    });
    setRegistroExitoso(false);
    setErrorRegistro(null);
    setDatosRegistro(null);
  };

  // Actualizar datos del formulario (múltiples campos)
  const updateFormData = (updates) => {
    setFormData((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  // Seleccionar tipo de pensión
  const seleccionarTipoPension = (pension) => {
    setFormData((prev) => ({
      ...prev,
      pensionId: pension.id,
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

  // Enviar formulario completo
  const handleSubmit = async () => {
    setLoadingRegistro(true);
    setErrorRegistro(null);
    
    try {
      // Preparar datos según el DTO del backend
      const payload = {
        pensionId: formData.pensionId,
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        correo: formData.correo,
        telefono: formData.telefono,
        contra: formData.contra,
        vehiculos: formData.vehiculos.map(v => ({
          tipoVehiculoId: v.tipoVehiculoId,
          placa: v.placa.toUpperCase(),
          modelo: v.modelo,
          descripcion: v.descripcion,
        })),
      };

      const response = await registrarPensionado(payload);
      
      setRegistroExitoso(true);
      setDatosRegistro(response.data.data);
      
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      const errorMsg = getAxiosErrorMessage(error);
      setErrorRegistro(errorMsg);
      
      return {
        success: false,
        error: errorMsg,
      };
    } finally {
      setLoadingRegistro(false);
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
    cargarMasTiposPension,
    paginationInfo,

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
    loadingRegistro,
    errorRegistro,
    registroExitoso,
    datosRegistro,
  };
}
