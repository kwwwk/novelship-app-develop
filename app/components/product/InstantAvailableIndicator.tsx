import React from 'react';
import { Trans } from '@lingui/macro';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { Text, Box } from 'app/components/base';
import { BoxProps } from 'app/components/base/Box';
import theme from 'app/styles/theme';

const InstantAvailableIndicator = ({
  isInstantAvailable,
  view = 'full',
  size = 'md',
  ...props
}: {
  isInstantAvailable: boolean;
  view?: 'icon' | 'half' | 'full';
  size?: 'sm' | 'md' | 'lg';
} & BoxProps) =>
  isInstantAvailable ? (
    <Box alignItems="center" flexDirection="row" {...props}>
      {view === 'icon' ? (
        <Text mr={1}>
          <Ionicon
            name="flash-sharp"
            color={theme.colors.green}
            size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16}
          />
        </Text>
      ) : (
        <>
          <Text mr={1}>
            <Ionicon
              name="flash-sharp"
              color={theme.colors.green}
              size={size === 'sm' ? 12 : size === 'lg' ? 16 : 14}
            />
          </Text>
          <Text
            color="green"
            fontFamily="bold"
            textTransform="uppercase"
            fontSize={size === 'lg' ? 3 : 0}
          >
            {view === 'full' ? <Trans>Instant Available</Trans> : <Trans>Available</Trans>}
          </Text>
        </>
      )}
    </Box>
  ) : null;

export default InstantAvailableIndicator;
