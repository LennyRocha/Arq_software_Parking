import { View, Text } from 'react-native'
import React, { createContext } from 'react'
import { Snackbar, useTheme } from 'react-native-paper';

const SnackContext = createContext();

export default function SnackBarProvider({ children }) {

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
        <SnackContext.Provider value={{ showSnack }}>
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
        </SnackContext.Provider>
    );
};

// Usamos el contexto
export const useSnackBar = () => {
    return React.useContext(SnackContext);
};
