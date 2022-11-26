import { createContext } from 'react';

import { FilterType, SortType } from 'types/views/browse';

export type BrowseContextType = {
  sort: SortType;
  setSort: (v: SortType) => void;
  page: number;
  setPage: (v: number) => void;
  filter: FilterType;
  setFilter: (v: BrowseContextType['filter']) => void;
  tempFilter: FilterType | any;
  setTempFilter: (v: BrowseContextType['filter']) => void;
  currentFilterKey: keyof FilterType | string;
  setCurrentFilterKey: (v: keyof FilterType | '') => void;
  currentFilterValue: string | undefined;
  setCurrentFilterValue: (v?: string) => void;
};

const defaultFn = () => {};

export const defaultFilters: FilterType = {
  class: '',
  category_level_1: '',
  category_level_2: '',
  category_level_3: '',
  category_level_4: '',
  gender: [],
  size: [],
  us_size: [],
  uk_size: [],
  jp_size: [],
  eu_size: [],
  lowest_listing_price: [],
  drop_year: '',
  main_color: [],
  main_brand: '',
  collection: '',
  is_instant_available: false,
};

const BrowseContext = createContext<BrowseContextType>({
  sort: 'search',
  setSort: defaultFn,
  page: 0,
  setPage: defaultFn,
  filter: defaultFilters,
  setFilter: defaultFn,
  tempFilter: defaultFilters,
  setTempFilter: defaultFn,
  currentFilterKey: '',
  setCurrentFilterKey: defaultFn,
  currentFilterValue: '',
  setCurrentFilterValue: defaultFn,
});

export default BrowseContext;
