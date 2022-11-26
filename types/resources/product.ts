import { BaseType } from './base';

type ProductCelebrityType = Record<string, string>;

export type SneakerSizeMapType = Record<
  'US' | 'US_W' | 'US_M' | 'EU' | 'JP' | 'UK' | 'displaySize' | string,
  string | number
>;

export type ProductClassType = 'Sneakers' | 'Apparel' | 'Collectibles';
export const ProductClassEnums: ProductClassType[] = ['Sneakers', 'Apparel', 'Collectibles'];

export interface ProductType extends BaseType {
  id: number;
  name: string;
  short_name: string;
  shorter_name: string;
  name_slug: string;
  cost: number;

  actual_weight: number;
  vol_weight: number;
  colorway: string;
  designer: string;
  main_color: string;
  midsole: string;
  nickname_english: string;
  silhouette: string;
  sku: string;
  upper_material: string;
  season: string;
  gender: 'men' | 'women' | 'youth' | 'infant' | 'unisex';
  sizes: string[];
  size_chart_url: string;
  is_one_size: boolean;
  description: string;
  drop_date: string;
  drop_year: number;
  gallery: string[];
  image: string;
  gallery_lookbook: string[];
  offer_count: number;
  list_count: number;
  last_sale_price: number;
  last_sale_price_2: number;
  highest_offer_price: number;
  lowest_listing_price: number;
  recent_list_time: string;
  recent_lowest_list_time: string;
  recent_highest_offer_time: string;
  class: 'Sneakers' | 'Apparel' | 'Collectibles';
  main_brand: string;
  sub_brand: string;
  category: string;
  category_level_1: string;
  category_level_2: string;
  category_level_3: string;
  category_level_4: string;
  collections: string[];
  is_buy_now_only: boolean;
  is_sneaker: boolean;
  is_apparel: boolean;
  is_instant_available: boolean;
  size_specific: string;
  wishlist_active_count: number;
  wishlist_change_percentage: number;
  drop_dates_local: { [shortCode: string]: Date | string };
  celebrity: ProductCelebrityType;

  // Client Only
  queryID: string;
  // algolia Only
  objectID: string;
  product_id: number;
}

const defaultProduct: ProductType = {
  id: 0,
  name: '',
  short_name: '',
  shorter_name: '',
  name_slug: '',
  sku: '',
  cost: 0,
  actual_weight: 0,
  vol_weight: 0,
  colorway: '',
  designer: '',
  main_color: '',
  midsole: '',
  nickname_english: '',
  silhouette: '',
  upper_material: '',
  season: '',
  gender: 'men',
  sizes: [],
  size_chart_url: '',
  is_one_size: true,
  gallery: [],
  image: '',
  gallery_lookbook: [],
  description: '',
  drop_date: '',
  drop_year: 0,
  offer_count: 0,
  list_count: 0,
  last_sale_price: 0,
  last_sale_price_2: 0,
  highest_offer_price: 0,
  lowest_listing_price: 0,
  recent_list_time: '',
  recent_lowest_list_time: '',
  recent_highest_offer_time: '',
  class: 'Sneakers',
  main_brand: '',
  sub_brand: '',
  category: '',
  category_level_1: '',
  category_level_2: '',
  category_level_3: '',
  category_level_4: '',
  collections: [],
  is_buy_now_only: false,
  wishlist_active_count: 0,
  wishlist_change_percentage: 0,
  drop_dates_local: {},

  is_sneaker: true,
  is_apparel: false,
  is_instant_available: false,
  size_specific: '',

  celebrity: {},

  // Client Only
  queryID: '',
  // algolia Only
  objectID: '',
  product_id: 0,
};

export { defaultProduct };

// note to me sizes and box old new corelation
