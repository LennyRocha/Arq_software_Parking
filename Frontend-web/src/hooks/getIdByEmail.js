import React from "react";
const API_URL = import.meta.env.VITE_API_URL;
import axios from "axios";
import { getAxiosErrorMessage } from "../utils/getAxiosMessage";
import { getInfoUser } from "../utils/AuthService";

export default function useUserIdByEmail() {
    const [id, setId] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        async function fetchId() {
            try {
                setLoading(true);

                const user = getInfoUser();

                const correo = user.correo;
                
                const res = await axios.get(`${API_URL}/api/auth/buscarId/${correo}`);
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