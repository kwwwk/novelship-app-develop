import React, { useEffect, useState } from 'react';
import { TextInputProps, StyleSheet, TextStyle } from 'react-native';
import RNPickerSelect, { Item as PickerItem } from 'react-native-picker-select';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { Box } from 'app/components/base';
import theme from 'app/styles/theme';
import { IS_OS_IOS } from 'common/constants';

interface InputProps extends TextInputProps {
  items: PickerItem[];
  editable?: boolean;
  hasError?: boolean;
  iconStyles?: TextStyle;
  selectStyles?: TextStyle;
}

const SelectIcon = ({ color }: { color: string }) => (
  <Ionicon name="chevron-down" size={22} color={color} />
);

const Select = (
  {
    items,
    value,
    hasError,
    placeholder,
    onChangeText,
    editable = true,
    style = {},
    iconStyles = {},
    selectStyles = {},
    iconColor = theme.colors.textBlack,
  }: InputProps & { iconColor?: string },
  ref?: any
) => {
  const [selectorValue, setSelectorValue] = useState<string | undefined>(value);

  useEffect(() => {
    setSelectorValue(value);
  }, [value]);

  const inputStyles = {
    ...styles.select,
    ...selectStyles,
    ...(editable ? {} : styles.selectContainerDisabled),
  };

  return (
    <Box style={[styles.selectContainer, hasError && styles.selectContainerError, style]}>
      <RNPickerSelect
        ref={ref}
        placeholder={placeholder ? { label: placeholder, value: '' } : {}}
        useNativeAndroidPickerStyle={false}
        Icon={() => <SelectIcon color={iconColor} />}
        onValueChange={(selectItem) => {
          setSelectorValue(selectItem);
          if (!IS_OS_IOS && onChangeText) {
            onChangeText(selectItem);
          }
        }}
        onDonePress={() => {
          if (IS_OS_IOS && onChangeText && selectorValue) {
            onChangeText(selectorValue);
          }
        }}
        value={String(selectorValue)}
        disabled={!editable}
        items={items}
        style={{
          inputAndroid: inputStyles,
          inputIOS: inputStyles,
          iconContainer: { ...styles.iconContainer, ...iconStyles },
        }}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  selectContainer: {
    borderColor: theme.colors.borderLightGray,
    justifyContent: 'center',
    borderRadius: 4,
    borderWidth: 1,
    height: theme.constants.BUTTON_HEIGHT,
    maxHeight: theme.constants.BUTTON_HEIGHT,
    flex: 1,
  },
  select: {
    color: theme.colors.black2,
    paddingHorizontal: 12,
  },
  selectContainerDisabled: {
    color: theme.colors.gray4,
  },
  selectContainerError: {
    borderColor: theme.colors.textError,
  },
  iconContainer: {
    top: -2,
    right: 12,
    backgroundColor: theme.colors.transparent,
    height: '100%',
    justifyContent: 'center',
  },
});

export default React.forwardRef(Select);
