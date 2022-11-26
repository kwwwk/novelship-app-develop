import React from 'react';
import { Modal, ModalProps, StyleSheet, TouchableWithoutFeedback } from 'react-native';

import { Box } from 'app/components/base';
import { BoxProps } from 'app/components/base/Box';

const Dialog = ({
  isOpen,
  onClose = () => {},
  dismissable = true,
  ...props
}: { isOpen: boolean; onClose: () => void; dismissable?: boolean } & ModalProps & BoxProps) => (
  <Modal
    animationType="fade"
    hardwareAccelerated
    transparent
    visible={isOpen}
    onRequestClose={onClose}
  >
    <Box center height="100%">
      <TouchableWithoutFeedback onPress={() => dismissable && onClose()}>
        <Box style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <Box borderRadius={2} {...props} />
    </Box>
  </Modal>
);

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export default Dialog;
