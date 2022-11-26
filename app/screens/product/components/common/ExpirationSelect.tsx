import React from 'react';
import { StyleSheet } from 'react-native';
import { Trans } from '@lingui/macro';

import { Text, Box, ButtonBase } from 'app/components/base';
import theme from 'app/styles/theme';

const ExpirationSelect = ({
  selected,
  onSelect,
  expirationDays,
  ...props
}: {
  selected: number;
  onSelect: (_: number) => void;
  expirationDays: number[];
}) => (
  <Box center flexDirection="row" style={styles.container} {...props}>
    {expirationDays.map((day) => (
      <ButtonBase
        key={day}
        onPress={() => onSelect(day)}
        android_ripple={{ color: theme.colors.rippleGray }}
      >
        <Box
          style={[styles.button, selected === day && styles.buttonSelected]}
          key={day}
          center
          flexDirection="row"
          py={3}
          px={6}
          mx={2}
        >
          <Text
            fontSize={2}
            fontFamily="medium"
            style={[styles.buttonText, selected === day && styles.buttonTextSelected]}
          >
            <>
              <Trans>{day} DAYS</Trans>
            </>
          </Text>
        </Box>
      </ButtonBase>
    ))}
  </Box>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-evenly',
    minWidth: 320,
  },
  button: {
    borderColor: theme.colors.gray2,
    fontFamily: theme.fonts.bold,
    textAlign: 'center',
    borderRadius: 5,
    borderWidth: 1,
  },
  buttonSelected: {
    backgroundColor: theme.colors.black2,
    borderColor: theme.colors.black2,
  },
  buttonText: {
    color: theme.colors.black2,
  },
  buttonTextSelected: {
    color: theme.colors.white,
  },
});

export default ExpirationSelect;
