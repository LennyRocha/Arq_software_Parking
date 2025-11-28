import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const Session = {
    // Guardar todo al iniciar sesión
    async saveSession({ token, expiration, user }) {
        await SecureStore.setItemAsync("token", token);
        await SecureStore.setItemAsync("expiration", expiration.toString());

        await AsyncStorage.setItem("user", JSON.stringify(user));
    },

    // Obtener token
    async getToken() {
        return await SecureStore.getItemAsync("token");
    },

    // Obtener usuario
    async getUser() {
        const value = await AsyncStorage.getItem("user");
        return value ? JSON.parse(value) : null;
    },

    // Saber si el token ya expiró
    async isExpired() {
        const exp = await SecureStore.getItemAsync("expiration");
        if (!exp) return true;

        return Date.now() > Number(exp);
    },

    // Eliminar todo al cerrar sesión
    async clearSession() {
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("expiration");
        await AsyncStorage.removeItem("user");
    }
};