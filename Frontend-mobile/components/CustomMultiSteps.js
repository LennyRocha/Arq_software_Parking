import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import { useCustomThemes } from "../context/useCustomColors";

// 🔹 Componente genérico
export default function CustomMultiSteps({
  steps = [],
  stepProps = {},
}) {
  const paper = useTheme();
  const { theme, mode } = useCustomThemes();

  return (
    <View style={styles.container}>
      <ProgressSteps
        style={styles.progress}
        activeStepIconBorderColor={theme.other}
        activeStepNumColor="white"
        activeStepIconColor={theme.other}
        activeLabelColor={mode === "dark" ? theme.secondary : theme.other}
        completedStepIconColor={paper.colors.primary}
        completedProgressBarColor={paper.colors.primary}
        completedLabelColor={paper.colors.primary}
        progressBarColor={theme.card}
        disabledStepIconColor={theme.card}
        disabledStepNumColor={theme.primary}
        labelColor={theme.card}
        labelFontSize={14}
      >
        {steps.map((step, index) => (
          <ProgressStep
            key={index}
            label={step.label}
            buttonFillColor={theme.primary}
            buttonPreviousTextColor={theme.secondary}
            buttonBorderColor={theme.secondary}
            buttonHorizontalOffset={20}
            {...stepProps} // Props comunes para todos
            {...step.props} //  Props únicos de cada paso
          >
            <View style={styles.stepContent}>
              {step.content || <Text>Step {index + 1}</Text>}
            </View>
          </ProgressStep>
        ))}
      </ProgressSteps>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 0 },
  progress: { flex: 1, padding: 0, margin: 0 },
  stepContent: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    width: "100%",
    height: 200,
  },
});
