import * as yup from "yup";

const tarifaYup = yup.object({
  id: yup.number(),
  tiempo: yup.number(),
  id_vehiculo: yup.number(),
  costo: yup.number(),
  estatus: yup.boolean(),
});

export default tarifaYup;
