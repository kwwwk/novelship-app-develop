import React from 'react';
import { i18n } from '@lingui/core';
import { t, Trans } from '@lingui/macro';

import { Button, Box, Text } from 'app/components/base';
import { partialMatcher } from 'common/utils/string';
import { Input, Select } from 'app/components/form';
import { APIQueryParamsType } from 'common/api/query';
import theme from 'app/styles/theme';
import { IS_OS_IOS } from 'common/constants';
import { productSkuSearchFilter } from 'common/constants/offerList';

const SearchFilterActionBar = ({
  mode,
  refetch,
  showStatusFilter = false,
  search,
  setSearch,
  selectedStatus,
  setSelectedStatus,
}: {
  mode?: 'offer' | 'list' | 'buy' | 'sell';
  refetch: (_: APIQueryParamsType) => void;
  showStatusFilter?: boolean;
  search: string;
  setSearch: (_: string) => void;
  selectedStatus?: string;
  setSelectedStatus?: (_: string) => void;
}) => {
  // const [sortBy, setSortBy] = useState('-id');

  // @ts-ignore ignore
  // eslint-disable-next-line
  const isOfferList = /(offer|list)/.test(mode);
  // const sortOptions = isOfferList
  //   ? [
  //       { value: '-id', label: 'Most Recent' },
  //       { value: 'expired_at', label: 'Expiring Soon' },
  //     ]
  //   : [
  //       { value: '-id', label: 'Most Recent' },
  //       { value: 'id', label: 'Oldest' },
  //       // { value: mode === 'sell' ? 'list_price_local' : 'offer_price_local', label: 'Price' },
  //     ];

  const submit = () =>
    refetch({
      filter: {
        status: selectedStatus === 'all' ? '' : selectedStatus || '',
        ...productSkuSearchFilter(search),
      },
    });

  // const sort = (_sortBy: string) => {
  //   setSortBy(_sortBy);
  //   if (_sortBy) {
  //     refetch({ sort: _sortBy });
  //   }
  // };

  return (
    <Box center px={5} py={3} bg="gray8">
      <Box center flexDirection="row">
        <Input
          onChangeText={setSearch}
          placeholder={i18n._(t`Search by Name, SKU`)}
          returnKeyType="search"
          numberOfLines={1}
          onSubmitEditing={submit}
          style={{
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            width: '75%',
            height: 35,
            fontSize: 13,
          }}
        />
        <Button
          width="25%"
          variant="black"
          size="xs"
          text={i18n._(t`SEARCH`)}
          onPress={submit}
          style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, height: 35 }}
        />
      </Box>
      {showStatusFilter && (
        <Box center flexDirection="row" style={{ marginBottom: -8, marginTop: -2 }}>
          <Text mr={2} fontSize={2}>
            <Trans>Status: </Trans>
          </Text>
          <Select
            items={[
              { label: i18n._(t`All`), value: 'all' },
              { label: i18n._(t`Pending Shipment`), value: 'confirmed' },
              { label: i18n._(t`Shipping to Novelship`), value: 'shipping' },
              { label: i18n._(t`Authenticating`), value: 'authenticating' },
            ]}
            value={selectedStatus}
            onChangeText={(status) => {
              if (setSelectedStatus) setSelectedStatus(status);
              refetch({
                filter: {
                  status: status === 'all' ? '' : status,
                  [encodeURIComponent('product.name|product.sku:likeLower')]:
                    partialMatcher(search),
                },
              });
            }}
            selectStyles={{
              fontFamily: theme.fonts.medium,
              paddingHorizontal: 0,
              paddingRight: 24,
              fontSize: 14,
            }}
            iconStyles={{ top: IS_OS_IOS ? -2 : 0, right: 0, backgroundColor: 'transparent' }}
            style={{
              flex: 0,
              height: 46,
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: 'transparent',
            }}
          />
        </Box>
      )}
      {/* <Box center mt={4} flexDirection="row">
        <Text fontSize={2} fontFamily="regular" mr={3}>
          Sort by:
        </Text>
        <Select
          value={sortBy}
          onChangeText={sort}
          items={sortOptions}
          placeholder="Select"
          selectStyles={{ fontFamily: theme.fonts.medium, height: 40 }}
          iconStyles={{ top: -3, backgroundColor: 'transparent' }}
          style={{ flex: 0, width: 160, height: 40 }}
        />
      </Box> */}
    </Box>
  );
};

export default SearchFilterActionBar;
