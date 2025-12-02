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

    async getTokenExpiration() {
        return await SecureStore.getItemAsync("expiration");
    },

    // Obtener usuario
    async getUser() {
        const value = await AsyncStorage.getItem("user");
        return value ? JSON.parse(value) : null;
    },

    async getPension() {
        const value = await AsyncStorage.getItem("pension");
        return value ? JSON.parse(value) : null;
    },

    //Actualizar usuario
    async setUser(user) {
        console.log(user)
        await AsyncStorage.removeItem("user");
        await AsyncStorage.setItem("user", JSON.stringify(user));
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
        await AsyncStorage.removeItem("pension");
    }
};