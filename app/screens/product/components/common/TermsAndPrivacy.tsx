import React from 'react';
import { Trans } from '@lingui/macro';
import { Anchor, Text } from 'app/components/base';

const TermsAndPrivacy = () => (
  <Text fontSize={1} textAlign="center" lineHeight={20} mt={8}>
    <Trans>
      By proceeding, you agree to the{' '}
      <Anchor to="terms" textDecorationLine="underline" color="blue" fontSize={1}>
        Terms
      </Anchor>{' '}
      &amp;{' '}
      <Anchor to="privacy" textDecorationLine="underline" color="blue" fontSize={1}>
        Privacy Policy
      </Anchor>
    </Trans>
  </Text>
);

export default TermsAndPrivacy;
