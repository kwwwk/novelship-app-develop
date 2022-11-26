import { i18n } from '@lingui/core';
import { t, Trans } from '@lingui/macro';
import React, { useEffect, useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp } from '@react-navigation/native';

import { useStoreState } from 'app/store';
import { Button, Text, Box } from 'app/components/base';
import useAPIListFetch from 'app/hooks/useAPIListFetch';
import CheckBoxInput from 'app/components/form/CheckBox';
import { TransactionType } from 'types/resources/transaction';
import { RootRoutes, SellingTopTabRoutes } from 'types/navigation';
import LoadingIndicator from 'app/components/misc/LoadingIndicator';
import { productSkuSearchFilter } from 'common/constants/offerList';
import { getAvailableShippingMethods } from 'common/constants/transaction';
import { SafeAreaScreenContainer, Footer, FlatListContainer } from 'app/components/layout';

import SaleCard from './SaleCard';
import SearchFilterActionBar from './SearchFilterActionBar';

type ConfirmedSalesListNavigationProp = CompositeNavigationProp<
  StackNavigationProp<SellingTopTabRoutes, 'ConfirmedSales'>,
  StackNavigationProp<RootRoutes, 'UserStack'>
>;

const ConfirmedSalesList = ({ navigation }: { navigation: ConfirmedSalesListNavigationProp }) => {
  const [search, setSearch] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSaleRefs, setSelectedSaleRefs] = useState<string[]>([]);

  const user = useStoreState((s) => s.user.user);

  const salesParams = {
    page: { size: 20, number: 0 },
    filter: { seller_country_id: user.shipping_country_id },
  };

  const filter = {
    status: selectedStatus === 'all' ? '' : selectedStatus,
    ...productSkuSearchFilter(search),
  };

  const { refetch, fetchMore, isLoading, results: sales, total: salesCount } =
    // @ts-ignore correct params
    useAPIListFetch<TransactionType>(`me/sales/selling/confirmed`, salesParams, {
      refetchOnScreenFocus: true,
      filter,
    });

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => setSelectedSaleRefs([]));
    return unsubscribe;
  }, [navigation]);

  const shippingMethods = getAvailableShippingMethods(sales[0], user.seller_type);
  const isBulkShipmentAvailable =
    shippingMethods.manual && shippingMethods.manual.selection?.includes('bulk');
  const saleSelectionThreshold = isBulkShipmentAvailable
    ? shippingMethods.manual?.bulkItemLimit
    : 1;

  const SaleCardListItem = ({ item: trxn }: { item: TransactionType }) => {
    const isSaleSelected = selectedSaleRefs ? selectedSaleRefs.includes(trxn.ref) : false;

    return (
      <SaleCard
        item={trxn}
        mode="sell"
        key={trxn.id}
        selectCheckBox={
          <Box mr={1} alignSelf="center">
            <CheckBoxInput
              checked={isSaleSelected}
              onChecked={() => {
                if (isSaleSelected) {
                  setSelectedSaleRefs(selectedSaleRefs.filter((s) => s !== trxn.ref));
                } else {
                  setSelectedSaleRefs([...selectedSaleRefs, trxn.ref]);
                }
              }}
              disabled={
                (selectedSaleRefs.length === saleSelectionThreshold && !isSaleSelected) ||
                trxn.status !== 'confirmed' ||
                !!trxn.seller_courier
              }
            />
          </Box>
        }
      />
    );
  };

  return (
    <SafeAreaScreenContainer>
      <SearchFilterActionBar
        mode="sell"
        refetch={refetch}
        search={search}
        setSearch={setSearch}
        showStatusFilter
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      {sales.length ? (
        <FlatListContainer<TransactionType>
          data={sales}
          keyExtractor={(item) => item.id.toString()}
          renderItem={SaleCardListItem}
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
          <Trans>No sales found.</Trans>
        </Text>
      )}

      {!!selectedSaleRefs.length && (
        <Footer>
          <Text textAlign="center" fontSize={1} mb={2} color="red">
            {selectedSaleRefs.length > 6 ? (
              <Trans>
                You can only choose to self drop-off for{' '}
                <Text color="red" fontFamily="bold" fontSize={1}>
                  seven or more
                </Text>{' '}
                products.
              </Trans>
            ) : (
              ' '
            )}
          </Text>
          <Button
            text={`${
              selectedSaleRefs.length > 1
                ? i18n._(t`CREATE BULK SHIPMENT`)
                : i18n._(t`ARRANGE SHIPMENT`)
            } ${
              isBulkShipmentAvailable
                ? `(${selectedSaleRefs.length}/${saleSelectionThreshold})`
                : ''
            }`}
            onPress={() => {
              if (selectedSaleRefs.length > 1) {
                navigation.navigate('UserStack', {
                  screen: 'BulkShipment',
                  params: {
                    screen: 'MakeBulkShipment',
                    params: { selected_refs: selectedSaleRefs },
                  },
                });
              } else {
                navigation.navigate('UserStack', {
                  screen: 'SaleDetails',
                  params: { sale_ref: selectedSaleRefs[0] },
                });
              }
            }}
            variant="black"
          />
        </Footer>
      )}
    </SafeAreaScreenContainer>
  );
};

export default ConfirmedSalesList;
