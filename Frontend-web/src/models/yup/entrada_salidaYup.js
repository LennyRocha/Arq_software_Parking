import * as yup from "yup";

const entrada_salidaYup = yup.object({
  id: yup.number(),
  id_usuario: yup.number(),
  id_vehiculo: yup.number(),
  folio_ticket: yup.number,
  id_tipo_vehiculo: yup.number(),
  hora_entrada: yup.date(),
  hora_salida: yup.date(),
  cantidad_pago: yup.number(),
  fecha: yup.date(),
});

export default entrada_salidaYup;
