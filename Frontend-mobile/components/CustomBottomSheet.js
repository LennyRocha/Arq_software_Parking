import React, { forwardRef, useRef, useImperativeHandle } from "react";
import {  StyleSheet } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useTheme } from "react-native-paper";
import { useCustomThemes } from "../context/useCustomColors";

const CustomBottomSheet = forwardRef(
  ({ children, snapPoints = ["30%", "60%"] }, ref) => {
    const bottomSheetRef = useRef(null);

    // Exponer los métodos al padre
    useImperativeHandle(ref, () => ({
      open: () => bottomSheetRef.current?.expand(),
      close: () => bottomSheetRef.current?.close(),
    }));

    const themes = useTheme();
    const { theme, mode } = useCustomThemes();
    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1} // empieza cerrado
        snapPoints={snapPoints}
        enablePanDownToClose={true} // swipe hacia abajo para cerrar
        backgroundStyle={{ backgroundColor: themes.colors.surface }}
      >
        <BottomSheetView style={styles.content}>{children}</BottomSheetView>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
});

export default CustomBottomSheet;
