import { PromotionType, defaultPromotion } from 'types/resources/promotion';
import { OfferListType } from 'types/resources/offerList';
import { ProductType } from 'types/resources/product';
import { UserType } from 'types/resources/user';

import Store from 'app/store';

import { PAYMENT_PROCESSING_FEES_SELLING } from 'common/constants/currency';

import { getCurrencyById, getCurrentCountry, getCurrentCurrency, toPrecision } from './currency';
import { getPromotion, isSellerDiscountApplicable } from './promotion';
import { productGetEffectiveWeight } from './product';
import { toOffer } from './offer';

const getShippingFeePromotions = () => Store.getState().base.shippingFeePromotions;
const getSellingFeePromotions = () => Store.getState().base.sellingFeePromotions;

const getShippingFeePromotion = ({
  shippingFeeRegular,
  product,
  seller,
  price,
}: {
  product: ProductType;
  shippingFeeRegular: number;
  seller: UserType;
  price: number;
}): PromotionType =>
  getShippingFeePromotions().reduce((lowestFeePromotion, promotion) => {
    if (!isSellerDiscountApplicable({ promotion, product, seller, price })) {
      return lowestFeePromotion;
    }

    return getPromotion(promotion, lowestFeePromotion, shippingFeeRegular, promotion.shipping_fee);
  }, defaultPromotion);

const getSellerFeePromotion = ({
  product,
  seller,
  price,
  mode,
  isSellFromStorage,
}: {
  product: ProductType;
  seller: UserType;
  price: number;
  mode: 'list' | 'sell' | string;
  isSellFromStorage: boolean;
}): PromotionType => {
  // If seller is assigned a fee that doesn't allow promotions.
  if (!seller.selling_fee.promotions_applicable) {
    return defaultPromotion;
  }

  const sellingFeeRegular = seller.selling_fee.value;

  return getSellingFeePromotions().reduce((lowestFeePromotion, promotion) => {
    // Sell from Storage Promotion
    if (promotion.name === 'Sell_From_Storage' && !isSellFromStorage) {
      return lowestFeePromotion;
    }

    if (!isSellerDiscountApplicable({ promotion, product, seller, price })) {
      return lowestFeePromotion;
    }

    const discount =
      mode === 'list' ? promotion.listing_fee || promotion.selling_fee : promotion.selling_fee;
    return getPromotion(promotion, lowestFeePromotion, sellingFeeRegular, discount);
  }, defaultPromotion);
};

const getSellerFees = ({
  seller,
  product,
  mode,
  price,
  isSellFromStorage,
}: {
  seller: UserType;
  product: ProductType;
  mode: 'list' | 'sell' | string;
  price: number;
  isSellFromStorage: boolean;
}) => {
  const promotion = getSellerFeePromotion({
    product,
    seller,
    price,
    mode,
    isSellFromStorage,
  });

  // From the available fees, select only one, that is the min of all.
  return Math.min(seller.selling_fee.value, promotion.fee);
};

