import { KeyboardAvoidingView, Platform, View, Image } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import React from "react";
import BoxStyles from "../../../utils/genericScreenStyles";
import { useCustomThemes } from "../../../context/useCustomColors";
import SwiperView from "../../../components/Swiper";
import fondoCorto from "../../../img/fondo_corto.png";
import { CustomAlert } from "../../../utils/customAlert";
import { useCustomAlert } from "../../../utils/useCustomAlert";

export default function RecuContra({ navigation }) {
  const paper = useTheme();
  const { visible, config, showAlert, hideAlert } = useCustomAlert();
  const swiperRef = React.useRef();
  const [email, setEmail] = React.useState("");

  const vista1 = <Vista1 swiperRef={swiperRef} email={email} setEmail={setEmail} />;
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

  const verificarCodigo = (finalCode) => {
    console.log("Código ingresado:", finalCode);

    // aquí podrías hacer fetch, validación, etc.
    // por ahora mostramos una alerta
    showAlert({
      icon: "success",
      title: "Código verificado",
      message: `El código ${finalCode} fue ingresado correctamente.`,
      showCancelButton: false,
      confirmText: "Continuar",
      onConfirm: () => swiperRef.current.scrollBy(1),
      externalDismiss: false,
    });
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
          onPress={() => {
            showAlert({
              icon: "info",
              title: "¡Código reenviado!",
              message: "Revisa tu correo electrónico",
              showCancelButton: false,
              confirmText: "Aceptar",
              onConfirm: () => console.log("Cerrando"),
              externalDismiss: false,
            });
          }}
          style={{
            flex: 0,
            alignSelf: "flex-end",
            borderRadius: 5,
            paddingHorizontal: 0,
            marginHorizontal: 0,
          }}
        >
          Enviar nuevamente
        </Button>
      </View>

      <Button onPress={() => swiperRef.current.scrollBy(1)}>Next</Button>
      <Button
        onPress={() => {
          swiperRef.current.scrollBy(-1);
          setEmail("");
          setCode(["", "", "", "", "", ""]);
          inputs[0].current.focus();
        }}
      >
        Former
      </Button>
    </View>
  );
};

const Vista1 = ({ swiperRef, email, setEmail }) => {
  //const [email, setEmail] = React.useState("");
  const { theme } = useCustomThemes();
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
      <Button
        mode="contained"
        style={[BoxStyles.ButtonRadius]}
        labelStyle={BoxStyles.buttonText}
        onPress={() => swiperRef.current.scrollBy(1)}
        disabled={email === ""}
      >
        Enviar código
      </Button>
    </KeyboardAvoidingView>
  )
};

const Vista3 = ({ swiperRef, setEmail, showAlert, navigation }) => {
  const [visible1, setVisible1] = React.useState(false);
  const [visible2, setVisible2] = React.useState(false);
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
        right={
          <TextInput.Icon
            icon={visible2 ? "eye-off" : "eye"}
            onPress={() => setVisible2(!visible2)}
          />
        }
      />
      <Button
        mode="contained"
        style={[BoxStyles.ButtonRadius]}
        labelStyle={BoxStyles.buttonText}
        onPress={() => showAlert({
          icon: "success",
          title: "¡Éxito!",
          message: "Contraseña actualizada correctamente.",
          showCancelButton: false,
          confirmText: "Aceptar",
          cancelText: "Cancelar",
          onConfirm: () =>
            //swiperRef.current.scrollBy(-1),
            navigation.goBack(),
          externalDismiss: false,
        })}
      >
        Guardar
      </Button>
    </KeyboardAvoidingView>
  )
};