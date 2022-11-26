import React from 'react';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { ButtonBase, Button, Box } from 'app/components/base';
import Dialog from 'app/components/dialog/Dialog';
import theme from 'app/styles/theme';

const InfoDialog = ({
  isOpen,
  onClose = () => {},
  dismissable = true,
  showClose = false,
  buttonText,
  children,
}: {
  isOpen: boolean;
  onClose?: () => void;
  dismissable?: boolean;
  showClose?: boolean;
  buttonText?: string;
  children?: React.ReactNode;
}) => (
  <Dialog
    center
    p={5}
    width={340}
    bg="white"
    onClose={onClose}
    dismissable={dismissable}
    isOpen={isOpen}
    position="relative"
  >
    {showClose && (
      <ButtonBase style={{ position: 'absolute', top: 8, right: 8 }} onPress={onClose}>
        <Box justifyContent="center" alignItems="center" height={40} width={40}>
          <Ionicon size={24} name="close" color={theme.colors.textSecondary} />
        </Box>
      </ButtonBase>
    )}
    {children}
    <Box mt={4} width="100%">
      <Button variant="black" onPress={onClose} text={buttonText} width="100%" />
    </Box>
  </Dialog>
);

export default InfoDialog;
