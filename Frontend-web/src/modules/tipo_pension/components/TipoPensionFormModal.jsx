import React from 'react';
import { Box, TextField } from "@mui/material";
import CustomDialog from '../../../components/CustomDialog';
import CustomSweetAlert from '../../../components/CustomSweetAlert';
import { useFormik } from "formik";
import pensionYup from '../config/pensionYup';

export default function TipoPensionFormModal({
  isOpen,
  onClose,
  tipoPension,
  onSubmit,
  setLoading
}) {
  const handleSubmit = async (values) => {
    const esEdicion = !!tipoPension;

    // Primero cerramos el modal
    onClose();
    
    // Mostrar diálogo de confirmación
    const confirmResult = await CustomSweetAlert.confirm({
      title: `¿Desea ${esEdicion ? "modificar" : "registrar"} el tipo de pensión?`,
      text: `Se ${esEdicion ? "modificará" : "agregará"} el tipo de pensión con los datos proporcionados`,
      confirmButtonText: esEdicion ? "Modificar" : "Agregar",
    });

    if (confirmResult.isConfirmed) {
      setLoading(true);
      const resultado = await onSubmit(values);
      setLoading(false);
      
      if (resultado.success) {
        formik.resetForm(); // Limpiamos el formulario después de un registro exitoso
        await CustomSweetAlert.success({
          title: "¡Éxito!",
          text: `El tipo de pensión se ha ${esEdicion ? "modificado" : "registrado"} correctamente`
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
      nombre: tipoPension?.nombre || "",
      duracionDias: tipoPension?.duracionDias || "",
      costo: tipoPension?.costo || ""
    },
    validationSchema: pensionYup,
    onSubmit: handleSubmit,
    enableReinitialize: true
  });

  return (
    <CustomDialog
      titulo={tipoPension ? "Modificar tipo de pensión" : "Agregar tipo de pensión"}
      isOpen={isOpen}
      handleClose={() => {
        onClose();
        formik.resetForm();
      }}
      isForm={true}
      onSubmit={formik.handleSubmit}
      textSubmit={tipoPension ? "Modificar" : "Agregar"}
      textCancel="Cancelar"
      maxWidth="sm"
      fullWidth
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
        <TextField
          fullWidth
          label="Nombre"
          name="nombre"
          value={formik.values.nombre}
          onChange={formik.handleChange}
          error={formik.touched.nombre && Boolean(formik.errors.nombre)}
          helperText={formik.touched.nombre && formik.errors.nombre}
        />

        <TextField
          fullWidth
          label="Duración (días)"
          name="duracionDias"
          type="number"
          value={formik.values.duracionDias}
          onChange={formik.handleChange}
          error={formik.touched.duracionDias && Boolean(formik.errors.duracionDias)}
          helperText={formik.touched.duracionDias && formik.errors.duracionDias}
        />

        <TextField
          fullWidth
          label="Costo"
          name="costo"
          type="number"
          value={formik.values.costo}
          onChange={formik.handleChange}
          error={formik.touched.costo && Boolean(formik.errors.costo)}
          helperText={formik.touched.costo && formik.errors.costo}
        />
      </Box>
    </CustomDialog>
  );
}