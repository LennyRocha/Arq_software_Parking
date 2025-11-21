import sweetAlert from '../utils/sweetAlert';

/**
 * CustomSweetAlert - Componente para mostrar alertas personalizadas
 * 
 * @param {Object} config - Configuración de la alerta
 * @param {string} config.title - Título de la alerta
 * @param {string} config.text - Texto de la alerta
 * @param {string} config.icon - Icono de la alerta (success, error, warning, info, question)
 * @param {boolean} config.showConfirmButton - Mostrar botón de confirmar
 * @param {string} config.confirmButtonText - Texto del botón confirmar
 * @param {boolean} config.showDenyButton - Mostrar botón denegar
 * @param {string} config.denyButtonText - Texto del botón denegar
 * @param {number} config.timer - Tiempo en ms para cerrar automáticamente
 * @returns {Promise} Resultado de la alerta
 */
const showAlert = ({
  title,
  text,
  icon = "success",
  showConfirmButton = true,
  confirmButtonText = "Aceptar",
  showDenyButton = false,
  denyButtonText = "Cancelar",
  timer,
  ...rest
}) => {
  return sweetAlert({
    title,
    text,
    icon,
    showConfirmButton,
    confirmButtonText,
    showDenyButton,
    denyButtonText,
    timer,
    showCloseButton: true,
    reverseButtons: true,
    ...rest
  });
};

/**
 * Mostrar alerta de confirmación
 */
export const showConfirmDialog = ({
  title,
  text,
  confirmButtonText = "Aceptar",
  denyButtonText = "Cancelar"
}) => {
  return showAlert({
    title,
    text,
    icon: "warning",
    showDenyButton: true,
    confirmButtonText,
    denyButtonText,
  });
};

/**
 * Mostrar alerta de éxito
 */
export const showSuccessAlert = ({
  title,
  text,
  timer = 2000
}) => {
  return showAlert({
    title,
    text,
    icon: "success",
    timer,
    showConfirmButton: false
  });
};

/**
 * Mostrar alerta de error
 */
export const showErrorAlert = ({
  title = "Error",
  text
}) => {
  return showAlert({
    title,
    text,
    icon: "error"
  });
};

// Exportar todo como un objeto para facilitar el uso
const CustomSweetAlert = {
  show: showAlert,
  confirm: showConfirmDialog,
  success: showSuccessAlert,
  error: showErrorAlert,
};

export default CustomSweetAlert;