import * as React from 'react';
import {
  createText,
  createRestyleFunction,
  createRestyleComponent,
  TextProps as RSTextProps,
} from '@shopify/restyle';
import { Theme } from 'app/styles/theme';
import { TextProps as RNTextProps } from 'react-native';

export type TextProps = RSTextProps<Theme, true> &
  RNTextProps & { children?: React.ReactNode; fontFamily?: keyof Theme['fonts'] };

const BaseText = createText<Theme>();

const fontSize = createRestyleFunction({
  property: 'fontSize',
  styleProperty: 'fontSize',
  transform: ({ theme, value }: { theme: Theme; value: number }) => theme.fontSizes[value] || value,
});

const fontFamily = createRestyleFunction({
  property: 'fontFamily',
  styleProperty: 'fontFamily',
  transform: ({ theme, value }: { theme: Theme; value: keyof Theme['fonts'] }) =>
    theme.fonts[value] || value,
});

const RSText = createRestyleComponent<TextProps, Theme>([fontSize, fontFamily], BaseText);

const Text = (props: TextProps) => <RSText allowFontScaling={false} {...props} />;

export default Text;
