import { useState, useEffect } from 'react';
import {
  fetchTiposPensionPaginados,
  registrarPensionado,
  crearPreferenciaPago,
} from '../api/registroPensionApi';
import { getAxiosErrorMessage } from '../../../utils/getAxiosMessage';
export default function useRegistroPension(tipoPensionInicial = null) {
  // Estado para el stepper (0: Pensión, 1: Personal, 2: Vehículos, 3: Pago, 4: Confirmación)
  const [activeStep, setActiveStep] = useState(tipoPensionInicial ? 1 : 0);

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
    // Paso 1: Tipo de pensión
    pensionId: tipoPensionInicial?.id || null,
    tipoPension: tipoPensionInicial || null,
    
    // Paso 2: Información personal
    nombre: "",
    apellidos: "",
    correo: "",
    telefono: "",
    contra: "",
    
    // Paso 3: Vehículos
    vehiculos: [],
  });

  // Estado para el proceso de registro
  const [loadingRegistro, setLoadingRegistro] = useState(false);
  const [errorRegistro, setErrorRegistro] = useState(null);
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [datosRegistro, setDatosRegistro] = useState(null);

  // Cargar tipos de pensión al montar
  useEffect(() => {
    if (!tipoPensionInicial) {
      cargarTiposPension();
    }
  }, [tipoPensionInicial]);

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
    setActiveStep(tipoPensionInicial ? 1 : 0);
    setFormData({
      pensionId: tipoPensionInicial?.id || null,
      tipoPension: tipoPensionInicial || null,
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

  // Iniciar proceso de pago con Mercado Pago
  const iniciarPago = async () => {
    try {
      const response = await crearPreferenciaPago(formData);
      const preferenceData = response.data.data;
      
      console.log('=== DATOS COMPLETOS DE LA RESPUESTA ===');
      console.log('Response completo:', response);
      console.log('Preference Data:', preferenceData);
      console.log('Keys disponibles:', Object.keys(preferenceData));
      
      // Probar todas las variantes posibles de nombres de propiedades
      const paymentUrl = 
        preferenceData.sandboxInitPoint || 
        preferenceData.sandbox_init_point ||
        preferenceData.initPoint || 
        preferenceData.init_point;
      
      console.log('sandboxInitPoint:', preferenceData.sandboxInitPoint);
      console.log('sandbox_init_point:', preferenceData.sandbox_init_point);
      console.log('initPoint:', preferenceData.initPoint);
      console.log('init_point:', preferenceData.init_point);
      console.log('URL de pago seleccionada:', paymentUrl);
      
      if (!paymentUrl) {
        console.error(' NO SE ENCONTRÓ URL DE PAGO en ninguna propiedad');
        return {
          success: false,
          error: 'No se recibió URL de pago de Mercado Pago. Verifica la respuesta en consola.',
        };
      }
      
      // Retornar la URL de pago para redireccionar
      return {
        success: true,
        preferenceId: preferenceData.id,
        initPoint: paymentUrl,
      };
    } catch (error) {
      console.error(' Error en iniciarPago:', error);
      return {
        success: false,
        error: getAxiosErrorMessage(error),
      };
    }
  };

  // Función removida - ya no se necesitan datos de MP

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

    // Proceso de pago
    iniciarPago,

    // Envío del formulario
    handleSubmit,
    loadingRegistro,
    errorRegistro,
    registroExitoso,
    datosRegistro,
  };
}
