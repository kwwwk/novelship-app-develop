import { ProductType } from 'types/resources/product';

import { AlgoliaIndices } from 'app/services/algolia';

export type CategoryType = {
  name: string;
  url?: string;
  slug?: string;
  tree?: string;
  value?: any;
  color?: string;
  filterKey?: keyof FilterType | any;
  children?: CategoryType[];
  type?: 'switch' | 'select';
};

export type SortType = keyof typeof AlgoliaIndices;

export interface FilterType {
  class: ProductType['class'] | '';
  category_level_1: string;
  category_level_2: string;
  category_level_3: string;
  category_level_4: string;
  gender: Array<ProductType['gender'] | string>;
  size: Array<string>;
  us_size: Array<string>;
  uk_size: Array<string>;
  eu_size: Array<string>;
  jp_size: Array<string>;
  lowest_listing_price: Array<string>;
  main_color: Array<string>;
  main_brand: string;
  drop_year: string;
  collection: string;
  is_instant_available: boolean;
}

export interface BrowseParamType extends Partial<FilterType> {
  q?: string;
  sort?: SortType;
  page?: number;
  instant?: boolean;
}
