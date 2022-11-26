import { defaultShippingConfig, ShippingConfigType } from 'types/views/label-generation';
import { BaseType } from './base';
import { CurrencyType, defaultCurrency } from './currency';

export type PayoutConfigType = {
  method: 'crypto' | 'expedited_requested' | 'requested';
  fee_percent: number;
  fee_fixed: number;
  fee_percent_discounted: number;
  fee_fixed_discounted: number;
  admin_only?: boolean;
};

type CountryCitiesType = Record<string, string[]>;

export interface CountryType extends BaseType {
  name: string;
  calling_code?: string;
  currency: CurrencyType;
  currency_id: number;
  currency_symbol?: string;
  shortcode: string;
  delivery_base: number;
  delivery_increment: number;
  delivery_surcharge: number;
  delivery_instant: number;
  shipping_surcharge: number;
  shipping_base: number;
  shipping_increment: number;
  buying_enabled: boolean;
  selling_enabled: boolean;
  buying_storage_enabled: boolean;
  storage_delivery_enabled: boolean;
  shipping_config: ShippingConfigType[];
  payout_config: PayoutConfigType[];
  states: string[];
  cities: CountryCitiesType;
  delivery_surcharge_remote: number;

  // ns office address details
  ns_address_name?: string;
  ns_address_line_1?: string;
  ns_address_line_2?: string;
  ns_address_line_3?: string;
  ns_address_city?: string;
  ns_address_state?: string;
  ns_address_zip?: string;
  ns_address_phone?: string;
  ns_address_email?: string;
  drop_off_day_time?: string;
  selling_consignment_enabled: boolean;
  site_ticker: { text?: string; link?: string };
}

const defaultCountry: CountryType = {
  id: 0,
  name: '',
  delivery_base: 0,
  delivery_increment: 0,
  delivery_surcharge: 0,
  delivery_instant: 0,
  shipping_base: 0,
  shipping_increment: 0,
  shipping_surcharge: 0,
  currency_id: 0,
  buying_enabled: true,
  selling_enabled: true,
  buying_storage_enabled: false,
  storage_delivery_enabled: false,
  shortcode: '',
  currency: defaultCurrency,
  shipping_config: [defaultShippingConfig],
  payout_config: [
    {
      method: 'crypto',
      fee_percent: 0,
      fee_fixed: 0,
      fee_percent_discounted: 0,
      fee_fixed_discounted: 0,
    },
    {
      method: 'expedited_requested',
      fee_percent: 0,
      fee_fixed: 0,
      fee_percent_discounted: 0,
      fee_fixed_discounted: 0,
    },
    {
      method: 'requested',
      fee_percent: 0,
      fee_fixed: 0,
      fee_percent_discounted: 0,
      fee_fixed_discounted: 0,
    },
  ],
  states: [],
  cities: {},
  delivery_surcharge_remote: 0,
  selling_consignment_enabled: false,
  site_ticker: { text: undefined, link: undefined },
};

export { defaultCountry };
