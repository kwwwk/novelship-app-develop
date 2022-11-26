/* eslint-disable import/no-cycle */
import { AddressType, UserType } from './user';
import { CountryType } from './country';
import { CurrencyType } from './currency';
import { ProductType } from './product';
import { OfferListType } from './offerList';
import { PromocodeType } from './promocode';
import { BaseType } from './base';
import { TrxnStatusType } from './transaction';
import { TransactionBuyerAddOnType } from './transactionBuyerAddOn';
import { PaymentMethodEnumType } from './paymentMethod';

export type DeliverToType = 'buyer' | 'storage';
export type OperationType = 'buy' | 'sell';
export type TrxnPaymentStatusType =
  | 'failed'
  | 'pending'
  | 'authorized'
  | 'captured'
  | 'capture_failed'
  | 'refund_processed'
  | 'refunded';

export interface TransactionBuyerType extends BaseType {
  id: number;
  ref: string;
  type: 'transaction' | 'consignment';
  airtable_ref: string;
  buyer_id: number;
  buyer: UserType;
  buyer_country_id: number;
  buyer_country: CountryType;
  product_id: number;
  product: ProductType;
  user_product_id: number;
  user_product: OfferListType;
  promocode_id: number | null;
  promocode: PromocodeType;
  promocode_value?: number | null;
  base_price: number;
  offer_price_local: number;
  total_price: number;
  total_price_local: number;
  buyer_currency_id: number;
  buyer_currency: CurrencyType;
  buyer_currency_rate: number;
  fee_processing_buy: number;
  fee_delivery: number;
  fee_delivery_instant: number;
  fee_delivery_insurance: number;
  fee_add_on: number;
  add_on_quantity: number;
  add_ons: TransactionBuyerAddOnType[];
  deliver_to: DeliverToType;
  buyer_delivery_declared?: number | null;
  delivery_date: string;
  delivery_address: AddressType;
  size: string;
  local_size: string;
  size_id: string;
  status: TrxnStatusType;
  payment_status: TrxnPaymentStatusType;
  operation: OperationType;
  cancel_reason: string;
  payment_method: PaymentMethodEnumType;
  payment_reference: string;
  payment_delivery_reference: string;
  payment_delivery_insurance_reference: string;
  loyalty_points: number;
  is_delivery_paid: boolean;
  add_on_purchased: boolean;
  add_on_show: boolean;
  resell_show: boolean;
  buyer_courier: string;
  buyer_courier_tracking: string;
  buyer_courier_tracking_url: string;
  buyer_courier_cost: number;
  buyer_courier_currency_id: number;
  buyer_courier_currency: CurrencyType;
  buyer_courier_collection_method: 'drop-off' | 'pickup' | null;
  storage_list_id?: number | null;
  storage_list?: OfferListType;
  is_list_from_storage: boolean;
  is_pre_order: boolean;
}
