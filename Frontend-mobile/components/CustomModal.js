import { Modal, Portal, useTheme } from "react-native-paper";

const CustomModal = ({
  children,
  visible,
  onClose,
  fullScreen = false,
  margin = 10,
  externalDismiss = true,
}) => {
  const paperTheme = useTheme();

  const containerStyle = fullScreen
    ? {
        width: "100%",
        height: "100%",
        flex: 1,
        backgroundColor: paperTheme.colors.surface,
        padding: 20,
      }
    : {
        backgroundColor: paperTheme.colors.surface,
        padding: 20,
        alignSelf: "center",
        margin: margin,
      };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={externalDismiss ? onClose : () => {}}
        contentContainerStyle={containerStyle}
      >
        {children}
      </Modal>
    </Portal>
  );
};

export default CustomModal;
