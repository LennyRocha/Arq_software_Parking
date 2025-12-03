import { useGlobalContext } from '../../../context/GlobalContext'
import { useSnackBar } from '../../../context/SnackBarContext';
import api from '../../../utils/api'
import React from 'react'
import { getAxiosErrorMessage } from '../../../utils/getAxiosMessage';
import { Session } from './TokenManagement';

export default function setPension() {
    const { setPension } = useGlobalContext();
    const { showSnack } = useSnackBar();

    const [loading, setLoading] = React.useState(false);

    async function savePension() {
        try {
            const response = await api.get(`/pensionado/cliente/mi-pension`)
            const pensionResponse = response.data;

            const { id: pensionId, nombrePension, fechaFinalizacion, costoUltimoPago, estatus, uuidCodigoQR, fechaInicioProximaRenovacion, fechaFinProximaRenovacion } = pensionResponse.data;

            const pensionJson = {
                id: pensionId, nombrePension,
                fechaFinalizacion: fechaFinalizacion,
                costoUltimoPago: costoUltimoPago,
                estatus: estatus,
                uuidCodigoQR: uuidCodigoQR,
                fechaInicioProximaRenovacion: fechaInicioProximaRenovacion,
                fechaFinProximaRenovacion: fechaFinProximaRenovacion
            }

            await Session.setPension(pensionJson);
            setPension(pensionJson);
        } catch (err) {
            showSnack(getAxiosErrorMessage(err), "Cerrar")
        } finally {
            setLoading(false);
        }
    }

    React.useEffect(() => {
        savePension();
    }, []);

    return { loading };
}