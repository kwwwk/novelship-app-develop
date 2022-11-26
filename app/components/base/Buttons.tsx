import React from 'react';
import { TextStyle, Pressable, ViewStyle, PressableProps, StyleProp } from 'react-native';
import theme, { Theme } from 'app/styles/theme';
import { IS_OS_ANDROID } from 'common/constants';
import { BoxProps } from '@shopify/restyle';
import Text from './Text';
import LoadingIndicator from '../misc/LoadingIndicator';

export interface ButtonProps extends PressableProps, BoxProps<Theme, true> {
  text?: string;
  onPress: () => void;
  variant: keyof Theme['buttonVariants'];
  color?: keyof Theme['colors'];
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  activeOpacity?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  fontSize?: number;
}

const sizeIndex = {
  xs: 0,
  sm: 1,
  md: 2,
  lg: 3,
};

// Do not extend this component with more conditionals, however more style props may be added.
const Button = (buttonProps: ButtonProps) => {
  const {
    text,
    onPress,
    variant,
    disabled,
    loading,
    style,
    fontSize: buttonFontSize,
    size = 'md',
    color: buttonColorName,
    ...props
  } = buttonProps;

  const variantProps = theme.buttonVariants[variant];
  const touchProps: PressableProps = { ...props, ...variantProps.props };
  const disabledProps = (disabled && variantProps.disabled) || {};
  const { activeOpacity } = variantProps.props;

  const { fontSizes, heights, ...themedStyles } = { ...variantProps, ...disabledProps };
  const { fontFamily, color, textTransform, letterSpacing } = themedStyles as unknown as TextStyle &
    ViewStyle & { fontFamily: keyof Theme['fonts'] };

  const { textColor } = themedStyles;
  const buttonColor = buttonColorName && theme.colors[buttonColorName];

  // Button Size style selection
  const fontSize = buttonFontSize ?? fontSizes[sizeIndex[size]];
  const height = heights[sizeIndex[size]];

  // Disable handler when loading
  const onPressHandler = loading ? () => {} : onPress;

  const content = loading ? (
    <LoadingIndicator color={textColor} />
  ) : (
    <Text
      textTransform={textTransform}
      letterSpacing={letterSpacing}
      fontFamily={fontFamily}
      fontSize={fontSize}
      style={{ color: textColor || buttonColor }}
    >
      {text}
    </Text>
  );

  return (
    <Pressable
      android_ripple={{ color: textColor }}
      onPress={onPressHandler}
      style={({ pressed }) => [
        {
          height,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 4,
          backgroundColor: color,
          opacity: !IS_OS_ANDROID && pressed ? activeOpacity : 1,
        },
        themedStyles,
        style,
      ]}
      disabled={loading || disabled}
      {...touchProps}
    >
      {content}
    </Pressable>
  );
};

const activeButtonOpacity = 0.82;

const ButtonBase = ({
  android_ripple,
  touchEffectDisabled,
  style,
  ...props
}: {
  style?: StyleProp<ViewStyle>;
  touchEffectDisabled?: boolean;
} & PressableProps & { children?: React.ReactNode }) =>
  touchEffectDisabled ? (
    <Pressable {...props} />
  ) : (
    <Pressable
      android_ripple={android_ripple}
      style={({ pressed }) => [
        { opacity: (!IS_OS_ANDROID || !android_ripple) && pressed ? activeButtonOpacity : 1 },
        style,
      ]}
      {...props}
    />
  );

export { Button, ButtonBase };
