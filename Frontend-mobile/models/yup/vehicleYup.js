import * as yup from "yup";

const vehicleYup = yup.object({
  id: yup.number().nullable(),
  id_user: yup.number().required("El usuario es obligatorio"),
  id_type: yup.number().required("El tipo de vehículo es obligatorio"),
  modelo: yup.string().max(50, "El modelo del vehículo no debe tener más de 50 caracteres").required("El campo modelo no puede estar vacío"),
  placa: yup
    .string()
    .max(7, "La placa no debe tener más de 7 caracteres")
    .matches(/^$|^[A-Za-z0-9-]+$/, "La placa solo puede contener letras, números y guiones")
    .nullable()
    .trim(),
  desc: yup.string().max(250, "La descripción no debe tener más de 250 caracteres").required("El campo descripción no puede estar vacío"),
  status: yup.boolean()
});

export default vehicleYup;
