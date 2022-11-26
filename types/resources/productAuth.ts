import { BaseType } from './base';
import { ProductType, defaultProduct } from './product';
import { CurrencyType, defaultCurrency } from './currency';

export interface ProductAuthType extends BaseType {
  user_id: number;
  product_id: number;
  images: { url: string }[];
  status: 'payment_pending' | 'confirmed' | 'requested_images' | 'passed' | 'failed' | 'rejected';
  request_info: string;
  reject_info: string;
  payment_method: string;
  currency_id: number;
  total_price: number;
  total_price_local: number;

  currency: CurrencyType;
  product: ProductType;
}

const defaultProductAuth: ProductAuthType = {
  id: 0,
  user_id: 0,
  product_id: 0,
  images: [],
  status: 'payment_pending',
  request_info: '',
  reject_info: '',
  payment_method: '',
  currency_id: 0,
  total_price: 0,
  total_price_local: 0,

  currency: defaultCurrency,
  product: defaultProduct,
};

export { defaultProductAuth };
