import React from 'react';
import { Box } from "@mui/material";
import CustomDialog from '../../../components/CustomDialog';
import CustomSweetAlert from '../../../components/CustomSweetAlert';
import CustomInputLabel from '../../../components/inputs/CustomInputLabel';
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
      title: ` ${esEdicion ? "Modificar" : "Registrar"} tipo de pensión`,
      text: `¿Está seguro que desea ${esEdicion ? "modificar" : "registrar"} el tipo de pensión?`,
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
          text: `Tipo de pensión ${esEdicion ? "modificado" : "agregado"} correctamente`
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
        <CustomInputLabel
          labelText="Nombre"
          value={formik.values.nombre}
          onChange={formik.handleChange}
          name="nombre"
          isObligatory={true}
          type="text"
          placeholder="Ejemplo: Pensión-RangoTiempo"
          isWrong={formik.touched.nombre && Boolean(formik.errors.nombre)}
          errorMessage={formik.touched.nombre && formik.errors.nombre}
        />

        <CustomInputLabel
          labelText="Duración (días)"
          value={formik.values.duracionDias}
          onChange={formik.handleChange}
          name="duracionDias"
          isObligatory={true}
          type="number"
          placeholder="30"
          isWrong={formik.touched.duracionDias && Boolean(formik.errors.duracionDias)}
          errorMessage={formik.touched.duracionDias && formik.errors.duracionDias}
        />

        <CustomInputLabel
          labelText="Costo ($ MXN)"
          value={formik.values.costo}
          onChange={formik.handleChange}
          name="costo"
          isObligatory={true}
          type="number"
          placeholder="150"
          isWrong={formik.touched.costo && Boolean(formik.errors.costo)}
          errorMessage={formik.touched.costo && formik.errors.costo}
        />
      </Box>
    </CustomDialog>
  );
}