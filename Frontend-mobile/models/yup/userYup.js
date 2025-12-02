import * as yup from "yup";

const userYup = yup.object({
  id: yup.number().required("El id del usuario es obligatorio"),
  nombre: yup.string(),
  apellidos: yup.string(),
  correo: yup
    .string()
    .required("El correo no puede ser nulo.")
    .min(3, "El correo debe tener entre 3 y 50 caracteres.")
    .max(50, "El correo debe tener entre 3 y 50 caracteres."),
  telefono: yup.string(),
});

export default userYup;
