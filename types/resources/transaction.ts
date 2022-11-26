/* eslint-disable import/no-cycle */
import { TransactionBuyerType } from './transactionBuyer';
import { TransactionSellerType } from './transactionSeller';

export interface TransactionType extends TransactionBuyerType, TransactionSellerType {}
export type TrxnStatusType =
  | 'pending'
  | 'payment_failed'
  | 'confirmed'
  | 'shipping'
  | 'shipping_arrived'
  | 'shipping_transferring'
  | 'authenticating'
  | 'to_deliver'
  | 'delivering'
  | 'completed'
  | 'to_storage'
  | 'in_storage'
  | 'in_storage_to_deliver'
  | 'in_storage_sold'
  | 'to_inventory'
  | 'in_inventory'
  | 'to_complete'
  | 'to_inventory_store'
  | 'to_inventory_deliver'
  | 'qc_fail_decision'
  | 'buy_failed'
  | 'sell_failed';

export type TrxnDeliverToType = 'buyer' | 'storage';
export type TrxnOperationType = 'buy' | 'sell';
