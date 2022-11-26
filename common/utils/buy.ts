import { TrxnDeliverToType } from 'types/resources/transaction';
import { PaymentMethodEnumType } from 'types/resources/paymentMethod';
import { PromotionType, defaultPromotion } from 'types/resources/promotion';
import { PromocodeType, defaultPromocode } from 'types/resources/promocode';
import { OfferListType } from 'types/resources/offerList';
import { ProductType } from 'types/resources/product';
import { CountryType } from 'types/resources/country';
import { UserType } from 'types/resources/user';

import { DELIVERY_PROTECTION_FEE_BUYING, CURRENCY_CONSTANTS } from 'common/constants/currency';
import Store from 'app/store';
import { getCurrentCountry, toBaseCurrency } from 'common/utils/currency';

import { CurrencyType } from 'types/resources/currency';
import { defaultProductAddOn, ProductAddOnType } from 'types/resources/productAddOn';
import { getCurrencyById, getCurrentCurrency, toPrecision } from './currency';
import { getPromotion, isDeliveryFeeDiscountApplicable } from './promotion';
import { productGetEffectiveWeight } from './product';
import { toList } from './list';

const getDeliveryFeePromotions = () => Store.getState().base.deliveryFeePromotions;

const NEW_USER_SALE_POINTS = 50;
const POINTS_PER_PRICE_BEFORE_THRESHOLD = 0.05;

function getBuyProcessingFeePercent({
  country,
  paymentMethod,
  mode,
}: {
  country: CountryType;
  paymentMethod: PaymentMethodEnumType | null;
  mode: 'buy' | 'offer';
}) {
  const paymentConfig = Store.getState().base.buyTrxnPaymentFee;

  const feePercent = paymentConfig.reduce((prev, curr) => {
    if (
      (curr.country_id === country.id || !curr.country_id) &&
      (curr.payment_method === paymentMethod || !curr.payment_method) &&
      (curr.mode === mode || !curr.mode) &&
      curr.fee > prev
    ) {
      // eslint-disable-next-line no-param-reassign
      prev = curr.fee;
    }
    return prev;
  }, 0);

  return (feePercent || 0) / 100;
}

const getPointsForSale = (price: number, user: UserType, promocodeValue: number): number => {
  let points = 0;
  const currentCurrency = getCurrentCurrency();

  if (user.firstTimePromocodeEligible) {
    points += NEW_USER_SALE_POINTS;
  }
  points +=
    POINTS_PER_PRICE_BEFORE_THRESHOLD * (price - toBaseCurrency(promocodeValue, currentCurrency));

  return Math.ceil(points);
};

// const getBonusPointsForSale = (points: number): number => {
//   const bonus = Math.ceil((points * config.campaign.loyaltyPointsBonus) / 100);
//   return isLoyaltyBonusAvailable ? points + bonus : 0;
// };

const getBuyerDeliveryCountry = (user: UserType, currentCountry: CountryType) =>
  user.country.id ? user.country : currentCountry;

const getBuyerDeliveryInstantFee = (user: UserType) => {
  const currentCurrency = getCurrentCurrency();
  const country = getBuyerDeliveryCountry(user, getCurrentCountry());
  const deliveryCurrency = getCurrencyById(country.currency_id);
  const currencyPrecision = currentCurrency.precision;

  const roundUp = (input: number) => toPrecision(input, currencyPrecision, 'up');
  const deliveryInstant = roundUp(
    (country.delivery_instant / deliveryCurrency.rate) * currentCurrency.rate
  );

  return deliveryInstant;
};

const getDeliveryFeePromotion = ({
  deliveryFeeRegular,
  product,
  price,
  user,
}: {
  deliveryFeeRegular: number;
  product: ProductType;
  user: UserType;
  price: number;
}): PromotionType =>
  getDeliveryFeePromotions().reduce((lowestFeePromotion, promotion) => {
    if (!isDeliveryFeeDiscountApplicable({ promotion, product, user, price })) {
      return lowestFeePromotion;
    }

    return getPromotion(promotion, lowestFeePromotion, deliveryFeeRegular, promotion.delivery_fee);
  }, defaultPromotion);

