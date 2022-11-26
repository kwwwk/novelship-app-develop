import { DeliveryFeePromotionType } from 'types/resources/deliveryFeePromotion';
import { ShippingFeePromotionType } from 'types/resources/shippingFeePromotion';
import { SellingFeePromotionType } from 'types/resources/sellingFeePromotion';
import { PromotionType } from 'types/resources/promotion';
import { ProductType } from 'types/resources/product';
import { UserType } from 'types/resources/user';

import { toPrecision } from 'common/utils/currency';
import Store from 'app/store';

type PromotionsType = DeliveryFeePromotionType | ShippingFeePromotionType | SellingFeePromotionType;

const getCurrentCountryId = () => Store.getState().country.current.id;

const checkUserGroup = (promotion: PromotionsType, user: UserType): boolean =>
  !promotion.user_group || !!(promotion.user_group && user.groups.includes(promotion.user_group));

const checkCountry = (
  promotion: DeliveryFeePromotionType | ShippingFeePromotionType | SellingFeePromotionType,
  userCountryId: number | void
): boolean =>
  !promotion.country_id ||
  !!(promotion.country_id && (userCountryId || getCurrentCountryId()) === promotion.country_id);

const checkMinimumPrice = (minimumPrice: number | void, price: number): boolean =>
  !minimumPrice || !!(minimumPrice && price >= minimumPrice);

const checkProductCollection = (promotion: PromotionsType, product: ProductType): boolean =>
  !promotion.product_collection ||
  (promotion.product_collection &&
    product.collections?.includes(promotion.product_collection.slug));

const isDeliveryFeeDiscountApplicable = ({
  promotion,
  product,
  price,
  user,
}: {
  promotion: DeliveryFeePromotionType;
  product: ProductType;
  user: UserType;
  price: number;
}): boolean =>
  checkUserGroup(promotion, user) &&
  checkCountry(promotion, user.country_id) &&
  checkMinimumPrice(promotion.minimum_purchase_value, price) &&
  checkProductCollection(promotion, product);

const isSellerDiscountApplicable = ({
  promotion,
  product,
  seller,
  price,
}: {
  promotion: ShippingFeePromotionType | SellingFeePromotionType;
  product: ProductType;
  seller: UserType;
  price: number;
}): boolean =>
  checkUserGroup(promotion, seller) &&
  checkCountry(promotion, seller.shipping_country_id) &&
  checkMinimumPrice(promotion.minimum_sales_value, price) &&
  checkProductCollection(promotion, product);

const roundUp = (input: number) => toPrecision(input, 0.1, 'up');
const feeAfterDiscount = (fee: number, discount = 0) =>
  roundUp(fee - (fee * (discount || 0)) / 100);

const getPromotionalFee = (promotion: PromotionsType, regularFee: number, discount: number) => {
  if (promotion.discount_type === 'percentage') {
    return feeAfterDiscount(regularFee, discount);
  }
  if (promotion.discount_type === 'fixed-reduction') {
    return regularFee > discount ? regularFee - discount : 0;
  }
  return Math.min(discount, regularFee);
};

const getPromotion = (
  promotion: PromotionsType,
  lowestFeePromotion: PromotionType,
  regularFee: number,
  discount: number
): PromotionType => {
  const fee = getPromotionalFee(promotion, regularFee, discount);
  return fee < lowestFeePromotion.fee && fee < regularFee
    ? { id: promotion.id, fee, discount, type: promotion.discount_type, name: promotion.name }
    : lowestFeePromotion;
};

export { isDeliveryFeeDiscountApplicable, isSellerDiscountApplicable, getPromotion };
