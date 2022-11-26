import React, { useRef } from 'react';
import { TextInputProps, StyleSheet } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { ButtonBase, Box } from 'app/components/base';
import { Input } from 'app/components/form';
import theme from 'app/styles/theme';

interface PriceInputProps extends TextInputProps {
  value: number | any;
  step: number;
  min: number;
}

const PriceInput = ({ onChangeText, min, step, value, ...props }: PriceInputProps) => {
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const isMinPrice = !value || value === min;

  const updateValue = (change: number) => {
    const newValue = parseInt(value || min) + change;
    // eslint-disable-next-line no-param-reassign
    value = min > newValue ? min : newValue;
    if (onChangeText) {
      onChangeText(value);
    }
  };

  const setOperator = (operator: '+' | '-') => {
    const change = operator === '+' ? step : -step;
    updateValue(change);
    clearOperator();
    timeout.current = setInterval(() => updateValue(change), 200);
  };

  const clearOperator = () => {
    if (timeout.current) {
      clearInterval(timeout.current);
    }
  };

  return (
    <Box center pt={2} flexDirection="row">
      <ButtonBase
        onPressOut={clearOperator}
        onPressIn={() => setOperator('-')}
        disabled={isMinPrice}
      >
        <Ionicon
          name="remove-outline"
          size={32}
          color={isMinPrice ? theme.colors.gray3 : theme.colors.textBlack}
        />
      </ButtonBase>

      <Input
        onChangeText={onChangeText}
        keyboardType="numeric"
        style={styles.input}
        value={value ? value.toString() : ''}
        {...props}
      />

      <ButtonBase onPressOut={clearOperator} onPressIn={() => setOperator('+')}>
        <Ionicon name="add-outline" size={32} color={theme.colors.textBlack} />
      </ButtonBase>
    </Box>
  );
};

const styles = StyleSheet.create({
  input: {
    fontFamily: theme.fonts.bold,
    // fixme: react native input font issue https://github.com/facebook/react-native/issues/18820
    fontWeight: 'normal',
    paddingHorizontal: 12,
    marginHorizontal: 12,
    textAlign: 'center',
    borderRadius: 2,
    maxWidth: 200,
    fontSize: 22,
    width: 220,
    height: theme.constants.BUTTON_LARGE_HEIGHT,
  },
});

export default PriceInput;
