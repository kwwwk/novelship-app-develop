import { BasePromotionType } from './promotion';

export interface DeliveryFeePromotionType extends BasePromotionType {
  delivery_fee: number;
  minimum_purchase_value?: number;
}
