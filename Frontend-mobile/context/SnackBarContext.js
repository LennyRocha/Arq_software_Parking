import { View, Text } from 'react-native'
import React, { createContext } from 'react'
import { Snackbar, useTheme, Button, ActivityIndicator } from 'react-native-paper';
import CustomBottomSheet from '../components/CustomBottomSheet';
import useBottomSheetController from '../hooks/useBottomSheetController';

const SnackContext = createContext();

export default function SnackBarProvider({ children }) {
    const { sheetRef, openSheet, closeSheet } = useBottomSheetController();
    const [snapPoints, setSnapPoints] = React.useState(["25%"]);
    const [sheetChild, setSheetChild] = React.useState(
        <View style={{ alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator size={"small"} />
        </View>)

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
