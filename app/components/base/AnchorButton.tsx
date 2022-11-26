import React from 'react';

import { openExternalUrl } from 'app/services/url';
import { Button, ButtonProps, ButtonBase } from './Buttons';

export type AnchorButtonProps = Omit<ButtonProps, 'onPress' | 'variant'> & {
  to?: string;
  variant?: ButtonProps['variant'];
  action?: () => void;
};

const AnchorButton: React.FunctionComponent<AnchorButtonProps> = ({
  to,
  action = () => {},
  variant,
  ...props
}) =>
  variant ? (
    <Button
      variant={variant}
      onPress={() => {
        openExternalUrl(to);
        action();
      }}
      {...props}
    />
  ) : (
    <ButtonBase
      onPress={() => {
        openExternalUrl(to);
        action();
      }}
      {...props}
    />
  );

export default AnchorButton;
