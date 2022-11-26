import { BaseType } from './base';

export interface ProductStatType extends BaseType {
  id: number;
  product_id: number;
  lowest_list_price: number;
  highest_offer_price: number;
  last_sale_price: number;
  instant_list_price: number;
  price_spread: number;
  size: string;
  country_id: number;
}

const defaultProductStat = {
  id: 0,
  product_id: 0,
  lowest_list_price: 0,
  highest_offer_price: 0,
  last_sale_price: 0,
  instant_list_price: 0,
  price_spread: 0,
  size: '',
  country_id: 0,
};

export { defaultProductStat };
