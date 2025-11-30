import * as yup from "yup";

const cajonYup = yup.object({
  id: yup.number().nullable(),

  name: yup
    .string()
    .required("El campo identificador no puede estar vacío")
    .max(5, "El identificador del cajón solo alcanzará 5 caracteres")
    .matches(/^[A-Za-z0-9]+$/, "Solo letras y números. Ejemplo: 'A1'"),

  tipoVehiculo: yup
    .object({
      id: yup.number().required(),
      name: yup.string(),
    })
    .required("Se debe especificar el tipo de vehículo"),

  ubicacion: yup
    .string()
    .required("El campo ubicación no puede estar vacío")
    .max(100, "La ubicación es demasiado larga"),

  disponible: yup
    .boolean()
    .required("Se debe especificar la disponibilidad actual del cajón"),

  paraPensionados: yup
    .boolean()
    .required("Se debe especificar si el cajón es para pensionados"),

  piso: yup
    .number()
    .required("El campo piso no puede estar vacío"),

  estatus: yup.boolean().required(),
});

export default cajonYup;