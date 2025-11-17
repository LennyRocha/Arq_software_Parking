import * as yup from "yup";

// Validación para editar entrada/salida de visitante
// Solo se validan los campos editables del vehículo
export const entradaSalidaEditarSchema = yup.object().shape({
  modelo: yup
    .string()
    .max(50, "El modelo no puede exceder los 50 caracteres"),
  
  placa: yup
    .string()
    .max(20, "La placa no puede exceder los 20 caracteres"),
  
  descripcion: yup
    .string()
    .max(500, "La descripción no puede exceder los 500 caracteres"),
});

