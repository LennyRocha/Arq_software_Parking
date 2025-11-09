import React, { useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  IconButton,
  Switch,
  FormControl,
  InputLabel,
  OutlinedInput,
  MenuItem,
  Select,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import MainHeader from "../../../components/MainHeader";
import CustomDialog from "../../../components/CustomDialog";
import LoadingBackdrop from "../../../components/LoadingBackdrop";
import HeadingDescription from "../../../components/HeadingDescription";
import CustomTable from "../../../components/CustomTable";
import CustomSweetAlert from "../../../components/CustomSweetAlert";
import useDialogController from "../../../hooks/useDialogController";
import useTiposPension from "../hooks/useTiposPension";
import { useFormik } from "formik";
import pensionYup from "../../../models/yup/pensionYup";

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
  const [tipoPensionSeleccionado, setTipoPensionSeleccionado] = React.useState(null);

  const {
    tiposPension,
    loading,
    error,
    page,
    rowsPerPage,
    totalElements,
    ordenarPor,
    ordenDireccion,
    buscarTexto,
    setPage,
    setRowsPerPage,
    setOrdenarPor,
    setOrdenDireccion,
    setBuscarTexto,
    setLoading,
    cargarTiposPensionPaginados,
    crearTipoPension,
    actualizarTipoPension,
    actualizarEstadoTipoPension
  } = useTiposPension();

  // Cargar datos al montar el componente o cambiar parámetros
  useEffect(() => {
    setTimeout(() => {
      cargarTiposPensionPaginados();
    }, 500);
  }, [page, rowsPerPage, ordenarPor, ordenDireccion]);

  // Formik para el formulario
  const formik = useFormik({
    initialValues: {
      nombre: "",
      duracionDias: "",
      costo: ""
    },
    validationSchema: pensionYup,
    onSubmit: async (values) => {
      const esEdicion = !!tipoPensionSeleccionado;
      
      // Primero cerramos el modal
      closeDialog();
      
      // Mostrar diálogo de confirmación
      const confirmResult = await CustomSweetAlert.confirm({
        title: `¿Desea ${esEdicion ? "modificar" : "registrar"} el tipo de pensión?`,
        text: `Se ${esEdicion ? "modificará" : "agregará"} el tipo de pensión con los datos proporcionados`,
        confirmButtonText: esEdicion ? "Modificar" : "Agregar",
      });

      if (confirmResult.isConfirmed) {
        setLoading(true); // Mostrar loading
        const resultado = esEdicion
          ? await actualizarTipoPension(tipoPensionSeleccionado.id, values)
          : await crearTipoPension(values);
        setLoading(false); // Ocultar loading

        if (resultado.success) {
          await CustomSweetAlert.success({
            title: "¡Éxito!",
            text: `El tipo de pensión se ha ${esEdicion ? "modificado" : "registrado"} correctamente`
          });
          cargarTiposPensionPaginados();
        } else {
          await CustomSweetAlert.error({
            text: resultado.error
          });
        }
      } else {
        // Si cancela, volvemos a abrir el modal con los datos
        openDialog();
      }
    }
  });

  // Manejadores
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleBuscar = () => {
    setPage(0);
    setTimeout(() => {
      cargarTiposPensionPaginados();
    }, 500);
  };

  const handleLimpiarFiltros = () => {
    setBuscarTexto("");
    setOrdenarPor("id");
    setOrdenDireccion("desc");
    setPage(0);
  };

  const handleAbrirModal = (tipoPension = null) => {
    if (tipoPension) {
      setTipoPensionSeleccionado(tipoPension);
      formik.setValues({
        nombre: tipoPension.nombre,
        duracionDias: tipoPension.duracionDias,
        costo: tipoPension.costo
      });
    } else {
      setTipoPensionSeleccionado(null);
      formik.resetForm();
    }
    openDialog();
  };

  const handleChangeEstatus = async (id, estatus) => {
    const confirmResult = await CustomSweetAlert.confirm({
      title: `${estatus ? "Desactivar" : "Activar"} tipo de pensión`,
      text: `¿Está seguro que desea ${estatus ? "desactivar" : "activar"} este tipo de pensión?`,
    });

    if (confirmResult.isConfirmed) {
      setLoading(true); // Mostrar loading
      const resultado = await actualizarEstadoTipoPension(id);
      setLoading(false); // Ocultar loading
      
      if (resultado.success) {
        await CustomSweetAlert.success({
          title: "¡Éxito!",
          text: `El tipo de pensión se ha ${estatus ? "desactivado" : "activado"} correctamente`
        });
      } else {
        await CustomSweetAlert.error({
          text: resultado.error
        });
      }
    }
  };

  // Configuración de columnas para la tabla
  const columns = [
    { field: "nombre", label: "Nombre" },
    { 
      field: "duracionDias", 
      label: "Duración",
      render: (row) => `${row.duracionDias} días`
    },
    { 
      field: "costo", 
      label: "Costo",
      render: (row) => `$${row.costo}`
    },
    {
      field: "status",
      label: "Estatus",
      render: (row) => row.status ? "Activa" : "Inactiva"
    },
    {
      field: "opciones",
      label: "Opciones",
      align: "center",
      render: (row) => (
        <>
          <Button
            startIcon={<EditIcon />}
            onClick={() => handleAbrirModal(row)}
            color="secondary"
            size="small"
            sx={{ mr: 1 }}
          >
            Editar
          </Button>
          <Switch
            checked={row.status}
            onChange={() => handleChangeEstatus(row.id, row.status)}
            color="primary"
          />
        </>
      )
    }
  ];

  return (
    <>
      <LoadingBackdrop isOpen={loading} onClose={() => {}} />
      <MainHeader titulo="TIPOS DE PENSIÓN" breads={links} />

      <Box sx={{ padding: { xs: 2, sm: 3, md: 4 }, paddingTop: { xs: 3, sm: 4, md: 6 }, maxWidth: "1200px", margin: "0 auto" }}>
        <HeadingDescription
          title="GESTIÓN DE TIPOS DE PENSIÓN"
          description="Los tipos de pensión son las opciones de contratación que aparecen para convertirse en usuario pensionado."
        />

        {/* Controles de búsqueda y filtros */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 3,
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", flex: 1 }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Ordenar por</InputLabel>
              <Select
                value={ordenarPor}
                label="Ordenar por"
                onChange={(e) => setOrdenarPor(e.target.value)}
              >
                <MenuItem value="id">ID</MenuItem>
                <MenuItem value="nombre">Nombre</MenuItem>
                <MenuItem value="duracionDias">Duración</MenuItem>
                <MenuItem value="costo">Costo</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Dirección</InputLabel>
              <Select
                value={ordenDireccion}
                label="Dirección"
                onChange={(e) => setOrdenDireccion(e.target.value)}
              >
                <MenuItem value="asc">Ascendente</MenuItem>
                <MenuItem value="desc">Descendente</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Buscar</InputLabel>
              <OutlinedInput
                label="Buscar"
                value={buscarTexto}
                onChange={(e) => setBuscarTexto(e.target.value)}
              />
            </FormControl>

            <Button variant="outlined" onClick={handleBuscar}>
              BUSCAR
            </Button>
            <Button variant="outlined" onClick={handleLimpiarFiltros}>
              LIMPIAR FILTROS
            </Button>
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={() => handleAbrirModal()}
            sx={{ minWidth: 150 }}
          >
            + AGREGAR NUEVO
          </Button>
        </Box>

        {/* Tabla */}
        <CustomTable
          columns={columns}
          data={tiposPension}
          page={page}
          rowsPerPage={rowsPerPage}
          totalElements={totalElements}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          loading={loading}
          error={error}
          emptyMessage="No hay tipos de pensión disponibles"
        />
      </Box>

      {/* Modal para crear/editar */}
      <CustomDialog
        titulo={tipoPensionSeleccionado ? "Modificar tipo de pensión" : "Agregar tipo de pensión"}
        isOpen={open}
        handleClose={() => {
          closeDialog();
          formik.resetForm();
        }}
        isForm={true}
        onSubmit={formik.handleSubmit}
        textSubmit={tipoPensionSeleccionado ? "Modificar" : "Agregar"}
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
    </>
  );
}
