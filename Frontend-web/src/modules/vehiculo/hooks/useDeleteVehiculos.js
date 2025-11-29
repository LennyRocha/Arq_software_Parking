import React from "react";
import { getAxiosErrorMessage } from "../../../utils/getAxiosMessage";
import vehiculoInterface from "./vehiculoInterface";
import api from "../../../utils/api";
import sweetAlert from "../../../utils/sweetAlert";

export default function useDeleteVehiculos(getVehiculos, vehiculo) {
    const [isLoading, setLoading] = React.useState(false);
    const [errorData, setErrorData] = React.useState(null);

    const preSubmit = async (toggler) => {
        sweetAlert({
            icon: "info",
            title: "¡Confirmación!",
            text: `Estás por cambiar el estado de ${vehiculo.modelo}. ¿Deseas continuar?`,
            confirmText: "Actualizar",
            denyText: "Cancelar",
            showCancelButton: true,
            allowEscapeKey: true,
            allowOutsideClick: true,
            showLoaderOnConfirm: true,
            preConfirm: () => onSubmit(),
        }).then((result) => {
            if (result.isConfirmed) {
                if (!errorData) {
                    sweetAlert({
                        icon: "success",
                        title: "¡Éxito!",
                        text: result.value?.message ?? "Vehículo actualizado correctamente.",
                        confirmText: "Aceptar",
                    })
                        .then(() => {
                            toggler();
                            getVehiculos()
                        });
                } else {
                    sweetAlert({
                        icon: "error",
                        title: "¡Error al actualizar el estado del vehículo!",
                        text: errorData.texto,
                        confirmText: "Aceptar",
                    });
                }
            }
        });
    };

    const onSubmit = async () => {
        if (isLoading) return;

        setLoading(true);
        setErrorData(null);

        try {
            const res = await api.delete(vehiculoInterface.byId(vehiculo.id));
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