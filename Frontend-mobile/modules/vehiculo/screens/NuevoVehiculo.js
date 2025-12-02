import { View, Text, Image } from "react-native";
import React from "react";
import ScrollRefreshingView from "../../../components/ScrollRefreshingView";
import { Button, SegmentedButtons, useTheme, Checkbox, TextInput, HelperText, ActivityIndicator } from "react-native-paper";
import { KeyboardAvoidingView, Platform } from "react-native";
import BoxStyles from "../../../utils/genericScreenStyles";
import usePostVehiculos from "../hooks/usePostVehiculos";
import ErrorAxios from "../../errores/screens/ErroresScreens";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useTiposVehiculos from "../hooks/useTiposVehiculos";
import { CustomAlert } from "../../../utils/customAlert";
import useUserIdByEmail from "../../acceso/hooks/getIdByEmail";

export default function NuevoVehiculo({ navigation }) {
  const { id, loading, error } = useUserIdByEmail();
  const { data: tipos } = useTiposVehiculos();
  const paper = useTheme();
  const [valueId, setValueId] = React.useState(1);
  const vehiculos = {
    moto: require('../../../img/moto_view_small.png'),
    coche: require('../../../img/coche_view_small.png'),
    camioneta: require('../../../img/camioneta_view_small.png'),
  }

  const changeIdType = (id) => {
    setValueId(id);
    setValue("id_type", id);
  }

  const [hasPlaca, setHasPlaca] = React.useState(true);

  const [lenModelo, setLenModelo] = React.useState(0);
  const [lenDesc, setLenDesc] = React.useState(0);
  const [lenPlaca, setLenPlaca] = React.useState(0);

  const restartValues = () => {
    setValueId(1);
    reset();
    setLenDesc(0);
    setLenModelo(0);
    setLenPlaca(0);
    setHasPlaca(true);
  }

  const { isLoading, errorData, onSubmit, defaultValues, vehicleYup, visible, hideAlert, config } = usePostVehiculos(navigation);

  const {
    control,
    handleSubmit,
    reset,
    trigger,
    formState: { errors, isValid },
    setValue
  } = useForm({
    defaultValues,
    resolver: yupResolver(vehicleYup),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  React.useEffect(() => {
    if (id !== null) {
      reset({ ...defaultValues, id_user: id });
      trigger("id_user");
    }
  }, [id]);

  const vehiculo = React.useMemo(() => {
    // si aun no hay datos, salimos sin crashear
    if (!tipos.length) return null;

    const item = tipos[valueId - 1];
    if (!item) return null;

    return vehiculos[item.nombre.toLowerCase()];
  }, [tipos, valueId]);

  if (errorData?.tipo === "Error de Axios") return <ErrorAxios error={errorData.detalles} callback={() => navigation.goBack()} />

  return (
    <>
      <KeyboardAvoidingView
        style={[BoxStyles.flex]}
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
      >
        <ScrollRefreshingView refreshHandler={restartValues} style={{ flex: 1 }} contentContainerStyle={{ justifyContent: "space-between", padding: 24, flexGrow: 1, }}>
          <View style={{ gap: 0 }} >
            <Image source={vehiculo} style={{ aspectRatio: 16 / 9, height: 150, marginHorizontal: "auto" }} resizeMode="stretch" resizeMethod="scale" />
            <SegmentedButtons
              value={valueId}
              onValueChange={changeIdType}
              buttons={[
                {
                  value: 1,
                  label: 'Coche',
                  style: {
                    backgroundColor: valueId === 1 ? paper.colors.tertiary : undefined,
                  },
                  checkedColor: "white",
                },
                {
                  value: 2,
                  label: 'Camioneta',
                  style: {
                    backgroundColor: valueId === 2 ? paper.colors.tertiary : undefined,
                  },
                  checkedColor: "white",
                },
                {
                  value: 3,
                  label: 'Moto',
                  style: {
                    backgroundColor: valueId === 3 ? paper.colors.tertiary : undefined,
                  },
                  checkedColor: "white",
                },
              ]}
              style={{ borderColor: paper.colors.tertiary, marginVertical: 12 }}
              theme={{ roundness: 1 }}
            />
            <Controller
              control={control}
              name="modelo"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <>
                  <TextInput
                    label="Modelo del vehículo"
                    placeholder="Ingresa el modelo del vehículo"
                    maxLength={50}
                    value={value}
                    onChangeText={(text) => {
                      onChange(text);
                      setLenModelo(text.length);
                    }}
                    onBlur={onBlur}
                    ref={ref}
                    error={!!errors.modelo}
                  />

                  <HelperText
                    type="info"
                    visible
                    style={{ alignSelf: "flex-end", color: paper.colors.gray }}
                  >
                    {lenModelo}/50
                  </HelperText>

                  {
                    errors.modelo &&
                    <HelperText variant="labelSmall" type="error" visible={!!errors.modelo}>
                      {errors?.modelo?.message}
                    </HelperText>
                  }
                </>
              )}
            />
            <Controller
              control={control}
              name="placa"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <>
                  <TextInput
                    label="Placa del vehículo"
                    placeholder="Ingresa la placa del vehículo"
                    maxLength={7}
                    value={value}
                    onChangeText={(text) => {
                      onChange(text);
                      setLenPlaca(text.length);
                    }}
                    onBlur={onBlur}
                    ref={ref}
                    error={!!errors.placa}
                    disabled={!hasPlaca}
                  />

                  <HelperText
                    type="info"
                    visible
                    style={{ alignSelf: "flex-end", color: paper.colors.gray }}
                  >
                    {lenPlaca}/7
                  </HelperText>

                  {
                    errors.placa &&
                    <HelperText variant="labelSmall" type="error" visible={!!errors.placa}>
                      {errors?.placa?.message}
                    </HelperText>
                  }

                  <View
                    style={{
                      flexDirection: "row",
                      width: "100%",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginVertical: 12,
                    }}
                  >
                    <Text variant="labelLarge">No tiene placa</Text>
                    <Checkbox
                      status={!hasPlaca ? "checked" : "unchecked"}
                      onPress={() => {
                        setValue("placa", "");
                        setHasPlaca(!hasPlaca);
                      }}
                    />
                  </View>
                </>
              )}
            />
            <Controller
              control={control}
              name="desc"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <>
                  <TextInput
                    label="Descripción del vehículo"
                    placeholder="Ingresa la descripción del vehículo"
                    maxLength={250}
                    multiline
                    numberOfLines={3}
                    style={{ height: 112, textAlignVertical: "top" }}
                    value={value}
                    onChangeText={(text) => {
                      onChange(text);
                      setLenDesc(text.length);
                    }}
                    onBlur={onBlur}
                    ref={ref}
                    error={!!errors.desc}
                  />

                  <HelperText
                    type="info"
                    visible
                    style={{ alignSelf: "flex-end", color: paper.colors.gray }}
                  >
                    {lenDesc}/250
                  </HelperText>

                  {
                    errors.desc &&
                    <HelperText variant="labelSmall" type="error" visible={!!errors.desc}>
                      {errors?.desc?.message}
                    </HelperText>
                  }
                </>
              )}
            />
          </View>
          {
            isLoading ? <View style={{ width: "100%", alignItems: "center", justifyContent: "center", padding: 4 }}>
              <ActivityIndicator color={paper.colors.primary} size={"small"} />
            </View> : <Button disabled={!isValid} mode="contained" style={BoxStyles.ButtonRadius} labelStyle={BoxStyles.buttonText} onPress={handleSubmit(onSubmit)}>Guardar</Button>
          }
        </ScrollRefreshingView>
      </KeyboardAvoidingView>
      <CustomAlert visible={visible} hideAlert={hideAlert} config={config} />
    </>
  );
}
