import * as React from "react";
import {
  MD3LightTheme,
  MD3DarkTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import { useCustomThemes } from "./useCustomColors";

// export const UrbanOasisLightTheme = {
//   ...MD3LightTheme,
//   colors: {
//     ...MD3LightTheme.colors,
//     primary: "#4B7C7B",
//     secondary: "#7EBEBE",
//     tertiary: "#A7D6D5",
//     surface: "#EDEAF0",
//     cardSurface: "#C5E4E7",
//     onSurface: "#1C1B1F",
//     other: "#1E3A3E",
//     gray: "#808080",
//     error: "#FF5252",
//     warning: "#FF9800",
//     success: "#4CAF50",
//     info: "#2196F3",
//     dark: "#424242",
//     onPrimary: "#F0F9F9",
//     onSecondary: "#1E3A3E",
//     onTertiary: "#1E3A3E",
//     onCardSurface: "#4B7C7B",
//   },
// };

// export const UrbanOasisDarkTheme = {
//   ...MD3DarkTheme,
//   colors: {
//     ...MD3DarkTheme.colors,
//     primary: "#397974",
//     secondary: "#5EB0A9",
//     tertiary: "#5EB0A9",
//     surface: "#323035",
//     cardSurface: "#A2E6E5",
//     onSurface: "#E6E1E5",
//     other: "#1F4D4C",
//     gray: "#B3B3B3",
//     error: "#BD0000",
//     warning: "#E65100",
//     success: "#0B6E00",
//     info: "#1976D2",
//     dark: "#1E1E1E",
//     onPrimary: "#E2F3F3",
//     onSecondary: "#1F4D4C",
//     onTertiary: "#E2F3F3",
//     onCardSurface: "#397974",
//   },
// };

export const UrbanOasisLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    //Primary
    primary: "#4B7C7B",
    onPrimary: "#fff",
    primaryContainer: "#DCEAEA",
    onPrimaryContainer: "#253C3C",
    //Secondary
    secondary: "#7EBEBE",
    onSecondary: "#0D1A1B",
    secondaryContainer: "#C5E4E7",
    onSecondaryContainer: "#253C3C",
    //Tertiary
    tertiary: "#1E3A3E",
    onTertiary: "#fff",
    tertiaryContainer: "#F0F9F9",
    onTertiaryContainer: "#2F5A60",
    //Error
    onError: "#ffff",
    errorContainer: "#FFDAD6",
    onErrorContainer: "#410002",
    //Background
    //Surface
    surface: "#EDEAF0",
    onSurface: "#323035",
    surfaceVariant: "#FAFAFA",
    onSurfaceVariant: "#2E2E2E",
    //Outline
    outline: "#808080",
    //Custom
    gray: "#808080",
    error: "#FF5252",
    warning: "#FF9800",
    success: "#4CAF50",
    info: "#2196F3",
    dark: "#424242",
    cardSurface: "#A2E6E5",
    onCardSurface: "#397974",
    cardDark: "#FAFDFC",
    onCardDark: "#191C1C",
  },
};

export const UrbanOasisDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    //Primary
    primary: "#397974",
    onPrimary: "#fff",
    primaryContainer: "#CBE7E4",
    onPrimaryContainer: "#183432",
    //Secondary
    secondary: "#5EB0A9",
    onSecondary: "#010404",
    secondaryContainer: "#A2E6E5",
    onSecondaryContainer: "#183432",
    //Tertiary
    tertiary: "#1F4D4C",
    onTertiary: "#fff",
    tertiaryContainer: "#E2F3F3",
    onTertiaryContainer: "#102827",
    //Error
    onError: "#FFB4AB",
    errorContainer: "#93000A",
    onErrorContainer: "#FFB4AB",
    //Background
    //Surface
    surfaceVariant: "#2E2E2E",
    onSurfaceVariant: "#FAFAFA",
    surface: "#323035",
    onSurface: "#EDEAF0",
    //Outline
    outline: "#b3b3b3",
    //Custom
    gray: "#B3B3B3",
    error: "#BD0000",
    warning: "#E65100",
    success: "#0B6E00",
    info: "#1976D2",
    dark: "#1E1E1E",
    cardSurface: "#C5E4E7",
    onCardSurface: "#397974",
    cardDark: "#191C1C",
    onCardDark: "#FAFDFC",
  },
};

// ----- Paper Provider que detecta Appearance automáticamente -----
export default function PaperContext({ children }) {
  const { mode } = useCustomThemes();
  const theme = mode === "dark" ? UrbanOasisDarkTheme : UrbanOasisLightTheme;

  return <PaperProvider theme={theme}>{children}</PaperProvider>;
}
