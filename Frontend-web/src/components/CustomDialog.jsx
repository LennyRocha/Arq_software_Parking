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
          <Button type="submit" variant="contained" form={undefined}>
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