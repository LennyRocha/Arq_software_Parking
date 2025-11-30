import React from "react";
import { getAxiosErrorMessage } from "../../../utils/getAxiosMessage";
import cajonInterface from './cajonInterface';
import api from "../../../utils/api";
import sweetAlert from "../../../utils/sweetAlert";

export default function useDeleteCajon(restart,) {
    const [isLoading, setLoading] = React.useState(false);
    const [errorData, setErrorData] = React.useState(null);

    const preSubmit = (toggler, cajon) => {
        sweetAlert({
            icon: "info",
            title: "¡Confirmación!",
            text: `¿Deseas cambiar el estatus de este cajón a ${cajon.estatus ? "Inactivo" : "Activo"}?`,
            confirmText: "Confirmar",
            denyText: "Cancelar",
            showCancelButton: true,
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return onSubmit(cajon)
                    .then((res) => res)
                    .catch((err) => {
                        sweetAlert({
                            icon: "error",
                            title: "¡Error al actualizar el estado del cajón!",
                            text: err.response?.data?.message || err.message,
                            confirmText: "Aceptar",
                        });
                        throw err;
                    });
            },
        }).then((result) => {
            if (result.isConfirmed) {
                toggler();
                restart();

                sweetAlert({
                    icon: "success",
                    title: "¡Éxito!",
                    text: result.value?.message ?? "Estatus del cajón actualizado correctamente.",
                    confirmText: "Aceptar",
                });
            }
        });
    };

    const onSubmit = async (cajon) => {
        if (isLoading) return;

        setLoading(true);
        setErrorData(null);

        try {
            const res = await api.delete(cajonInterface.byId(cajon.id));
            return res.data;
        } catch (err) {
            const errorObject = {
                tipo: err.response ? "Error de la API" : "Error de Axios",
                texto: getAxiosErrorMessage(err),
                detalles: err,
            };
            setErrorData(errorObject);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { isLoading, errorData, preSubmit };
}