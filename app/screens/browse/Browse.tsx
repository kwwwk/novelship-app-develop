import { i18n } from '@lingui/core';
import { t, Trans } from '@lingui/macro';
import React, { useEffect, useContext } from 'react';

import { useStoreState, useStoreActions } from 'app/store';
import { Button, Text, Box } from 'app/components/base';
import { ProductType } from 'types/resources/product';
import ProductCardStacked from 'app/components/product/ProductCardStacked';
import LoadingIndicator from 'app/components/misc/LoadingIndicator';
import envConstants from 'app/config';

import { FlatListContainer } from 'app/components/layout';
import { AlgoliaIndices } from 'app/services/algolia';
import AnnouncementTicker from 'app/components/promotion/AnnouncementTicker';
import { buildAlgoliaFilterString } from './utils/index';
import SortAndResultCountBar from './components/SortAndResultCountBar';
import BrowseContext from './context';

type ProductCardProps = ProductType & { sort: keyof typeof AlgoliaIndices };

const Browse = () => {
  const currentCountryId = useStoreState((s) => s.country.current.id);
  const userCountryId = useStoreState((s) => s.user.user.country_id);
  const { search, isSearching, isLoadingMore, browseProducts, browseProductsFound } = useStoreState(
    (s) => s.search
  );
  const { debouncedFetchBrowseProducts, setIsSearching, setIsLoadingMore, loadMoreBrowseProducts } =
    useStoreActions((a) => a.search);
  const { filter, sort, page } = useContext(BrowseContext);
  const filterString = buildAlgoliaFilterString(filter);

  const showMoreProducts = () => {
    setIsLoadingMore(true);
    loadMoreBrowseProducts({
      page: browseProducts.results.length / 20,
      search,
      filterString,
      sort,
    });
  };

  useEffect(() => {
    setIsSearching(true);
    debouncedFetchBrowseProducts({ search, filterString, sort, page, filter });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filterString, sort, page]);

  const buyingCountryId = userCountryId || currentCountryId;

  return (
    <FlatListContainer<ProductCardProps>
      data={
        isSearching
          ? []
          : browseProducts.results.map((p) => ({
              ...p,
              // @ts-ignore using country_price from search result
              lowest_listing_price: p[`${buyingCountryId}_price`] || p.lowest_listing_price,
              sort,
            }))
      }
      keyExtractor={(item: ProductType) => item.objectID}
      numColumns={2}
      renderItem={getProductCard}
      ListHeaderComponent={
        isSearching ? (
          <Box center p={5}>
            <LoadingIndicator />
          </Box>
        ) : browseProductsFound ? (
          <>
            <AnnouncementTicker />
            <SortAndResultCountBar resultCount={browseProducts.total} />
          </>
        ) : (
          <>
            <SortAndResultCountBar resultCount={browseProductsFound ? browseProducts.total : 0} />
            <Box center p={5} borderBottomWidth={2} borderBottomColor="dividerGray">
              <Text color="textSecondary" fontSize={2} textAlign="center" fontFamily="medium">
                <Trans>Couldn't find any products with the applied filters.</Trans>
              </Text>
            </Box>
            {!!browseProducts.results.length && (
              <Text p={5} textAlign="center" fontFamily="bold">
                <Trans>MOST POPULAR</Trans>
              </Text>
            )}
          </>
        )
      }
      ListFooterComponent={
        <Box p={5}>
          {!isSearching &&
            browseProducts.results.length < browseProducts.total &&
            browseProducts.results.length < envConstants.ALGOLIA.PAGING_LIMIT && (
              <Button
                text={i18n._(t`SHOW MORE`)}
                variant="white"
                onPress={showMoreProducts}
                loading={isLoadingMore}
              />
            )}
        </Box>
      }
    />
  );
};

const getProductCard = ({ item: product, index }: { item: ProductCardProps; index: number }) => (
  <ProductCardStacked
    key={index}
    product={product}
    section="Browse"
    index={index}
    sort={product.sort}
  />
);

export default Browse;
