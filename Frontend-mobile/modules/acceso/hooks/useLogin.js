import React from 'react'
import { Session } from './TokenManagement';
import { useSnackBar } from '../../../context/SnackBarContext'
import { loginYup } from '../../../models/yup/loginYup';
import { getAxiosErrorMessage } from '../../../utils/getAxiosMessage';
import { useGlobalContext } from '../../../context/GlobalContext';
import { API_URL } from '@env';
import axios from 'axios';

export default function useLogin() {
    const { showSnack } = useSnackBar();
    const { setAvatar, setCorreo, setPension } = useGlobalContext();
    const [loading, setLoading] = React.useState(false);
    const [errorData, setErrorData] = React.useState(null);

    function getInitials(nombre, apellidos) {
        const inicialNombre = nombre?.charAt(0)?.toUpperCase() ?? "";
        const inicialApellido = apellidos?.charAt(0)?.toUpperCase() ?? "";

        return inicialNombre + inicialApellido;
    }

    function createJSON(email, pass) {
        const payload = {
            correo: email.trim().toLowerCase(),
            contra: pass.trim(),
        }
        return payload;
    }

    const submit = async (data) => {
        let errorObject = {}
        setLoading(true);
        setErrorData(null);
        try {
            const response = await axios.post(`${API_URL}/auth/public/login`, createJSON(data.correo, data.contra));

            const apiResponse = response.data;

            if (!apiResponse.success) {
                showSnack(apiResponse.message || "¡Nombre o contraseña incorrectos!", "Aceptar");
                setLoading(false);
                return false;
            }

            const { token, expiration, user } = apiResponse.data;

            if (user.role !== "CLIENTE_PENSIONADO") {
                showSnack("Esta aplicación es de uso exclusivo para clientes pensionados", "Aceptar");
                setLoading(false);
                return false;
            }

            const response_two = await axios.get(`${API_URL}/auth/consultarDatos/${user.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const userResponse = response_two.data;

            if (!userResponse.success) {
                showSnack(apiResponse.message || "¡Error al recuperar tus datos!", "Aceptar");
                setLoading(false);
                return false;
            }

            const { apellidos, correo, telefono, esPensionado, nombre, rol, status } = userResponse.data;

            const response_three = await axios.get(`${API_URL}/pensionado/cliente/mi-pension`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const pensionResponse = response_three.data;

            if (!pensionResponse.success) {
                showSnack(apiResponse.message || "¡Error al recuperar datos de tu pensión!", "Aceptar");
                setLoading(false);
                return false;
            }

            const { id: pensionId, nombrePension, fechaFinalizacion, costoUltimoPago, estatus, uuidCodigoQR, fechaInicioProximaRenovacion, fechaFinProximaRenovacion } = pensionResponse.data;

            const userJson = {
                apellidos: apellidos, correo: correo, telefono: telefono, esPensionado: esPensionado, nombre: nombre, rol: rol, status: status
            };

            const pensionJson = {
                id: pensionId, nombrePension,
                fechaFinalizacion: fechaFinalizacion,
                costoUltimoPago: costoUltimoPago,
                estatus: estatus,
                uuidCodigoQR: uuidCodigoQR,
                fechaInicioProximaRenovacion: fechaInicioProximaRenovacion,
                fechaFinProximaRenovacion: fechaFinProximaRenovacion
            }

            setCorreo(correo);

            setAvatar(getInitials(nombre, apellidos));

            setPension(pensionJson)

            await Session.saveSession({
                token: token,
                expiration: expiration,
                user: userJson,
            })

            return true;

        } catch (err) {
            errorObject = {
                tipo: err.response ? "Error de la API" : "Error de Axios",
                texto: getAxiosErrorMessage(err),
                detalles: err
            }
            if (err.response) {
                showSnack(err.response.message || err.response.data.message, "Aceptar")
            }
            setErrorData(errorObject);
        } finally {
            setLoading(false);
        }
    };

    const defaultValues = React.useMemo(() => ({
        correo: "",
        contra: ""
    }), []);

    return { loading, errorData, defaultValues, setErrorData, submit, loginYup }
}