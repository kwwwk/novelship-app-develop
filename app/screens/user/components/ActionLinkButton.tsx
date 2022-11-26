import React from 'react';

import { AnchorButton, Button } from 'app/components/base';
import { ButtonProps } from 'app/components/base/Buttons';
import { AnchorButtonProps } from 'app/components/base/AnchorButton';

const buttonProps = {
  size: 'sm',
  width: '100%',
  style: { marginBottom: 4 },
} as const;

const ActionButton: React.FunctionComponent<
  Omit<ButtonProps, 'variant'> & { variant?: ButtonProps['variant'] }
> = ({ variant = 'black', ...props }) => <Button variant={variant} {...buttonProps} {...props} />;

const ActionLink: React.FunctionComponent<AnchorButtonProps> = (props: AnchorButtonProps) => (
  <AnchorButton variant="black" {...buttonProps} {...props} />
);

export { ActionButton, ActionLink };
