import React from 'react';
import { ViewProps as RNViewProps } from 'react-native';
import { createBox, BoxProps as DefaultBoxProps } from '@shopify/restyle';
import { Theme } from 'app/styles/theme';

type RSBoxProps = DefaultBoxProps<Theme, true> & RNViewProps & { children?: React.ReactNode };

export interface BoxProps extends RSBoxProps {
  center?: boolean;
}

const Box: React.FunctionComponent<BoxProps> = ({ center, ...boxProps }) => (
  <BaseBox
    {...boxProps}
    style={[center && { justifyContent: 'center', alignItems: 'center' }, boxProps.style]}
  />
);

const BaseBox = createBox<Theme>();

export default Box;
