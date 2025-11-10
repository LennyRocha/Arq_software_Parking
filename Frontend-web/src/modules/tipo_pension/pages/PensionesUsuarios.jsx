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
    nombre: "Pensiones de usuarios",
    ruta: "/admin/pensiones_de_usuarios",
    disabled: true,
  },
];

export default function PensionesUsuario() {
  const { open, openDialog, closeDialog } = useDialogController();
  const { toggleDarkMode } = useDarkContext();
  const [show, setShow] = React.useState(false);
  return (
    <>
      <LoadingBackdrop isOpen={show} onClose={() => setShow(false)} />
      <MainHeader titulo="PENSIONES DE USUARIO" breads={links} />

      <HeadingDescription
        title="GESTIÓN DE PENSIONES DE USUARIOS"
        description="Apartado para consultar usuarios con pago de pensión, renovarla (recibiendo dinero de manera física) y/o consultar su historial de pagos. De igual forma, agregar a un nuevo pensionado."
      />
    </>
  );
}
