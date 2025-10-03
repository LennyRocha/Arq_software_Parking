import React from "react";
import { Dialog, Button, Portal, Text } from "react-native-paper";
import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { useCustomThemes } from "../context/useCustomColors";

export function CustomAlert({ visible, hideAlert, config }) {
  const themes = useTheme();
  const { theme, mode } = useCustomThemes();
  const iconType = {
    alert: "alert",
    info: "information",
    success: "check-circle",
    error: "alert-circle",
    warning: "alert",
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={config.externalDismiss ? hideAlert : () => {}} style={{backgroundColor: theme.surface}}>
        {/* Icono dinámico */}
        {config.icon && (
          <Dialog.Icon
            icon={iconType[config.icon]}
            size={36}
            color={theme[config.icon]}
          />
        )}

        {/* Título */}
        {config.title && (
          <Dialog.Title
            style={[
              styles.title,
              { color: mode !== "dark" ? theme.other :themes.colors.secondary },
            ]}
          >
            {config.title}
          </Dialog.Title>
        )}

        {/* Mensaje */}
        {config.message && (
          <Dialog.Content>
            <Text
              variant="bodyMedium"
              style={[styles.title, { color: themes.colors.onSurface }]}
            >
              {config.message}
            </Text>
          </Dialog.Content>
        )}

        {/* Botones */}
        <Dialog.Actions>
          {config.showCancelButton && (
            <Button
              onPress={() => {
                config.onCancel();
                hideAlert();
              }}
              textColor={mode === "dark" ? themes.colors.cardSurface :themes.colors.primary}
            >
              {config.cancelText || "Cancelar"}
            </Button>
          )}
          {config.showConfirmButton !== false && (
            <Button
              onPress={() => {
                config.onConfirm();
                hideAlert();
              }}
              textColor={mode === "dark" ? themes.colors.cardSurface :themes.colors.primary}
            >
              {config.confirmText || "Aceptar"}
            </Button>
          )}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  title: { textAlign: "center" },
});
