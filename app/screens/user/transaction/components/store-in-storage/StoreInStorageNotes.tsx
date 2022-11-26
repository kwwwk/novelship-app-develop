import React from 'react';
import { Trans } from '@lingui/macro';

import { Text, Box, Anchor } from 'app/components/base';
import getFaqLink from 'common/constants/faq';
import { LB } from 'common/constants';

const DeliverToStorageNotes = () => (
  <>
    <Box px={3} mb={3} flexDirection="row">
      <Text style={{ marginTop: -2 }}>{'\u2022'}</Text>
      <Text ml={2} fontSize={2} lineHeight={16}>
        <Text fontFamily="bold" fontSize={2} lineHeight={16}>
          <Trans>Store for free:</Trans>
        </Text>
        {LB}
        <Trans>Put in Novelship Storage for free. Request delivery when you are ready!</Trans>
      </Text>
    </Box>
    <Box px={3} mb={3} flexDirection="row">
      <Text style={{ marginTop: -2 }}>{'\u2022'}</Text>
      <Text ml={2} fontSize={2} lineHeight={16}>
        <Text fontFamily="bold" fontSize={2} lineHeight={16}>
          <Trans> Resell at lower selling fee:</Trans>
        </Text>
        {LB}
        <Trans>Sell from Storage and enjoy up to 50% off on selling fee.</Trans>
      </Text>
    </Box>
    <Box px={3} mb={3} flexDirection="row">
      <Text style={{ marginTop: -2 }}>{'\u2022'}</Text>
      <Text ml={2} fontSize={2} lineHeight={16}>
        <Trans>
          Delivery fee paid will be refunded if you sell from storage. Refund will be in the form of
          a Discount Code.
        </Trans>
      </Text>
    </Box>

    <Box px={3} mb={3} flexDirection="row">
      <Text style={{ marginTop: -2 }}>{'\u2022'}</Text>
      <Text ml={2} fontSize={2} lineHeight={16}>
        <Trans>
          <Anchor
            to={getFaqLink('post_purchase_storage')}
            fontSize={2}
            textDecorationLine="underline"
          >
            Learn more
          </Anchor>
        </Trans>
      </Text>
    </Box>
  </>
);

export default DeliverToStorageNotes;
