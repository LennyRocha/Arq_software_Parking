import { View, Text } from 'react-native'
import React, { createContext } from 'react'
import { Snackbar, useTheme, Button } from 'react-native-paper';
import CustomBottomSheet from '../components/CustomBottomSheet';
import useBottomSheetController from '../hooks/useBottomSheetController';

const SnackContext = createContext();

export default function SnackBarProvider({ children }) {
    const { sheetRef, openSheet, closeSheet } = useBottomSheetController();
    const [snapPoints, setSnapPoints] = React.useState(["25%", "50%", "75%", "100%"]);
    const [sheetChild, setSheetChild] = React.useState(
        <>
            <Text>¡Hola desde el BottomSheet! 🎉</Text>
            <Button onPress={closeSheet}>Cerrar</Button>
            <View
                style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            >
                <Text style={{ fontFamily: "Exo2_300Light", fontSize: 18 }}>
                    Texto ligero 🪶
                </Text>
                <Text style={{ fontFamily: "Exo2_400Regular", fontSize: 20 }}>
                    Texto regular 😎
                </Text>
                <Text style={{ fontFamily: "Exo2_700Bold", fontSize: 22 }}>
                    Texto en negritas 💪
                </Text>
            </View>
        </>)

    const [visible, setVisible] = React.useState(false);
    const [title, setTitle] = React.useState("");
    const [label, setLabel] = React.useState("");
    const paper = useTheme();

    const showSnack = (title, label) => {
        setVisible(true);
        setTitle(title);
        setLabel(label);
    };

    return (
        <SnackContext.Provider value={{ showSnack, setSnapPoints, openSheet, closeSheet, setSheetChild }}>
            {children}
            <Snackbar
                visible={visible}
                onDismiss={() => setVisible(false)}
                duration={5000}
                action={{
                    label: label || "Aceptar",
                    onPress: () => { },
                    labelStyle: { color: paper.colors.primary }
                }}
            >
                {title}
            </Snackbar>
            <CustomBottomSheet
                ref={sheetRef}
                snapPoints={snapPoints}
            >
                {sheetChild}
            </CustomBottomSheet>
        </SnackContext.Provider>
    );
};

// Usamos el contexto
export const useSnackBar = () => {
    return React.useContext(SnackContext);
};
