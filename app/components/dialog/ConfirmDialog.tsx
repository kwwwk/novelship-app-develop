import React from 'react';
import { i18n } from '@lingui/core';

import { Box, Button, Text } from 'app/components/base';
import Dialog from 'app/components/dialog/Dialog';
import theme from 'app/styles/theme';

const ConfirmDialog = ({
  isOpen,
  onClose = () => {},
  onConfirm = () => {},
  dismissable = true,
  confirmText = i18n._('CONFIRM'),
  closeText = i18n._('CANCEL'),
  title,
  children,
  loading,
}: {
  isOpen: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  dismissable?: boolean;
  title?: string;
  confirmText?: string;
  closeText?: string;
  children?: React.ReactNode;
  loading?: boolean;
}) => (
  <Dialog
    center
    p={5}
    width={340}
    bg="white"
    onClose={onClose}
    dismissable={dismissable}
    isOpen={isOpen}
  >
    {!!title && (
      <Text
        my={1}
        fontSize={4}
        fontFamily="bold"
        textAlign="center"
        letterSpacing={theme.constants.LETTER_SPACINGS_TEXT_TITLE}
      >
        {title}
      </Text>
    )}
    {children}
    <Box width="100%">
      <Button
        variant="black"
        loading={loading}
        onPress={() => {
          onConfirm();
          onClose();
        }}
        text={confirmText}
      />
      <Box mt={3}>
        <Button variant="white" onPress={onClose} text={closeText} />
      </Box>
    </Box>
  </Dialog>
);

export default ConfirmDialog;
