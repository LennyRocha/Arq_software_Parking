import React from "react";

export default function useModalController() {
  const [modalVisible, setVisible] = React.useState(false);
 const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  return {modalVisible, showModal, hideModal};
}
