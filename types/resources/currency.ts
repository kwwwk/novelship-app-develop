import { BaseType } from './base';

export interface CurrencyType extends BaseType {
  id: number;
  name?: string;
  code: string;
  symbol: string;
  locale: string;
  rate: number;
  min_offer_price: number;
  min_list_price: number;
  offer_step: number;
  list_step: number;
  authentication_fee: number;
  max_decimals: 2 | 1 | 0;
  precision: number;
  payout_precision: number;
  referrer_promocode_value: number;
}

const defaultCurrency: CurrencyType = {
  id: 0,
  code: 'USD',
  symbol: '',
  locale: 'en-US',
  rate: 0,
  min_offer_price: 30,
  min_list_price: 30,
  offer_step: 1,
  list_step: 1,
  authentication_fee: 0,
  max_decimals: 2,
  precision: 0.01,
  payout_precision: 0.1,
  referrer_promocode_value: 0,
};

export { defaultCurrency };
