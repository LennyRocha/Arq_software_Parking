import React from "react";
import { getAxiosErrorMessage } from "../../../utils/getAxiosMessage";
import vehiculoInterface from "./vehiculoInterface";
import vehicleYup from "../../../models/yup/vehicleYup";
import Vehicle from "../../../models/Vehicle";
import api from "../../../utils/api";
import sweetAlert from "../../../utils/sweetAlert";

export default function usePutVehiculos(getVehiculos, vehiculo, idUser) {
    const [isLoading, setLoading] = React.useState(false);
    const [errorData, setErrorData] = React.useState(null);

    const preSubmit = async (data, close) => {
        close();
        sweetAlert({
            icon: "info",
            title: "¡Confirmación!",
            text: `Estás por modificar los datos de ${vehiculo.modelo}. ¿Deseas continuar?`,
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
                            text: result.value?.message ?? "Vehículo actualizado correctamente.",
                            confirmText: "Aceptar",
                        })
                            .then(() => {
                                getVehiculos()
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

        const vehic = new Vehicle({
            id: vehiculo.id,
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
            const res = await api.put(vehiculoInterface.byId(vehiculo.id), vehic.toJson());
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
        id_user: 0,
        modelo: vehiculo.modelo,
        id_type: vehiculo.idTipoVehiculo,
        placa: vehiculo.placa,
        desc: vehiculo.descripcion,
        estatus: vehiculo.estatus
    }), [vehiculo]);

    return { isLoading, errorData, preSubmit, defaultValues, vehicleYup };
}