import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import { useCustomThemes } from "../context/useCustomColors";
import BoxStyles from "../utils/genericScreenStyles";

export default function CustomMultiSteps({
  steps = [],
  stepProps = {},
  showButtons = true,
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const paper = useTheme();
  const { theme, mode } = useCustomThemes();

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <ProgressSteps
      activeStep={currentStep}
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
          removeBtnRow={!showButtons}
          {...stepProps}
          {...step.props}
        >
          <View style={styles.stepContent}>
            {step.content || <Text>Step {index + 1}</Text>}

            {!showButtons && (
              <View style={styles.buttonRow}>
                {index > 0 && (
                  <Button
                    style={[BoxStyles.ButtonRadius, { flex: 1 }]}
                    labelStyle={BoxStyles.buttonText}
                    mode="contained"
                    onPress={prevStep}
                    buttonColor={paper.colors.secondary}
                  >
                    Volver
                  </Button>
                )}

                <Button
                  style={[BoxStyles.ButtonRadius, { flex: 1 }]}
                  labelStyle={BoxStyles.buttonText}
                  mode="contained"
                  disabled={
                    index === steps.length - 1
                      ? step.props?.nextBtnDisabled
                      : step.props?.nextBtnDisabled
                  }
                  onPress={
                    index === steps.length - 1
                      ? step.onFinish || (() => alert("Finalizado"))
                      : nextStep
                  }
                >
                  {index === steps.length - 1 ? "Finalizar" : "Siguiente"}
                </Button>
              </View>
            )}
          </View>
        </ProgressStep>
      ))}
    </ProgressSteps>
  );
}

const styles = StyleSheet.create({
  progress: { flex: 1, padding: 0, margin: 0 },
  stepContent: {
    justifyContent: "center",
    flex: 1,
    width: "100%",
    height: "auto",
  },
  buttonRow: {
    width: "100%",
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
});