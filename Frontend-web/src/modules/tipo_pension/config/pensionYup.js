import * as yup from "yup";

const pensionYup = yup.object({
  id: yup.number(),
  nombre: yup.string()
    .required("El nombre es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no debe exceder los 50 caracteres"),
  duracionDias: yup.number()
    .required("La duración es requerida")
    .min(7, "La duración mínima es de 7 días")
    .max(365, "La duración máxima es de 365 días"),
  costo: yup.number()
    .required("El costo es requerido")
    .min(1, "El costo debe ser mayor a 0"),
  estatus: yup.boolean()
    .default(true),
});

export default pensionYup;
