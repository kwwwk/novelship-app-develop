import { BaseType } from './base';
import { CurrencyType } from './currency';

export interface VoucherType extends BaseType {
  name: string;
  category: 'Sneakers' | 'Apparel' | 'Collectibles' | 'Shipping';
  type: string;
  value: number;
  cost: number;
  limit: number;
  best_value: boolean;
  currency: CurrencyType;
  currency_id: number;
  code: string;
  // client only
  brought: number;
}
export interface VoucherList extends BaseType {
  created_at: string;
  id: number;
  updated_at: string;
  user_id: number;
  voucher_id: number;
}
