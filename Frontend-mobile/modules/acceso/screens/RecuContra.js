import { KeyboardAvoidingView, Platform, View, Image } from "react-native";
import { Button, Text, TextInput, useTheme, ActivityIndicator } from "react-native-paper";
import React from "react";
import BoxStyles from "../../../utils/genericScreenStyles";
import { useCustomThemes } from "../../../context/useCustomColors";
import SwiperView from "../../../components/Swiper";
import fondoCorto from "../../../img/fondo_corto.png";
import { CustomAlert } from "../../../utils/customAlert";
import { useCustomAlert } from "../../../utils/useCustomAlert";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios'
import { API_URL } from '@env';
import getAxiosErrorMessage from '../../../utils/getAxiosMessage'

export default function RecuContra({ navigation }) {
  const paper = useTheme();
  const { visible, config, showAlert, hideAlert } = useCustomAlert();
  const swiperRef = React.useRef();
  const [email, setEmail] = React.useState("");

  const vista1 = <Vista1 swiperRef={swiperRef} email={email} setEmail={setEmail} showAlert={showAlert} />;
  const vista2 = <Vista2 swiperRef={swiperRef} email={email} setEmail={setEmail} showAlert={showAlert} />;
  const vista3 = <Vista3 swiperRef={swiperRef} showAlert={showAlert} navigation={navigation} />;

  return (
    <>
      <SwiperView
        slides={[vista1, vista2, vista3]}
        horizontal={true}
        showsPagination={false}
        loop={false}
        ref={swiperRef}
        controlledSwipe={true}
        scrollEnabled={false}
      />
      <Image
        source={fondoCorto}
        style={{
          width: "100%",
          position: "absolute",
          bottom: 0,
          left: 0,
          aspectRatio: 16 / 9,
          zIndex: -1
        }}
      />
      <CustomAlert visible={visible} hideAlert={hideAlert} config={config} />
    </ >
  );
}


const Vista2 = ({ swiperRef, email, setEmail, showAlert }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const paper = useTheme();
  const { theme } = useCustomThemes();

  // Refs para cada input
  const inputs = Array.from({ length: 6 }, () => React.useRef(null));

  // Estado local del código
  const [code, setCode] = React.useState(["", "", "", "", "", ""]);

  const handleChange = (text, index) => {
    if (/^\d$/.test(text)) {
      // actualiza el dígito
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);

      // mover foco al siguiente
      if (index < inputs.length - 1) {
        inputs[index + 1].current.focus();
      }

      // si ya completó los 6, verificamos
      if (index === inputs.length - 1 || newCode.every((d) => d !== "")) {
        const finalCode = newCode.join("");
        verificarCodigo(finalCode);
      }
    } else if (text === "") {
      // si borra, solo limpia
      const newCode = [...code];
      newCode[index] = "";
      setCode(newCode);
    }
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === "Backspace" && code[index] === "" && index > 0) {
      inputs[index - 1].current.focus();
    }
  };

  const verificarCodigo = async (finalCode) => {
    const codigoGuardado = await AsyncStorage.getItem("codigoRecuperacion");

    if (finalCode === codigoGuardado) {
      showAlert({
        icon: "success",
        title: "Código correcto",
        message: "El código es válido.",
        showCancelButton: false,
        confirmText: "Continuar",
        onConfirm: () => swiperRef.current.scrollBy(1),
      });
    } else {
      showAlert({
        icon: "error",
        title: "Código incorrecto",
        message: "El código ingresado no coincide.",
        showCancelButton: false,
      });

      // limpiar inputs
      setCode(["", "", "", "", "", ""]);
      inputs[0].current.focus();
    }
  };

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        gap: 12,
      }}
    >
      <Text
        style={{
          color: theme.txtTertiary,
          fontFamily: "Exo2_700Bold",
          textAlign: "left",
        }}
        variant="headlineLarge"
      >
        Código de verificación
      </Text>

      <Text variant="bodyLarge">
        Ingresa el código de verificación que hemos enviado a{" "}
        <Text
          variant="bodyLarge"
          style={{ color: paper.colors.secondary }}
        >
          {email.toLowerCase().trim()}
        </Text>
      </Text>

      <View style={{ flexDirection: "row", gap: 6 }}>
        {inputs.map((ref, index) => (
          <TextInput
            key={index}
            ref={ref}
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: 20,
            }}
            mode="outlined"
            inputMode="numeric"
            maxLength={1}
            value={code[index]}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
          />
        ))}
      </View>

      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
        }}
      >
        <Text
          variant="titleSmall"
          style={{
            color: paper.colors.onBackground,
            textAlign: "right",
            paddingHorizontal: 0,
          }}
        >
          No recibí ningún código.
        </Text>

        <Button
          mode="text"
          onPress={async () => {
            try {
              setIsLoading(true)
              const correo = email.trim().toLowerCase();

              // 1. Llamar API que envía el código
              const response = await axios.post(`${API_URL}/email/send/${correo}`, {
                subject: "Recuperación de contraseña",
                message: "Tu código de verificación es:",
              });

              const codigo = response.data.data.code;

              // 2. Obtener ID del usuario
              const userIdResp = await axios.get(`${API_URL}/auth/buscarId/${correo}`);
              const userId = userIdResp.data.data.id.toString();

              // 3. Guardar en AsyncStorage
              await AsyncStorage.setItem("codigoRecuperacion", String(codigo));
              await AsyncStorage.setItem("userId", String(userId));

              showAlert({
                icon: "success",
                title: "Código enviado",
                message: response.data.data.message || "Revisa tu correo electrónico.",
                showCancelButton: false,
                onConfirm: () => { },
              });

            } catch (e) {
              console.log(e)
              showAlert({
                icon: "error",
                title: "Error",
                message: getAxiosErrorMessage(e) || "No se pudo enviar el código.",
                showCancelButton: false,
                onConfirm: () => { }
              });
            } finally {
              setIsLoading(false);
            }
          }}
          style={{
            flex: 0,
            alignSelf: "flex-end",
            borderRadius: 5,
            paddingHorizontal: 0,
            marginHorizontal: 0,
          }}
          disabled={isLoading}
        >
          Enviar nuevamente
        </Button>
      </View>
    </View>
  );
};

