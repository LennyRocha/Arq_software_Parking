import {
  Box,
  Button,
  Card,
  Switch,
  Typography,
  TextField,
  FormGroup,
  FormControlLabel,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import React from "react";
import moto from "../../../img/moto_view_small.png";
import coche from "../../../img/coche_view_small.png";
import camioneta from "../../../img/camioneta_view_small.png";
import useDeleteVehiculos from "../hooks/useDeleteVehiculos";
import usePutVehiculos from "../hooks/usePutVehiculos";
import useDialogController from "../../../hooks/useDialogController";
import CustomDialog from "../../../components/CustomDialog";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useUserIdByEmail from "../../../hooks/getIdByEmail";

export default function VehiculoCard({ vehic, types, getVehiculos, current }) {
  if (current) console.log(current);
  const {
    open: isDetailsOpen,
    openDialog: openDetails,
    closeDialog: closeDetails,
  } = useDialogController();
  const {
    open: isPutOpen,
    openDialog: openPut,
    closeDialog: closePut,
  } = useDialogController();

  const [userId, setUserId] = React.useState(null);

  const { id, loading, error } = useUserIdByEmail();

  React.useEffect(() => {
    if (id) {
      setUserId(id);
    }
  }, [id]);

  const vehiculos = {
    1: coche,
    2: camioneta,
    3: moto,
  };
  const [isSwitchOn, setIsSwitchOn] = React.useState(vehic.estatus);
  const { isLoading, errorData, preSubmit } = useDeleteVehiculos(
    getVehiculos,
    vehic
  );
  const toggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
  };
  return (
    <Card style={{ backgroundColor: "var(--card)" }}>
      <Box sx={{ padding: "10px" }}>
        <img
          src={vehiculos[vehic.idTipoVehiculo]}
          alt={vehic.modelo}
          style={{ aspectRatio: 4 / 3, width: "75%" }}
        />
        <Typography
          variant="subtitle1"
          style={{ textAlign: "left", fontWeight: "bold" }}
        >
          {vehic.modelo}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="body1"
            color={vehic.placa ? "secondary" : "error"}
          >
            {vehic.placa ? vehic.placa : "Sin placa"}
          </Typography>
          <Switch
            disabled={current.vehiculo && current.vehiculo.id === vehic.id}
            checked={isSwitchOn}
            onChange={async () => {
              await preSubmit(toggleSwitch);
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              flex: 1,
            }}
            style={{ textAlign: "left" }}
          >
            {vehic.estatus ? "Activo" : "Inactivo"}{" "}
            {current.vehiculo && current.vehiculo.id === vehic.id && "| En uso"}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          sx={{
            flex: 1,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            borderTopLeftRadius: 0,
          }}
          variant="contained"
          color="secondary"
          onClick={openDetails}
        >
          Ver más
        </Button>
        <Button
          sx={{
            flex: 1,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
          variant="contained"
          color="blueBack"
          onClick={openPut}
        >
          Editar
        </Button>
      </Box>
      <ModalDetalles
        open={isDetailsOpen}
        closeDialog={closeDetails}
        vehiculo={vehic}
        types={types}
        current={current}
      />
      <ModalEditar
        open={isPutOpen}
        closeDialog={closePut}
        vehiculo={vehic}
        getVehiculos={getVehiculos}
        idUser={userId}
      />
    </Card>
  );
}

function ModalDetalles({ open, closeDialog, vehiculo, types, current }) {
  const vehiculos = {
    1: coche,
    2: camioneta,
    3: moto,
  };
  return (
    <CustomDialog
      isOpen={open}
      handleClose={closeDialog}
      showCancel={false}
      textConfirm="Cerrar"
      titulo={"Detalles del vehículo"}
      fullWidth
      maxWidth="sm"
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 1,
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          <img
            src={vehiculos[vehiculo.idTipoVehiculo]}
            alt={vehiculo.modelo}
            style={{ aspectRatio: 4 / 3, width: "100%" }}
          />
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          <ListItem>
            <ListItemText primary="Modelo" secondary={vehiculo.modelo} />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Placa"
              secondary={vehiculo.placa ? vehiculo.placa : "Sin placa"}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Descripción"
              secondary={vehiculo.descripcion}
            />
          </ListItem>
        </Box>
      </Box>
      <Divider />
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 1,
        }}
      >
        <ListItem sx={{ flex: 1 }}>
          <ListItemText
            primary="En uso"
            secondary={
              current.vehiculo && current.vehiculo.id === vehic.id ? "Si" : "No"
            }
          />
        </ListItem>
        <ListItem sx={{ flex: 1 }}>
          <ListItemText
            primary="Estado"
            secondary={vehiculo.estatus ? "Activo" : "Inactivo"}
          />
        </ListItem>
      </Box>
      <Divider />
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 1,
        }}
      >
        <ListItem sx={{ flex: 1 }}>
          <ListItemText
            primary="Tipo de vehículo"
            secondary={types[vehiculo.idTipoVehiculo - 1].nombre}
          />
        </ListItem>
        <ListItem sx={{ flex: 1, display: { xs: "none", md: "flex" } }}>
          <ListItemText primary="" secondary={""} />
        </ListItem>
      </Box>
    </CustomDialog>
  );
}

