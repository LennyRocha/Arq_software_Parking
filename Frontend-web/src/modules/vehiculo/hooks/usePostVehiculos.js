import React from "react";
import { getAxiosErrorMessage } from "../../../utils/getAxiosMessage";
import vehiculoInterface from "./vehiculoInterface";
import vehicleYup from "../../../models/yup/vehicleYup";
import Vehicle from "../../../models/Vehicle";
import api from "../../../utils/api";
import sweetAlert from "../../../utils/sweetAlert";
import { useNavigate } from "react-router-dom";

export default function usePostVehiculos(idUser) {
    const navigate = useNavigate();
    const [isLoading, setLoading] = React.useState(false);
    const [errorData, setErrorData] = React.useState(null);

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

        setLoading(true);
        setErrorData(null);

        try {
            const res = await api.post(vehiculoInterface.postIt(), vehic.toJson());

            setLoading(false);

            await sweetAlert({
                icon: "success",
                title: "¡Éxito!",
                text: res.data.message,
                confirmText: "Aceptar",
            });

            navigate("/pensionados/mis_vehiculos");

        } catch (err) {
            const errorObject = {
                tipo: err.response ? "Error de la API" : "Error de Axios",
                texto: getAxiosErrorMessage(err),
                detalles: err
            };
            setErrorData(errorObject);

            await sweetAlert({
                icon: "error",
                title: "¡Error al registrar vehículo!",
                text: getAxiosErrorMessage(err),
                confirmText: "Aceptar",
            });

        } finally {
            setLoading(false);
        }
    };

    const defaultValues = React.useMemo(() => ({
        id_user: idUser,
        modelo: "",
        id_type: 1,
        placa: "",
        desc: "",
        estatus: true
    }), []);

    return { isLoading, errorData, onSubmit, defaultValues, vehicleYup };
}