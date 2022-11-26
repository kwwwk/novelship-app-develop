import React from 'react';
import { Trans } from '@lingui/macro';

import { Box, Text } from 'app/components/base';
import HintDialog from 'app/components/dialog/HintDialog';
import Ionicon from 'react-native-vector-icons/Ionicons';
import theme from 'app/styles/theme';

const ShippingSurchargeInfoDialog = ({
  deliveryPrepaidText = '',
}: {
  deliveryPrepaidText?: string;
}) => (
  <HintDialog
    hintContent={
      <Box alignItems="center" flexDirection="row">
        <Text fontFamily="medium">
          <Trans>Emergency Courier Surcharge</Trans> {deliveryPrepaidText}
        </Text>
        <Text> </Text>
        <Ionicon name="information-circle" size={22} color={theme.colors.textBlack} />
      </Box>
    }
  >
    <Box p={2}>
      <Text textAlign="center" fontSize={4} fontFamily="bold">
        <Trans>EMERGENCY COURIER SURCHARGE</Trans>
      </Text>
      <Text textAlign="center" fontSize={2} my={4}>
        <Trans>
          This is a temporary emergency surcharge added by the courier service due to the ongoing
          COVID-19 crisis worldwide.
        </Trans>
      </Text>
    </Box>
  </HintDialog>
);

export default ShippingSurchargeInfoDialog;
