import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { IconButton, Modal, Portal, useTheme } from "react-native-paper";

const CustomModal = ({
  children,
  visible,
  onClose,
  fullScreen = false,
  margin = 10,
  externalDismiss = true,
  showClose = true,
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
        onDismiss={externalDismiss ? onClose : () => { }}
        contentContainerStyle={containerStyle}
      >
        {
          showClose &&
          <View
            style={{
              width: "100%",
              paddingVertical: 4,
              flexDirection: "row",
              justifyContent: "flex-end"
            }}
          >
            <IconButton
              size={24}
              icon="close"
              onPress={onClose}
              iconColor={paperTheme.colors.gray}
            />
          </View>
        }
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
          {children}
        </ScrollView>
      </Modal>
    </Portal>
  );
};

export default CustomModal;
