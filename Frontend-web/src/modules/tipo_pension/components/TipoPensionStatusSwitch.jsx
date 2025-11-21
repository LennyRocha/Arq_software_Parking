import React from 'react';
import { Switch } from "@mui/material";
import CustomSweetAlert from '../../../components/CustomSweetAlert';

export default function TipoPensionStatusSwitch({
  id,
  status,
  onStatusChange,
  setLoading
}) {
  const handleChangeEstatus = async () => {
    const confirmResult = await CustomSweetAlert.confirm({
      title: `¿Confirmar cambio de estatus?`,
      text: `La pensión será marcada como ${status ? "desactivada" : "activa"}`,
    });

    if (confirmResult.isConfirmed) {
      setLoading(true);
      const resultado = await onStatusChange(id);
      setLoading(false);
      
      if (resultado.success) {
        await CustomSweetAlert.success({
          title: "¡Operación exitosa!",
          text: `Ha cambiado el estatus de la pensión de ${status ? "activa" : "desactivada"} a ${status ? "desactivada" : "activa"}.`
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