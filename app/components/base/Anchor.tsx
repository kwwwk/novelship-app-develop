import { openExternalUrl } from 'app/services/url';
import React from 'react';

import Text, { TextProps } from './Text';

const Anchor = ({
  children,
  to,
  action = () => {},
  ...props
}: TextProps & {
  to?: string;
  action?: () => void;
}) => (
  <Text
    onPress={() => {
      openExternalUrl(to);
      action();
    }}
    {...props}
  >
    {children}
  </Text>
);

export default Anchor;
