import * as React from 'react';
import { Trans } from '@lingui/macro';
import { SvgProps } from 'react-native-svg';

import { Box, Text } from 'app/components/base';
import GlobalReachIcon from 'app/components/icons/GlobalReachIcon';
import AuthenticIcon from 'app/components/icons/AuthenticIcon';
import CustomerSupportIcon from 'app/components/icons/CustomerSupportIcon';
import SecureIcon from 'app/components/icons/SecureIcon';
import { LB } from 'common/constants';

const ServiceBadges = () => (
  <Box flexDirection="row" justifyContent="space-between" alignItems="center">
    <ServiceBadge Icon={GlobalReachIcon}>
      <Trans>SE ASIA{LB}MARKETPLACE</Trans>
    </ServiceBadge>
    <ServiceBadge Icon={AuthenticIcon}>
      <Trans>CERTIFIED{LB}AUTHENTIC</Trans>
    </ServiceBadge>
    <ServiceBadge Icon={CustomerSupportIcon}>
      <Trans>CUSTOMER{LB}CARE</Trans>
    </ServiceBadge>
    <ServiceBadge Icon={SecureIcon}>
      <Trans>SECURE{LB}TRANSACTIONS</Trans>
    </ServiceBadge>
  </Box>
);

const ServiceBadge = ({
  Icon,
  children,
}: {
  Icon: React.FunctionComponent<SvgProps>;
  children: React.ReactNode;
}) => (
  <Box center style={{ width: '25%' }}>
    <Icon width={66} height={66} />
    <Text
      textAlign="center"
      fontFamily="medium"
      ellipsizeMode="clip"
      numberOfLines={2}
      mt={2}
      fontSize={11}
    >
      {children}
    </Text>
  </Box>
);

export default ServiceBadges;
