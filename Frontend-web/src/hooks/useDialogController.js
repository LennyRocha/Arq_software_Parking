import React from "react";

export default function useDialogController() {
  const [open, toggleOpen] = React.useState(false);
  const openDialog = () => toggleOpen(true);
  const closeDialog = () => toggleOpen(false);
  return { open, openDialog, closeDialog };
}
