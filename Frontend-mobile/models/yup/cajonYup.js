import * as yup from "yup";

const pensionYup = yup.object({
  id: yup.number(),
  identificador: yup.string(),
  ubicacion: yup.string(),
  ocupado: yup.boolean(),
  para_pensionado: yup.boolean(),
  piso: yup.number(),
  estatus: yup.boolean(),
});

export default pensionYup;
