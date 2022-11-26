import React from 'react';
import { Trans } from '@lingui/macro';

import { Text, Box, Anchor } from 'app/components/base';
import getFaqLink from 'common/constants/faq';

const PostDeliveryProtectionNotes = () => (
  <>
    <Box px={3} mb={3} flexDirection="row">
      <Text style={{ marginTop: -2 }}>{'\u2022'}</Text>
      <Text ml={2} fontSize={2} lineHeight={16} fontFamily="bold">
        <Trans>Affordable, Great Coverage, Added Security.</Trans>
      </Text>
    </Box>
    <Box px={3} mb={3} flexDirection="row">
      <Text style={{ marginTop: -2 }}>{'\u2022'}</Text>
      <Text ml={2} fontSize={2} lineHeight={16}>
        <Trans>
          We do not support delivery protection for purchases to and delivery from Novelship Storage
          at this time.
        </Trans>
      </Text>
    </Box>
    <Box px={3} mb={3} flexDirection="row">
      <Text style={{ marginTop: -2 }}>{'\u2022'}</Text>
      <Text ml={2} fontSize={2} lineHeight={16}>
        <Trans>
          <Anchor
            to={getFaqLink('post_purchase_protection')}
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

export { PostDeliveryProtectionNotes };
