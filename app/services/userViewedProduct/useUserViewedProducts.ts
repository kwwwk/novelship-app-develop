// @flow
import type { ProductType, ProductClassType } from 'types/resources/product';
import { useQuery } from 'react-query';
import { useStoreState } from 'app/store';
import { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import type { ViewedProductType } from 'types/resources/userViewedProduct';
import UserViewedProductService from '.';

function useUserViewedProducts(productClass: ProductClassType) {
  const isAuthenticated = useStoreState((s) => s.user.user.id);
  const [cached, setCached] = useState<ViewedProductType[]>([]);
  const isFocused = useIsFocused();

  // result is already in order
  const { data: { results: recentProductsFromAPI } = { results: [] } } = useQuery<{
    results: ProductType[];
  }>([`me/viewed-products/${productClass}`, cached], {
    enabled: !!isAuthenticated,
    initialData: { results: [] },
  });

  // products are unordered
  const { data: { results: recentProductsCachedUnordered } = { results: [] } } = useQuery<{
    results: ProductType[];
  }>(['products', { filter: { 'id:in': cached.map((p: ViewedProductType) => p.product_id) } }], {
    enabled: !!(!isAuthenticated && cached.length),
    initialData: { results: [] },
  });

  const recentProductsCachedById = recentProductsCachedUnordered.reduce<{
    [key: number]: ProductType;
  }>((a, c) => {
    a[c.id] = c;
    return a;
  }, {});

  const recentProductsCached: ProductType[] = cached
    .map(({ product_id }) => recentProductsCachedById[product_id])
    .filter(Boolean);

  useEffect(() => {
    if (isFocused) {
      UserViewedProductService.cacheGet(productClass).then(setCached);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  return {
    // prefer recentProductsFromAPI over from local cache
    products: recentProductsFromAPI.length ? recentProductsFromAPI : recentProductsCached,
    exists: cached.length > 0,
  };
}

export default useUserViewedProducts;
