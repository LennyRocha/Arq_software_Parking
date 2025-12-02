import React from "react";
import MainHeader from "../../../components/MainHeader";
import LoadingBackdrop from "../../../components/LoadingBackdrop";
import {
  Box,
  Typography,
  TextField,
  ButtonGroup,
  Button,
  CircularProgress,
} from "@mui/material";
import useTiposVehiculos from "../../vehiculo/hooks/useTiposVehiculos";
import usePostCajones from "../hooks/usePostCajones";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import cajonYup from "../../../models/yup/cajonYup";
import moto from "../../../img/moto_view_small.png";
import coche from "../../../img/coche_view_small.png";
import camioneta from "../../../img/camioneta_view_small.png";
import NumberField from "../../../components/NumberField";
import Cajon from "../../../models/Cajon";
import CajonItem from "../components/CajonItem";

export default function NuevoCajon() {
  const { data: list, error: errorTipos, load } = useTiposVehiculos();
  const [typeIndex, setTypeIndex] = React.useState(0);
  const {
    isLoading,
    errorData,
    onSubmit,
    defaultValues,
    addCajon,
    cajones,
    removeCajon,
  } = usePostCajones();
  const {
    control,
    handleSubmit,
    reset,
    resetField,
    trigger,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    defaultValues,
    resolver: yupResolver(cajonYup),
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const vehiculos = {
    0: coche,
    1: camioneta,
    2: moto,
  };
  React.useEffect(() => {
    if (list) {
      setValue("tipoVehiculo", list[typeIndex]);
    }
  }, [list, typeIndex]);

  return (
    <Box sx={{ flex: 1, overflow: "auto" }}>
      <LoadingBackdrop isOpen={load} />
      <MainHeader
        titulo="Nuevo cajón"
        breads={[
          {
            nombre: "Inicio",
            ruta: "/admin",
            disabled: false,
          },
          {
            nombre: "Gestion de cajones",
            ruta: "/admin/cajones",
            disabled: false,
          },
          {
            nombre: "Nuevo",
            ruta: "/admin/estacionamiento",
            disabled: true,
          },
        ]}
      />
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: { xs: "column", lg: "row", width: "100%" },
          padding: "25px",
          gap: 2,
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            display: "flex",
            flexDirection: { xs: "column", md: "column" },
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: { xs: "column-reverse", md: "column" },
              gap: 2,
            }}
          >
            <div>
              <Typography
                color="gray"
                variant="body2"
                sx={{ textAlign: "left" }}
              >
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
            </div>

            <img
              src={vehiculos[typeIndex]}
              alt="vehiculo_seleccionado"
              style={{ aspectRatio: 16 / 9, width: "80%", margin: "0 auto" }}
            />
          </Box>
          {cajones.length !== 0 &&
            cajones.map((c, index) => (
              <CajonItem
                key={index}
                cajon={c}
                index={index}
                remove={removeCajon}
              />
            ))}
        </Box>
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
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
                  {value.length}/5
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
                  {value.length}/100
                </Typography>
              </>
            )}
          />
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
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              onClick={async () => {
                const ok = await addCajon(getValues(), list[typeIndex]);
                if (ok) {
                  reset();
                }
              }}
              disabled={!isValid}
            >
              Agregar otro
            </Button>
            {isLoading ? (
              <CircularProgress />
            ) : (
              <Button
                variant="contained"
                onClick={async () => {
                  const actual = getValues();
                  const tipo = list[typeIndex];

                  let cajonesAEnviar = [];

                  const cajonActual = new Cajon({
                    name: actual.name,
                    tipoVehiculo: tipo,
                    ubicacion: actual.ubicacion,
                    disponible: actual.disponible,
                    paraPensionados: actual.paraPensionados,
                    piso: actual.piso,
                    estatus: actual.estatus,
                  });

                  if (cajones.length > 0) {
                    cajonesAEnviar = [...cajones, cajonActual];
                  }

                  handleSubmit((data) => onSubmit(data, cajonesAEnviar))();
                }}
                disabled={!isValid}
              >
                Registrar
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
