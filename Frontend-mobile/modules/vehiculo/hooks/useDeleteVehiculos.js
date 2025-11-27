import React from "react";
import { getAxiosErrorMessage } from "../../../utils/getAxiosMessage";
import vehiculoInterface from "./vehiculoInterface";
import api from "../../../utils/api";
import { useCustomAlert } from "../../../utils/useCustomAlert";

export default function useDeleteVehiculos(navigation, vehiculo) {
    const [isLoading, setLoading] = React.useState(false);
    const [errorData, setErrorData] = React.useState(null);
    const [newStatus, setNewStatus] = React.useState(null);

    const { visible, config, showAlert, hideAlert } = useCustomAlert();

    const preSubmit = async (afterUpdate) => {
        showAlert({
            icon: "question",
            title: "¡Confirmación!",
            message: `Estas por cambiar el estado de ${vehiculo.modelo}. ¿Deseas continuar?`,
            confirmText: "Actualizar",
            cancelText: "Cancelar",
            onConfirm: async () => onSubmit(afterUpdate),
            onCancel: async () => { },
            showCancelButton: true,
            externalDismiss: true,
        });
    };

    const onSubmit = async (afterUpdate) => {
        if (isLoading) return;

        setLoading(true);
        setErrorData(null);
        setNewStatus(null);

        try {
            const res = await api.delete(`${vehiculoInterface.byId(vehiculo.id)}`);
            setNewStatus(res.data.estatus);

            if (afterUpdate) {
                afterUpdate(res.data.estatus);
            }

            showAlert({
                icon: "success",
                title: "¡Éxito!",
                message: res.data.message,
                showCancelButton: false,
                confirmText: "Aceptar",
                onConfirm: () => navigation.goBack(),
                externalDismiss: false,
            });
        } catch (err) {
            showAlert({
                icon: "error",
                title: "¡Error al actualizar el estado del vehículo!",
                message: getAxiosErrorMessage(err),
                confirmText: "Aceptar",
            });
        } finally {
            setLoading(false);
        }
    };

    return { isLoading, errorData, preSubmit, visible, hideAlert, config, newStatus };
}