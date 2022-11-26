import {
  TextInputFocusEventData,
  NativeSyntheticEvent,
  TextInputProps,
  StyleSheet,
  TextInput,
} from 'react-native';
import React, { useState } from 'react';
import { Box, ButtonBase } from 'app/components/base';
import Ionicon from 'react-native-vector-icons/Ionicons';
import theme from 'app/styles/theme';

interface InputProps extends TextInputProps {
  type?: 'password' | 'text';
  hasError?: boolean;
}

const BaseInput: React.FC<
  InputProps & { iconButton?: React.ReactNode; removeFocusOnBlur?: boolean }
> = ({ type, hasError, style, onBlur, iconButton, removeFocusOnBlur = true, ...props }) => {
  const [isFocus, setIsFocus] = useState(false);

  const onblur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    if (removeFocusOnBlur) setIsFocus(false);
    if (onBlur) onBlur(e);
  };

  return iconButton ? (
    <Box
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      style={[
        styles.input,
        { paddingRight: iconButton ? 12 : 16 },
        isFocus && styles.inputFocus,
        hasError && styles.inputError,
        style,
      ]}
    >
      <Box width="90%">
        <TextInput
          style={[styles.passwordInput]}
          onFocus={() => setIsFocus(true)}
          onBlur={onblur}
          placeholderTextColor={theme.colors.gray3}
          allowFontScaling={false}
          {...props}
        />
      </Box>
      <Box width="10%" alignItems="center">
        {iconButton}
      </Box>
    </Box>
  ) : (
    <TextInput
      style={[styles.input, isFocus && styles.inputFocus, hasError && styles.inputError, style]}
      onFocus={() => setIsFocus(true)}
      onBlur={onblur}
      placeholderTextColor={theme.colors.gray3}
      allowFontScaling={false}
      {...props}
    />
  );
};

const PasswordInput: React.FC<InputProps> = ({ hasError, style, onBlur, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <BaseInput
      style={style}
      hasError={hasError}
      onBlur={onBlur}
      type="password"
      removeFocusOnBlur={false}
      secureTextEntry={!showPassword}
      {...props}
      iconButton={
        <ButtonBase
          onPress={() => setShowPassword(!showPassword)}
          android_ripple={{ color: theme.colors.gray5, borderless: true }}
          style={{ padding: 4 }}
        >
          <Ionicon
            name={showPassword ? 'eye-outline' : 'eye-off-outline'}
            size={20}
            color={theme.colors.black2}
          />
        </ButtonBase>
      }
    />
  );
};

const Input: React.FC<InputProps & { iconButton?: React.ReactNode; removeFocusOnBlur?: boolean }> =
  ({ type, ...props }) =>
    type === 'password' ? <PasswordInput {...props} /> : <BaseInput type={type} {...props} />;

const styles = StyleSheet.create({
  input: {
    color: theme.colors.textBlack,
    borderColor: theme.colors.borderLightGray,
    fontFamily: theme.fonts.regular,
    borderRadius: 4,
    borderWidth: 1,
    fontSize: 16,
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 0,
    height: theme.constants.BUTTON_HEIGHT + 2,
    textAlignVertical: 'center',
    letterSpacing: theme.constants.LETTER_SPACINGS_TEXT_TITLE,
  },
  inputFocus: {
    borderColor: theme.colors.black2,
  },
  inputError: {
    borderColor: theme.colors.textError,
  },
  passwordInput: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textBlack,
  },
});

export default Input;
