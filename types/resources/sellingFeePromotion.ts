import { BasePromotionType } from './promotion';

export interface SellingFeePromotionType extends BasePromotionType {
  selling_fee: number;
  listing_fee?: number;
  minimum_sales_value?: number;
}
