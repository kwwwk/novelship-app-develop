import { Platform } from 'react-native';

import { BaseType } from './base';

type CountriesValueType = {
  shortcode: string;
  currency: string;
  min?: number;
  max?: number;
  help_url: string;
  admin_only: boolean;
  active: boolean;
};

type CountriesType = Record<string, CountriesValueType>;

type PaymentMethodConfigType = {
  installments: number;
  interest: number;
  period: string;
  url?: string;
  buyer_payment_fee?: number;
};

type PromotionTextType = {
  [key: string]: string | null;
};

export type PaymentMethodEnumType =
  | 'afterpay'
  | 'stripe_alipay'
  | 'stripe_grabpay'
  | 'atome'
  | 'pace'
  | 'paidy'
  | 'rapyd_paynow'
  | 'bank-transfer'
  | 'chailease'
  | 'consignment'
  | 'dana'
  | 'grabpay_wallet'
  | 'grabpay_paylater'
  | 'grabpay_postpaid'
  | 'hoolah'
  | 'linkaja'
  | 'linepay'
  | 'ovo'
  | 'rely'
  | 'stripe'
  | 'triple-a_bitcoin'
  | 'triple-a_ethereum'
  | 'triple-a_tether'
  | 'triple-a_binance_pay'
  | 'paypal'
  | 'paypal_paylater';

export interface PaymentMethodType extends BaseType {
  name: string;
  admin_only: boolean;
  slug: PaymentMethodEnumType;
  type: 'card' | 'wallet' | 'paylater';
  response: 'redirect' | 'callback' | 'instant';
  config: PaymentMethodConfigType[];
  countries: CountriesType;
  platforms: typeof Platform.OS[];
  promotion_text: PromotionTextType;
}

export type ConfigBuyTrxnPaymentFeeType = {
  fee: number;
  country_id: number | null;
  payment_method: number | null;
  mode: 'buy' | 'offer' | null;
};
