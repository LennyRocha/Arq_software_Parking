import React from "react";
import sweetAlert from "../../../utils/sweetAlert";
import { useDarkContext } from "../../../context/DarkContext";
import { Button, TextField, Typography } from "@mui/material";
import MainHeader from "../../../components/MainHeader";
import useDialogController from "../../../hooks/useDialogController";
import CustomDialog from "../../../components/CustomDialog";
import LoadingBackdrop from "../../../components/LoadingBackdrop";
import HeadingDescription from "../../../components/HeadingDescription";

const links = [
  { nombre: "Pensiones", ruta: "/admin/tipos_de_pension", disabled: false },
  {
    nombre: "Tipos de pensión",
    ruta: "/admin/tipos_de_pension",
    disabled: true,
  },
];

export default function GestionTiposPension() {
  const { open, openDialog, closeDialog } = useDialogController();
  const { toggleDarkMode } = useDarkContext();
  const [show, setShow] = React.useState(false);
  return (
    <>
      <LoadingBackdrop isOpen={show} onClose={() => setShow(false)} />
      <MainHeader titulo="TIPOS DE PENSIÓN" breads={links} />

      <HeadingDescription
        title="GESTIÓN DE TIPOS DE PENSIÓN"
        description="Los tipos de pensión son las opciones de contratación que aparecen para convertirse en usuario pensionado."
      />
    </>
  );
}
