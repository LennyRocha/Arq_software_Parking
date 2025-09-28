import { createTheme } from "@mui/material/styles";

const getDesignTokens = (mode) => ({
  palette: {
    primary: {
      main: mode ? "#397974" : "#4B7C7B",
      contrastText: mode ? "#F0F9F9" : "#E2F3F3",
    },
    secondary: {
      main: mode ? "#5EB0A9" : "#7EBEBE",
      contrastText: mode ? "#1E3A3E" : "#1F4D4C",
    },
    error: {
      main: mode ? "#BD0000" : "#FF5252",
    },
    warning: {
      main: mode ? "#E65100" : "#FF9800",
    },
    success: {
      main: mode ? "#0B6E00" : "#4CAF50",
    },
    info: {
      main: mode ? "#1976D2" : "#2196F3",
    },
    // Colores adicionales personalizados
    tertiary: {
      main: mode ? "#5EB0A9" : "#A7D6D5",
      contrastText: mode ? "#E2F3F3" : "#1E3A3E",
    },
    surface: {
      main: mode ? "#A2E6E5" : "#C5E4E7",
      contrastText: mode ? "#397974" : "#4B7C7B",
    },
    other: {
      main: mode ? "#1F4D4C" : "#1E3A3E",
    },
    gray: {
      main: mode ? "#B3B3B3" : "#808080",
    },
    dark: {
      main: mode ? "#1E1E1E" : "#424242",
    },
    text: mode ? "#FFFFFF" : "#242424",
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: mode ? "#F0F9F9" : "#242424", // normal
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: mode ? "#5EB0A9" : "#7EBEBE", // hover
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: mode ? "#397974" : "#4B7C7B", // focus
          },
          "&.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: mode ? "#BD0000" : "#FF5252", // error (igual en ambos modos)
          },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          "&:before": {
            borderBottom: mode ? "#F0F9F9" : "#242424", // normal
          },
          "&:hover:not(.Mui-disabled):before": {
            borderColor: mode ? "#5EB0A9" : "#7EBEBE", // hover
          },
          "&.Mui-focused:after": {
            borderColor: mode ? "#397974" : "#4B7C7B", // focus
          },
          "&.Mui-error:after": {
            borderColor: mode ? "#BD0000" : "#FF5252", // error
          },
        },
      },
    },

    MuiInput: {
      styleOverrides: {
        root: {
          "&:before": {
            borderBottom: mode ? "#F0F9F9" : "#242424", // normal
          },
          "&:hover:not(.Mui-disabled):before": {
            borderColor: mode ? "#5EB0A9" : "#7EBEBE", // hover
          },
          "&.Mui-focused:after": {
            borderColor: mode ? "#397974" : "#4B7C7B", // focus
          },
          "&.Mui-error:after": {
            borderColor: mode ? "#BD0000" : "#FF5252", // error
          },
        },
      },
    },
  },
});

export default function getTheme(mode) {
  return createTheme(getDesignTokens(mode));
}
