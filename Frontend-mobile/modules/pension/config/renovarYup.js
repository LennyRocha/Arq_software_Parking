import * as yup from "yup";

export const renovarPensionSchema = yup.object().shape({
  tipoPensionId: yup
    .number()
    .required("Debe seleccionar un tipo de pensión")
    .positive("Debe seleccionar un tipo de pensión válido")
    .integer("Debe seleccionar un tipo de pensión válido"),
});

export const renovarPensionInitialValues = {
  tipoPensionId: "",
};
