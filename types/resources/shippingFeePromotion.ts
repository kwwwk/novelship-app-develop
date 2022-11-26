import { BasePromotionType } from './promotion';

export interface ShippingFeePromotionType extends BasePromotionType {
  shipping_fee: number;
  minimum_sales_value?: number;
}
