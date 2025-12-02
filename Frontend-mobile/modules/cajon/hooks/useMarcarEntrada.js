import React from 'react'
import { Session } from '../../acceso/hooks/TokenManagement';
import { getAxiosErrorMessage } from "../../../utils/getAxiosMessage";
import api from "../../../utils/api";
import { useCustomAlert } from "../../../utils/useCustomAlert";
import { useSnackBar } from '../../../context/SnackBarContext';
import { useGlobalContext } from '../../../context/GlobalContext';

export default function useMarcarEntrada(navigation) {
    const [vehiculo, setVehiculo] = React.useState(null);
    const { showSnack } = useSnackBar();
    const { setPension, pension } = useGlobalContext();

    const [isLoading, setLoading] = React.useState(false);
    const [errorData, setErrorData] = React.useState(null);
    const { visible, config, showAlert, hideAlert } = useCustomAlert();
    const [data, setData] = React.useState(null);

    const onSubmit = async (close) => {
        if (isLoading) return;

        if (!vehiculo || !pension) return;

        let errorObject = {}

        setLoading(true);
        setErrorData(null);

        const uuidCodigo = pension.uuidCodigoQR;

        try {
            const payload = {
                uuidCodigoQR: pension.uuidCodigoQR,
                vehiculo: {
                    id: vehiculo.id,
                    tipoVehiculo: {
                        id: vehiculo.idTipoVehiculo
                    },
                    placa: vehiculo.placa ?? "",
                    usuario: {
                        id: vehiculo.idUsuario
                    },
                    modelo: vehiculo.modelo,
                    estatus: vehiculo.estatus,
                    descripcion: vehiculo.descripcion
                }
            }
            console.log("Se marca entrada con", payload.uuidCodigoQR);
            const res = await api.post(`/entrada-salida/pensionado`, payload);
            const data = res.data;
            const entrada = data.data;

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

            close();

            navigation.navigate("entradaQR", { folio: uuidCodigo, entrada: entrada })
            setData(entrada);
            showSnack("Entrada marcada", "Cerrar");
        } catch (err) {
            errorObject = {
                tipo: err.response ? "Error de la API" : "Error de Axios",
                texto: getAxiosErrorMessage(err),
                detalles: err
            }
            setErrorData(errorObject);
            close();
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
            setLoading(false);
        }
    }

    return { setVehiculo, isLoading, vehiculo, errorData, visible, config, hideAlert, data, onSubmit };
}
