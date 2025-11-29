import React from 'react'
import { useSnackBar } from '../../../context/SnackBarContext';
import { useWebSocket } from './useWebSocket';
import { Audio } from 'expo-av';

export default function useCajones() {
    const { showSnack } = useSnackBar();
    const { emit, on, isConnected } = useWebSocket();

    const [piso, setPiso] = React.useState(0);
    const [idCar, setIdCar] = React.useState(0);
    const [data, setData] = React.useState(null);
    const [message, setMessage] = React.useState(null);

    const [loading, setLoading] = React.useState(false);
    const [availableCount, setAvailableCount] = React.useState(0);

    const soundRef = React.useRef(null);

    async function playSound() {
        try {
            if (!soundRef.current) {
                const wav = require("../../../sounds/claxon.wav");

                const { sound } = await Audio.Sound.createAsync(
                    wav,
                    { volume: 0.5 }
                );

                soundRef.current = sound;
            }

            await soundRef.current.replayAsync();

        } catch (error) {
            console.log("Error al reproducir sonido:", error);
        }
    }

    React.useEffect(() => {
        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync();
            }
        };
    }, []);

    const sendParams = (piso, id) => {
        setLoading(true);
        emit("get", { piso, id });
    };

    React.useEffect(() => {
        if (!isConnected) return;

        on("sync", () => {
            setLoading(true);
            emit("get", { piso, id: idCar });
            playSound();
            showSnack("Cajones modificados desde el backend", "Aceptar");
        });

        on("response", (data) => {
            setData(data.data);
            setLoading(false);
            const valorDisp = data.data.filter((c) => c.disponible === true);
            setAvailableCount(valorDisp.length);
            setMessage(data.message);
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

    return {
        data,
        loading,
        sendParams,
        restartValues,
        setPiso,
        setIdCar,
        piso,
        idCar,
        availableCount,
        message
    };
}