import * as React from "react";
import {
  MD3LightTheme,
  MD3DarkTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import { useColorScheme } from "react-native";
import { useCustomThemes } from "./useCustomColors";

export const UrbanOasisLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#4B7C7B",
    secondary: "#7EBEBE", 
    tertiary: "#A7D6D5", 
    surface: "#EDEAF0",  
    cardSurface: "#C5E4E7",  
    onSurface: "#1C1B1F", 
    other: "#1E3A3E", 
    gray: "#808080",
    error: "#FF5252",
    warning: "#FF9800",
    success: "#4CAF50",
    info: "#2196F3",
    dark: "#424242",
    onPrimary: "#F0F9F9",
    onSecondary: "#1E3A3E",
    onTertiary: "#1E3A3E",
    onCardSurface: "#4B7C7B",
  },
};

export const UrbanOasisDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#397974",
    secondary: "#5EB0A9", 
    tertiary: "#5EB0A9", 
    surface: "#323035",   
    cardSurface: "#A2E6E5", 
    onSurface: "#E6E1E5", 
    other: "#1F4D4C", 
    gray: "#B3B3B3",
    error: "#BD0000",
    warning: "#E65100",
    success: "#0B6E00",
    info: "#1976D2",
    dark: "#1E1E1E",
    onPrimary: "#E2F3F3",
    onSecondary: "#1F4D4C",
    onTertiary: "#E2F3F3",
    onCardSurface: "#397974",
  },
};

// ----- Paper Provider que detecta Appearance automáticamente -----
export default function PaperContext({ children }) {
  const { mode } = useCustomThemes();
  const theme = mode === "dark" ? UrbanOasisDarkTheme : UrbanOasisLightTheme;

  return <PaperProvider theme={theme}>{children}</PaperProvider>;
}
