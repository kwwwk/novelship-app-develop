import { BaseType } from './base';
import { defaultCurrency, CurrencyType } from './currency';

export interface PromocodeType extends BaseType {
  code: string;
  value: number;
  is_shipping_free: boolean;
  is_percentage_discount: boolean;
  first_purchase_only: boolean;
  description: string;
  end_date: string;
  is_shipping_only: boolean;
  class: string;
  collection: string;
  min_buy: number;
  currency_id: number;
  currency: CurrencyType;
  max_discount: number;
  payment_method: string;
}

const defaultPromocode: PromocodeType = {
  id: 0,
  value: 0,
  is_shipping_free: false,
  is_percentage_discount: false,
  first_purchase_only: false,
  is_shipping_only: false,
  code: '',
  end_date: '',
  description: '',
  class: '',
  collection: '',
  min_buy: 0,
  currency_id: 1,
  currency: defaultCurrency,
  max_discount: 0,
  payment_method: '',
};

export { defaultPromocode };
