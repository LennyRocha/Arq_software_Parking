import * as yup from "yup";

const entradaVisitanteYup = yup.object({
  tipoVehiculo: yup.object({
    id: yup.number()
      .required("El tipo de vehículo es obligatorio")
      .positive("El tipo de vehículo debe ser un número válido")
  }).required("El tipo de vehículo es obligatorio"),
  
  vehiculo: yup.object().when('$agregarDatosAdicionales', {
    is: true,
    then: (schema) => schema.shape({
      placa: yup.string()
        .required("La placa es obligatoria")
        .min(3, "La placa debe tener al menos 3 caracteres")
        .max(20, "La placa no debe exceder 20 caracteres"),
      modelo: yup.string()
        .required("El modelo es obligatorio")
        .min(2, "El modelo debe tener al menos 2 caracteres")
        .max(50, "El modelo no debe exceder 50 caracteres"),
      descripcion: yup.string()
        .required("La descripción es obligatoria")
        .min(3, "La descripción debe tener al menos 3 caracteres")
        .max(200, "La descripción no debe exceder 200 caracteres")
    }),
    otherwise: (schema) => schema.optional().nullable()
  })
});

export default entradaVisitanteYup;
