import { BaseType } from './base';
import { ProductType, defaultProduct } from './product';
import { CountryType, defaultCountry } from './country';
import { UserType, anonymousUser } from './user';
import { CurrencyType, defaultCurrency } from './currency';

export interface RaffleProductEntryType extends BaseType {
  id: number;
  product_id: number;
  raffle_product_id: number;
  country_id: number;
  country: CountryType;
  user_id: number;
  user: UserType;
  status: 'live' | 'won' | 'expired';
  size: string;
  local_size: string;
  local_price: number;
  local_currency_id: number;
  product: ProductType;
  currency: CurrencyType;
}

const defaultRaffleProductEntry: RaffleProductEntryType = {
  id: 0,
  product_id: 0,
  raffle_product_id: 0,
  country_id: 0,
  country: defaultCountry,
  user_id: 0,
  user: anonymousUser,
  status: 'live',
  size: '',
  local_size: '',
  local_price: 0,
  local_currency_id: 0,
  product: defaultProduct,
  currency: defaultCurrency,
};

export { defaultRaffleProductEntry };
