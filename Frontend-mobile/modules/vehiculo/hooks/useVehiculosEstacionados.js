import React from "react";
import { getAxiosErrorMessage } from "../../../utils/getAxiosMessage";
import vehiculoInterface from "./vehiculoInterface";
import api from "../../../utils/api";

export default function useVehiculosEstacionados() {
    const [isLoading, setLoading] = React.useState(false);
    const [activeData, setData] = React.useState(null);
    const [errorData, setErrorData] = React.useState(null);
    const [dependence, setDependence] = React.useState(false);

    const restartCall = () => setDependence(!dependence);

    const getVehiculosActive = React.useCallback(async () => {
        let errorObject = {}

        setLoading(true);
        setErrorData(null);

        try {
            const res = await api.get(
                vehiculoInterface.check()
            );
            setData(res.data);
        } catch (err) {
            errorObject = {
                tipo: err.response ? "Error de la API" : "Error de Axios",
                texto: getAxiosErrorMessage(err),
                detalles: err
            }
            setErrorData(errorObject);
        } finally {
            setLoading(false);
        }
    }, [dependence]);

    React.useEffect(() => {
        getVehiculosActive();
    }, [dependence]);

    return { getVehiculosActive, activeData, isLoading, errorData, restartCall };
}