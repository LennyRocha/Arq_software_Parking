import React from "react";
import { getAxiosErrorMessage } from "../../../utils/getAxiosMessage";
import vehiculoInterface from "./vehiculoInterface";
import api from "../../../utils/api";
import { useCustomAlert } from "../../../utils/useCustomAlert";

export default function useDeleteVehiculos(navigation, vehiculo) {
    const [isLoading, setLoading] = React.useState(false);
    const [errorData, setErrorData] = React.useState(null);

    const { visible, config, showAlert, hideAlert } = useCustomAlert();

    const preSubmit = async () => {
        showAlert({
            icon: "question",
            title: "¡Confirmación!",
            message: `Estas por cambiar el estado de ${vehiculo.modelo}. ¿Deseas continuar?`,
            confirmText: "Actualizar",
            cancelText: "Cancelar",
            onConfirm: async () => onSubmit(),
            externalDismiss: false,
        })
    }

    const onSubmit = async () => {
        if (isLoading) return;

        let errorObject = {}

        setLoading(true);
        setErrorData(null);
        try {
            const res = await api.delete(`${vehiculoInterface.byId(vehiculo.id)}`);
            showAlert({
                icon: "success",
                title: "¡Éxito!",
                message: res.data.message,
                showCancelButton: false,
                confirmText: "Aceptar",
                onConfirm: () => navigation.goBack(),
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
                title: "¡Error al actualizar el estado del vehículo!",
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

    return { isLoading, errorData, preSubmit, visible, hideAlert, config };
}