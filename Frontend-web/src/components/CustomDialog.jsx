/**
 * CustomDialog - Componente de diálogo personalizado reutilizable
 * 
 * @description
 * Componente que muestra un diálogo modal personalizado con Material-UI.
 * Soporta modo formulario y modo confirmación, con estilos adaptados al tema oscuro/claro.
 * 
 * @example
 * // Uso como diálogo de confirmación
 * <CustomDialog
 *   titulo="Confirmar acción"
 *   isOpen={open}
 *   handleClose={handleClose}
 *   onConfirm={handleConfirm}
 *   textConfirm="Aceptar"
 *   textCancel="Cancelar"
 * >
 *   <Typography>¿Estás seguro de realizar esta acción?</Typography>
 * </CustomDialog>
 * 
 * @example
 * // Uso como formulario
 * <CustomDialog
 *   titulo="Agregar Usuario"
 *   isOpen={open}
 *   handleClose={handleClose}
 *   isForm={true}
 *   onSubmit={handleSubmit}
 *   textSubmit="Guardar"
 *   textCancel="Cancelar"
 *   maxWidth="md"
 * >
 *   <TextField label="Nombre" />
 *   <TextField label="Email" />
 * </CustomDialog>
 * 
 * @param {string} titulo - Título del diálogo
 * @param {boolean} isOpen - Estado de apertura del diálogo
 * @param {React.ReactNode} children - Contenido del diálogo
 * @param {boolean} [isForm=false] - Si el diálogo contiene un formulario
 * @param {Function} [onSubmit] - Callback al enviar el formulario (si isForm=true)
 * @param {Function} [onCancel] - Callback al cancelar
 * @param {Function} [onConfirm] - Callback al confirmar
 * @param {string} [textSubmit="Submit"] - Texto del botón de envío
 * @param {string} [textCancel="Cancel"] - Texto del botón de cancelar
 * @param {string} [textConfirm="Confirm"] - Texto del botón de confirmar
 * @param {boolean} [fullWidth=true] - Si el diálogo ocupa el ancho completo
 * @param {string} [maxWidth="sm"] - Ancho máximo del diálogo (xs, sm, md, lg, xl)
 * @param {Object} [containerStyle] - Estilos personalizados del contenedor
 * @param {Function} handleClose - Función para cerrar el diálogo
 * @param {boolean} [keyForClose=true] - Si se puede cerrar con la tecla ESC
 * @param {boolean} [allowOutsideClick=true] - Si se puede cerrar haciendo clic fuera
 */
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDarkContext } from "../context/DarkContext";
import React from "react";

export default function CustomDialog({
  titulo,
  isOpen,
  children,
  isForm = false,
  onSubmit,
  onCancel,
  onConfirm,
  textSubmit = "Submit",
  textCancel = "Cancel",
  textConfirm = "Confirm",
  fullWidth = true, // changed default to true
  maxWidth = "sm",  // changed default to "sm"
  containerStyle = {
    m: "auto",
    // removed width: "fit-content" so maxWidth can apply
    height: "fit-content",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  handleClose,
  keyForClose = true,
  allowOutsideClick = true
}) {
    const { isDarkMode } = useDarkContext();

  const doNothing = (e) => {
    e?.preventDefault?.();
  };

  const titleId = React.useId ? React.useId() : "custom-dialog-title";

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      handleClose?.(); // Cambiado de onClose a handleClose
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      handleClose?.(); // Cambiado de onClose a handleClose
    }
  };

  return (
    <Dialog
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      open={isOpen}
      onClose={(event, reason) =>{
        if (reason === 'backdropClick' && !allowOutsideClick) return;
        handleClose();
      }} 
      aria-labelledby={titleId}
      disableEscapeKeyDown={keyForClose}
    >
      <Box
        component={"div"}
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          padding: 1
        }}
      >
        <DialogTitle
          id={titleId}
          variant="h5"
          color={isDarkMode ? "white" : "tertiary"}
          sx={{ fontWeight: "bold",textAlign: "left", paddingLeft: 0, paddingRight: 0 }}
          className="custom-font"
        >
          {titulo}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ padding: "12px", height: "fit-content"}}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent>
        <Box
          component={isForm ? "form" : "div"}
          onSubmit={isForm ? onSubmit ?? doNothing : undefined}
          sx={containerStyle}
        >
          {children}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} variant="contained" color="inerhit">
          {textCancel}
        </Button>
        {isForm ? (
          <Button type="submit" variant="contained" onClick={onSubmit}>
            {textSubmit}
          </Button>
        ) : (
          <Button onClick={handleConfirm} variant="contained">
            {textConfirm}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}