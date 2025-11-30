import React from "react";
import { getAxiosErrorMessage } from "../../../utils/getAxiosMessage";
import cajonYup from "../../../models/yup/cajonYup";
import api from "../../../utils/api";
import sweetAlert from "../../../utils/sweetAlert";
import cajonInterface from "./cajonInterface";
import Cajon from "../../../models/Cajon";

export default function usePutCajones(restartCall, cajon,) {
    const [isLoading, setLoading] = React.useState(false);
    const [errorData, setErrorData] = React.useState(null);

    const preSubmit = async (data, close) => {
        close();
        sweetAlert({
            icon: "info",
            title: "¡Confirmación!",
            text: `Estás por modificar los datos de ${cajon.name}. ¿Deseas continuar?`,
            confirmText: "Actualizar",
            denyText: "Cancelar",
            showCancelButton: true,
            preConfirm: () => onSubmit(data),
            showLoaderOnConfirm: true,
        })
            .then((result) => {
                if (result.isConfirmed) {
                    if (!errorData) {
                        sweetAlert({
                            icon: "success",
                            title: "¡Éxito!",
                            text: result.value?.message ?? "Cajón actualizado correctamente.",
                            confirmText: "Aceptar",
                        })
                            .then(() => {
                                restartCall()
                            });
                    } else {
                        sweetAlert({
                            icon: "error",
                            title: "¡Error!",
                            text: errorData.texto,
                            confirmText: "Aceptar",
                        });
                    }
                }
            });
    };

    const onSubmit = async (data) => {
        if (isLoading) return;

        const cajonObj = new Cajon({
            id: cajon.id,
            name: data.name,
            ubicacion: data.ubicacion,
            tipoVehiculo: data.tipoVehiculo,
            disponible: data.disponible,
            paraPensionados: data.paraPensionados,
            piso: data.piso,
            estatus: data.estatus
        });

        setLoading(true);
        setErrorData(null);

        try {
            const res = await api.put(cajonInterface.byId(cajon.id), cajonObj.toJson());
        } catch (err) {
            const errorObject = {
                tipo: err.response ? "Error de la API" : "Error de Axios",
                texto: getAxiosErrorMessage(err),
                detalles: err
            };
            setErrorData(errorObject);
        } finally {
            setLoading(false);
        }
    };

    const defaultValues = React.useMemo(() => ({
        name: cajon.name,
        tipoVehiculo: cajon.tipoVehiculo,
        ubicacion: cajon.ubicacion,
        disponible: cajon.disponible,
        paraPensionados: cajon.paraPensionados,
        piso: cajon.piso,
        estatus: cajon.estatus
    }), [cajon]);

    return { isLoading, errorData, preSubmit, defaultValues, cajonYup };
}