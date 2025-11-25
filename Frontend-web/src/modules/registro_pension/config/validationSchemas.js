import * as Yup from "yup";

// Schema para Step 2: Información Personal
export const informacionPersonalSchema = Yup.object().shape({
  nombre: Yup.string()
    .required("El nombre es requerido")
    .max(50, "El nombre no debe exceder 50 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo puede contener letras"),
  
  apellidos: Yup.string()
    .required("Los apellidos son requeridos")
    .max(50, "Los apellidos no deben exceder 50 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Los apellidos solo pueden contener letras"),
  
  correo: Yup.string()
    .required("El correo es requerido")
    .email("El formato del correo no es válido")
    .max(50, "El correo no debe exceder 50 caracteres"),
  
  telefono: Yup.string()
    .required("El teléfono es requerido")
    .matches(/^\d{10}$/, "El teléfono debe tener exactamente 10 dígitos")
    .length(10, "El teléfono debe tener exactamente 10 dígitos"),
  
  contra: Yup.string()
    .required("La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  
  confirmarContra: Yup.string()
    .required("Debes confirmar la contraseña")
    .oneOf([Yup.ref("contra")], "Las contraseñas no coinciden"),
});

// Schema para Step 3: Vehículo individual
export const vehiculoSchema = Yup.object().shape({
  tipoVehiculoId: Yup.number()
    .required("El tipo de vehículo es requerido")
    .positive("Debe seleccionar un tipo de vehículo"),
  
  placa: Yup.string()
    .required("La placa es requerida")
    .max(7, "La placa no debe tener más de 7 caracteres")
    .matches(/^[A-Za-z0-9-]+$/, "La placa solo puede contener letras, números y guiones"),
  
  modelo: Yup.string()
    .required("El modelo es requerido")
    .max(50, "El modelo no debe exceder 50 caracteres"),
  
  descripcion: Yup.string()
    .required("La descripción es requerida")
    .max(50, "La descripción no debe exceder 50 caracteres"),
});

// Valores iniciales para Step 2
export const initialValuesInformacionPersonal = {
  nombre: "",
  apellidos: "",
  correo: "",
  telefono: "",
  contra: "",
  confirmarContra: "",
};

// Valores iniciales para un vehículo
export const initialValuesVehiculo = {
  tipoVehiculoId: "",
  placa: "",
  modelo: "",
  descripcion: "",
};
