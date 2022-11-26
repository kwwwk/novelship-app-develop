import { TransactionBuyerType } from 'types/resources/transactionBuyer';
import { BaseType } from './base';
import { CurrencyType } from './currency';
import { ProductAddOnType } from './productAddOn';

export interface TransactionBuyerAddOnType extends BaseType {
  add_on_name: string;
  total_price_local: number;
  quantity: number;

  currency_id: number;
  currency: CurrencyType;

  product_add_on_id: number;
  product_add_on: ProductAddOnType;

  transaction_buyer_id: number;
  transaction_buyer: TransactionBuyerType;
}