const getDeliveryInsuranceFee = ({
  deliveryDeclare,
  currency,
}: {
  deliveryDeclare: number;
  currency: CurrencyType;
}) => {
  const { deliveryInsuranceMaxFree, deliveryInsurancePrecision } =
    CURRENCY_CONSTANTS[currency.code];

  const roundUpInsuranceFee = (input: number) =>
    toPrecision(input, deliveryInsurancePrecision, 'up');
  return deliveryDeclare && deliveryDeclare > deliveryInsuranceMaxFree
    ? roundUpInsuranceFee(
        (deliveryDeclare - deliveryInsuranceMaxFree) * DELIVERY_PROTECTION_FEE_BUYING
      )
    : 0;
};

const getFees = ({
  price,
  related: {
    product,
    user,
    promocode = { value: 0 },
    productAddOn = { price: 0, quantity: 0, addOn: defaultProductAddOn },
  },
  options: { paymentMethod, deliverTo, deliveryDeclare, instantFeeApplicable, mode },
}: {
  price: number;
  related: {
    product: ProductType;
    user: UserType;
    promocode: { value: number };
    productAddOn?: { price: number; quantity: number; addOn: ProductAddOnType | null };
  };
  options: {
    paymentMethod: PaymentMethodEnumType;
    deliverTo: TrxnDeliverToType;
    deliveryDeclare: number;
    instantFeeApplicable?: boolean;
    mode: 'buy' | 'offer';
  };
}) => {
  const country = getBuyerDeliveryCountry(user, getCurrentCountry());
  const deliveryCurrency = getCurrencyById(country.currency_id);
  const currentCurrency = getCurrentCurrency();
  const currencyPrecision = currentCurrency.precision;

  const weight = productGetEffectiveWeight(product, productAddOn);
  const isStorageRequest = deliverTo === 'storage';

  const roundUp = (input: number) => toPrecision(input, currencyPrecision, 'up');

  const deliveryInsurance = getDeliveryInsuranceFee({ deliveryDeclare, currency: currentCurrency });

  const deliveryInstant = instantFeeApplicable
    ? roundUp((country.delivery_instant / deliveryCurrency.rate) * currentCurrency.rate)
    : 0;

  const deliverySurcharge = roundUp(
    ((country.delivery_surcharge * weight) / deliveryCurrency.rate) * currentCurrency.rate
  );

  const remoteDeliverySurcharge =
    user.address && user.address.is_remote_area
      ? roundUp((country.delivery_surcharge_remote / deliveryCurrency.rate) * currentCurrency.rate)
      : 0;

  const deliveryFeeOnlyRegular =
    roundUp(
      ((country.delivery_base + country.delivery_increment * weight) / deliveryCurrency.rate) *
        currentCurrency.rate
    ) + remoteDeliverySurcharge;

  const deliveryFeeRegular = deliveryFeeOnlyRegular + deliverySurcharge;

  const args = { deliveryFeeRegular, product, price, user };
  const deliveryFeePromotion = getDeliveryFeePromotion(args);

  const minDeliveryFee = Math.min(deliveryFeeRegular, deliveryFeePromotion.fee);

  const processingBuyPercent = getBuyProcessingFeePercent({ country, paymentMethod, mode });

  const fees: Pick<
    OfferListType['fees'],
    | 'processing_buy'
    | 'processingBuyPercent'
    | 'delivery_insurance'
    | 'delivery'
    | 'deliveryInstant'
    | 'deliverySurcharge'
    | 'deliveryFeeOnlyRegular'
    | 'deliveryFeeRegular'
  > = {
    processing_buy: roundUp(processingBuyPercent * price),
    processingBuyPercent,
    delivery_insurance: deliveryInsurance,
    delivery: isStorageRequest ? deliveryInstant : roundUp(minDeliveryFee + deliveryInstant),
    deliveryInstant: instantFeeApplicable ? roundUp(deliveryInstant) : 0,
    deliverySurcharge: isStorageRequest ? 0 : deliverySurcharge,
    deliveryFeeOnlyRegular: isStorageRequest ? 0 : roundUp(deliveryFeeOnlyRegular),
    deliveryFeeRegular: isStorageRequest ? 0 : roundUp(deliveryFeeRegular),
  };

  return {
    fees,
    totalPrice: roundUp(
      price +
        fees.delivery +
        fees.processing_buy +
        fees.delivery_insurance -
        promocode.value +
        Number(productAddOn?.price || 0)
    ),
  };
};

