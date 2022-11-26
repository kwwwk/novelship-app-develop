import React from 'react';
import { Trans } from '@lingui/macro';

import { Anchor } from 'app/components/base';

const FollowSocial = () => (
  <Trans>
    Follow our{' '}
    <Anchor fontSize={1} fontFamily="bold" color="white" textDecorationLine="underline" to="/news">
      blog
    </Anchor>{' '}
    and{' '}
    <Anchor
      fontSize={1}
      fontFamily="bold"
      color="white"
      textDecorationLine="underline"
      to="https://instagram.com/novelship/"
    >
      instagram
    </Anchor>{' '}
    for updates.
  </Trans>
);

export default FollowSocial;
