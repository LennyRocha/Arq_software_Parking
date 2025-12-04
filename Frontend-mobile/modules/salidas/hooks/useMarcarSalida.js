import React from 'react'
import { Session } from '../../acceso/hooks/TokenManagement';
import { getAxiosErrorMessage } from "../../../utils/getAxiosMessage";
import api from "../../../utils/api";
import { useCustomAlert } from "../../../utils/useCustomAlert";
import { useSnackBar } from '../../../context/SnackBarContext';
import useTiposVehiculos from '../../vehiculo/hooks/useTiposVehiculos'

export default function useMarcarSalida(navigation, folio, recall, salida) {
    const { showSnack } = useSnackBar();

    const [isLoading, setLoading] = React.useState(false);
    const [errorData, setErrorData] = React.useState(null);
    const { visible, config, showAlert, hideAlert } = useCustomAlert();
    const [data, setData] = React.useState(null);
    const [vehiculo, setVehiculo] = React.useState(null);

    const { data: tipos } = useTiposVehiculos();

    React.useEffect(() => {
        if (salida) {
            setVehiculo(salida.vehiculo);
        }
    }, [salida])

    const [tipoVehiculo, setTipoVehiculo] = React.useState(null);

    React.useEffect(() => {
        if (tipos && vehiculo) {
            setTipoVehiculo(tipos[vehiculo.idTipoVehiculo - 1])
        }
    }, [tipos, vehiculo])


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

        let errorObject = {}

        setLoading(true);
        setErrorData(null);

        try {
            const res = await api.get(`/entrada-salida/solicitar-codigo`);
            const data = res.data.data;
            const user = await Session.getUser();
            const now = new Date();
            const fecha = now.toISOString().substring(0, 10);
            const horaSalida = formatHora(now);
            const exit = {
                uuidCodigoQR: data,
                fecha: fecha,
                horaEntrada: salida.horaEntrada,
                horaSalida: horaSalida,
                tipoVehiculo: tipoVehiculo,
                vehiculo: {
                    id: vehiculo.id,
                    tipoVehiculo: tipoVehiculo,
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
                },
                folioTicket: folio
            }
            /*console.log("Se marca salida con", pension.uuidCodigoQR);
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
            */
            navigation.navigate("salidaQR", { folio: data, salida: exit });
            setData(salida);
            recall();
            setLoading(false);
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
