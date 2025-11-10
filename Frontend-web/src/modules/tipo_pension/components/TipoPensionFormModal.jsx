import React from 'react';
import { Box, TextField } from "@mui/material";
import CustomDialog from "../../../../components/CustomDialog";
import { useFormik } from "formik";
import pensionYup from "../../../../models/yup/pensionYup";

export default function TipoPensionFormModal({
  isOpen,
  onClose,
  tipoPension,
  onSubmit,
}) {
  const formik = useFormik({
    initialValues: {
      nombre: tipoPension?.nombre || "",
      duracionDias: tipoPension?.duracionDias || "",
      costo: tipoPension?.costo || ""
    },
    validationSchema: pensionYup,
    onSubmit,
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