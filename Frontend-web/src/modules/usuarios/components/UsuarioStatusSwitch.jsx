import React from 'react';
import { Switch } from "@mui/material";
import CustomSweetAlert from '../../../components/CustomSweetAlert';

export default function UsuarioStatusSwitch({
  id,
  status,
  onStatusChange,
  setLoading
}) {
  const handleChangeEstatus = async () => {
    const confirmResult = await CustomSweetAlert.confirm({
      title: `¿Confirmar cambio de estatus?`,
      text: `El usuario será marcado como ${status ? "inactivo" : "activo"}`,
    });

    if (confirmResult.isConfirmed) {
      setLoading(true);
      const resultado = await onStatusChange(id);
      setLoading(false);
      
      if (resultado.success) {
        await CustomSweetAlert.success({
          title: "¡Operación exitosa!",
          text: `El estatus del usuario ha cambiado de ${status ? "activo" : "inactivo"} a ${status ? "inactivo" : "activo"}.`
        });
      } else {
        await CustomSweetAlert.error({
          text: resultado.error
        });
      }
    }
  };

  return (
    <Switch
      checked={status}
      onChange={handleChangeEstatus}
      color="primary"
    />
  );
}