type SellOptions = {
  sale_storage_ref: string;
};
const getFees = (
  price: number,
  product: ProductType,
  user: UserType,
  mode: 'list' | 'sell',
  { sale_storage_ref }: SellOptions
) => {
  const country = user.shipping_country.id ? user.shipping_country : getCurrentCountry();
  const shippingCurrency = getCurrencyById(country.currency_id);
  const currentCurrency = getCurrentCurrency();
  const weight = productGetEffectiveWeight(product);
  const currencyPrecision = shippingCurrency.payout_precision;

  const roundUp = (input: number) => toPrecision(input, currencyPrecision, 'up');

  // If Selling from Storage, shipping = 0
  const isShippingFree = !!sale_storage_ref;

  const shippingSurcharge = isShippingFree
    ? 0
    : roundUp(
        ((country.shipping_surcharge * weight) / shippingCurrency.rate) *
          currentCurrency.rate *
          user.selling_fee.shipping_fee_multiplier
      );

  const shippingFeeOnlyRegular = isShippingFree
    ? 0
    : roundUp(
        ((country.shipping_base + country.shipping_increment * weight) / shippingCurrency.rate) *
          currentCurrency.rate *
          user.selling_fee.shipping_fee_multiplier
      );
  const shippingFeeRegular = isShippingFree ? 0 : shippingFeeOnlyRegular + shippingSurcharge;

  const args = { shippingFeeRegular, product, price, seller: user };
  const shippingFeePromotion = getShippingFeePromotion(args);
  const minShippingFee = Math.min(shippingFeeRegular, shippingFeePromotion.fee);
  const shipping = isShippingFree ? 0 : roundUp(minShippingFee);

  const fees: Pick<
    OfferListType['fees'],
    | 'selling'
    | 'processing_sell'
    | 'shipping'
    | 'shippingSurcharge'
    | 'shippingFeeRegular'
    | 'shippingFeeOnlyRegular'
  > = {
    selling: roundUp(
      (price *
        getSellerFees({
          seller: user,
          product,
          mode,
          price,
          isSellFromStorage: !!sale_storage_ref,
        })) /
        100
    ),
    processing_sell: roundUp(PAYMENT_PROCESSING_FEES_SELLING * price),
    shipping,
    shippingSurcharge,
    shippingFeeRegular,
    shippingFeeOnlyRegular,
  };

  return {
    fees,
    totalPrice: toPrecision(
      price - fees.selling - fees.processing_sell - fees.shipping,
      currencyPrecision,
      'down'
    ),
  };
};

const getSell = ({
  offer = { price: 0 },
  sale_storage_ref,
  product,
  user,
}: {
  offer: OfferListType & any;
  sale_storage_ref: string;
  product: ProductType;
  user: UserType;
}) => {
  if (!offer.price) offer.price = 0;

  const seller_currency = getCurrentCurrency();

  const sell = {
    size: offer.size,
    confirmed_price: offer.price,
    price: toOffer(offer.price),
    operation: 'sell',
    offer_list_id: offer.id,
    product_id: offer.product_id,
    seller_currency,
    seller_currency_id: seller_currency.id,
    sale_storage_ref,
    local_price: toOffer(offer.price),
    expiration: 7,
    type: 'selling',
  };
  return {
    ...sell,
    ...getFees(sell.price, product, user, 'sell', { sale_storage_ref }),
  };
};

const getList = ({
  list = { price: 0 },
  sale_storage_ref,
  product,
  user,
}: {
  list: OfferListType & any;
  sale_storage_ref: string;
  product: ProductType;
  user: UserType;
}) => {
  if (!list.price) list.price = 0;
  const currency = getCurrentCurrency();

  const sell = {
    ...list,
    isList: true,
    type: 'selling',
    local_price: parseInt(list.local_price, 10) || '',
    local_currency_id: currency.id,
    currency,
    expiration: parseInt(list.expiration, 10),
    product_id: product.id,
    sale_storage_ref,
  };

  return {
    ...sell,
    ...getFees(sell.local_price || 0, product, user, 'list', { sale_storage_ref }),
  };
};

// https://docs.google.com/document/d/1qbQI2Nu2kIx4CtppGcpNyMPbESlagn-jAbrue1-b0hU
const getSuggestedListPrice = (highestOfferPrice: number, lowestListPrice: number) => {
  if (!lowestListPrice && !highestOfferPrice) {
    return undefined;
  }

  if (!lowestListPrice && highestOfferPrice) {
    return highestOfferPrice;
  }

  const { list_step, min_list_price } = getCurrentCurrency();
  if (lowestListPrice && !highestOfferPrice) {
    return lowestListPrice - list_step * 10;
  }

  const highLowOfferListPriceDiff = lowestListPrice - highestOfferPrice;
  if (highLowOfferListPriceDiff <= list_step) return highestOfferPrice;

  const suggestedListPrice =
    highLowOfferListPriceDiff <= list_step * 10
      ? lowestListPrice - list_step
      : lowestListPrice - list_step * 10;

  return suggestedListPrice >= min_list_price ? suggestedListPrice : undefined;
};

export {
  getSell,
  getList,
  getSellerFees,
  getSuggestedListPrice,
  getSellerFeePromotion,
  getShippingFeePromotion,
};
