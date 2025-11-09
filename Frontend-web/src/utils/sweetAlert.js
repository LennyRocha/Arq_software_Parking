import Swal from "sweetalert2";

export default function sweetAlert({
  title,
  text,
  icon,
  allowEscapeKey = true,
  allowOutsideClick = false,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  denyText = "No",
  showCancelButton = false,
  showDenyButton = false,
  html = undefined,
  showCloseButton = false,
  showLoaderOnConfirm = false,
  reverseButtons = false,
}) {
  return Swal.fire({
    title, // título del modal
    text, // texto del modal
    icon, // tipo de icono (success, error, info, etc.)
    confirmButtonText: confirmText, // texto botón Confirmar
    cancelButtonText: cancelText, // texto botón Cancelar
    denyButtonText: denyText, // texto botón Denegar
    showCancelButton, // mostrar botón Cancelar
    showDenyButton, // mostrar botón Denegar
    showCloseButton, // mostrar botón de cierre (X arriba)
    html, // contenido HTML personalizado
    showLoaderOnConfirm, // loader en el botón Confirmar
    allowOutsideClick, // permite cerrar clicando fuera
    allowEscapeKey, // permite cerrar con tecla Escape
    reverseButtons, // invierte el orden de Confirmar/Cancelar
    customClass: {
      confirmButton: "confirm-button-class",
      cancelButton: "cancel-button-class",
      denyButton: "deny-button-class",
      popup: "popup-class",
    },
  });
}
