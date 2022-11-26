import { ProductType } from 'types/resources/product';

import React, { useEffect } from 'react';
import { t, Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';

import { useStoreState, useStoreActions } from 'app/store';
import { FlatListContainer } from 'app/components/layout';
import { Button, Text, Box } from 'app/components/base';
import ProductCardStacked from 'app/components/product/ProductCardStacked';
import LoadingIndicator from 'app/components/misc/LoadingIndicator';
import envConstants from 'app/config';

import SearchResultsNotFound from './components/SearchResultsNotFound';
import SearchResultsFound from './components/SearchResultsFound';
import SearchProductCard from './components/SearchProductCard';

const SearchResults = () => {
  const { search, isSearching, isLoadingMore, searchProducts, searchProductsFound } = useStoreState(
    (s) => s.search
  );

  const { setIsLoadingMore, loadMore, debouncedFetchSearchProducts } = useStoreActions(
    (a) => a.search
  );

  const showMoreProducts = () => {
    setIsLoadingMore(true);
    loadMore({
      page: searchProducts.results.length / 20,
      search,
    });
  };

  useEffect(() => {
    if (search) {
      debouncedFetchSearchProducts({ search });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <FlatListContainer<ProductType>
      data={isSearching ? [] : searchProducts.results}
      keyExtractor={(item: ProductType) => item.objectID}
      numColumns={searchProductsFound ? 1 : 2}
      key={searchProductsFound ? 1 : 2}
      renderItem={searchProductsFound ? getSearchProductCard : getProductCard}
      ListHeaderComponent={
        isSearching ? (
          <Box center p={5}>
            <LoadingIndicator />
          </Box>
        ) : searchProductsFound ? (
          <>
            <SearchResultsFound search={search} resultsCount={searchProducts.totalByClasses} />
            <Box mt={5} mx={4} flexDirection="row">
              <Text fontFamily="bold">
                <Trans>TOP RESULTS</Trans>
              </Text>
            </Box>
          </>
        ) : (
          <>
            <SearchResultsNotFound search={search} />
            {!!searchProducts.results.length && (
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
            searchProducts.results?.length < searchProducts.total &&
            searchProducts.results?.length < envConstants.ALGOLIA.PAGING_LIMIT && (
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

const getSearchProductCard = ({ item: product, index }: { item: ProductType; index: number }) => (
  <SearchProductCard key={index} product={product} index={index} />
);

const getProductCard = ({ item: product, index }: { item: ProductType; index: number }) => (
  <ProductCardStacked key={index} product={product} index={index} />
);

export default SearchResults;
