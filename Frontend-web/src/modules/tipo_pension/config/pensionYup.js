import * as yup from "yup";

const pensionYup = yup.object({
  id: yup.number(),
  nombre: yup.string()
    .required("El nombre es requerido")
    .min(3, "¡Nombre inválido!. El nombre de la pensión debe tener entre 3 y 50 caracteres")
    .max(50, "¡Nombre inválido!. El nombre de la pensión debe tener entre 3 y 50 caracteres"),
  duracionDias: yup.number()
    .required("La duración es requerida")
    .min(7, "¡Duración inválida!. La duración mínima es de 7 días.")
    .max(365, "¡Duración inválida!. La duración máxima es de 365 días."),
  costo: yup.number()
    .required("El costo es requerido")
    .min(1, "¡Costo inválido!. El monto debe ser mayor a 0"),
  estatus: yup.boolean()
    .default(true),
});

export default pensionYup;
