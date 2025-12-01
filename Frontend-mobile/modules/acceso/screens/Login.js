import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { TextInput, Button, Text, Divider, useTheme, ActivityIndicator, HelperText } from "react-native-paper";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  View,
} from "react-native";
import fondoCorto from "../../../img/fondo_corto.png";
import logo from "../../../img/logo_parking_hd_no_titulo.png";
import { useCustomThemes } from "../../../context/useCustomColors";
import { useNavigation } from "@react-navigation/native";
import BoxStyles from "../../../utils/genericScreenStyles";
import useLogin from "../hooks/useLogin";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCustomAlert } from "../../../utils/useCustomAlert";
import { CustomAlert } from "../../../utils/customAlert";

const gradient1 = ["#1E3A3E", "#1F4D4C", "#397974", "#4B7C7B"];
const gradient2 = ["#0D2226", "#1E3A3E", "#21484E", "#255A60", "#2A6F77"];
const gradient3 = ["#0C2727", "#1E4342", "#1F4D4C", "#236260", "#277A77"];

export default function Login() {
  const { visible: visAlert, config, showAlert, hideAlert } = useCustomAlert();
  const { loading, errorData, defaultValues, setErrorData, submit, loginYup } = useLogin();
  const navigation = useNavigation();
  const { theme } = useCustomThemes();
  const paper = useTheme();
  const [visible, setVisible] = React.useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues,
    resolver: yupResolver(loginYup),
    mode: "onChange",
    reValidateMode: "onChange",
  });
  async function setUser(data) {
    try {
      const ok = await submit(data);

      if (ok) {
        // Get root navigation and reset
        const rootNavigation = navigation.getParent();
        if (rootNavigation) {
          rootNavigation.reset({
            index: 0,
            routes: [{ name: "User" }],
          });
        } else {
          // Fallback if no parent navigator
          navigation.reset({
            index: 0,
            routes: [{ name: "User" }],
          });
        }
      }
    } catch (err) {
      console.error("Error setting user:", err);
    }
  }
  React.useEffect(() => {
    if (errorData && errorData.tipo === "Error de Axios") {
      showAlert({
        icon: "error",
        title: "¡Error al iniciar sesión!",
        message: errorData.text,
        showCancelButton: false,
        confirmText: "Aceptar",
        onConfirm: () => { hideAlert(); setErrorData(null) },
        externalDismiss: true,
      })
    }
  }, [errorData])
  return (
    <>
      {/* <LinearGradient
        colors={gradient3}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      > */}
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
        touchSoundDisabled={Keyboard.isVisible ? true : false}
        style={{ backgroundColor: "transparent" }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, width: "100%", zIndex: 2, backgroundColor: "transparent" }}
        >
          <ScrollView
            contentContainerStyle={{
              justifyContent: "center",
              paddingHorizontal: 24,
              paddingVertical: 50,
              gap: 20,
              zIndex: 1,
              backgroundColor: "transparent",
            }}
            keyboardShouldPersistTaps="handled"
          >
            <Text
              variant="labelLarge"
              style={{ color: paper.colors.onBackground, textAlign: "center" }}
            >
              Bienvenido
            </Text>
            <Image
              source={logo}
              style={{
                width: "50%",
                aspectRatio: 4 / 3,
                height: "auto",
                resizeMode: "contain",
                alignSelf: "center",
              }}
            />
            <Text
              style={{
                color: theme.txtTertiary,
                fontFamily: "Exo2_700Bold",
                textAlign: "center",
              }}
              variant="headlineLarge"
            >
              Iniciar sesión
            </Text>

            <Controller
              control={control}
              name="correo"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <>
                  <TextInput
                    label="Correo electrónico"
                    mode="flat"
                    keyboardType="email-address"
                    placeholder="Ingresa tu correo electrónico"
                    maxLength={50}
                    value={value}
                    onChangeText={(text) => {
                      onChange(text);
                    }}
                    onBlur={onBlur}
                    ref={ref}
                    error={!!errors.correo}
                  />

                  {
                    errors.correo &&
                    <HelperText variant="labelSmall" type="error" visible={!!errors.correo}>
                      {errors?.correo?.message}
                    </HelperText>
                  }
                </>
              )}
            />
            <Controller
              control={control}
              name="contra"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <>
                  <TextInput
                    label="Contraseña"
                    mode="flat"
                    secureTextEntry={!visible}
                    placeholder="Ingresa tu contraseña"
                    maxLength={20}
                    value={value}
                    onChangeText={(text) => {
                      onChange(text);
                    }}
                    onBlur={onBlur}
                    ref={ref}
                    right={
                      <TextInput.Icon
                        icon={!visible ? "eye" : "eye-off"}
                        onPress={() => setVisible(!visible)}
                      />
                    }
                    error={!!errors.contra}
                  />

                  {
                    errors.contra &&
                    <HelperText variant="labelSmall" type="error" visible={!!errors.contra}>
                      {errors?.contra?.message}
                    </HelperText>
                  }
                </>
              )}
            />
            <Button
              mode="text"
              onPress={() => navigation.navigate("recovery")}
              style={{ flex: 0, alignSelf: "flex-end", borderRadius: 5 }}
            >
              ¿Olvidaste tu contraseña?
            </Button>
            {
              loading ? <View>
                <ActivityIndicator size={"small"} />
              </View>
                :
                <Button
                  mode="contained"
                  style={{
                    width: "100%",
                    borderRadius: 5,
                  }}
                  disabled={!isValid}
                  labelStyle={BoxStyles.buttonText}
                  onPress={handleSubmit(setUser)}
                >
                  Acceder
                </Button>
            }
            <Divider style={{ backgroundColor: theme.gray }} />
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                variant="titleSmall"
                style={{
                  color: paper.colors.onBackground,
                  textAlign: "center",
                }}
              >
                ¿No tienes cuenta?
              </Text>
              <Button
                mode="text"
                onPress={() => {
                  navigation.navigate("signup");
                }}
                style={{
                  flex: 0,
                  alignSelf: "flex-end",
                  borderRadius: 5,
                  paddingHorizontal: 0,
                }}
              >
                Regístrate aquí
              </Button>
            </View>
          </ScrollView>
          <CustomAlert visible={visAlert} hideAlert={hideAlert} config={config} />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      {/* </LinearGradient> */}
      <Image
        source={fondoCorto}
        style={{
          width: "100%",
          position: "absolute",
          bottom: 0,
          left: 0,
          aspectRatio: 16 / 9,
        }}
      />
    </>
  );
}
