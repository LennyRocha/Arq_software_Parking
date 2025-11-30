import React, { useEffect } from "react";
import { Box, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MainHeader from "../../../components/MainHeader";
import LoadingBackdrop from "../../../components/LoadingBackdrop";
import HeadingDescription from "../../../components/HeadingDescription";
import CustomTable from "../../../components/CustomTable";
import TableFilters from "../../../components/TableFilters";
import useDialogController from "../../../hooks/useDialogController";
import useUsuarios from "../hooks/useUsuarios";
import UsuarioFormModal from "../components/UsuarioFormModal";
import CustomSweetAlert from "../../../components/CustomSweetAlert";
import LockResetIcon from '@mui/icons-material/LockReset';
import { usuarioColumns, orderOptions, tipoUsuarioOptions } from "../config/tableColumns.jsx";

const links = [
  { nombre: "Usuarios", ruta: "/admin/gestion_usuarios", disabled: false },
  { nombre: "Consulta", ruta: "/admin/gestion_usuarios", disabled: true },
];

export default function GestionUsuarios() {
  const navigate = useNavigate();
  const { open, openDialog, closeDialog } = useDialogController();
  const [usuarioSeleccionado, setUsuarioSeleccionado] = React.useState(null);

  const {
    usuarios,
    loading,
    error,
    page,
    rowsPerPage,
    totalElements,
    ordenarPor,
    ordenDireccion,
    buscarTexto,
    tipoUsuarioFiltro,
    setPage,
    setRowsPerPage,
    setOrdenarPor,
    setOrdenDireccion,
    setBuscarTexto,
    setTipoUsuarioFiltro,
    setLoading,
    cargarUsuariosPaginados,
    actualizarUsuario,
    actualizarEstadoUsuario,
    restablecerContrasenaUsuario,
    limpiarFiltros
  } = useUsuarios();

  useEffect(() => {
    cargarUsuariosPaginados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, ordenarPor, ordenDireccion, tipoUsuarioFiltro]);

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
      cargarUsuariosPaginados();
    }, 500);
  };

  const handleLimpiarFiltros = () => {
    limpiarFiltros();
  };

  const handleAbrirModalEditar = (usuario) => {
    setUsuarioSeleccionado(usuario);
    openDialog();
  };

  const handleRestablecerContrasena = async (usuario) => {
    const confirmResult = await CustomSweetAlert.confirm({
      title: "¿Restablecer contraseña?",
      text: `La contraseña de ${usuario.nombre} ${usuario.apellidos} será restablecida a: ${usuario.apellidos}123`,
      icon: LockResetIcon,
    });

    if (confirmResult.isConfirmed) {
      setLoading(true);
      const resultado = await restablecerContrasenaUsuario(usuario.id);
      setLoading(false);

      if (resultado.success) {
        await CustomSweetAlert.success({
          title: "¡Éxito!",
          text: "Contraseña restablecida exitosamente. El usuario recibirá un correo con su nueva contraseña."
        });
      } else {
        await CustomSweetAlert.error({
          text: resultado.error
        });
      }
    }
  };

  const handleNuevoUsuarioPensionado = () => {
    navigate("/admin/usuarios/registrar");
  };

  const handleNuevoEmpleado = () => {
    navigate("/admin/usuarios/registrar-empleado");
  };

  const getEmptyMessage = () => {
    const textoLimpio = typeof buscarTexto === 'string' ? buscarTexto.trim() : '';
    if (textoLimpio !== "" || tipoUsuarioFiltro !== "" || ordenarPor !== "id" || ordenDireccion !== "desc") {
      return "No se encontraron usuarios con tu búsqueda";
    }
    return "No hay usuarios registrados";
  };

  return (
    <>
      <LoadingBackdrop isOpen={loading} onClose={() => {}} />
      <MainHeader titulo="GESTIÓN DE USUARIOS" breads={links} />

      <Box sx={{ padding: { xs: 2, sm: 3, md: 4 }, paddingTop: { xs: 3, sm: 4, md: 6 }, maxWidth: "1200px", margin: "0 auto" }}>
        <HeadingDescription
          title="CONSULTA DE USUARIOS"
          description="Gestiona los usuarios pensionados y empleados registrados en el sistema."
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, gap: 2, flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleNuevoUsuarioPensionado}
              sx={{ minWidth: 180 }}
            >
              + REGISTRAR PENSIONADO
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNuevoEmpleado}
              sx={{ minWidth: 150 }}
            >
              + REGISTRAR EMPLEADO
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap", alignItems: "center" }}>
          <TableFilters
            orderOptions={orderOptions}
            orderBy={ordenarPor}
            orderDirection={ordenDireccion}
            searchPlaceholder={"Nombre, apellidos o correo"}
            searchText={buscarTexto}
            onOrderByChange={setOrdenarPor}
            onOrderDirectionChange={setOrdenDireccion}
            onSearchChange={setBuscarTexto}
            onSearch={handleBuscar}
            onClearFilters={handleLimpiarFiltros}
          />

          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Tipo de usuario</InputLabel>
            <Select
              value={tipoUsuarioFiltro}
              label="Tipo de usuario"
              onChange={(e) => {
                setTipoUsuarioFiltro(e.target.value);
                setPage(0);
              }}
            >
              {tipoUsuarioOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <CustomTable
          columns={usuarioColumns({
            onEdit: handleAbrirModalEditar,
            onChangeStatus: actualizarEstadoUsuario,
            onRestablecerContrasena: handleRestablecerContrasena,
            setLoading: setLoading
          })}
          data={usuarios}
          page={page}
          rowsPerPage={rowsPerPage}
          totalElements={totalElements}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          loading={loading}
          error={error}
          emptyMessage={getEmptyMessage()}
        />
      </Box>

      <UsuarioFormModal
        isOpen={open}
        onClose={closeDialog}
        usuario={usuarioSeleccionado}
        setLoading={setLoading}
        onSubmit={async (values) => {
          const resultado = await actualizarUsuario(usuarioSeleccionado.id, values);

          if (resultado.success) {
            cargarUsuariosPaginados();
          }
          return resultado;
        }}
      />
    </>
  );
}