const Vista1 = ({ swiperRef, email, setEmail, showAlert }) => {
  //const [email, setEmail] = React.useState("");
  const { theme } = useCustomThemes();
  const [isLoading, setIsLoading] = React.useState(false);
  return (
    <KeyboardAvoidingView
      style={[BoxStyles.container, BoxStyles.flexJustifiedCenter]}
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
    >
      <Text
        style={{
          color: theme.txtTertiary,
          fontFamily: "Exo2_700Bold",
          textAlign: "left",
        }}
        variant="headlineLarge"
      >
        ¿Olvidaste tu contraseña?
      </Text>
      <Text variant="bodyLarge">
        Por favor, ingresa tu correo electrónico. Te enviaremos un código para
        restablecer tu contraseña.
      </Text>
      <TextInput
        label={"Correo electrónico"}
        placeholder="Ingresa tu correo electrónico"
        inputMode="email"
        value={email}
        onChangeText={(text) => { setEmail(text); console.log(text) }}
      />

      {isLoading ? (
        <View style={{ width: "100%", alignItems: "center", marginTop: 10 }}>
          <ActivityIndicator size="small" />
        </View>
      ) : (

        <Button
          mode="contained"
          style={[BoxStyles.ButtonRadius]}
          labelStyle={BoxStyles.buttonText}
          disabled={email.trim() === ""}
          onPress={async () => {
            try {
              setIsLoading(true)
              const correo = email.trim().toLowerCase();

              // 1. Llamar API que envía el código
              const response = await axios.post(`${API_URL}/email/send/${correo}`, {
                subject: "Recuperación de contraseña",
                message: "Tu código de verificación es:",
              });

              const codigo = response.data.data.code;

              // 2. Obtener ID del usuario
              const userIdResp = await axios.get(`${API_URL}/auth/buscarId/${correo}`);
              const userId = userIdResp.data.data.id.toString();

              // 3. Guardar en AsyncStorage
              await AsyncStorage.setItem("codigoRecuperacion", String(codigo));
              await AsyncStorage.setItem("userId", String(userId));

              showAlert({
                icon: "success",
                title: "Código enviado",
                message: response.data.data.message || "Revisa tu correo electrónico.",
                showCancelButton: false,
                onConfirm: () => swiperRef.current.scrollBy(1),
              });

            } catch (e) {
              console.log(e)
              showAlert({
                icon: "error",
                title: "Error",
                message: getAxiosErrorMessage(e) || "No se pudo enviar el código.",
                showCancelButton: false,
                onConfirm: () => { }
              });
            } finally {
              setIsLoading(false);
            }
          }}
        >
          Enviar código
        </Button>
      )}
    </KeyboardAvoidingView>
  )
};

