import { View, KeyboardAvoidingView, Platform } from "react-native";
import React from "react";
import { Text, TextInput, HelperText, useTheme, Button, Checkbox, ActivityIndicator } from "react-native-paper";
import BoxStyles from "../../../utils/genericScreenStyles";
import usePutVehiculos from "../hooks/usePutVehiculos";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CustomAlert } from "../../../utils/customAlert";
import { useFocusEffect } from "@react-navigation/native";
import useUserIdByEmail from "../../acceso/hooks/getIdByEmail";

export default function InputVehiculo({ navigation, route }) {
  const { id, loading, error } = useUserIdByEmail();
  const paper = useTheme();
  const { campo, data, onReturn } = route.params;

  const { isLoading, errorData, preSubmit, defaultValues, vehicleYup, visible, hideAlert, config } =
    usePutVehiculos(navigation, data, campo, onReturn);

  const [field, setField] = React.useState("");
  const [valueStart, setValueStart] = React.useState("");
  const [hasPlaca, setHasPlaca] = React.useState(true);

  useFocusEffect(
    React.useCallback(() => {
      switch (campo) {
        case "Modificar modelo":
          setField("modelo");
          setValueStart(data.modelo);
          break;
        case "Modificar placa":
          setField("placa");
          setValueStart(data.placa);
          break;
        case "Modificar descripción":
          setField("descripción");
          setValueStart(data.descripcion);
          break;
      }
      return () => {
        // opcional: cleanup cuando la pantalla pierde foco
      };
    }, [data, campo])
  );

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid },
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

  // ▶ watch para evitar re-renders que cierran el teclado
  const modelo = watch("modelo") ?? "";
  const placa = watch("placa") ?? "";
  const desc = watch("desc") ?? "";

  // Valor actual según campo
  let valorActual =
    field === "modelo" ? modelo :
      field === "placa" ? placa :
        desc;


  React.useEffect(() => {
    reset(defaultValues);
    valorActual =
      field === "modelo" ? modelo :
        field === "placa" ? placa :
          desc;
  }, [defaultValues]);

  const renderField = React.useMemo(() => {
    if (campo === "Modificar modelo") {
      return (
        <Controller
          control={control}
          name="modelo"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <>
              <TextInput
                label="Actualizar modelo del vehículo"
                placeholder="Ingresa el modelo del vehículo"
                maxLength={50}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                ref={ref}
                error={!!errors.modelo}
              />

              <HelperText type="info" visible style={{ alignSelf: "flex-end", color: paper.colors.gray }}>
                {modelo.length}/50
              </HelperText>

              <HelperText type="error" visible={!!errors.modelo}>
                {errors?.modelo?.message}
              </HelperText>
            </>
          )}
        />
      );
    }

    if (campo === "Modificar placa") {
      return (
        <Controller
          control={control}
          name="placa"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <>
              <TextInput
                label="Actualizar placa del vehículo"
                placeholder="Ingresa la placa del vehículo"
                maxLength={7}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                ref={ref}
                error={!!errors.placa}
                disabled={!hasPlaca}
              />

              <HelperText type="info" visible style={{ alignSelf: "flex-end", color: paper.colors.gray }}>
                {placa.length}/7
              </HelperText>

              <HelperText type="error" visible={!!errors.placa}>
                {errors?.placa?.message}
              </HelperText>

              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 12 }}>
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
      );
    }

    if (campo === "Modificar descripción") {
      return (
        <Controller
          control={control}
          name="desc"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <>
              <TextInput
                label="Actualizar descripción del vehículo"
                placeholder="Ingresa la descripción del vehículo"
                maxLength={250}
                multiline
                numberOfLines={3}
                style={{ height: 112, textAlignVertical: "top" }}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                ref={ref}
                error={!!errors.desc}
              />

              <HelperText type="info" visible style={{ alignSelf: "flex-end", color: paper.colors.gray }}>
                {desc.length}/250
              </HelperText>

              <HelperText type="error" visible={!!errors.desc}>
                {errors?.desc?.message}
              </HelperText>
            </>
          )}
        />
      );
    }
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "transparent", padding: 24 }}
    >
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View>
          {renderField}
          <Text variant="bodyMedium" style={{ textAlign: "justify" }}>
            Aquí podrás actualizar {field === "descripción" ? "la" : "el"} {field.trim()} de tu vehículo en caso de haberlo ingresado incorrectamente
          </Text>
        </View>

        {isLoading ? (
          <View style={{ width: "100%", justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="small" />
          </View>
        ) : (
          <Button
            mode="contained"
            style={[BoxStyles.ButtonRadius]}
            labelStyle={BoxStyles.buttonText}
            disabled={!isValid || valueStart === valorActual}
            onPress={handleSubmit(preSubmit)}
          >
            Guardar
          </Button>
        )}
      </View>
      <CustomAlert visible={visible} hideAlert={hideAlert} config={config} />
    </KeyboardAvoidingView>
  );
}