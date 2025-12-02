import React from "react";
import { getAxiosErrorMessage } from "../../../utils/getAxiosMessage";
import User from "../../../models/User";
import userYup from "../../../models/yup/userYup";
import api from "../../../utils/api";
import { useCustomAlert } from "../../../utils/useCustomAlert";
import { Session } from "../../acceso/hooks/TokenManagement";
import { useGlobalContext } from "../../../context/GlobalContext";

export default function usePutUsuario(navigation, usuario, campo) {
    const [isLoading, setLoading] = React.useState(false);
    const [errorData, setErrorData] = React.useState(null);
    const { setAvatar, setCorreo } = useGlobalContext();

    const { visible, config, showAlert, hideAlert } = useCustomAlert();

    function getInitials(nombre, apellidos) {
        const inicialNombre = nombre?.charAt(0)?.toUpperCase() ?? "";
        const inicialApellido = apellidos?.charAt(0)?.toUpperCase() ?? "";

        return inicialNombre + inicialApellido;
    }

    const preSubmit = async (data) => {
        showAlert({
            icon: "question",
            title: "¡Confirmación!",
            message: `Estas por modificar el campo ${campo}. ¿Deseas continuar?`,
            confirmText: "Actualizar",
            cancelText: "Cancelar",
            onConfirm: async () => onSubmit(data),
            onCancel: async () => { },
            showCancelButton: true,
            externalDismiss: true,
        })
    }

    const onSubmit = async (data) => {
        if (isLoading) return;

        let errorObject = {}

        setLoading(true);
        setErrorData(null);

        const user = new User({
            id: data.id,
            nombre: data.nombre,
            apellidos: data.apellidos,
            correo: data.correo,
            telefono: data.telefono,
        });

        try {
            const res = await api.post(`/auth/actualizarDatosUsuario`, user.toJson());

            const fetchUser = await api.get(`/auth/consultarDatos/${data.id}`);

            const { apellidos, correo, telefono, esPensionado, nombre, rol, status } = fetchUser.data.data;

            const userJson = {
                apellidos: apellidos, correo: correo, telefono: telefono, esPensionado: esPensionado, nombre: nombre, rol: rol, status: status
            };

            await Session.setUser(userJson);

            setCorreo(correo);

            setAvatar(getInitials(nombre, apellidos));

            showAlert({
                icon: "success",
                title: "¡Éxito!",
                message: res.data.message,
                showCancelButton: false,
                confirmText: "Aceptar",
                onConfirm: () => {
                    navigation.goBack();
                    navigation.goBack();
                },
                externalDismiss: false,
            })
        } catch (err) {
            errorObject = {
                tipo: err.response ? "Error de la API" : "Error de Axios",
                texto: getAxiosErrorMessage(err),
                detalles: err
            }
            setErrorData(errorObject)
            showAlert({
                icon: "error",
                title: "¡Error al actualizar el usuario!",
                message: getAxiosErrorMessage(err),
                showCancelButton: false,
                confirmText: "Aceptar",
                onConfirm: () => { },
                externalDismiss: false,
            })
        } finally {
            setLoading(false);
        }
    }

    const defaultValues = React.useMemo(() => ({
        id: 0,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        telefono: usuario.telefono,
    }), [usuario]);

    return { isLoading, errorData, preSubmit, defaultValues, userYup, visible, hideAlert, config };
}