import React from "react";
import MainHeader from "../../../components/MainHeader";
import LoadingBackdrop from "../../../components/LoadingBackdrop";
import {
  Box,
  Switch,
  Typography,
  TextField,
  FormGroup,
  FormControlLabel,
  ButtonGroup,
  Button,
  CircularProgress,
} from "@mui/material";
import usePostVehiculos from "../hooks/usePostVehiculos";
import useTiposVehiculos from "../hooks/useTiposVehiculos";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import moto from "../../../img/moto_view_small.png";
import coche from "../../../img/coche_view_small.png";
import camioneta from "../../../img/camioneta_view_small.png";

export default function NuevoVehiculo() {
  const {
    isLoading,
    errorData,
    onSubmit,
    defaultValues,
    vehicleYup,
    visible,
    hideAlert,
    config,
  } = usePostVehiculos(3);
  const { data: list, error: errorTipos, load } = useTiposVehiculos();
  const [idCar, setIdCar] = React.useState(1);
  const vehiculos = {
    1: coche,
    2: camioneta,
    3: moto,
  };
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
  const [hasPlaca, setHasPlaca] = React.useState(true);
  React.useEffect(() => {
    setValue("id_type", idCar);
  }, [idCar]);
  return (
    <Box sx={{ flex: 1, overflow: "auto" }}>
      <LoadingBackdrop isOpen={load} />
      <MainHeader
        titulo="Nuevo vehículo"
        breads={[
          {
            nombre: "Usuario pensionado",
            ruta: "/pensionados",
            disabled: false,
          },
          {
            nombre: "Mis vehículos",
            ruta: "/pensionados/mis_vehiculos",
            disabled: false,
          },
          {
            nombre: "Nuevo",
            ruta: "/mis_vehiculos",
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
            flexDirection: { xs: "column-reverse", md: "column" },
            gap: 2,
          }}
        >
          <div>
            <Typography color="gray" variant="body2" sx={{ textAlign: "left" }}>
              Tipo de vehículo
            </Typography>
            <ButtonGroup
              variant="contained"
              color="tertiary"
              sx={{ flex: 1, width: "100%" }}
            >
              <Button
                variant={idCar === 1 ? "contained" : "outlined"}
                sx={{ flex: 1, width: "100%" }}
                onClick={() => setIdCar(1)}
              >
                Coche
              </Button>
              <Button
                variant={idCar === 2 ? "contained" : "outlined"}
                sx={{ flex: 1 }}
                onClick={() => setIdCar(2)}
              >
                Camioneta
              </Button>
              <Button
                variant={idCar === 3 ? "contained" : "outlined"}
                sx={{ flex: 1 }}
                onClick={() => setIdCar(3)}
              >
                Moto
              </Button>
            </ButtonGroup>
          </div>
          <img
            src={vehiculos[idCar]}
            alt="vehiculo_seleccionado"
            style={{ aspectRatio: 16 / 9, width: "80%", margin: "0 auto" }}
          />
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
                  {value.length}/7
                </Typography>

                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={!hasPlaca}
                        onChange={() => {
                          !hasPlaca
                            ? resetField("placa")
                            : setValue("placa", "");
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
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
            }}
          >
            {isLoading ? (
              <CircularProgress />
            ) : (
              <Button
                variant="contained"
                onClick={handleSubmit(onSubmit)}
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
