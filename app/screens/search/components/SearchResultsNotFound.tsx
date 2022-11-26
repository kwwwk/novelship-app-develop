import React from 'react';
import { Trans } from '@lingui/macro';

import { Text, Box } from 'app/components/base';

const SearchResultsNotFound = ({ search }: { search: string }) => (
  <Box center p={5} borderBottomWidth={2} borderBottomColor="dividerGray">
    <Trans>
      <Text color="textSecondary" fontFamily="bold">
        SEARCH RESULTS FOR
      </Text>
      <Text my={5} fontSize={2} fontFamily="bold" textTransform="uppercase">
        "{search}"
      </Text>
    </Trans>
    <Text mb={5} fontSize={2} color="textSecondary" textAlign="center" fontFamily="medium">
      <Trans>We couldn’t find what you’re looking for. please try another search.</Trans>
    </Text>
  </Box>
);

export default SearchResultsNotFound;
