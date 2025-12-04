import React, { forwardRef, useRef, useImperativeHandle } from "react";
import { StyleSheet } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useTheme } from "react-native-paper";
import { useCustomThemes } from "../context/useCustomColors";

const CustomBottomSheet = forwardRef(
  ({ children, snapPoints = ["30%", "60%"] }, ref) => {
    const bottomSheetRef = useRef(null);

    const memoSnapPoints = React.useMemo(() => snapPoints, [snapPoints]);

    // Exponer los métodos al padre
    useImperativeHandle(ref, () => ({
      open: () => bottomSheetRef.current?.expand(),
      close: () => bottomSheetRef.current?.close(),
    }));

    const themes = useTheme();
    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1} // empieza cerrado
        snapPoints={memoSnapPoints}
        enablePanDownToClose={true} // swipe hacia abajo para cerrar
        backgroundStyle={{ backgroundColor: themes.colors.surface }}
      >
        {children}
      </BottomSheet>
    );
  }
);

export const BottomSheetContainerStyles = StyleSheet.create({
  content: {
    padding: 24,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
});

export default CustomBottomSheet;
