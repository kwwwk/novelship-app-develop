import React, { useState } from 'react';
import { t, Trans } from '@lingui/macro';

import useAPIListFetch from 'app/hooks/useAPIListFetch';
import { Text, Box } from 'app/components/base';
import { UserWishlistType } from 'types/resources/wishlist';
import LoadingIndicator from 'app/components/misc/LoadingIndicator';
import { FlatListContainer, SafeAreaScreenContainer } from 'app/components/layout';
import WishlistCard from '../components/WishlistCard';
import SortFilterActionBar from '../components/SortFilterActionBar';
import SearchFilterActionBar from '../components/SearchFilterActionBar';

const currentWishlistParams = {
  page: { size: 20, number: 0 },
  include: ['product'],
};

const sortSettings = [
  { name: t`Date`, key: 'id' },
  { name: t`Name`, key: 'product.name' },
  { name: t`Offer`, key: 'product_stat.highest_offer_price' },
  { name: t`List`, key: 'product_stat.lowest_list_price' },
  { name: t`Last Sale`, key: 'product_stat.last_sale_price' },
];

const Wishlist = () => {
  const {
    fetchMore,
    refetch,
    isLoading,
    results: currentlyWishListed,
    total: currentlyWishListedCount,
  } = useAPIListFetch<UserWishlistType>('me/wishlist', currentWishlistParams, {
    refetchOnScreenFocus: true,
  });

  const [search, setSearch] = useState<string>('');

  const WishListCardListItem = ({ item: wishlistItem }: { item: UserWishlistType }) => (
    <WishlistCard key={wishlistItem.id} item={wishlistItem} refetch={refetch} />
  );

  return (
    <SafeAreaScreenContainer>
      <SearchFilterActionBar refetch={refetch} search={search} setSearch={setSearch} />
      <SortFilterActionBar onSort={refetch} sortSettings={sortSettings} />
      {currentlyWishListed.length ? (
        <FlatListContainer<UserWishlistType>
          data={currentlyWishListed}
          keyExtractor={(item) => item.id.toString()}
          renderItem={WishListCardListItem}
          onEndReached={() => fetchMore()}
          ListFooterComponent={
            <Box center my={3} p={5}>
              {isLoading && currentlyWishListed.length < currentlyWishListedCount && (
                <LoadingIndicator />
              )}
            </Box>
          }
        />
      ) : isLoading ? (
        <Box center p={5}>
          <LoadingIndicator />
        </Box>
      ) : (
        <Text p={5} fontSize={1} fontFamily="regular" textAlign="center">
          <Trans>No items wishlisted.</Trans>
        </Text>
      )}
    </SafeAreaScreenContainer>
  );
};

export default Wishlist;