function ModalEditar({ open, closeDialog, vehiculo, getVehiculos, idUser }) {
  const { isLoading, errorData, preSubmit, defaultValues, vehicleYup } =
    usePutVehiculos(getVehiculos, vehiculo, idUser);
  const {
    control,
    handleSubmit,
    reset,
    resetField,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    defaultValues,
    resolver: yupResolver(vehicleYup),
    mode: "onChange",
    reValidateMode: "onChange",
  });
  function closeAndReset() {
    closeDialog();
    reset();
  }
  const [hasPlaca, setHasPlaca] = React.useState(vehiculo.placa);
  return (
    <CustomDialog
      isOpen={open}
      handleClose={closeAndReset}
      isForm
      titulo={"Modificar vehículo"}
      onSubmit={handleSubmit((data) => preSubmit(data, closeDialog))}
      textSubmit="Actualizar"
      textCancel="Cancelar"
      isLoading={isLoading}
      valid={isValid}
      onCancel={closeAndReset}
    >
      <Box sx={{ height: 1 }}></Box>
      <Controller
        control={control}
        name="modelo"
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <>
            <TextField
              id="modelo_input"
              label="Modelo del vehículo"
              variant="outlined"
              error={!!errors.modelo}
              helperText={errors?.modelo?.message}
              value={value}
              onChange={onChange}
              placeholder="Ingresa el modelo del vehículo para actualizarlo"
            />
            <Typography
              variant="body2"
              color="gray"
              sx={{ width: "100%", textAlign: "right" }}
            >
              {value.length}/50
            </Typography>
          </>
        )}
      />
      <Controller
        control={control}
        name="placa"
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <>
            <TextField
              id="placa_input"
              label="Placa del vehículo"
              variant="outlined"
              error={!!errors.placa}
              helperText={errors?.placa?.message}
              value={value}
              onChange={onChange}
              placeholder="Ingresa la placa del vehículo si es que tiene una"
              disabled={!hasPlaca}
            />
            <Typography
              variant="body2"
              color="gray"
              sx={{ width: "100%", textAlign: "right" }}
            >
              {value?.length ?? 0}/7
            </Typography>

            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={!hasPlaca}
                    onChange={() => {
                      !hasPlaca ? resetField("placa") : setValue("placa", "");
                      setHasPlaca(!hasPlaca);
                    }}
                  />
                }
                label="No tiene placa"
              />
            </FormGroup>
          </>
        )}
      />
      <Controller
        control={control}
        name="desc"
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <>
            <TextField
              id="desc_input"
              label="Descripción del vehículo"
              variant="outlined"
              error={!!errors.desc}
              helperText={errors?.desc?.message}
              value={value}
              multiline
              rows={4}
              onChange={onChange}
              placeholder="Ingresa la descripción del vehículo para actualizarla"
            />
            <Typography
              variant="body2"
              color="gray"
              sx={{ width: "100%", textAlign: "right" }}
            >
              {value.length}/250
            </Typography>
          </>
        )}
      />
    </CustomDialog>
  );
}
