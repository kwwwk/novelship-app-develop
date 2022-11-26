import React, { useState, useEffect } from 'react';
import { t, Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';
import { useStoreState } from 'app/store';
import { StackScreenProps } from '@react-navigation/stack';

import { Button, Text, Box, ButtonBase } from 'app/components/base';
import { FlatListContainer, Footer, SafeAreaScreenContainer } from 'app/components/layout';
import { OfferListType } from 'types/resources/offerList';
import validOfferListsFilter, { productSkuSearchFilter } from 'common/constants/offerList';
import useAPIListFetch from 'app/hooks/useAPIListFetch';
import CheckBoxInput from 'app/components/form/CheckBox';
import LoadingIndicator from 'app/components/misc/LoadingIndicator';
import { RootRoutes } from 'types/navigation';
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
    key: 'product_stat.highest_offer_price - price',
  },
];

const CurrentLists = ({ navigation }: StackScreenProps<RootRoutes, 'UserStack'>) => {
  const currentCurrencyId = useStoreState((s) => s.currency.current.id);

  const [selectedListsId, setSelectedListIds] = useState<number[]>([]);
  const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');

  const currentListedParams = {
    page: { size: 20, number: 0 },
    include: ['product', 'currency'],
    filter: {
      type: 'selling',
      local_currency_id: currentCurrencyId,
      ...validOfferListsFilter,
    },
  };

  const {
    refetch,
    fetchMore,
    isLoading,
    results: currentListed,
    total: currentListedCount,
  } = useAPIListFetch<OfferListType>('me/offer-lists', currentListedParams, {
    refetchOnScreenFocus: true,
    filter: productSkuSearchFilter(search),
  });

  const isAllListSelectedManually = selectedListsId.length === currentListedCount;

  const handleSelectAll = () => {
    setIsSelectAll(true);
    setSelectedListIds(currentListed.map((li) => li.id));
  };

  const handleClearAll = () => {
    setIsSelectAll(false);
    setSelectedListIds([]);
  };

  const onUpdateListsButtonPress = () =>
    navigation.navigate('UserStack', {
      screen: 'BulkListEditStack',
      params: {
        screen: 'BulkListUpdate',
        params: {
          selected_ids: selectedListsId,
          is_select_all: isSelectAll,
          search_term: search,
        },
      },
    });

  const canProceed = selectedListsId.length > 0;

  useEffect(() => {
    if (isSelectAll) {
      setSelectedListIds(currentListed.map((li) => li.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentListed]);

  const OfferListCardListItem = ({ item: list }: { item: OfferListType }) => {
    const isListSelected = selectedListsId ? selectedListsId.includes(list.id) : false;
    return (
      <OfferListCard
        key={list.id}
        item={list}
        mode="list"
        selectCheckBox={
          <Box mr={1} alignSelf="center">
            <CheckBoxInput
              checked={isListSelected}
              onChecked={() => {
                if (setIsSelectAll) {
                  setSelectedListIds(selectedListsId);
                  setIsSelectAll(false);
                }
                setSelectedListIds([...selectedListsId, list.id]);
                if (isListSelected) {
                  setSelectedListIds(selectedListsId.filter((li) => li !== list.id));
                }
              }}
            />
          </Box>
        }
      />
    );
  };

  return (
    <SafeAreaScreenContainer>
      <SearchFilterActionBar mode="list" refetch={refetch} search={search} setSearch={setSearch} />
      <SortFilterActionBar onSort={refetch} sortSettings={sortSettings} />
      {currentListed.length ? (
        <>
          <Box
            width="100%"
            px={5}
            pt={2}
            pb={3}
            flexDirection="row"
            justifyContent="space-between"
            borderBottomWidth={1}
            borderBottomColor="dividerGray"
          >
            <Text textAlign="center" fontSize={1} fontFamily="medium" color="gray3">
              {currentListedCount} <Trans> results found</Trans>
            </Text>
            <ButtonBase onPress={isSelectAll ? handleClearAll : handleSelectAll}>
              <Text fontSize={1} fontFamily="medium" textDecorationLine="underline">
                {isSelectAll || isAllListSelectedManually ? (
                  <Trans>UNSELECT ALL</Trans>
                ) : (
                  <Trans>SELECT ALL</Trans>
                )}
              </Text>
            </ButtonBase>
          </Box>

          <FlatListContainer<OfferListType>
            data={currentListed}
            keyExtractor={(item) => item.id.toString()}
            renderItem={OfferListCardListItem}
            onEndReached={() => fetchMore()}
            ListFooterComponent={
              <Box center my={3} p={5}>
                {isLoading && currentListed.length < currentListedCount && <LoadingIndicator />}
              </Box>
            }
          />

          <Footer>
            <Box flexDirection="row" justifyContent="space-between" alignItems="center">
              <Button
                variant="white"
                size="md"
                width="49%"
                text={i18n._(t`CANCEL`)}
                onPress={() => navigation.goBack()}
              />
              <Button
                text={i18n._(t`UPDATE LISTS`)}
                variant="black"
                size="md"
                width="49%"
                onPress={onUpdateListsButtonPress}
                disabled={!canProceed}
              />
            </Box>
          </Footer>
        </>
      ) : isLoading ? (
        <Box center p={5}>
          <LoadingIndicator />
        </Box>
      ) : (
        <Text p={5} fontSize={1} fontFamily="regular" textAlign="center">
          <Trans>No lists found.</Trans>
        </Text>
      )}
    </SafeAreaScreenContainer>
  );
};

export default CurrentLists;
