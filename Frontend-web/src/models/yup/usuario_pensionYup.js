import * as yup from "yup";

const usuario_pensionYup = yup.object({
  id: yup.number(),
  id_usuario: yup.number(),
  id_pension: yup.number(),
  fecha_finalizacion: yup.date(),
  uuid_codigo_qr: yup.string(),
  id_ultima_entrada: yup.number(),
  estatus: yup.boolean(),
});

export default usuario_pensionYup;
