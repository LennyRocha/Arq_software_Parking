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

    function formatHora(date) {
        const pad = (n) => n.toString().padStart(2, "0");

        const horas = pad(date.getHours());
        const minutos = pad(date.getMinutes());
        const segundos = pad(date.getSeconds());

        // JS solo da milisegundos (0–999)
        const ms = date.getMilliseconds().toString().padStart(3, "0");

        // Generar dígitos extra para imitar el formato largo
        const extra = Math.floor(Math.random() * 9000 + 1000); // 4 dígitos

        return `${horas}:${minutos}:${segundos}.${ms}${extra}`;
    }

    const onSubmit = async (close) => {
        if (isLoading) return;

        if (!vehiculo || !pension) return;

        let errorObject = {}

        setLoading(true);
        setErrorData(null);

        const uuidCodigo = pension.uuidCodigoQR;

        try {
            const user = await Session.getUser();
            const now = new Date();

            const fecha = now.toISOString().substring(0, 10);
            const horaEntrada = formatHora(now);

            const entrada = {
                uuidCodigoQR: pension.uuidCodigoQR,
                fecha: fecha,
                horaEntrada: horaEntrada,
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
                },
                usuario: {
                    nombre: user.nombre,
                    apellidos: user.apellidos,
                    telefono: user.telefono
                }
            }
            /*console.log("Se marca entrada con", payload.uuidCodigoQR);
            const res = await api.post(`/entrada-salida/pensionado`, payload);
            const data = res.data;
            const entrada = data.data;
            console.log(entrada, user);

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

            setPension(pensionJson);*/

            close();

            navigation.navigate("entradaQR", { folio: `${uuidCodigo}|${vehiculo.id}`, entrada: entrada })
            setData(entrada);
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
