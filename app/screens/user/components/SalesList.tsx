import { Trans } from '@lingui/macro';
import React, { useEffect, useState } from 'react';
import { RouteProp } from '@react-navigation/native';

import { Text, Box } from 'app/components/base';
import useAPIListFetch from 'app/hooks/useAPIListFetch';
import { TransactionType } from 'types/resources/transaction';
import LoadingIndicator from 'app/components/misc/LoadingIndicator';
import { productSkuSearchFilter } from 'common/constants/offerList';
import { BuyingTopTabRoutes, SellingTopTabRoutes } from 'types/navigation';
import { FlatListContainer, SafeAreaScreenContainer } from 'app/components/layout';

import SaleCard from './SaleCard';
import SearchFilterActionBar from './SearchFilterActionBar';
import SellFromStorageTicker from './SellFromStorageTicker';
import PurchaseConfirmCard from './PurchaseConfirmedCard';

const salesParams = {
  page: { size: 20, number: 0 },
  filter: {},
};

const SaleCardBuyListItem = ({ item: trxn }: { item: TransactionType }) => (
  <SaleCard key={trxn.id} item={trxn} mode="buy" />
);

const SaleCardBuyConfirmedListItem = ({ item: trxn }: { item: TransactionType }) => (
  <PurchaseConfirmCard key={trxn.id} item={trxn} mode="buy" />
);

const SaleCardSellListItem = ({ item: trxn }: { item: TransactionType }) => (
  <SaleCard key={trxn.id} item={trxn} mode="sell" />
);

const SalesList = ({ route }: { route: RouteProp<BuyingTopTabRoutes | SellingTopTabRoutes> }) => {
  const [search, setSearch] = useState<string>('');

  const mode = /Sales/.test(route.name) ? 'sell' : 'buy';
  const isStorage = route.name === 'Storage';
  const isPurchaseConfirmed = route.name === 'ConfirmedPurchases';

  const endpoint = isStorage ? 'in_storage' : /Confirmed/.test(route.name) ? 'confirmed' : 'past';

  const {
    refetch,
    fetchMore,
    isLoading,
    results: sales,
    total: salesCount,
  } = useAPIListFetch<TransactionType>(`me/sales/${mode}ing/${endpoint}`, salesParams, {
    refetchOnScreenFocus: true,
    filter: productSkuSearchFilter(search),
  });

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaScreenContainer>
      {isStorage && <SellFromStorageTicker />}
      <SearchFilterActionBar mode={mode} refetch={refetch} search={search} setSearch={setSearch} />

      {sales.length ? (
        <FlatListContainer<TransactionType>
          data={sales}
          keyExtractor={(item) => item.id.toString()}
          renderItem={
            mode === 'buy'
              ? isPurchaseConfirmed
                ? SaleCardBuyConfirmedListItem
                : SaleCardBuyListItem
              : SaleCardSellListItem
          }
          onEndReached={() => fetchMore()}
          ListFooterComponent={
            <Box center my={3} p={5}>
              {isLoading && sales.length < salesCount && <LoadingIndicator />}
            </Box>
          }
        />
      ) : isLoading ? (
        <Box center p={5}>
          <LoadingIndicator />
        </Box>
      ) : (
        <Text p={5} fontSize={1} fontFamily="regular" textAlign="center">
          {isStorage ? (
            <Trans>No items in storage.</Trans>
          ) : mode === 'buy' ? (
            <Trans>No purchases found.</Trans>
          ) : (
            <Trans>No sales found.</Trans>
          )}
        </Text>
      )}
    </SafeAreaScreenContainer>
  );
};

export default SalesList;