const getBuy = ({
  list = { price: 0 },
  product,
  promocode = defaultPromocode,
  user,
  deliverTo,
  deliveryDeclare,
  paymentMethod,
  productAddOn,
}: {
  list: OfferListType & any;
  product: ProductType;
  promocode: PromocodeType;
  user: UserType;
  deliverTo: TrxnDeliverToType;
  deliveryDeclare: number;
  paymentMethod: PaymentMethodEnumType;
  productAddOn: { price: number; quantity: number; addOn: ProductAddOnType | null };
}) => {
  if (!list.price) list.price = 0;
  const buyer_currency = getCurrentCurrency();
  const buy = {
    size: list.size,
    confirmed_price: list.price,
    price: toList(list.price),
    promocode: promocode.code || null,
    promocode_value: promocode.value || undefined,
    operation: 'buy',
    offer_list_id: list.id,
    product_id: list.product_id,
    buyer_currency,
    buyer_currency_id: buyer_currency.id,
    local_price: toList(list.price),
    expiration: 7,
    type: 'buying',
    buyer_delivery_declared: deliveryDeclare,
    deliver_to: deliverTo,
    payment_method: paymentMethod,
    instant_fee_applicable: list.is_instant,
  };

  const loyaltyPoints = getPointsForSale(list.price, user, promocode.value);
  return {
    ...buy,
    ...getFees({
      price: buy.price,
      related: {
        product,
        user,
        promocode,
        productAddOn,
      },
      options: {
        paymentMethod,
        deliverTo,
        deliveryDeclare,
        instantFeeApplicable: buy.instant_fee_applicable,
        mode: 'buy',
      },
    }),
    // loyaltyPointsWithBonus: getBonusPointsForSale(loyaltyPoints),
    loyaltyPoints,
  };
};

const getOffer = ({
  list = { price: 0 },
  product,
  promocode = defaultPromocode,
  user,
  deliverTo,
  deliveryDeclare,
  paymentMethod,
}: {
  list: OfferListType & any;
  product: ProductType;
  promocode: PromocodeType;
  user: UserType;
  deliverTo: TrxnDeliverToType;
  deliveryDeclare: number;
  paymentMethod: PaymentMethodEnumType;
}) => {
  if (!list.price) list.price = 0;
  const currency = getCurrentCurrency();

  const buy = {
    ...list,
    isOffer: true,
    type: 'buying',
    local_price: parseInt(list.local_price, 10) || '',
    local_currency_id: currency.id,
    currency,
    expiration: parseInt(list.expiration, 10),
    product_id: product.id,
    promocode: promocode.code || null,
    buyer_delivery_declared: deliveryDeclare,
    deliver_to: deliverTo,
    payment_method: paymentMethod,
  };

  const loyaltyPoints = getPointsForSale(buy.local_price / currency.rate, user, promocode.value);
  return {
    ...buy,
    ...getFees({
      price: buy.local_price || 0,
      related: {
        product,
        user,
        promocode,
      },
      options: {
        paymentMethod,
        deliverTo,
        deliveryDeclare,
        mode: 'offer',
      },
    }),
    // loyaltyPointsWithBonus: getBonusPointsForSale(loyaltyPoints),
    loyaltyPoints,
  };
};

// https://docs.google.com/document/d/1qbQI2Nu2kIx4CtppGcpNyMPbESlagn-jAbrue1-b0hU
const getSuggestedOfferPrice = (highestOfferPrice: number, lowestListPrice: number) => {
  if (!lowestListPrice && !highestOfferPrice) {
    return undefined;
  }

  if (lowestListPrice && !highestOfferPrice) {
    return lowestListPrice;
  }

  const { offer_step } = getCurrentCurrency();
  if (!lowestListPrice && highestOfferPrice) {
    return highestOfferPrice + offer_step * 10;
  }

  const highLowOfferListPriceDiff = lowestListPrice - highestOfferPrice;
  if (highLowOfferListPriceDiff <= offer_step) return lowestListPrice;
  if (highLowOfferListPriceDiff <= offer_step * 10) return highestOfferPrice + offer_step;
  return highestOfferPrice + offer_step * 10; // if highLowOfferListPriceDiff > offer_step * 10
};

export {
  getBuy,
  getOffer,
  getSuggestedOfferPrice,
  getDeliveryFeePromotion,
  getBuyerDeliveryInstantFee,
  getDeliveryInsuranceFee,
};
