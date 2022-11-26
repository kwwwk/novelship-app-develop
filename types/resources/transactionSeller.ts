/* eslint-disable import/no-cycle */
import { PayoutRequestType } from './payoutRequest';
import { UserType } from './user';
import { CountryType } from './country';
import { CurrencyType } from './currency';
import { ProductType } from './product';
import { OfferListType } from './offerList';
import { BaseType } from './base';
import { TrxnStatusType } from './transaction';

export type OperationType = 'buy' | 'sell';

export type TrxnPayoutStatusType =
  | 'pending'
  | 'ready'
  | 'expedited_requested'
  | 'requested'
  | 'processed'
  | 'bounced'
  | 're_requested'
  | 're_processed'
  | 'canceled';

export interface TransactionSellerType extends BaseType {
  id: number;
  ref: string;
  type: 'transaction' | 'consignment';
  airtable_ref: string;
  seller_id: number;
  seller: UserType;
  seller_country_id: number;
  seller_country: CountryType;
  processing_country_id: number;
  processing_country: CountryType;
  product_id: number;
  product: ProductType;
  user_product_id: number;
  user_product: OfferListType;
  transaction_storage_id: number;
  base_price: number;
  list_price_local: number;
  payout_amount: number;
  payout_amount_local: number;
  seller_currency_id: number;
  seller_currency: CurrencyType;
  seller_currency_rate: number;
  fee_shipping: number;
  fee_processing_sell: number;
  fee_selling: number;
  reminded_to_ship: 'none' | 'first' | 'second' | 'last';
  shipping_deadline: string;
  shipping_deadline_extended: string;
  size: string;
  local_size: string;
  size_id: string;
  status: TrxnStatusType;
  payout_request_id: number;
  payout_request: PayoutRequestType;
  payout_status: TrxnPayoutStatusType;
  operation: OperationType;
  cancel_reason: string;
  payout_reference: string;
  seller_courier?: 'DHL' | 'GDEX' | 'JANIO' | 'BLUPORT' | string;
  seller_courier_tracking: string;
  seller_courier_tracking_url: string;
  seller_courier_cost: number;
  seller_courier_currency_id: number;
  seller_courier_currency: CurrencyType;
  seller_fee_id: number;
  selling_fee_promotion_id: number | null | typeof undefined;
  seller_courier_pickup_date_time: string;
  has_to_ship: boolean;
  has_to_ship_delayed: boolean;

  // Seller Penalty
  penalty_reason: string;
  penalty_amount: number;
  return_fee: number;
  payment_penalty_ref: string;
  penalty_date: string;
  penalty_appeal_status:
    | 'appeal_pending'
    | 'penalty_accepted'
    | 'penalty_accepted-auto'
    | 'appealed'
    | 'appeal_accepted'
    | 'appeal_declined-auto'
    | 'appeal_declined';
  payment_penalty_status: 'authorized' | 'captured' | 'capture_failed' | 'refunded';
  penalty_appeal_reason: string;
}
