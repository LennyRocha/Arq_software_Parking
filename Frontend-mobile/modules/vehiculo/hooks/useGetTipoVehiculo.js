import { View, Text } from 'react-native'
import React from 'react'
import { getAxiosErrorMessage } from '../../../utils/getAxiosMessage';
import TipoVehiculo from '../../../models/TipoVehiculo';
import api from '../../../utils/api';

export default function useGetTiposVehiculos(id) {
    const [data, setData] = React.useState([]);
    const [error, setError] = React.useState([]);

    async function getTipos() {
        await api.get(`/vehiculos/tipos/${id}`)
            .then((res) => setData(new TipoVehiculo(res.data.id, res.data.nombre)))
            .catch((err) => setError(getAxiosErrorMessage(err)))
    }

    React.useEffect(() => {
        getTipos()
    }, [])

    return { data, error }
}