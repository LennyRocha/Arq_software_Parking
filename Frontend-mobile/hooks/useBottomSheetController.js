import React from "react";

export default function useBottomSheetController() {
  const sheetRef = React.useRef(null);

  const openSheet = () => sheetRef.current?.open(); 
  const closeSheet = () => sheetRef.current?.close();

  return { sheetRef, openSheet, closeSheet };
}