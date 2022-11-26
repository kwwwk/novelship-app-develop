import React from 'react';

import { Text } from '../base';
import { TextProps } from '../base/Text';

const ErrorMessage = ({ children, ...props }: TextProps) =>
  children ? (
    <Text color="textError" fontSize={2} {...props}>
      {children}
    </Text>
  ) : null;

export default ErrorMessage;
