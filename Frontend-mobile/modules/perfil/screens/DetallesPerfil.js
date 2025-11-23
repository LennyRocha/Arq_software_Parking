import { View } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme, List, Text, Avatar, IconButton } from "react-native-paper";
import { useCustomThemes } from "../../../context/useCustomColors";
import { ScrollView } from "react-native-gesture-handler";

export default function DetallesPerfil({ navigation }) {
  const paper = useTheme();
  const { mode } = useCustomThemes();
  return (
    <LinearGradient style={{ flex: 1 }} colors={[mode === "dark" ? paper.colors.surfaceVariant : paper.colors.olderBack, paper.colors.background]} >
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ backgroundColor: "transparent", padding: 24, justifyContent: "center", alignItems: "center", gap: 16 }}>
        <Avatar.Text label="XD" size={96} style={{ marginBottom: 8 }} />
        <List.Item
          title="Nombre (s):"
          description="Fulano"
          titleStyle={{ fontWeight: "600", color: paper.colors.primary }}
          left={props => (
            <IconButton
              {...props}
              icon="pencil"
              iconColor={paper.colors.primary}
              style={{ margin: 0, padding: 0 }}
              onPress={() => navigation.navigate("inputPerfilScreen", { campo: "Modificar nombre", label: "Nuevo nombre (s) de usuario:" })}
            />
          )}
        />
        <List.Item
          title="Apellido (s):"
          description="De Tal"
          titleStyle={{ fontWeight: "600", color: paper.colors.primary }}
          left={props => (
            <IconButton
              {...props}
              icon="pencil"
              iconColor={paper.colors.primary}
              style={{ margin: 0, padding: 0 }}
              onPress={() => navigation.navigate("inputPerfilScreen", { campo: "Modificar apellido", label: "Nuevo apellido (s):" })}
            />
          )}
        />
        <List.Item
          title="Teléfono:"
          description="777-123-45-67"
          titleStyle={{ fontWeight: "600", color: paper.colors.primary }}
          left={props => (
            <IconButton
              {...props}
              icon="pencil"
              iconColor={paper.colors.primary}
              style={{ margin: 0, padding: 0 }}
              onPress={() => navigation.navigate("inputPerfilScreen", { campo: "Modificar teléfono", label: "Nuevo número de teléfono:" })}
            />
          )}
        />
        <List.Item
          title="Correo electrónico:"
          description="fulanusky@gmail.com"
          titleStyle={{ fontWeight: "600", color: paper.colors.primary }}
        />
        <List.Item
          title="Estado:"
          description="Activo"
          titleStyle={{ fontWeight: "600", color: paper.colors.primary }}
        />
      </ScrollView>
    </LinearGradient>
  );
}
