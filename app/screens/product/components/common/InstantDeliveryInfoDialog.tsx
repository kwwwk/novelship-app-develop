import React from 'react';
import { useStoreState } from 'app/store';
import { Trans } from '@lingui/macro';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { getBuyerDeliveryInstantFee } from 'common/utils/buy';
import { Anchor, Box, Text } from 'app/components/base';
import InstantAvailableIndicator from 'app/components/product/InstantAvailableIndicator';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import HintDialog from 'app/components/dialog/HintDialog';
import getFaqLink from 'common/constants/faq';
import theme from 'app/styles/theme';

const InstantDeliveryInfoDialogContent: React.FC<{ instantDeliveryFee: string }> = ({
  instantDeliveryFee,
}) => (
  <Box center p={2}>
    <InstantAvailableIndicator isInstantAvailable size="lg" mb={4} />
    <Text textAlign="center" fontSize={2} my={2}>
      <Trans>
        Instant Delivery products are pre-verified and ready to ship with priority processing.
      </Trans>
    </Text>
    <Text textAlign="center" fontSize={2} my={2}>
      <Trans>Your order will be processed within 1-2 working days.</Trans>
    </Text>
    <Text textAlign="center" fontSize={2} my={2}>
      <Trans>
        Pricing includes priority processing of {instantDeliveryFee}.{' '}
        <Anchor to={getFaqLink('instant_delivery')} fontSize={2} textDecorationLine="underline">
          Learn more
        </Anchor>
      </Trans>
    </Text>
  </Box>
);

const InstantDeliveryInfoDialog = () => {
  const user = useStoreState((s) => s.user.user);
  const instantDeliveryFee = getBuyerDeliveryInstantFee(user);
  const { $ } = useCurrencyUtils();

  return (
    <HintDialog
      hintContent={
        <Box alignItems="center" flexDirection="row">
          <Text fontFamily="medium">
            <Trans>Priority Processing</Trans>{' '}
          </Text>
          <Ionicon name="information-circle" size={22} color={theme.colors.textBlack} />
        </Box>
      }
    >
      <InstantDeliveryInfoDialogContent instantDeliveryFee={$(instantDeliveryFee)} />
    </HintDialog>
  );
};

export { InstantDeliveryInfoDialogContent };
export default InstantDeliveryInfoDialog;
