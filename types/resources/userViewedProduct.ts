import type { ProductClassType } from './product';

export interface ViewedProductType {
  product_id: number;
  timestamp: number;
}

export interface UserViewedProductType {
  user_id: number;
  product_class: ProductClassType;
  products: ViewedProductType[];
}
