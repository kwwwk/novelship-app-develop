import * as React from 'react';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { ButtonBase, Text, Box } from 'app/components/base';
import InfoDialog from 'app/components/dialog/InfoDialog';
import useToggle from 'app/hooks/useToggle';
import theme from 'app/styles/theme';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';

const HintDialog = ({
  hintContent,
  children,
}: {
  hintContent?: string | React.ReactNode;
  children?: React.ReactNode;
}) => {
  const [isHintDialogOpen, toggleHintDialog]: [boolean, () => void] = useToggle(false);

  return (
    <Box>
      <ButtonBase onPress={toggleHintDialog}>
        {hintContent || (
          <Text fontSize={2}>
            <Ionicon name="information-circle" size={22} color={theme.colors.textBlack} />
          </Text>
        )}
      </ButtonBase>

      <InfoDialog
        isOpen={isHintDialogOpen}
        onClose={toggleHintDialog}
        buttonText={i18n._(t`GOT IT`)}
      >
        {children}
      </InfoDialog>
    </Box>
  );
};

export default HintDialog;
