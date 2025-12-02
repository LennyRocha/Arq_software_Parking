import React from "react";
import apiToken from "./apiToken";
import { getInfoUser } from "./AuthService";

export default function useInitials() {
  const [loading, setLoading] = React.useState(false);
  const [nombre, setNombre] = React.useState("");
  const [apellidos, setApellidos] = React.useState("");

  const user = getInfoUser();

  React.useEffect(() => {
    async function getData() {
      try {
        setLoading(true);
        const res = await apiToken.get(`api/auth/consultarDatos/${user.id}`);
        const { apellidos, nombre } = res.data.data;
        setNombre(nombre);
        setApellidos(apellidos);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    getData();
  }, [user.id]);

  const concated = React.useMemo(() => {
    const inicialNombre = nombre?.charAt(0)?.toUpperCase() ?? "";
    const inicialApellido = apellidos?.charAt(0)?.toUpperCase() ?? "";
    return inicialNombre + inicialApellido;
  }, [nombre, apellidos]);

  return { loading, concated };
}