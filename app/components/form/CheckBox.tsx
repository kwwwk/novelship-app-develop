import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import CheckBox, { CheckBoxProps as RNCheckBoxProps } from '@react-native-community/checkbox';
import { ButtonBase, Box } from 'app/components/base';
import theme from 'app/styles/theme';
import { WINDOW_WIDTH } from 'common/constants';

interface CheckBoxProps extends RNCheckBoxProps {
  checked?: boolean;
  onChecked?: (arg0: boolean) => void;
  hasError?: boolean;
}

// Issue: Checkbox controlled component issue https://github.com/react-native-checkbox/react-native-checkbox/issues/71
// WARNING: Cannot be used as a Control Component
const CheckBoxInput: React.FunctionComponent<CheckBoxProps> = ({
  children,
  checked,
  onChecked,
  disabled,
  hasError,
}) => {
  const onChange = () => {
    if (disabled) return;
    if (onChecked) {
      onChecked(!checked);
    }
  };

  const color = theme.colors[hasError ? 'red' : disabled ? 'gray3' : 'textBlack'];

  const checkBoxProps: CheckBoxProps = {
    style: styles.checkBox,
    disabled,
    boxType: 'square',
    lineWidth: 2,
    animationDuration: 0,
    onAnimationType: 'fade',
    offAnimationType: 'fade',
    tintColors: {
      true: color,
      false: color,
    },
    tintColor: color,
    onTintColor: color,
    onCheckColor: color,
  };

  return (
    <Box
      style={[children ? styles.checkBoxContainer : {}]}
      maxWidth={WINDOW_WIDTH - (theme.spacing[5] * 2 + 22 + 14)} // page padding * 2 + checkbox width + checkbox margin-right
    >
      <CheckBox {...checkBoxProps} value={checked || false} onValueChange={onChange} />
      {children && <ButtonBase onPress={onChange}>{children}</ButtonBase>}
    </Box>
  );
};

const styles = StyleSheet.create({
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkBox: {
    height: 20,
    width: 20,
    ...Platform.select({
      ios: {
        marginRight: 10,
      },
      android: {
        transform: [{ scale: 1.25 }],
        marginRight: 16,
      },
    }),
  },
});

export default CheckBoxInput;
