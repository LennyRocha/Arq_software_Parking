import * as yup from "yup";

const pensionYup = yup.object({
  id: yup.number(),
  duracion: yup.number(),
  costo: yup.number(),
  nombre: yup.string(),
  estatus: yup.boolean(),
});

export default pensionYup;
