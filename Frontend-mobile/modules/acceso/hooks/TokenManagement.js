import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const Session = {
    // Guardar todo al iniciar sesión
    async saveSession({ token, expiration, user, pension }) {
        await SecureStore.setItemAsync("token", token);
        await SecureStore.setItemAsync("expiration", expiration.toString());

        await AsyncStorage.setItem("user", JSON.stringify(user));
        await AsyncStorage.setItem("pension", JSON.stringify(pension));
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
        await AsyncStorage.removeItem("user");
        await AsyncStorage.setItem("user", JSON.stringify(user));
    },

    async setPension(pension) {
        await AsyncStorage.removeItem("pension");
        await AsyncStorage.setItem("pension", JSON.stringify(pension));
    },

    //Guardar id
    async setId(id) {
        await SecureStore.setItemAsync("id", id);
    },

    async getId() {
        const id = await SecureStore.getItemAsync("id");
        return id ? Number(id) : null;
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
        await SecureStore.deleteItemAsync("id");
    }
};