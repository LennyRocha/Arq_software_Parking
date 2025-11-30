import React from "react";
import { getAxiosErrorMessage } from "../../../utils/getAxiosMessage";
import cajonInterface from './cajonInterface';
import api from "../../../utils/api";
import sweetAlert from "../../../utils/sweetAlert";
import conteoYup from "../../../models/yup/conteoYup";

export default function useReservarCajones(restart, openList, close) {
    const [isLoading, setLoading] = React.useState(false);
    const [errorData, setErrorData] = React.useState(null);

    const [returnedList, setReturnedList] = React.useState([]);

    const onSubmit = async (data) => {
        if (isLoading) return;

        setLoading(true);
        setErrorData(null);

        try {
            const res = await api.put(cajonInterface.reservar(), data.conteo);

            close();

            setReturnedList(res.data.data);

            sweetAlert({
                icon: "success",
                title: "¡Operación exitosa!",
                text: res.data.message ?? "Cajones reservados correctamente.",
                reverseButtons: true,
                showDenyButton: true,
                confirmText: "Aceptar",
                denyText: "Ver cajones"
            })
                .then((result) => {
                    if (result.isDenied) openList();
                    restart();
                })
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

    const defaultValues = React.useMemo(() => ({
        conteo: 0
    }), []);

    return { isLoading, errorData, onSubmit, returnedList, conteoYup, defaultValues };
}