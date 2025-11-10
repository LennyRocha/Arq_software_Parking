import React from 'react';
import { Switch } from "@mui/material";
import CustomSweetAlert from "../../../../components/CustomSweetAlert";

export default function TipoPensionStatusSwitch({
  id,
  status,
  onStatusChange,
  setLoading
}) {
  const handleChangeEstatus = async () => {
    const confirmResult = await CustomSweetAlert.confirm({
      title: `${status ? "Desactivar" : "Activar"} tipo de pensión`,
      text: `¿Está seguro que desea ${status ? "desactivar" : "activar"} este tipo de pensión?`,
    });

    if (confirmResult.isConfirmed) {
      setLoading(true);
      const resultado = await onStatusChange(id);
      setLoading(false);
      
      if (resultado.success) {
        await CustomSweetAlert.success({
          title: "¡Éxito!",
          text: `El tipo de pensión se ha ${status ? "desactivado" : "activado"} correctamente`
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