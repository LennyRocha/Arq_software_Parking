import * as Yup from 'yup';

export const usuarioSchema = Yup.object({
  nombre: Yup.string()
    .trim()
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre debe contener solo letras")
    .max(50, "El nombre debe tener máximo 50 caracteres")
    .required("El nombre no puede estar vacío"),
  apellidos: Yup.string()
    .trim()
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El apellido debe contener solo letras")
    .max(50, "El apellido debe tener máximo 50 caracteres")
    .required("El apellido no puede estar vacío"),
});

export const initialValuesUsuario = {
  nombre: '',
  apellidos: ''
};
