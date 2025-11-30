import React from 'react';
import { Box } from "@mui/material";
import CustomDialog from '../../../components/CustomDialog';
import CustomSweetAlert from '../../../components/CustomSweetAlert';
import CustomInputLabel from '../../../components/inputs/CustomInputLabel';
import { useFormik } from "formik";
import { usuarioSchema } from '../config/usuarioYup';

export default function UsuarioFormModal({
  isOpen,
  onClose,
  usuario,
  onSubmit,
  setLoading
}) {
  const handleSubmit = async (values) => {
    // Primero cerramos el modal
    onClose();
    
    // Mostrar diálogo de confirmación
    const confirmResult = await CustomSweetAlert.confirm({
      title: "¿Confirmar cambios?",
      text: "Los datos del usuario serán actualizados.",
      confirmButtonText: "Guardar cambios",
    });

    if (confirmResult.isConfirmed) {
      setLoading(true);
      const resultado = await onSubmit(values);
      setLoading(false);
      
      if (resultado.success) {
        formik.resetForm();
        await CustomSweetAlert.success({
          title: "¡Éxito!",
          text: "Datos del usuario actualizados correctamente"
        });
      } else {
        await CustomSweetAlert.error({
          text: resultado.error
        });
        // Si hay error, volvemos a abrir el modal
        setTimeout(() => onClose(false), 100);
      }
    } else {
      // Si cancela, volvemos a abrir el modal
      setTimeout(() => onClose(false), 100);
    }
  };

  const formik = useFormik({
    initialValues: {
      nombre: usuario?.nombre || "",
      apellidos: usuario?.apellidos || ""
    },
    validationSchema: usuarioSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true
  });

  return (
    <CustomDialog
      titulo="Modificar usuario"
      isOpen={isOpen}
      handleClose={() => {
        onClose();
        formik.resetForm();
      }}
      isForm={true}
      onSubmit={formik.handleSubmit}
      textSubmit="Guardar cambios"
      textCancel="Cancelar"
      maxWidth="sm"
      fullWidth
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
        <CustomInputLabel
          labelText="Nombre(s)"
          value={formik.values.nombre}
          onChange={formik.handleChange}
          name="nombre"
          isObligatory={true}
          type="text"
          placeholder="Juan Carlos"
          isWrong={formik.touched.nombre && Boolean(formik.errors.nombre)}
          errorMessage={formik.touched.nombre && formik.errors.nombre}
        />

        <CustomInputLabel
          labelText="Apellidos"
          value={formik.values.apellidos}
          onChange={formik.handleChange}
          name="apellidos"
          isObligatory={true}
          type="text"
          placeholder="Pérez García"
          isWrong={formik.touched.apellidos && Boolean(formik.errors.apellidos)}
          errorMessage={formik.touched.apellidos && formik.errors.apellidos}
        />
      </Box>
    </CustomDialog>
  );
}
