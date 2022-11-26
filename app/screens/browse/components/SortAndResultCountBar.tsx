import React, { useContext } from 'react';
import { i18n } from '@lingui/core';
import { t, Trans } from '@lingui/macro';

import { useStoreState } from 'app/store';
import { Text, Box } from 'app/components/base';
import AlgoliaClient from 'app/services/algolia';
import Select from 'app/components/form/SelectInput';
import theme from 'app/styles/theme';

import BrowseContext from '../context';

const SortAndResultCountBar = ({ resultCount }: { resultCount: number }) => {
  const { sort, setSort } = useContext(BrowseContext);
  const currentCountryCode = useStoreState((s) => s.country.current.shortcode);

  const mostPopularValue = Object.keys(AlgoliaClient).includes(`mostPopular${currentCountryCode}`)
    ? `mostPopular${currentCountryCode}`
    : 'mostPopular';

  const sortOptions = [
    { value: 'search', label: i18n._(t`Most Relevant`) },
    { value: mostPopularValue, label: i18n._(t`Most Popular`) },
    { value: 'priceLowToHigh', label: i18n._(t`Price (Low to High)`) },
    { value: 'priceHighToLow', label: i18n._(t`Price (High to Low)`) },
  ];

  if (currentCountryCode !== 'US') {
    sortOptions.push({ value: `upcomingReleaseUS`, label: i18n._(t`Upcoming Release (US)`) });
  }

  if (Object.keys(AlgoliaClient).includes(`upcomingRelease${currentCountryCode}`)) {
    sortOptions.push({
      value: `upcomingRelease${currentCountryCode}`,
      label: i18n._(t`Upcoming Release (${currentCountryCode})`),
    });
  }

  sortOptions.push({ value: 'latestRelease', label: i18n._(t`Latest Release`) });

  return (
    <Box px={5} py={2} flexDirection="row" alignItems="center" justifyContent="space-between">
      <Box flexDirection="row">
        <Trans>
          <Text color="black2" fontSize={1} fontFamily="bold">
            {resultCount}{' '}
          </Text>
          <Text color="textSecondary" fontSize={1} fontFamily="medium">
            results found
          </Text>
        </Trans>
      </Box>
      <Box center flexDirection="row">
        <Text color="textSecondary" fontSize={1} fontFamily="medium" mr={3}>
          <Trans>Sort by:</Trans>
        </Text>
        <Select
          onChangeText={setSort as (arg: string) => void}
          items={sortOptions}
          value={sort}
          selectStyles={{
            fontFamily: theme.fonts.medium,
            paddingHorizontal: 0,
            paddingRight: 24,
            fontSize: 12,
          }}
          iconStyles={{ top: -3, right: 0, backgroundColor: 'transparent' }}
          style={{ flex: 0, height: 50, borderColor: 'transparent' }}
        />
      </Box>
    </Box>
  );
};

export default SortAndResultCountBar;
