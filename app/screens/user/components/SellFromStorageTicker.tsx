import React from 'react';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { Anchor, Text, Box } from 'app/components/base';
import theme from 'app/styles/theme';
import getFaqLink from 'common/constants/faq';
import HintDialog from 'app/components/dialog/HintDialog';
import { Trans } from '@lingui/macro';
import { LB } from 'common/constants';

const SellFromStorageTicker = () => (
  <Box center bg="goldenrod" py={4}>
    <Box width="90%" flexDirection="row" justifyContent="space-between" alignItems="center">
      <Box flexDirection="row" justifyContent="space-between" alignItems="center">
        <Ionicon name="information-circle-outline" size={20} color={theme.colors.white} />
        <Box ml={2}>
          <Text color="white" fontSize={1} fontFamily="medium">
            <Trans>50% OFF: SELL FROM STORAGE</Trans>
          </Text>
        </Box>
      </Box>

      <HintDialog
        hintContent={
          <Text color="white" fontSize={1} textDecorationLine="underline" fontFamily="medium">
            <Trans>LEARN MORE</Trans>
          </Text>
        }
      >
        <Box center p={2}>
          <Text fontFamily="bold" color="green" fontSize={3} mb={4}>
            <Trans>SELL FROM STORAGE DISCOUNT</Trans>
          </Text>
          <Text textAlign="center" fontSize={2} mx={4} my={4}>
            <Trans>
              Sell or List your item from storage now to enjoy a 50% Seller Fee Discount.
              {LB}
              {LB}
              Get your payouts faster, save shipping costs to Novelship, and say goodbye to Buyer
              Flakes.
            </Trans>{' '}
            <Anchor
              to={getFaqLink('sell_from_storage')}
              fontSize={2}
              textDecorationLine="underline"
            >
              <Trans>Learn more</Trans>
            </Anchor>
          </Text>
        </Box>
      </HintDialog>
    </Box>
  </Box>
);

export default SellFromStorageTicker;
