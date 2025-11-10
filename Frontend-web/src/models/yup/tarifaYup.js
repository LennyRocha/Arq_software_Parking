import * as yup from "yup";

const tarifaYup = yup.object({
  id: yup.number(),
  tiempo: yup.number()
        .typeError('El tiempo debe ser un número válido')
        .min(15, 'El tiempo debe tener al menos 15 minutos')
        .max(1440, 'El tiempo no puede exceder los 1440 minutos')
        .required('El tiempo es obligatorio'),
  tipoVehiculo: yup.object().shape({
    id: yup.number()
        .typeError('El tipo de vehículo es obligatorio')
        .required('El tipo de vehículo es obligatorio')
  }).required('El tipo de vehículo es obligatorio'),
  costo: yup.number()
        .typeError('El costo debe ser un número válido')
        .min(1.0, 'El costo debe ser al menos 1.00')
        .required('El costo es obligatorio'),
  estatus: yup.boolean(),
});

export default tarifaYup;
