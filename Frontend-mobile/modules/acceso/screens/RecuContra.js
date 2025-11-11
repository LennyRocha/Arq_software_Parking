import { KeyboardAvoidingView, Platform, View, Image } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import React from "react";
import BoxStyles from "../../../utils/genericScreenStyles";
import { useCustomThemes } from "../../../context/useCustomColors";
import SwiperView from "../../../components/Swiper";
import { SafeAreaView } from "react-native-safe-area-context";
import fondoCorto from "../../../img/fondo_corto.png";
import { ScrollView } from "react-native-gesture-handler";

export default function RecuContra() {
  const paper = useTheme();
  const swiperRef = React.useRef();
  const { theme } = useCustomThemes();
  const Form1 = () => {
    <></>;
  };

  const Vista2 = () => (
    <View
      style={[
        {
          flex: 1,
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          padding: 24
        },
      ]}
    >
      <View style={{ flexDirection: "row", gap: 4 }}>
        <TextInput
          style={{ flex: 1 }}
          mode="outlined"
          inputMode="numeric"
        />
        <TextInput
          style={{ flex: 1 }}
          mode="outlined"
          inputMode="numeric"
        />
        <TextInput
          style={{ flex: 1 }}
          mode="outlined"
          inputMode="numeric"
        />
        <TextInput
          style={{ flex: 1 }}
          mode="outlined"
          inputMode="numeric"
        />
        <TextInput
          style={{ flex: 1 }}
          mode="outlined"
          inputMode="numeric"
        />
        <TextInput
          style={{ flex: 1 }}
          mode="outlined"
          inputMode="numeric"
        />
      </View>
      <Button onPress={() => swiperRef.current.scrollBy(1)} >Next</Button>
      <Button onPress={() => swiperRef.current.scrollBy(-1)} >Former</Button>
    </View>
  );

  const Vista1 = () => (
    <KeyboardAvoidingView
      style={[BoxStyles.container, BoxStyles.flexJustifiedCenter]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
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
      />
      <Button
        mode="contained"
        style={[BoxStyles.ButtonRadius, BoxStyles.upperText]}
        onPress={() => swiperRef.current.scrollBy(1)}
      >
        Enviar código
      </Button>
    </KeyboardAvoidingView>
  );

  const Vista3 = () => {
    const [visible1, setVisible1] = React.useState(false);
    const [visible2, setVisible2] = React.useState(false);
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
            style={[BoxStyles.ButtonRadius, BoxStyles.upperText]}
            onPress={() => swiperRef.current.scrollBy(-1)}
          >
            Enviar código
          </Button>
      </KeyboardAvoidingView>
    )
  };

  return (
    <SafeAreaView style={[BoxStyles.flex]} edges={['left', 'right', 'bottom']}>
      <SwiperView
        slides={[Vista1, Vista2, Vista3]}
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
    </SafeAreaView >
  );
}
