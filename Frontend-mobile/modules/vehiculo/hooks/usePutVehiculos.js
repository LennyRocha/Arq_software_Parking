import React from "react";
import { getAxiosErrorMessage } from "../../../utils/getAxiosMessage";
import vehiculoInterface from "./vehiculoInterface";
import vehicleYup from "../../../models/yup/vehicleYup";
import Vehicle from "../../../models/Vehicle";
import api from "../../../utils/api";
import { useCustomAlert } from "../../../utils/useCustomAlert";

export default function usePutVehiculos(navigation, vehiculo, campo) {
    const [isLoading, setLoading] = React.useState(false);
    const [errorData, setErrorData] = React.useState(null);

    const { visible, config, showAlert, hideAlert } = useCustomAlert();

    const preSubmit = async (data) => {
        showAlert({
            icon: "question",
            title: "¡Confirmación!",
            message: `Estas por modificar el campo ${campo}. ¿Deseas continuar?`,
            confirmText: "Actualizar",
            cancelText: "Cancelar",
            onConfirm: async () => onSubmit(data),
            externalDismiss: false,
        })
    }

    const onSubmit = async (data) => {
        if (isLoading) return;

        const vehic = new Vehicle({
            id: vehiculo.id,
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
            const res = await api.put(`${vehiculoInterface.byId(vehiculo.id)}`, vehic.toJson());
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
                title: "¡Error al actualizar el vehículo!",
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
        modelo: vehiculo.modelo,
        id_type: vehiculo.tipoVehiculo.id,
        placa: vehiculo.placa,
        desc: vehiculo.descripcion,
        estatus: vehiculo.estatus
    }), [vehiculo]);

    return { isLoading, errorData, preSubmit, defaultValues, vehicleYup, visible, hideAlert, config };
}