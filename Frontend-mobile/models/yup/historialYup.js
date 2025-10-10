import * as yup from "yup";

const historialYup = yup.object({
  id: yup.number(),
  id_usuario_pension: yup.number(),
  cantidad: yup.number(),
  fecha_fin: yup.date(),
  fecha_pago: yup.date(),
  fecha_inicio: yup.date(),
});

export default historialYup;
