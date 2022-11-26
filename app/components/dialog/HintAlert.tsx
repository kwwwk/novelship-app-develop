import React from 'react';
import { Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { Box, ButtonBase } from 'app/components/base';
import { BoxProps } from 'app/components/base/Box';
import theme from 'app/styles/theme';

const HintAlert = ({
  children,
  title,
  text,
  ...props
}: {
  children?: React.ReactNode;
  title: string;
  text: string;
} & BoxProps) => (
  <ButtonBase
    onPress={() =>
      Alert.alert(i18n._(title), i18n._(text), [{ text: i18n._(t`GOT IT`) }], { cancelable: true })
    }
  >
    <Box px={2} {...props}>
      <FontAwesome name="question-circle" color={theme.colors.gray2} size={14} />
    </Box>
  </ButtonBase>
);

export default HintAlert;
