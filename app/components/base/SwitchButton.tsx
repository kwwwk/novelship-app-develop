import theme from 'app/styles/theme';
import React from 'react';
import { Platform, Switch } from 'react-native';
import { CheckBoxProps as RNCheckBoxProps } from '@react-native-community/checkbox';

const SIZE_SCALE = Platform.OS === 'ios' ? 1 : 1.2;

interface CheckBoxProps extends RNCheckBoxProps {
  checked?: boolean;
  onChecked?: (arg0: boolean) => void;
}
const SwitchButton = ({ value, checked, onChecked }: { value?: boolean } & CheckBoxProps) => {
  const onChange = () => onChecked && onChecked(!checked);

  return (
    <Switch
      trackColor={{ true: theme.colors.blue, false: theme.colors.gray3 }}
      style={{ transform: [{ scale: SIZE_SCALE }] }}
      thumbColor={theme.colors.gray9}
      value={value || checked}
      onValueChange={onChange}
    />
  );
};

export default SwitchButton;
