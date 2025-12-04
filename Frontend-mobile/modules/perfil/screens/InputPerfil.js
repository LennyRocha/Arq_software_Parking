import { View, KeyboardAvoidingView, Platform } from "react-native";
import React from "react";
import { Text, TextInput, HelperText, useTheme, Button, ActivityIndicator } from "react-native-paper";
import { MaskedTextInput } from "react-native-mask-text";
import BoxStyles from "../../../utils/genericScreenStyles";
import usePutUsuario from "../config/usePutUser";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CustomAlert } from "../../../utils/customAlert";
import { useFocusEffect } from "@react-navigation/native";
import { useGlobalContext } from "../../../context/GlobalContext";

export default function InputPerfil({ navigation, route }) {
  const paper = useTheme();
  const { idUsuario: id } =  useGlobalContext();
  const { campo, data, onReturn } = route.params;
  
  const { 
    isLoading, 
    errorData, 
    preSubmit, 
    defaultValues, 
    userYup, 
    visible, 
    hideAlert, 
    config 
  } = usePutUsuario(navigation, data, campo, onReturn);
  
  const [field, setField] = React.useState("");
  const [valueStart, setValueStart] = React.useState("");
  const [longitud, setLongitud] = React.useState(0);

  useFocusEffect(
    React.useCallback(() => {
      switch (campo) {
        case "Modificar nombre":
          setField("nombre");
          setValueStart(data.nombre);
          setLongitud(50);
          break;
        case "Modificar apellido":
          setField("apellidos");
          setValueStart(data.apellidos);
          setLongitud(50);
          break;
        case "Modificar teléfono":
          setField("telefono");
          setValueStart(data.telefono);
          setLongitud(12);
          break;
        case "Modificar correo":
          setField("correo");
          setValueStart(data.correo);
          setLongitud(100);
          break;
      }
      return () => {};
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
    resolver: yupResolver(userYup),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  React.useEffect(() => {
    if (id !== null) {
      reset({ ...defaultValues, id: id });
      trigger("id");
    }
  }, [id]);

  // Watch para evitar re-renders
  const nombre = watch("nombre") ?? "";
  const apellidos = watch("apellidos") ?? "";
  const telefono = watch("telefono") ?? "";
  const correo = watch("correo") ?? "";

  // Valor actual según campo
  let valorActual = 
    field === "nombre" ? nombre :
    field === "apellidos" ? apellidos :
    field === "telefono" ? telefono :
    correo;

  React.useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  const renderField = React.useMemo(() => {
    if (campo === "Modificar nombre") {
      return (
        <Controller
          control={control}
          name="nombre"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <>
              <TextInput
                label="Actualizar nombre"
                placeholder="Ingresa tu nombre"
                maxLength={50}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                ref={ref}
                error={!!errors.nombre}
              />
              <HelperText
                type="info"
                visible
                style={{ alignSelf: "flex-end", color: paper.colors.gray }}
              >
                {nombre.length}/50
              </HelperText>
              <HelperText type="error" visible={!!errors.nombre}>
                {errors?.nombre?.message}
              </HelperText>
            </>
          )}
        />
      );
    }

    if (campo === "Modificar apellido") {
      return (
        <Controller
          control={control}
          name="apellidos"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <>
              <TextInput
                label="Actualizar apellidos"
                placeholder="Ingresa tus apellidos"
                maxLength={50}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                ref={ref}
                error={!!errors.apellidos}
              />
              <HelperText
                type="info"
                visible
                style={{ alignSelf: "flex-end", color: paper.colors.gray }}
              >
                {apellidos.length}/50
              </HelperText>
              <HelperText type="error" visible={!!errors.apellidos}>
                {errors?.apellidos?.message}
              </HelperText>
            </>
          )}
        />
      );
    }

    if (campo === "Modificar teléfono") {
      return (
        <Controller
          control={control}
          name="telefono"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <>
              <TextInput
                label="Actualizar teléfono"
                mode="flat"
                keyboardType="numeric"
                maxLength={12}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                ref={ref}
                error={!!errors.telefono}
                render={(inputProps) => (
                  <MaskedTextInput
                    {...inputProps}
                    mask="999 999 9999"
                    style={[inputProps.style]}
                  />
                )}
              />
              <HelperText
                type="info"
                visible
                style={{ alignSelf: "flex-end", color: paper.colors.gray }}
              >
                {telefono.replace(/\s/g, "").length}/10
              </HelperText>
              <HelperText type="error" visible={!!errors.telefono}>
                {errors?.telefono?.message}
              </HelperText>
            </>
          )}
        />
      );
    }

    if (campo === "Modificar correo") {
      return (
        <Controller
          control={control}
          name="correo"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <>
              <TextInput
                label="Actualizar correo electrónico"
                placeholder="Ingresa tu correo"
                maxLength={100}
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                ref={ref}
                error={!!errors.correo}
              />
              <HelperText
                type="info"
                visible
                style={{ alignSelf: "flex-end", color: paper.colors.gray }}
              >
                {correo.length}/100
              </HelperText>
              <HelperText type="error" visible={!!errors.correo}>
                {errors?.correo?.message}
              </HelperText>
            </>
          )}
        />
      );
    }
  }, [campo, nombre, apellidos, telefono, correo, errors, control, paper.colors.gray]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "transparent", padding: 24 }}
    >
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View>
          {renderField}
          <Text variant="bodyMedium" style={{ textAlign: "justify" }}>
            Aquí podrás actualizar tu {field.trim()} en caso de haberlo ingresado
            incorrectamente
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