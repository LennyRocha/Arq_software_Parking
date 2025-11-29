import { View, Text } from 'react-native'
import React from 'react'
import { getAxiosErrorMessage } from '../../../utils/getAxiosMessage';
import api from '../../../utils/api';

export default function useTiposVehiculos() {
    const [data, setData] = React.useState([]);
    const [load, setLoad] = React.useState(false);
    const [error, setError] = React.useState([]);

    async function getTipos() {
        setLoad(true);
        await api.get(`/vehiculos/tipos`)
            .then((res) => setData(res.data.data))
            .catch((err) => setError(getAxiosErrorMessage(err)))
            .finally(() => setLoad(false))
    }

    React.useEffect(() => {
        getTipos()
    }, [])

    return { data, error, load }
}