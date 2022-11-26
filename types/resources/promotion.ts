import { ProductCollectionType } from './productCollection';
import { CountryType } from './country';
import { BaseType } from './base';

export interface BasePromotionType extends BaseType {
  name: string;
  discount_type: 'fixed' | 'fixed-reduction' | 'percentage';
  user_group?: string;
  start_at?: string | Date;
  end_at?: string | Date;

  country_id?: number;
  country?: CountryType;
  product_collection_id?: number;
  product_collection?: ProductCollectionType;
}

export interface PromotionType {
  id?: number;
  fee: number;
  discount: number;
  type: 'fixed' | 'fixed-reduction' | 'percentage';
  name: string;
}

export const defaultPromotion: PromotionType = {
  fee: Number.POSITIVE_INFINITY,
  discount: 0,
  type: 'percentage',
  name: '',
};
