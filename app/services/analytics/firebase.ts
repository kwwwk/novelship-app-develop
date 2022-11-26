import { sentryCapture } from 'app/services/sentry';
import { ProductType } from 'types/resources/product';
import { PromocodeType } from 'types/resources/promocode';

import analytics, { FirebaseAnalyticsTypes } from '@react-native-firebase/analytics';
import { toList } from 'common/utils/list';
import { CurrencyType } from 'types/resources/currency';
import {
  TrackingProperties,
  getProductItem,
  getBuyItem,
  getPromocodeInfo,
  BuyOfferTrxnType,
} from './utils';

class FirebaseAnalyticsManager {
  analytics: FirebaseAnalyticsTypes.Module;

  currency!: string;

  constructor(a: FirebaseAnalyticsTypes.Module) {
    this.analytics = a;
  }

  setContext({ currency }: { currency: CurrencyType }) {
    this.currency = currency.code;
  }

  setUserId = (id: string) => {
    try {
      this.analytics.setUserId(id).catch(sentryCapture);
    } catch (error) {
      sentryCapture(error);
    }
  };

  // todo: set userId to null https://github.com/invertase/react-native-firebase/issues/4931
  // logLogout = () => {
  //   try {
  //     this.analytics.setUserId(null).catch(sentryCapture);
  //   } catch (error) {
  //     sentryCapture(error);
  //   }
  // };

  logLogin = (method: 'email' | 'facebook' | 'google' | 'apple') => {
    try {
      this.analytics.logLogin({ method }).catch(sentryCapture);
    } catch (error) {
      sentryCapture(error);
    }
  };

  logSignUp = (method: 'email' | 'facebook' | 'google' | 'apple') => {
    try {
      this.analytics.logSignUp({ method }).catch(sentryCapture);
    } catch (error) {
      sentryCapture(error);
    }
  };

  logSearch = (searchTerm: string) => {
    try {
      this.analytics.logSearch({ search_term: searchTerm }).catch(sentryCapture);
    } catch (error) {
      sentryCapture(error);
    }
  };

  logScreenView = (screenName: string) => {
    try {
      this.analytics.logScreenView({ screen_name: screenName }).catch(sentryCapture);
    } catch (error) {
      sentryCapture(error);
    }
  };

  logViewItem = (product: ProductType) => {
    const productPrice = toList(product.lowest_listing_price) || 0;

    try {
      this.analytics
        .logViewItem({
          currency: this.currency,
          value: productPrice,
          items: [{ ...getProductItem(product), price: productPrice }],
        })
        .catch(sentryCapture);
    } catch (error) {
      sentryCapture(error);
    }
  };

  logAddToCart = (
    product: ProductType,
    buy: BuyOfferTrxnType,
    trackingData: TrackingProperties
  ) => {
    try {
      this.analytics
        .logAddToCart({
          currency: this.currency,
          value: trackingData['Product Price'] as number,
          items: [
            {
              ...getProductItem(product),
              ...getBuyItem(buy),
              item_variant: trackingData.Size as string,
              price: trackingData['Product Price'] as number,
            },
          ],
        })
        .catch(sentryCapture);
    } catch (error) {
      sentryCapture(error);
    }
  };

  logRemoveFromCart = (product: ProductType, buy: BuyOfferTrxnType) => {
    const buyItem = getBuyItem(buy);

    try {
      this.analytics
        .logRemoveFromCart({
          currency: this.currency,
          value: buyItem.price,
          items: [{ ...getProductItem(product), ...buyItem }],
        })
        .catch(sentryCapture);
    } catch (error) {
      sentryCapture(error);
    }
  };

  logBeginCheckout = (product: ProductType, buy: BuyOfferTrxnType) => {
    const buyItem = getBuyItem(buy);
    try {
      this.analytics
        .logBeginCheckout({
          currency: this.currency,
          value: buyItem.price,
          items: [{ ...getProductItem(product), ...buyItem }],
          ...(buy.promocode && { coupon: buy.promocode }),
        })
        .catch(sentryCapture);
    } catch (error) {
      sentryCapture(error);
    }
  };

  logPurchase = (product: ProductType, buy: BuyOfferTrxnType) => {
    const buyItem = getBuyItem(buy);
    try {
      this.analytics
        .logPurchase({
          currency: this.currency,
          value: buyItem.price,
          items: [{ ...getProductItem(product), ...buyItem }],
          ...(String(buy.promocode_id || buy.promocode) && {
            coupon: String(buy.promocode_id || buy.promocode),
          }),
          shipping: (buy.isOffer ? buy.fees.delivery : buy.fee_delivery) || 0,
          transaction_id: String(buy.ref || buy.id),
        })
        .catch(sentryCapture);
    } catch (error) {
      sentryCapture(error);
    }
  };

  logSelectPromotion = (product: ProductType, promocode: PromocodeType, buy: BuyOfferTrxnType) => {
    try {
      this.analytics
        .logSelectPromotion({
          ...getPromocodeInfo(promocode),
          items: [{ ...getProductItem(product), ...getBuyItem(buy) }],
        })
        .catch(sentryCapture);
    } catch (error) {
      sentryCapture(error);
    }
  };

  logViewPromotion = (product: ProductType, buy: BuyOfferTrxnType, promocode?: PromocodeType) => {
    if (!(promocode && promocode.id)) return;

    try {
      this.analytics
        .logViewPromotion({
          ...getPromocodeInfo(promocode),
          items: [{ ...getProductItem(product), ...getBuyItem(buy) }],
        })
        .catch(sentryCapture);
    } catch (error) {
      sentryCapture(error);
    }
  };

  logAddToWishlist = (product: ProductType) => {
    try {
      this.analytics
        .logAddToWishlist({
          currency: this.currency,
          value: 0,
          items: [{ ...getProductItem(product) }],
        })
        .catch(sentryCapture);
    } catch (error) {
      sentryCapture(error);
    }
  };
}

const FirebaseAnalytics = new FirebaseAnalyticsManager(analytics());

export default FirebaseAnalytics;
