import { defaultProduct, ProductType } from 'types/resources/product';
import { UserWishlistType } from 'types/resources/wishlist';
import { OfferListType } from 'types/resources/offerList';
import { RootRoutes } from 'types/navigation';

import { useContext } from 'react';
import { useMutation, useQuery } from 'react-query';
import { StackScreenProps } from '@react-navigation/stack';
import { Alert } from 'react-native';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';

import { getHighLowOfferLists } from 'common/utils/offerLists';
import API, { queryClient } from 'common/api';
import { AppBaseContext } from 'app/AppBase';
import { useStoreState } from 'app/store';
import validOfferListsFilter from 'common/constants/offerList';
import AlgoliaInsights from 'app/services/algolia-insights';
import Analytics from 'app/services/analytics';
import { UserPostProductTagType } from 'types/resources/userPostProductTag';

const useProductContextValue = ({
  params,
  route,
  navigation,
}: StackScreenProps<RootRoutes, 'ProductStack'> & { params: Record<string, any> }) => {
  const productSlug = route.params.slug;
  const user = useStoreState((s) => s.user.user);
  const currentCountryId = useStoreState((s) => s.country.current.id);
  const { appBaseRefresh } = useContext(AppBaseContext);
  const { size: urlQuerySize } = params;

  const fallbackURI = route.path || route.params?.path || productSlug;
  const onError = () => navigation.replace('NotFoundScreen', { uri: fallbackURI });

  const buyingCountryId = user.country_id || currentCountryId;
  const sellingCountryId = user.shipping_country_id || currentCountryId;

  const modifierQuery =
    buyingCountryId === sellingCountryId
      ? { c: buyingCountryId }
      : {
          b: user.country_id || currentCountryId,
          s: user.shipping_country_id || currentCountryId,
        };

  const productQueryKey = [`products/slug/${productSlug}`];
  const { data: product = defaultProduct, isFetching } = useQuery<ProductType>(productQueryKey, {
    onError,
    initialData: defaultProduct,
    retry: false,
  });

  const { data: { results: offerLists } = { results: [] }, refetch: refetchOfferListsQuery } =
    useQuery<{
      results: OfferListType[];
    }>([`products/${product.id}/offer-lists`, { modifier: modifierQuery, page: { size: 1000 } }], {
      initialData: { results: [] },
      enabled: !!product.id,
    });

  const { data: { results: productsRelated } = { results: [] } } = useQuery<{
    results: ProductType[];
  }>([`products/${product.id}/related`], {
    initialData: { results: [] },
    enabled: !!product.id,
  });

  const {
    data: { results: selfOfferLists } = { results: [] },
    refetch: refetchUserOfferListsQuery,
  } = useQuery<{ results: OfferListType[] }>(
    [
      'me/offer-lists/',
      {
        filter: { ...validOfferListsFilter, product_id: product.id },
        include: ['currency'],
        page: { size: 100 },
      },
    ],
    { initialData: { results: [] }, enabled: !!(product.id && user.id) }
  );

  const { data: lastSalesPricesForSize = [] } = useQuery(
    `sales/last-sales/${product.id}/${encodeURIComponent(urlQuerySize)}`,
    { initialData: [], enabled: !!urlQuerySize }
  );

  const wishlistQueryKey = [
    'me/wishlist/',
    { filter: { product_id: product.id }, page: { size: 50 } },
  ];

  const { data: { results: wishlistItems } = { results: [] } } = useQuery<{
    results: UserWishlistType[];
  }>(wishlistQueryKey, { initialData: { results: [] }, enabled: !!(product.id && user.id) });

  const { data: { results: lookbookFeeds } = { results: [] } } = useQuery<{
    results: UserPostProductTagType[];
  }>([`products/${product.id}/feed`, { page: { size: 6 } }], {
    initialData: { results: [] },
    enabled: !!product.id,
  });

  const { mutateAsync: wishlistProductSize } = useMutation<
    UserWishlistType,
    unknown,
    { size: string; local_size: string }
  >(
    ({ size, local_size }) => API.put('me/wishlist/', { product_id: product.id, size, local_size }),
    {
      onSuccess: (newData: UserWishlistType) => {
        queryClient.setQueryData(
          wishlistQueryKey,
          (existingWishlist: { results: UserWishlistType[] } = { results: [] }) => {
            const existingWishlistIndex = existingWishlist.results.findIndex(
              (o) => o.size === newData.size
            );
            if (existingWishlistIndex !== -1) {
              existingWishlist.results[existingWishlistIndex] = newData;
            } else {
              existingWishlist.results.push(newData);
            }

            return existingWishlist;
          }
        );

        queryClient.setQueryData(productQueryKey, (_product: ProductType | undefined) => {
          if (_product) {
            _product.wishlist_active_count += newData.active ? 1 : -1;
          }
          return product;
        });

        if (newData.active) {
          Analytics.productWishListed(
            { 'Product ID': newData.product_id, Size: newData.size },
            product
          );
          AlgoliaInsights.productWishListed(product.name_slug);
        }
      },
      onError: () =>
        Alert.alert('', i18n._(t`Please remove some items from your wishlist to add more`), [
          {
            text: i18n._(t`REMOVE`),
            onPress: () => navigation.navigate('UserStack', { screen: 'Wishlist' }),
          },
        ]),
    }
  );

  const refetchOfferLists = () => {
    refetchOfferListsQuery();
    refetchUserOfferListsQuery();
    appBaseRefresh();
  };

  // Merge public offer-lists with self offer lists
  for (let i = 0; i < offerLists.length; i += 1) {
    const selfOL = selfOfferLists.find((_: OfferListType) => _.id === offerLists[i].id);
    if (selfOL && selfOL.id) {
      offerLists[i] = selfOL;
    }
  }

  const highLowOfferLists = getHighLowOfferLists(offerLists);

  const wishListedSizes = wishlistItems.reduce((prev: string[], curr) => {
    if (curr.active && curr.product_id === product.id) {
      prev.push(curr.size);
    }
    return prev;
  }, []);

  return {
    product,
    productsRelated,
    isFetching,
    offerLists,
    refetchOfferLists,
    highLowOfferLists,
    wishlistProductSize,
    wishListedSizes,
    lastSalesPricesForSize,
    lookbookFeeds,
  };
};

export default useProductContextValue;
