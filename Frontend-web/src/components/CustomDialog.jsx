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
 * @param {boolean} [showActions=true] - Si se muestran los botones de acción
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
  CircularProgress,
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
  showActions = true,
  fullWidth = true, // changed default to true
  maxWidth = "sm", // changed default to "sm"
  containerStyle = {},
  handleClose,
  keyForClose = true,
  allowOutsideClick = true,
  tituloLeft = false,
  showCancel = true,
  valid = true,
  isLoading = false,
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
      onClose={(event, reason) => {
        if (reason === "backdropClick" && !allowOutsideClick) return;
        handleClose();
      }}
      aria-labelledby={titleId}
      disableEscapeKeyDown={keyForClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          padding: 1,
        },
      }}
    >
      <DialogTitle
        id={titleId}
        sx={{
          textAlign: tituloLeft ? "left" : "center",
          color: "var(--primary)",
          fontWeight: "bold",
          fontSize: { xs: "1.5rem", sm: "2rem" },
          paddingBottom: 3,
          paddingTop: 2,
          position: "relative",
          paddingRight: { xs: "48px", sm: "16px" },
        }}
      >
        {titulo}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box
          component={isForm ? "form" : "div"}
          onSubmit={isForm ? onSubmit ?? doNothing : undefined}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
            ...containerStyle,
          }}
        >
          {children}
        </Box>
      </DialogContent>
      {showActions && (
        <DialogActions>
          {showCancel && (
            <Button onClick={handleCancel} variant="contained" color="inherit">
              {textCancel}
            </Button>
          )}
          {isForm ? (
            isLoading ? (
              <CircularProgress size={40} />
            ) : (
              <Button
                type="submit"
                variant="contained"
                onClick={onSubmit}
                disabled={!valid}
              >
                {textSubmit}
              </Button>
            )
          ) : (
            <Button onClick={handleConfirm} variant="contained">
              {textConfirm}
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
}
