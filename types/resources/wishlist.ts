import { defaultProduct } from 'types/resources/product';
import type { BaseType } from './base';
import type { ProductType } from './product';
import { ProductStatType, defaultProductStat } from './productStat';

export interface UserWishlistType extends BaseType {
  id: number;
  product_id: number;
  product: ProductType;
  product_stat?: ProductStatType;
  user_id: number;
  size: string;
  local_size: string;
}

const defaultUserWishlist: UserWishlistType = {
  id: 0,
  product_id: 0,
  product: defaultProduct,
  product_stat: defaultProductStat,
  user_id: 0,
  size: 'OS',
  local_size: 'OS',
};

export { defaultUserWishlist };
