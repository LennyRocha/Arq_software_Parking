import React, { createContext, useState, useContext } from "react";
import { Session } from "../modules/acceso/hooks/TokenManagement";
import { useNavigation } from "@react-navigation/native";
import { useCustomAlert } from "../utils/useCustomAlert";
import { CustomAlert } from "../utils/customAlert";
import useUserIdByEmail from "../modules/acceso/hooks/getIdByEmail";

const GlobalContext = createContext();

export let showExpiredAlertCallback = null;

export const GlobalProvider = ({ children }) => {
    const navigation = useNavigation();
    const [avatar, setAvatar] = useState("UP");
    const [correo, setCorreo] = useState("");
    const [pension, setPension] = useState({});
    const [idUsuario, setIdUsuario] = React.useState(null);
    const { visible, config, showAlert, hideAlert } = useCustomAlert();

    function getInitials(nombre, apellidos) {
        const inicialNombre = nombre?.charAt(0)?.toUpperCase() ?? "";
        const inicialApellido = apellidos?.charAt(0)?.toUpperCase() ?? "";

        return inicialNombre + inicialApellido;
    }

    React.useEffect(() => {
        return () => {
            setIdUsuario(null);
        };
    }, [])

    React.useEffect(() => {
        async function setBySecureStorage() {
            const id = await Session.getId();
            setIdUsuario(id);
            const user = await Session.getUser();
            if (user) {
                setCorreo(user.correo);
            }
        }
        setBySecureStorage();
    }, []);

    const showExpiredAlert = () => {
        showAlert({
            icon: "warning",
            title: "¡Sesión expirada!",
            message: "Por favor incie sesión nuevamente.",
            showCancelButton: false,
            confirmText: "Aceptar",
            onConfirm: async () => unsetUser(),
            externalDismiss: false,
        })
    }

    showExpiredAlertCallback = showExpiredAlert;

    async function unsetUser() {
        await Session.clearSession();
        navigation.reset({
            index: 0,
            routes: [{ name: "Auth", params: { screen: "login" } }],
        });
    }

    async function setAvatarIfUser() {
        const user = await Session.getUser();
        if (user) {
            setAvatar(getInitials(user.nombre, user.apellidos));
        }
    }

    React.useEffect(() => {
        setAvatarIfUser();
    }, [])

    return (
        <GlobalContext.Provider value={{ avatar, setAvatar, showExpiredAlert, correo, setCorreo, pension, setPension, idUsuario, setIdUsuario }}>
            {children}
            <CustomAlert visible={visible} hideAlert={hideAlert} config={config} />
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    return React.useContext(GlobalContext);
};