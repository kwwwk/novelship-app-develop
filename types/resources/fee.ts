import { BaseType } from './base';

export interface FeeType extends BaseType {
  level: number;
  value: number;
  sales: number;
  name: string;
  promotions_applicable: boolean;
  shipping_fee: 'auto' | 'free' | 'half';
  shipping_fee_multiplier: number;
  power_features: boolean;
  payout_fee_applicable: boolean;
  // free_sales: number;
}

const defaultFee: FeeType = {
  id: 0,
  level: 0,
  value: 9,
  sales: 0,
  name: '',
  promotions_applicable: true,
  shipping_fee: 'auto',
  shipping_fee_multiplier: 1,
  power_features: false,
  payout_fee_applicable: true,
};

export { defaultFee };
