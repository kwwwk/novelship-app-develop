import { CurrencyType } from './currency';

export type PayoutMethodType = 'crypto' | 'expedited_requested' | 'requested';

export interface PayoutRequestType {
  id: number;
  created_at: string;
  updated_at: string;

  ref: string;
  request_type: 'requested' | 'expedited_requested' | 'crypto';
  user_id: number;
  currency_id: number;
  currency: CurrencyType;
  requested_amount: number;
  payout_fee: number;
  early_payout_fee: number;
  total_payout_fee: number;
  payout_amount: number;
  status: 'requested' | 'processed' | 'bounced' | 're_requested' | 're_processed';
  expected_processing_date: string;
  processing_date: string;
  transaction_seller_ids: number[];
}
