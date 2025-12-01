import * as yup from 'yup';

export const loginYup = yup.object().shape({
    correo: yup
        .string()
        .required("El correo no puede ser nulo.")
        .min(3, "El correo debe tener entre 3 y 50 caracteres.")
        .max(50, "El correo debe tener entre 3 y 50 caracteres."),

    contra: yup
        .string()
        .required("La contraseña no puede ser nula.")
        .min(4, "La contraseña debe tener entre 4 y 20 caracteres.")
        .max(20, "La contraseña debe tener entre 4 y 20 caracteres."),
});