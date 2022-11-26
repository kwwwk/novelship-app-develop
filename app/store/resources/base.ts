import { Platform } from 'react-native';
import { action, computed, Action, Computed } from 'easy-peasy';

import { DeliveryFeePromotionType } from 'types/resources/deliveryFeePromotion';
import { ShippingFeePromotionType } from 'types/resources/shippingFeePromotion';
import { SellingFeePromotionType } from 'types/resources/sellingFeePromotion';
import { ProductCollectionType } from 'types/resources/productCollection';
import {
  PaymentMethodType,
  PaymentMethodEnumType,
  ConfigBuyTrxnPaymentFeeType,
} from 'types/resources/paymentMethod';
import { PromocodeType } from 'types/resources/promocode';
import { CurrencyType } from 'types/resources/currency';
import { CountryType } from 'types/resources/country';
import { ProductType } from 'types/resources/product';
import type { StoreModel } from '../storeModel';

export type CollectionType = {
  All: ProductCollectionType[];
  Sneakers: ProductCollectionType[];
  Apparel: ProductCollectionType[];
  Collectibles: ProductCollectionType[];
};

type CryptoRatesType = { BTC: number; ETH: number; USDT: number };
type PayoutCryptoConfigType = {
  balance: number;
  min: number;
  tokens: { name: string; code: string }[];
};
type PromotionLoyaltyMultiplierType = {
  country_id: number;
  payment_method: string;
  multiplier: number;
};

export type BaseAPIResponseType = {
  countries: CountryType[];
  currencies: CurrencyType[];
  promocodes: PromocodeType[];
  payment_methods: PaymentMethodType[];
  product_collections: CollectionType;
  delivery_fee_promotions: DeliveryFeePromotionType[];
  shipping_fee_promotions: ShippingFeePromotionType[];
  selling_fee_promotions: SellingFeePromotionType[];
  searchesTrending: string[];
  cryptoRates: CryptoRatesType;
  payoutCryptoConfig: PayoutCryptoConfigType;
  promotionLoyaltyMultiplier: PromotionLoyaltyMultiplierType[];
  buyTrxnPaymentFee: ConfigBuyTrxnPaymentFeeType[];
};

export type BaseStoreType = {
  set: Action<
    BaseStoreType,
    {
      deliveryFeePromotions: DeliveryFeePromotionType[];
      shippingFeePromotions: ShippingFeePromotionType[];
      sellingFeePromotions: SellingFeePromotionType[];
      productCollections: CollectionType;
      paymentMethods: PaymentMethodType[];
      promocodes: PromocodeType[];
      searchesTrending: string[];
      cryptoRates: CryptoRatesType;
      promotionLoyaltyMultiplier: PromotionLoyaltyMultiplierType[];
      payoutCryptoConfig: PayoutCryptoConfigType;
      buyTrxnPaymentFee: ConfigBuyTrxnPaymentFeeType[];
    }
  >;
  deliveryFeePromotions: DeliveryFeePromotionType[];
  shippingFeePromotions: ShippingFeePromotionType[];
  sellingFeePromotions: SellingFeePromotionType[];
  productCollections: CollectionType;
  getCollectionsByClass: Computed<
    BaseStoreType,
    (_class?: ProductType['class']) => ProductCollectionType[]
  >;
  getCollectionBySlug: Computed<
    BaseStoreType,
    (
      slug: string,
      _class: ProductType['class']
    ) => ProductCollectionType | Record<string, typeof undefined>
  >;
  paymentMethods: PaymentMethodType[];
  getPaymentMethodBySlug: Computed<
    BaseStoreType,
    (slug: PaymentMethodEnumType) => PaymentMethodType | Record<string, unknown>
  >;
  getAvailablePaymentMethods: Computed<
    BaseStoreType,
    (buyPrice?: number, product?: ProductType) => PaymentMethodType[],
    StoreModel
  >;
  promocodes: PromocodeType[];
  searchesTrending: string[];
  cryptoRates: CryptoRatesType;
  promotionLoyaltyMultiplier: PromotionLoyaltyMultiplierType[];
  payoutCryptoConfig: PayoutCryptoConfigType;
  buyTrxnPaymentFee: ConfigBuyTrxnPaymentFeeType[];
};

// No Data in here is changed after the <App /> is mounted and data is set once
const BaseStore: BaseStoreType = {
  set: action((store, base) => {
    store.deliveryFeePromotions = base.deliveryFeePromotions;
    store.shippingFeePromotions = base.shippingFeePromotions;
    store.sellingFeePromotions = base.sellingFeePromotions;
    store.productCollections = base.productCollections;
    store.paymentMethods = base.paymentMethods;
    store.promocodes = base.promocodes;
    store.searchesTrending = base.searchesTrending;
    store.cryptoRates = base.cryptoRates;
    store.promotionLoyaltyMultiplier = base.promotionLoyaltyMultiplier;
    store.payoutCryptoConfig = base.payoutCryptoConfig;
    store.buyTrxnPaymentFee = base.buyTrxnPaymentFee;
  }),
  // Promotion
  deliveryFeePromotions: [],
  shippingFeePromotions: [],
  sellingFeePromotions: [],
  // productCollections
  productCollections: { All: [], Sneakers: [], Apparel: [], Collectibles: [] },
  getCollectionsByClass: computed((state) => (_class?) => [
    ...(_class ? state.productCollections[_class] : []),
    ...state.productCollections.All,
  ]),
  getCollectionBySlug: computed(
    (state) => (slug, _class) =>
      state.getCollectionsByClass(_class).find((c) => c.slug === slug) || {}
  ),
  // payment methods
  paymentMethods: [],
  getPaymentMethodBySlug: computed(
    (state) => (slug) => state.paymentMethods.find((c) => c.slug === slug) || {}
  ),
  getAvailablePaymentMethods: computed(
    [
      (
        { paymentMethods },
        {
          user: { user },
          currency: { current: currentCurrency },
          country: { current: currentCountry },
        }
      ) => ({
        paymentMethods,
        user,
        currentCurrency,
        currentCountry,
      }),
    ],
    ({ paymentMethods, user, currentCurrency, currentCountry }) =>
      (buyPrice, product) => {
        const { isAdmin, country: buyingCountry } = user;
        const { code: currencyCode } = currentCurrency;
        const countryCode = buyingCountry.shortcode || currentCountry.shortcode;
        return paymentMethods.filter(
          (p) =>
            p.platforms.includes(Platform.OS) &&
            (p.admin_only ? isAdmin : true) &&
            !(p.slug === 'paidy' && String(product?.category_level_2).toLowerCase() === 'ps5') &&
            !(p.slug.includes('triple-a') && countryCode === 'CN') &&
            (!Object.keys(p.countries).length ||
              (p.countries[countryCode] &&
                p.countries[countryCode].active &&
                p.countries[countryCode].currency === currencyCode &&
                (p.countries[countryCode].admin_only ? isAdmin : true) &&
                (buyPrice
                  ? (p.countries[countryCode].min
                      ? Number(p.countries[countryCode].min) <= buyPrice
                      : true) &&
                    (p.countries[countryCode].max
                      ? Number(p.countries[countryCode].max) >= buyPrice
                      : true)
                  : true)))
        );
      }
  ),
  // public promocodes
  promocodes: [],
  // misc
  searchesTrending: [],
  cryptoRates: { BTC: 0, ETH: 0, USDT: 0 },
  payoutCryptoConfig: { min: 0, balance: 0, tokens: [] },
  promotionLoyaltyMultiplier: [],
  buyTrxnPaymentFee: [],
};

export default BaseStore;
