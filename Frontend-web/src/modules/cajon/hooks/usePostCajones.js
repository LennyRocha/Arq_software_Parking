import React from "react";
import { getAxiosErrorMessage } from "../../../utils/getAxiosMessage";
import cajonInterface from "./cajonInterface";
import cajonYup from "../../../models/yup/cajonYup";
import Cajon from "../../../models/Cajon";
import api from "../../../utils/api";
import sweetAlert from "../../../utils/sweetAlert";
import { useNavigate } from "react-router-dom";

export default function usePostVehiculos() {
    const [cajones, setCajones] = React.useState([]);
    const navigate = useNavigate();

    const [isLoading, setLoading] = React.useState(false);
    const [errorData, setErrorData] = React.useState(null);

    async function addCajon(c, tipo) {

        try {
            await cajonYup.validate(c, { abortEarly: false });

            const cajon = new Cajon({
                name: c.name,
                tipoVehiculo: tipo,
                ubicacion: c.ubicacion,
                disponible: c.disponible,
                paraPensionados: c.paraPensionados,
                piso: c.piso,
                estatus: c.estatus
            });

            setCajones(prev => [...prev, cajon]);
        } catch (validationError) {
            return sweetAlert({
                icon: "error",
                title: "Datos inválidos",
                text: validationError.errors?.join("\n") ?? "Verifique los campos",
            });
        }
    }

    const onSubmit = async (data) => {
        if (isLoading) return;

        const endpoint =
            cajones.length === 0 ? cajonInterface.postIt() : cajonInterface.postMany();

        const cajon = new Cajon({
            name: data.name,
            tipoVehiculo: data.tipoVehiculo,
            ubicacion: data.ubicacion,
            disponible: data.disponible,
            paraPensionados: data.paraPensionados,
            piso: data.piso,
            estatus: data.estatus
        });

        const payload =
            cajones.length === 0 ? cajon : cajones;

        setLoading(true);
        setErrorData(null);

        try {
            const res = await api.post(endpoint, payload);

            setLoading(false);

            await sweetAlert({
                icon: "success",
                title: "¡Éxito!",
                text: res.data.message,
                confirmText: "Aceptar",
            });

            navigate("/admin/cajones");

        } catch (err) {
            let errorMessage = getAxiosErrorMessage(err);

            // Si viene el mensaje genérico de Spring
            if (errorMessage === "Error de validación en la solicitud.") {
                errorMessage = "¡Ya existe un cajón con ese identificador!";
            }

            const errorObject = {
                tipo: err.response ? "Error API" : "Error Axios",
                texto: errorMessage,
                detalles: err
            };

            setErrorData(errorObject);
            setLoading(false);

            await sweetAlert({
                icon: "error",
                title:
                    cajones.length > 1
                        ? "¡Error al registrar los cajones!"
                        : "¡Error al registrar el cajón!",
                text: errorMessage,
                confirmText: "Aceptar",
            });
        }
    };

    function removeCajon(index) {
        setCajones(prev => prev.filter((_, i) => i !== index));
    }

    const defaultValues = React.useMemo(() => ({
        name: "",
        tipoVehiculo: {
            id: 1,
            nombre: "coche"
        },
        ubicacion: "",
        disponible: true,
        paraPensionados: false,
        piso: 1,
        estatus: true
    }), []);

    return {
        isLoading,
        errorData,
        onSubmit,
        defaultValues,
        addCajon,
        cajonYup,
        cajones,
        removeCajon
    };
}