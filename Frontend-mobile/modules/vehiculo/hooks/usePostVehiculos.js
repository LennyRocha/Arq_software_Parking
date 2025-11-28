import React from "react";
import { getAxiosErrorMessage } from "../../../utils/getAxiosMessage";
import vehiculoInterface from "./vehiculoInterface";
import vehicleYup from "../../../models/yup/vehicleYup";
import Vehicle from "../../../models/Vehicle";
import api from "../../../utils/api";
import { useCustomAlert } from "../../../utils/useCustomAlert";

export default function usePostVehiculos(navigation) {
    const [isLoading, setLoading] = React.useState(false);
    const [errorData, setErrorData] = React.useState(null);

    const { visible, config, showAlert, hideAlert } = useCustomAlert();

    const onSubmit = async (data) => {
        if (isLoading) return;

        const vehic = new Vehicle({
            id: null,
            id_user: data.id_user,
            id_type: data.id_type,
            placa: data.placa,
            modelo: data.modelo,
            desc: data.desc,
            status: data.estatus,
        });

        let errorObject = {}

        setLoading(true);
        setErrorData(null);
        try {
            const res = await api.post(`${vehiculoInterface.postIt()}`, vehic.toJson());
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
                title: "¡Error al registrar vehículo!",
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
        id_user: 3,
        modelo: "",
        id_type: 1,
        placa: "",
        desc: "",
        estatus: true
    }), []);

    return { isLoading, errorData, onSubmit, defaultValues, vehicleYup, visible, hideAlert, config };
}