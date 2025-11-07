import { Backdrop, CircularProgress } from "@mui/material";
import React from "react";

export default function LoadingBackdrop({ isOpen, onClose }) {
  return (
    <Backdrop sx={{ position: "absolute", top: 0, left: 0, flex: 1, zIndex: 1 }} open={isOpen} onClick={onClose}>
      <CircularProgress color="secondary" />
    </Backdrop>
  );
}
