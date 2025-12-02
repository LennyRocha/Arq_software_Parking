import React from "react";
import { API_URL } from "@env";
import axios from "axios";
import { getAxiosErrorMessage } from "../../../utils/getAxiosMessage";
import { useGlobalContext } from "../../../context/GlobalContext";

export default function useUserIdByEmail() {
    const [id, setId] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const { correo } = useGlobalContext();

    React.useEffect(() => {
        async function fetchId() {
            try {
                setLoading(true);

                const res = await axios.get(`${API_URL}/auth/buscarId/${correo}`);
                const data = res.data;
                setId(data.data.id);
                setLoading(false);
            } catch (err) {
                console.error("Error al obtener el id del usuario: ", getAxiosErrorMessage(err));
                setError(getAxiosErrorMessage(err));
            } finally {
                setLoading(false);
            }
        }

        fetchId();
    }, []);

    return { id, loading, error };
}