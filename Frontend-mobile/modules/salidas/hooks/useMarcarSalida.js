import React from 'react'
import { Session } from '../../acceso/hooks/TokenManagement';
import { getAxiosErrorMessage } from "../../../utils/getAxiosMessage";
import api from "../../../utils/api";
import { useCustomAlert } from "../../../utils/useCustomAlert";
import { useSnackBar } from '../../../context/SnackBarContext';
import { useGlobalContext } from '../../../context/GlobalContext';

export default function useMarcarSalida(navigation, folio, recall) {
    const { showSnack } = useSnackBar();
    const { setPension, pension } = useGlobalContext();

    const [isLoading, setLoading] = React.useState(false);
    const [errorData, setErrorData] = React.useState(null);
    const { visible, config, showAlert, hideAlert } = useCustomAlert();
    const [data, setData] = React.useState(null);

    const onSubmit = async (close) => {
        if (isLoading) return;

        if (!pension) return;

        let errorObject = {}

        setLoading(true);
        setErrorData(null);

        const uuidCodigo = pension.uuidCodigoQR;

        try {
            console.log("Se marca salida con", pension.uuidCodigoQR);
            const res = await api.put(`/entrada-salida/pensionado/salida/${pension.uuidCodigoQR}`);
            const data = res.data;
            const salida = data.data;

            const res_dos = await api.get(`/pensionado/cliente/mi-pension`);
            const pensionResponse = res_dos.data;
            console.log("Nuevo uuid", pensionResponse.data.uuidCodigoQR);

            const { id: pensionId, nombrePension, fechaFinalizacion, costoUltimoPago, estatus, uuidCodigoQR, fechaInicioProximaRenovacion, fechaFinProximaRenovacion } = pensionResponse.data;
            const pensionJson = {
                id: pensionId,
                nombrePension: nombrePension,
                fechaFinalizacion: fechaFinalizacion,
                costoUltimoPago: costoUltimoPago,
                estatus: estatus,
                uuidCodigoQR: uuidCodigoQR,
                fechaInicioProximaRenovacion: fechaInicioProximaRenovacion,
                fechaFinProximaRenovacion: fechaFinProximaRenovacion
            }

            setPension(pensionJson);

            navigation.navigate("salidaQR", { folio: uuidCodigo, salida: salida })
            setData(salida);
            showSnack("Salida marcada", "Cerrar");
            recall();
        } catch (err) {
            errorObject = {
                tipo: err.response ? "Error de la API" : "Error de Axios",
                texto: getAxiosErrorMessage(err),
                detalles: err
            }
            setErrorData(errorObject);
            setLoading(false);
            showAlert({
                icon: "error",
                title: "¡Error al marcar entrada!",
                message: getAxiosErrorMessage(err),
                showCancelButton: false,
                confirmText: "Aceptar",
                onConfirm: () => { },
                externalDismiss: false,
            })
        } finally {
            close();
            setLoading(false);
        }
    }

    return { isLoading, errorData, visible, config, hideAlert, data, onSubmit };
}
