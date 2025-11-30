import LoadingBackdrop from "../../../components/LoadingBackdrop";
import MainHeader from "../../../components/MainHeader";
import HeadingDescription from "../../../components/HeadingDescription";
import {
  Box,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Switch,
  Typography,
  ButtonGroup,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Add } from "@mui/icons-material";
import Icon from "@mdi/react";
import { mdiCarKey } from "@mdi/js";
import { mdiCarHatchback, mdiCarPickup, mdiMotorbike } from "@mdi/js";
import EditIcon from "@mui/icons-material/Edit";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import useGetCajones from "../hooks/useGetCajones";
import useDeleteCajon from "../hooks/useDeleteCajon";
import usePutCajones from "../hooks/usePutCajones";
import useDialogController from "../../../hooks/useDialogController";
import useTiposVehiculos from "../../vehiculo/hooks/useTiposVehiculos";
import CustomDialog from "../../../components/CustomDialog";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useReservarCajones from "../hooks/useReservarCajones";
import useCountCajones from "../hooks/useCountCajones";

export default function CajonesTabla() {
  const {
    data:countData,
    isLoading: loadingCount,
    errorData: errorCount,
    restartCall: callCount,
  } = useCountCajones();
  const [reservedList, setReservedList] = React.useState([]);
  const navigate = useNavigate();
  const {
    data,
    isLoading,
    errorData,
    restartCall,
    restoreValues,
    query,
    setQuery,
    sort,
    setSort,
    page,
    setPage,
    size,
    setSize,
  } = useGetCajones();
  const {
    isLoading: loadingPut,
    errorData: errorPut,
    preSubmit,
  } = useDeleteCajon(restartCall);
  const cambiarPagina = (event, newPage) => {
    setPage(newPage);
    restartCall();
  };
  const cambiarSize = (event) => {
    setSize(parseInt(event.target.value, 10));
    setPage(0);
    restartCall();
  };
  const [currentCajon, setCurrentCajon] = React.useState({});
  const ReturnIcon = ({ id }) => {
    switch (id) {
      case 1:
        return <Icon path={mdiCarHatchback} size={2} color="var(--other)" />;
      case 2:
        return <Icon path={mdiCarPickup} size={2} color="var(--other)" />;
      case 3:
        return <Icon path={mdiMotorbike} size={2} color="var(--other)" />;
    }
  };
  const [switchStates, setSwitchStates] = React.useState([]);
  React.useEffect(() => {
    if (data) setSwitchStates(data?.data.elementos.map((row) => row.estatus));
  }, [data]);

  const toggleSwitch = (index) => {
    setSwitchStates((prev) => prev.map((s, i) => (i === index ? !s : s)));
  };

  const { data: list, error: errorTipos, load } = useTiposVehiculos();

  const {
    open: isSetOpen,
    openDialog: openSet,
    closeDialog: closeSet,
  } = useDialogController();
  const {
    open: isPutOpen,
    openDialog: openPut,
    closeDialog: closePut,
  } = useDialogController();
  const {
    open: isGetOpen,
    openDialog: openGet,
    closeDialog: closeGet,
  } = useDialogController();

  return (
    <Box sx={{ flex: 1, overflow: "auto" }}>
      <LoadingBackdrop isOpen={isLoading || load || loadingCount} />
      <MainHeader
        titulo="Cajones"
        breads={[
          {
            nombre: "Inicio",
            ruta: "/admin",
            disabled: false,
          },
          {
            nombre: "Gestion de cajones",
            ruta: "/admin/cajones",
            disabled: true,
          },
          {
            nombre: "Estacionamiento",
            ruta: "/admin/estacionamiento",
            disabled: false,
          },
        ]}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: "25px",
          gap: 2,
        }}
      >
        <HeadingDescription
          title={isLoading ? "Cargando información..." : "GESTIÓN DE CAJONES"}
          description={
            isLoading
              ? "Por favor espera mientras verificamos tu información..."
              : "Desde este menú puedes administrar los cajones disponibles en el estacionamiento."
          }
        />
        {data && (
          <>
            {/*Campos de filtros */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", lg: "row", width: "100%" },
                gap: 1,
                boxSizing: "border-box",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", lg: "row", width: "100%" },
                  flex: 1,
                  gap: 1,
                  height: "40px",
                }}
              >
                <FormControl size="small" sx={{ flex: 1 }}>
                  <InputLabel>Ordenar por:</InputLabel>
                  <Select
                    value={sort}
                    label="Criterio de filtrado"
                    onChange={(e) => {
                      setSort(e.target.value);
                      restartCall();
                    }}
                    sx={{
                      "& .MuiSelect-select": {
                        textAlign: "left",
                      },
                    }}
                  >
                    <MenuItem value={""}>Sin filtros</MenuItem>
                    <MenuItem value={"name"}>Identificador</MenuItem>
                    <MenuItem value={"ubicacion"}>Ubicación</MenuItem>
                    <MenuItem value={"piso"}>Por piso</MenuItem>
                    <MenuItem value={"paraPensionados"}>
                      Exclusivos primero
                    </MenuItem>
                    <MenuItem value={"tipoVehiculo"}>Tipo de vehiuclo</MenuItem>
                  </Select>
                </FormControl>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    flex: { xs: 1, md: 2 },
                    gap: 1,
                  }}
                >
                  <FilterAltIcon color="gray" />
                  <TextField
                    label={"Buscar por"}
                    placeholder="Identificador o ubicación"
                    variant="outlined"
                    size="small"
                    sx={{ flex: 1 }}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                  height: "40px",
                }}
              >
                <Button
                  size="small"
                  variant="outlined"
                  sx={{ flex: { xs: 1, lg: 0 } }}
                  onClick={restartCall}
                >
                  Buscar
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  sx={{ flex: { xs: 1, lg: 1 } }}
                  onClick={restoreValues}
                >
                  Limpiar filtros
                </Button>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                  height: "40px",
                }}
              >
                <Button
                  size="large"
                  variant="outlined"
                  startIcon={<Icon path={mdiCarKey} size={1} />}
                  color="secondary"
                  sx={{ width: { xs: "50%", md: "120px" } }}
                  onClick={openSet}
                >
                  Reservar
                </Button>
                <Button
                  onClick={() => navigate("/admin/nuevo_cajon")}
                  size="large"
                  variant="contained"
                  sx={{ width: { xs: "50%", md: "auto" } }}
                  startIcon={<Add />}
                >
                  Nuevo
                </Button>
              </Box>
            </Box>
            {/*Campos de filtros */}
            <TableContainer
              component={Paper}
              elevation={3}
              sx={{ scrollbarWidth: "none" }}
            >
              <Table sx={{ minWidth: 650, scrollbarWidth: "none" }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "var(--background)" }}>
                    <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Identificador
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Ubicación</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Tipo de vehículo
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Exclusivo</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Piso</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Estatus</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography>Cargando cajones...</Typography>
                      </TableCell>
                    </TableRow>
                  ) : errorData ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography color="error">{errorData.texto}</Typography>
                      </TableCell>
                    </TableRow>
                  ) : !data || data.data.elementos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography>No hay cajones disponibles</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.data.elementos.map((row, index) => (
                      <TableRow
                        key={row.id || index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          "&:hover": { backgroundColor: "var(--background)" },
                        }}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell sx={{ maxWidth: 200, overflow: "hidden" }}>
                          <Typography
                            variant="body2"
                            sx={{ textWrap: "wrap", lineBreak: "anywhere" }}
                          >
                            {row.ubicacion}
                          </Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <ReturnIcon id={row.tipoVehiculo.id} />
                        </TableCell>
                        <TableCell
                          sx={
                            row.paraPensionados && { color: "var(--primary)" }
                          }
                        >
                          {row.paraPensionados ? "Si" : "No"}
                        </TableCell>
                        <TableCell>{row.piso}</TableCell>
                        <TableCell
                          sx={{
                            color: row.estatus
                              ? "var(--success)"
                              : "var(--error)",
                          }}
                        >
                          {row.estatus ? "Activo" : "Inactivo"}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            onClick={() => {
                              setCurrentCajon(row);
                              openPut();
                            }}
                            color="secondary"
                            size="small"
                            aria-label="editar"
                          >
                            <EditIcon />
                          </IconButton>
                          <Switch
                            onChange={() =>
                              preSubmit(() => toggleSwitch(index), row)
                            }
                            checked={switchStates[index]}
                            color="primary"
                            sx={{ ml: 1 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Paginación */}
              <TablePagination
                sx={{ scrollbarWidth: "none" }}
                component="div"
                count={data.data.totalElementos}
                page={page}
                onPageChange={cambiarPagina}
                rowsPerPage={size}
                onRowsPerPageChange={cambiarSize}
                rowsPerPageOptions={[5, 10, 25]}
                labelRowsPerPage="Resultados por página:"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} de ${
                    count !== -1 ? count : `más de ${to}`
                  } elementos`
                }
              />
            </TableContainer>
          </>
        )}
      </Box>
      <ModalEditar
        open={isPutOpen}
        closeDialog={closePut}
        cajon={currentCajon}
        restart={restartCall}
        setCajon={setCurrentCajon}
        list={list}
      />

      <ModalReservar
        open={isSetOpen}
        closeDialog={closeSet}
        count={countData ? countData.data : 0 }
        setList={setReservedList}
        openGet={openGet}
        restart={restartCall}
      />

      <ModalLista
        open={isGetOpen}
        closeDialog={closeGet}
        list={reservedList}
        setList={setReservedList}
      />
    </Box>
  );
}

function ModalEditar({ open, closeDialog, cajon, restart, setCajon, list }) {
  const { isLoading, errorData, preSubmit, defaultValues, cajonYup } =
    usePutCajones(restart, cajon);
  const {
    control,
    handleSubmit,
    reset,
    resetField,
    setValue,
    trigger,
    formState: { errors, isValid, isDirty },
  } = useForm({
    defaultValues,
    resolver: yupResolver(cajonYup),
    mode: "onChange",
    reValidateMode: "onChange",
  });
  function closeAndReset() {
    closeDialog();
    reset();
    setCajon({});
  }
  function closeAndShow() {
    closeDialog();
    setCajon({});
  }
  const [typeIndex, setTypeIndex] = React.useState(0);
  React.useEffect(() => {
    if (list) {
      setValue("tipoVehiculo", list[typeIndex]);
    }
  }, [list, typeIndex]);
  React.useEffect(() => {
    if (cajon && Object.keys(cajon).length > 0) {
      reset({
        name: cajon.name ?? "",
        tipoVehiculo: cajon.tipoVehiculo ?? list?.[0] ?? null,
        ubicacion: cajon.ubicacion ?? "",
        disponible: cajon.disponible ?? true,
        paraPensionados: cajon.paraPensionados ?? false,
        piso: cajon.piso ?? 1,
        estatus: cajon.estatus ?? true,
      });
      setTypeIndex(
        list?.findIndex((v) => v.id === cajon.tipoVehiculo?.id) ?? 0
      );
      trigger;
    }
  }, [cajon, list]);
  return (
    <CustomDialog
      isOpen={open}
      handleClose={closeAndReset}
      isForm
      titulo={"Modificar cajón"}
      onSubmit={handleSubmit((data) => preSubmit(data, closeAndShow))}
      textSubmit="Actualizar"
      textCancel="Cancelar"
      isLoading={isLoading}
      valid={isValid && isDirty}
      onCancel={closeAndReset}
    >
      <Box sx={{ height: "1px" }}></Box>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <>
            <TextField
              id="identifier_input"
              label="Identificador del cajón"
              variant="outlined"
              error={!!errors.name}
              helperText={errors?.name?.message}
              value={value}
              onChange={onChange}
              placeholder="Combinación de números y letras ej, 'AAA201'"
              disabled={isLoading}
            />
            <Typography
              variant="body2"
              color="gray"
              sx={{ width: "100%", textAlign: "right" }}
            >
              {(value ?? "0").length}/5
            </Typography>
          </>
        )}
      />
      <Controller
        control={control}
        name="ubicacion"
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <>
            <TextField
              id="ubic_input"
              label="Ubicación del cajón"
              variant="outlined"
              error={!!errors.ubicacion}
              helperText={errors?.ubicacion?.message}
              value={value}
              multiline
              rows={4}
              onChange={onChange}
              disabled={isLoading}
              placeholder="Descirpción breve de dónde se encuentra"
            />
            <Typography
              variant="body2"
              color="gray"
              sx={{ width: "100%", textAlign: "right" }}
            >
              {(value ?? "0").length}/100
            </Typography>
          </>
        )}
      />
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box sx={{ flex: 1, width: { xs: "100%", md: "100%" } }}>
          <Typography color="gray" variant="body2" sx={{ textAlign: "left" }}>
            Tipo de vehículo
          </Typography>
          <ButtonGroup
            variant="contained"
            color="tertiary"
            sx={{ flex: 1, width: "100%" }}
          >
            <Button
              variant={typeIndex === 0 ? "contained" : "outlined"}
              sx={{ flex: 1 }}
              onClick={() => setTypeIndex(0)}
            >
              Coche
            </Button>
            <Button
              variant={typeIndex === 1 ? "contained" : "outlined"}
              sx={{ flex: 1 }}
              onClick={() => setTypeIndex(1)}
            >
              Camioneta
            </Button>
            <Button
              variant={typeIndex === 2 ? "contained" : "outlined"}
              sx={{ flex: 1 }}
              onClick={() => setTypeIndex(2)}
            >
              Moto
            </Button>
          </ButtonGroup>
        </Box>
        <Box sx={{ flex: 1, width: { xs: "100%", md: "100%" } }}>
          <Controller
            control={control}
            name="piso"
            defaultValue={1}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="number"
                label="Piso"
                size="small"
                fullWidth
                inputProps={{ min: 1, max: 3 }}
                defaultValue={field.value}
                onChange={(value) => field.onChange(value)}
                onBlur={field.onBlur}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                disabled={isLoading}
              />
            )}
          />
        </Box>
      </Box>
    </CustomDialog>
  );
}

function ModalReservar({
  count,
  open,
  closeDialog,
  setList,
  openGet,
  restart,
}) {
  const {
    isLoading,
    errorData,
    onSubmit,
    returnedList,
    conteoYup,
    defaultValues,
  } = useReservarCajones(restart, openGet, closeDialog);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm({
    defaultValues,
    resolver: yupResolver(conteoYup),
    mode: "onChange",
    reValidateMode: "onChange",
  });
  React.useEffect(() => {
    setList(returnedList);
  }, [returnedList]);
  function closeAndClear() {
    reset();
    closeDialog();
  }
  return (
    <CustomDialog
      isOpen={open}
      handleClose={closeAndClear}
      isForm
      titulo={"Reservar cajones"}
      onSubmit={handleSubmit(onSubmit)}
      textSubmit="Guardar"
      textCancel="Cancelar"
      isLoading={isLoading}
      onCancel={closeAndClear}
      valid={isValid && isDirty}
    >
      <Typography variant="subtitle1">
        Reserva un cierto número de cajones para su uso exclusivo de usuarios
        pensionados. Los cajones se seleccionaran al azar.
      </Typography>
      <Controller
        control={control}
        name="conteo"
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            type="number"
            label="Cajones a reservar"
            size="small"
            fullWidth
            inputProps={{ min: 0, max: count }}
            error={!!fieldState.error || field.value > count}
            helperText={
              fieldState.error?.message ||
              (field.value > count
                ? "No puedes elegir un valor mayor al total"
                : "Límite: todos los cajones no exclusivos")
            }
            disabled={isLoading}
          />
        )}
      />
    </CustomDialog>
  );
}

function ModalLista({ list, open, closeDialog, setList }) {
  function closeAndClear() {
    setList([]);
    closeDialog();
  }
  return (
    <CustomDialog
      isOpen={open}
      handleClose={closeAndClear}
      titulo={"Cajones reservados"}
      showCancel={false}
      textConfirm="Cerrar"
      onConfirm={closeAndClear}
    >
      {list.map((c, index) => (
        <Box key={index}>
          <Typography variant="body1">{c.name}</Typography>
          <Typography variant="subtitle2" color="gray">
            {c.ubicacion}
          </Typography>
        </Box>
      ))}
    </CustomDialog>
  );
}
