import * as yup from "yup";

const conteoYup = yup.object({
  conteo: yup.number().required("Se requiere una cantidad de cajones").typeError("Debe ser un número").min(1, "Debes  establecer al menos 1 cajón"),
});

export default conteoYup;