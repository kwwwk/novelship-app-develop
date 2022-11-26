import React from 'react';
import { Modal, ModalProps, StyleSheet } from 'react-native';

import theme from 'app/styles/theme';
import { Box } from 'app/components/base';
import LoadingIndicator from 'app/components/misc/LoadingIndicator';

const LoadingOverlay = ({ isOpen }: { isOpen: boolean } & ModalProps) => (
  <Modal animationType="fade" hardwareAccelerated transparent visible={isOpen}>
    <Box center flex={1} height="100%" style={styles.modalOverlay}>
      <LoadingIndicator size="large" color={theme.colors.white} />
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

export default LoadingOverlay;
