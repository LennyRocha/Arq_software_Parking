import React from 'react'
import useWebSocket from './useWebSocket'
import claxon from "../../../sounds/claxon.wav";

export default function useCajones() {
    const { emit, on, isConnected } = useWebSocket();

    const [piso, setPiso] = React.useState(0);
    const [idCar, setIdCar] = React.useState(0);
    const [data, setData] = React.useState(null);

    const [loading, setLoading] = React.useState(false);
    const [availableCount, setAvailableCount] = React.useState(0);

    const sound = React.useMemo(() => new Audio(claxon), []);
    sound.volume = 0.25;

    const sendParams = (piso, id) => {
        setLoading(true);
        emit("get", { piso, id });
    };

    React.useEffect(() => {
        if (!isConnected) return;

        on("sync", () => {
            setLoading(true);
            emit("get", { piso, id: idCar });
            //Reproduce un sonido perron
            sound.currentTime = 0;
            sound.play().catch(() => { });
        });

        on("response", (data) => {
            setData(data.data);
            setLoading(false);
            const valorDisp = data.data.filter((c) => c.disponible === true);
            setAvailableCount(valorDisp.length);
        });

        sendParams(piso, idCar);
    }, [isConnected]);

    React.useEffect(() => {
        if (isConnected) sendParams(piso, idCar);
    }, [piso, idCar, isConnected]);

    function restartValues() {
        setIdCar(0);
        setPiso(0);
        sendParams(piso, idCar);
    }
    return { data, loading, sendParams, restartValues, setPiso, setIdCar, piso, idCar, availableCount }
}
