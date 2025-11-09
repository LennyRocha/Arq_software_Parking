const TOKEN_KEY = 'bearerToken';
const TOKEN_EXPIRATION = 'tokenExpiration';
const USER_INFO = 'userInfo';

// MÉTODOS PARA EL TOKEN
export const saveToken = (token) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error guardando token:', error);
  }
};

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error obteniendo token:', error);
    return null;
  }
};

export const removeToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error eliminando token:', error);
  }
};

// MÉTODOS PARA LA EXPIRACIÓN DEL TOKEN
export const saveTokenExpiration = (tokenExpiration) => {
  try {
    localStorage.setItem(TOKEN_EXPIRATION, tokenExpiration);
  } catch (error) {
    console.error('Error guardando la expiración del token: ', error);
  }
};

export const getTokenExpiration = () => {
  try {
    return localStorage.getItem(TOKEN_EXPIRATION);
  } catch (error) {
    console.error('Error obteniendo la expiración del token: ', error);
    return null;
  }
};

export const removeTokenExpiration = () => {
  try {
    localStorage.removeItem(TOKEN_EXPIRATION);
  } catch (error) {
    console.error('Error eliminando la expiración del token: ', error);
  }
};

// MÉTODOS PARA LA INFORMACIÓN DEL USUARIO
export const saveInfoUser = (userInfo) => {
  try {
    localStorage.setItem(USER_INFO, JSON.stringify(userInfo)); // Convertir a string
  } catch (error) {
    console.error('Error guardando la información del usuario: ', error);
  }
};

export const getInfoUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_INFO)); // Convertir a objeto
  } catch (error) {
    console.error('Error obteniendo la información del usuario: ', error);
    return null;
  }
};

export const removeInfoUser = () => {
  try {
    localStorage.removeItem(USER_INFO);
  } catch (error) {
    console.error('Error eliminando la información del usuario: ', error);
  }
};

// MÉTODOS GENERALES
export const saveAllStorage = (token, tokenExpiration, userInfo) => {
  try {
    saveToken(token);
    saveTokenExpiration(tokenExpiration);
    saveInfoUser(userInfo);
  } catch (error) {
    console.error('Error guardando todos los recursos en localStorage:', error);
  }
};

export const removeAllStorage = () => {
  try {
    removeToken();
    removeTokenExpiration();
    removeInfoUser();
  } catch (error) {
    console.error('Error eliminando todos los recursos guardados en localStorage: ', error);
  }
};