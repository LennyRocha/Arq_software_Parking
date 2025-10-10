import * as yup from "yup";
import roleYup from "./roleYup";

const userYup = yup.object({
  id: yup.number(),
  nombre: yup.string(),
  apellido_p: yup.string(),
  apellido_m: yup.string(),
  correo: yup.string().email("Correo inválido"),
  telefono: yup.string(),
  contra: yup.string(),
  rol: roleYup.required(),
  estatus: yup.boolean(),
  pensionado: yup.boolean(),
});

export default userYup;
