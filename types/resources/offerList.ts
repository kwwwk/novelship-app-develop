import { TrxnDeliverToType } from 'types/resources/transaction';
import { PaymentMethodEnumType } from 'types/resources/paymentMethod';
import { CountryType, defaultCountry } from 'types/resources/country';
import { TransactionBuyerAddOnType } from 'types/resources/transactionBuyerAddOn';
import { ProductType, defaultProduct } from './product';
import { ProductStatType, defaultProductStat } from './productStat';
import { CurrencyType, defaultCurrency } from './currency';
import { AddressType, defaultAddress } from './user';

export interface OfferListType {
  id: number;
  active: boolean;
  product_id: number;
  user_id: number;
  price: number;
  stock_count: number;
  type: 'selling' | 'buying';
  reminded: boolean;
  shipping_address: AddressType;
  destination: CountryType;
  status: 'live' | 'sold' | 'expired' | 'deleted' | 'vacation';
  size: string;
  local_size: string;
  fees: {
    processing_sell: number;
    processing_buy: number;
    selling: number;
    delivery: number;
    shipping: number;
    delivery_insurance: number;

    // client only
    processingBuyPercent: number;
    shippingFeeOnlyRegular: number;
    shippingFeeRegular: number;
    shippingSurcharge: number;
    deliveryFeeOnlyRegular: number;
    deliveryFeeRegular: number;
    deliverySurcharge: number;
    deliveryInstant: number;
  };
  expiration: number;
  promocode_id: number;
  promocode_value: number;
  buyer_delivery_declared: number;
  local_price: number;
  total_price_local: number;
  local_currency_id: number;
  created_at: string;
  updated_at: string;
  expired_at: string;

  product: ProductType;
  product_stat?: ProductStatType;
  currency: CurrencyType;

  isOffer: boolean;
  isList: boolean;
  isEdit: boolean;
  totalPrice: number;
  loyaltyPoints: number;
  deliver_to: TrxnDeliverToType;
  payment_method?: PaymentMethodEnumType;
  is_delivery_instant: boolean;
  is_pre_order: boolean;
  instant_fee_applicable: boolean;

  is_instant: boolean;
  sale_storage_ref?: string;
  fee_add_on?: number;
  add_on_quantity?: number;
  add_ons?: TransactionBuyerAddOnType[];

  // client only
  loyaltyPointsWithBonus: number;
  offer_list_id: number;
}

const defaultOfferList: OfferListType = {
  id: 0,
  product_id: 0,
  user_id: 0,
  price: 0,
  stock_count: 0,
  type: 'buying',
  reminded: false,
  status: 'live',
  size: '',
  local_size: '',
  shipping_address: defaultAddress,
  destination: defaultCountry,
  fees: {
    selling: 0,
    shipping: 0,
    processing_sell: 0,
    processing_buy: 0,
    delivery: 0,
    delivery_insurance: 0,

    processingBuyPercent: 0,
    shippingFeeOnlyRegular: 0,
    shippingFeeRegular: 0,
    shippingSurcharge: 0,
    deliveryFeeOnlyRegular: 0,
    deliveryFeeRegular: 0,
    deliverySurcharge: 0,
    deliveryInstant: 0,
  },
  expiration: 0,
  promocode_id: 0,
  promocode_value: 0,
  expired_at: '',
  buyer_delivery_declared: 0,
  total_price_local: 0,
  local_price: 0,
  local_currency_id: 0,
  active: true,
  created_at: '',
  updated_at: '',
  product: defaultProduct,
  product_stat: defaultProductStat,
  currency: defaultCurrency,

  isOffer: false,
  isList: false,
  isEdit: false,
  totalPrice: 0,
  loyaltyPoints: 0,
  deliver_to: 'buyer',
  is_delivery_instant: false,
  is_pre_order: false,
  instant_fee_applicable: false,

  is_instant: false,
  sale_storage_ref: '',

  // client only
  loyaltyPointsWithBonus: 0,
  offer_list_id: 0,
};

export { defaultOfferList };
