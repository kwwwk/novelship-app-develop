import { useState, useEffect } from 'react';
import { StackScreenProps } from '@react-navigation/stack';

import { useStoreActions } from 'app/store';
import { BottomTabRoutes } from 'types/navigation';
import { ProductType } from 'types/resources/product';
import { browseDataByUrl } from 'common/constants/browse';
import { BrowseParamType, FilterType, SortType } from 'types/views/browse';

import { defaultFilters } from '../context';

const useBrowseContextValue = ({ route }: StackScreenProps<BottomTabRoutes, 'BrowseStack'>) => {
  const params = <BrowseParamType>route.params?.params?.params || {};
  const screen = route.params?.params?.screen;

  const { setSearch } = useStoreActions((a) => a.search);
  const [currentFilterValue, setCurrentFilterValue] = useState<string>();
  const [currentFilterKey, setCurrentFilterKey] = useState<keyof FilterType | ''>('');
  const [tempFilter, setTempFilter] = useState<FilterType>(defaultFilters);
  const [filter, setFilter] = useState<FilterType>(defaultFilters);
  const [sort, setSort] = useState<SortType>(params.sort || 'search');
  const [page, setPage] = useState<number>(params.page || 0);

  useEffect(() => {
    if (screen) {
      const initialFilters = getInitialFilters(String(screen), params);
      setCurrentFilterValue('');
      setCurrentFilterKey('');
      setTempFilter(initialFilters);
      setFilter(initialFilters);
      if (params.q) setSearch(params.q);
      setSort(params.sort || 'search');
      setPage(params.page || 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    screen,
    params.sort,
    params.page,
    params.gender,
    params.lowest_listing_price,
    params.drop_year,
    params.q,
  ]);

  return {
    sort,
    setSort,
    page,
    setPage,
    filter,
    setFilter,
    tempFilter,
    setTempFilter,
    currentFilterKey,
    setCurrentFilterKey,
    currentFilterValue,
    setCurrentFilterValue,
  };
};

const getInitialFilters = (screen: string, params: BrowseParamType): FilterType => {
  const currentCategory = browseDataByUrl[screen] || {};
  const [_class, cl1, cl2, cl3, cl4] = currentCategory.tree?.split('\\') || [];

  const { collection, ...parsedParams } = parseParamFilters(params);
  // handling collection params from web urls
  const collectionFilter = collection ? { collections: collection } : {};

  return {
    ...defaultFilters,
    class: <ProductType['class']>_class || defaultFilters.class,
    category_level_1: cl1 || defaultFilters.category_level_1,
    category_level_2: cl2 || defaultFilters.category_level_2,
    category_level_3: cl3 || defaultFilters.category_level_3,
    category_level_4: cl4 || defaultFilters.category_level_4,
    ...parsedParams,
    ...collectionFilter,
  };
};

// parsing web URL params
const parseParamFilters = (params: BrowseParamType) =>
  Object.entries(params)
    .filter(([k]) => Object.keys(defaultFilters).includes(k))
    .reduce((prev: Record<string, unknown>, [key, value]) => {
      // @ts-ignore filtered above
      if (typeof defaultFilters[key] === 'boolean' && typeof value === 'string') {
        prev[key] = value === 'true';
        // @ts-ignore filtered above
      } else if (Array.isArray(defaultFilters[key]) && typeof value === 'string') {
        if (value.includes('[')) {
          prev[key] = value.slice(1, -1).split(',');
        } else {
          prev[key] = [value];
        }
      } else {
        prev[key] = value;
      }

      return prev;
    }, {});

export default useBrowseContextValue;
