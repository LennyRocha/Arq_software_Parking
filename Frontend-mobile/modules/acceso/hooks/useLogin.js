import { View, Text } from 'react-native'
import React from 'react'
import { Session } from './TokenManagement';
import api from '../../../utils/api';
import { useSnackBar } from '../../../context/SnackBarContext'

export default function useLogin() {
    const { showSnack } = useSnackBar();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [errorData, setErrorData] = React.useState(null);

    function createJSON() {
        const payload = {
            correo: email.trim(),
            contra: password.trim(),
        }
        return JSON.stringify(payload);
    }

    const submit = async () => {
        let errorObject = {}
        setLoading(true);
        setErrorData(null);
        try {
            const response = await api.post("/api/auth/public/login", createJSON());

            const apiResponse = response.data;

            if (!apiResponse.success) {
                showSnack(apiResponse.message || "¡Nombre o contraseña incorrectos!", "Aceptar");
                setLoading(false);
                return;
            }

            const { token, expiration, user } = apiResponse.data;

            if (user.role === "CLIENTE_PENSIONADO") {
                showSnack("Buen intento bastardo, pero esta aplicación es de uso único para clientes pensionados", "Aceptar");
                setLoading(false);
                return;
            }

            Session.saveSession({
                token: token,
                expiration: expiration,
                user: user
            })

        } catch (err) {
            errorObject = {
                tipo: err.response ? "Error de la API" : "Error de Axios",
                texto: getAxiosErrorMessage(err),
                detalles: err
            }
            if (err.response) showSnack(err.response.message, "Aceptar")
            setErrorData(errorObject);
        } finally {
            setLoading(false);
        }
    };

    const defaultValues = React.useMemo(() => ({
        correo: "",
        contra: ""
    }), []);

    return { email, setEmail, password, setPassword, loading, errorData, defaultValues }
}