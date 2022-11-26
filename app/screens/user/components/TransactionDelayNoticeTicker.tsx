import React from 'react';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { Trans } from '@lingui/macro';

import { Text, Box } from 'app/components/base';
import theme from 'app/styles/theme';

const TransactionDelayNoticeTicker = () => (
  <Box center bg="alert" py={3}>
    <Box center width="86%" flexDirection="row" justifyContent="space-between">
      <Ionicon name="alert-circle-outline" size={24} color={theme.colors.white} />
      <Box ml={2}>
        <Text color="white" fontSize={1} fontFamily="medium">
          <Trans>Due to COVID-19, please allow 2 to 3 weeks for processing and delivery.</Trans>
        </Text>
      </Box>
    </Box>
  </Box>
);

export default TransactionDelayNoticeTicker;