const Vista3 = ({ swiperRef, setEmail, showAlert, navigation }) => {
  const [visible1, setVisible1] = React.useState(false);
  const [visible2, setVisible2] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const [isLoading, setIsLoading] = React.useState(false);

  const paper = useTheme();
  const { theme } = useCustomThemes();
  return (
    <KeyboardAvoidingView
      style={[BoxStyles.container, BoxStyles.flexJustifiedCenter]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80}
    >
      <Text
        style={{
          color: theme.txtTertiary,
          fontFamily: "Exo2_700Bold",
          textAlign: "left",
        }}
        variant="headlineLarge"
      >
        Nueva contraseña
      </Text>
      <Text variant="bodyMedium" >
        Has comprobado tu identidad correctamente, ahora ingresa una contraseña nueva. La nueva contraseña debe contener al menos 8 caracteres
      </Text>
      <TextInput
        label="Nueva contraseña"
        placeholder="Debe tener al menos 8 caracteres"
        style={{ height: 44 }}
        mode="flat"
        secureTextEntry={!visible1}
        value={password}
        onChangeText={setPassword}
        right={
          <TextInput.Icon
            icon={visible1 ? "eye-off" : "eye"}
            onPress={() => setVisible1(!visible1)}
          />
        }
      />
      <TextInput
        label="Confirmar contraseña"
        placeholder="Debe tener al menos 8 carácteres"
        mode="flat"
        secureTextEntry={!visible2}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        right={
          <TextInput.Icon
            icon={visible2 ? "eye-off" : "eye"}
            onPress={() => setVisible2(!visible2)}
          />
        }
      />

      {isLoading ? (
        <View style={{ width: "100%", alignItems: "center", marginTop: 10 }}>
          <ActivityIndicator size="small" />
        </View>
      ) : (
        <Button
          mode="contained"
          style={[BoxStyles.ButtonRadius]}
          labelStyle={BoxStyles.buttonText}
          onPress={async () => {
            const nueva = password.trim();
            const confirmar = confirmPassword.trim();

            // Validaciones
            if (nueva.length < 8) {
              showAlert({
                icon: "error",
                title: "Contraseña inválida",
                message: "Debe tener al menos 8 caracteres.",
                onConfirm: () => { }
              });
              return;
            }

            if (nueva !== confirmar) {
              showAlert({
                icon: "error",
                title: "No coinciden",
                message: "Las contraseñas no coinciden.",
                onConfirm: () => { }
              });
              return;
            }

            try {
              setIsLoading(true);

              const userId = await AsyncStorage.getItem("userId");

              const response = await axios.post(`${API_URL}/auth/actualizarContraUsuario`, {
                id: userId,
                contra: nueva,
              });

              if (!response.data.success) {
                showAlert({
                  icon: "error",
                  title: "Error",
                  message: response.data.message || "No se pudo actualizar.",
                  onConfirm: () => { }
                });
                return;
              }

              showAlert({
                icon: "success",
                title: "¡Éxito!",
                message: "Contraseña actualizada correctamente.",
                onConfirm: () => navigation.goBack(),
              });
            } catch (e) {
              showAlert({
                icon: "error",
                title: "Error",
                message: "No se pudo actualizar la contraseña.",
                onConfirm: () => { }
              });
            } finally {
              setIsLoading(false);
            }
          }}
        >
          Guardar
        </Button>
      )}
    </KeyboardAvoidingView>
  )
};