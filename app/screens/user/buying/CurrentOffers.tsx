import { OfferListType } from 'types/resources/offerList';
import { t, Trans } from '@lingui/macro';
import { Text, Box } from 'app/components/base';
import { useStoreState } from 'app/store';
import LoadingIndicator from 'app/components/misc/LoadingIndicator';
import React, { useState } from 'react';
import useAPIListFetch from 'app/hooks/useAPIListFetch';
import validOfferListsFilter, { productSkuSearchFilter } from 'common/constants/offerList';
import { FlatListContainer } from 'app/components/layout';
import OfferListCard from '../components/OfferListCard';
import SearchFilterActionBar from '../components/SearchFilterActionBar';
import SortFilterActionBar from '../components/SortFilterActionBar';

const sortSettings = [
  { name: t`Name`, key: 'product.name' },
  { name: t`List`, key: 'product_stat.lowest_list_price' },
  { name: t`Offer`, key: 'product_stat.highest_offer_price' },
  { name: t`Expiry`, key: 'expired_at' },
  {
    name: t`Spread`,
    key: 'product_stat.lowest_list_price - price',
  },
];

const OfferListCardListItem = ({ item: offer }: { item: OfferListType }) => (
  <OfferListCard key={offer.id} item={offer} mode="offer" />
);

const CurrentOffers = () => {
  const [search, setSearch] = useState<string>('');
  const currentCurrencyId = useStoreState((s) => s.currency.current.id);

  const currentlyOfferedParams = {
    page: { size: 20, number: 0 },
    include: ['product', 'currency'],
    filter: {
      type: 'buying',
      local_currency_id: currentCurrencyId,
      ...validOfferListsFilter,
    },
  };

  const {
    refetch,
    fetchMore,
    isLoading,
    results: currentlyOffered,
    total: currentlyOfferedCount,
  } = useAPIListFetch<OfferListType>('me/offer-lists', currentlyOfferedParams, {
    refetchOnScreenFocus: true,
    filter: productSkuSearchFilter(search),
  });

  return (
    <>
      <SearchFilterActionBar mode="offer" refetch={refetch} search={search} setSearch={setSearch} />
      <SortFilterActionBar onSort={refetch} sortSettings={sortSettings} />
      {currentlyOffered.length ? (
        <FlatListContainer<OfferListType>
          data={currentlyOffered}
          keyExtractor={(item) => item.id.toString()}
          renderItem={OfferListCardListItem}
          onEndReached={() => fetchMore()}
          ListFooterComponent={
            <Box center my={3} p={5}>
              {isLoading && currentlyOffered.length < currentlyOfferedCount && <LoadingIndicator />}
            </Box>
          }
        />
      ) : isLoading ? (
        <Box center p={5}>
          <LoadingIndicator />
        </Box>
      ) : (
        <Text p={5} fontSize={1} fontFamily="regular" textAlign="center">
          <Trans>No offers found.</Trans>
        </Text>
      )}
    </>
  );
};

export default CurrentOffers;
