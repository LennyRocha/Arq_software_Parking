import * as yup from "yup";

// Validación para editar entrada/salida de visitante
// Solo se validan los campos editables del vehículo
// Si se llena algún campo (modelo, placa o descripción), los otros dos son obligatorios
export const entradaSalidaEditarSchema = yup.object().shape({
  modelo: yup
    .string()
    .max(50, "El modelo no puede exceder los 50 caracteres")
    .when(['placa', 'descripcion'], {
      is: (placa, descripcion) => (placa && placa.trim()) || (descripcion && descripcion.trim()),
      then: (schema) => schema
        .required("El modelo es obligatorio si se llena placa o descripción")
        .min(1, "El modelo no puede estar vacío"),
      otherwise: (schema) => schema,
    }),
  
  placa: yup
    .string()
    .max(20, "La placa no puede exceder los 20 caracteres")
    .when(['modelo', 'descripcion'], {
      is: (modelo, descripcion) => (modelo && modelo.trim()) || (descripcion && descripcion.trim()),
      then: (schema) => schema
        .required("La placa es obligatoria si se llena modelo o descripción")
        .matches(/^[A-Z0-9-]+$/, "La placa solo puede contener letras mayúsculas, números y guiones")
        .min(1, "La placa no puede estar vacía"),
      otherwise: (schema) => schema.matches(/^$|^[A-Z0-9-]+$/, "La placa solo puede contener letras mayúsculas, números y guiones"),
    }),
  
  descripcion: yup
    .string()
    .max(500, "La descripción no puede exceder los 500 caracteres")
    .when(['modelo', 'placa'], {
      is: (modelo, placa) => (modelo && modelo.trim()) || (placa && placa.trim()),
      then: (schema) => schema
        .required("La descripción es obligatoria si se llena modelo o placa")
        .min(1, "La descripción no puede estar vacía"),
      otherwise: (schema) => schema,
    }),
}, [
  ['modelo', 'placa'],
  ['modelo', 'descripcion'],
  ['placa', 'descripcion']
]);

