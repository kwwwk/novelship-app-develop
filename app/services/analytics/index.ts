import { toList } from 'common/utils/list';
import { OfferListType } from 'types/resources/offerList';
import { ProductType } from 'types/resources/product';
import { UserType } from 'types/resources/user';
import { PromocodeType } from 'types/resources/promocode';

import { Platform } from 'react-native';
import { Mixpanel } from 'mixpanel-react-native';
import { Route } from '@react-navigation/native';
import { sentryCapture } from 'app/services/sentry';
import API from 'common/api';
import { AlgoliaParams } from 'app/store/views/search';
import envConstants from 'app/config';
import AlgoliaInsights from 'app/services/algolia-insights';
import UserViewedProductService from 'app/services/userViewedProduct';
import { CurrencyType } from 'types/resources/currency';
import { CountryType } from 'types/resources/country';
import { RaffleProductType } from 'types/resources/raffleProduct';
import {
  mapProductForTracking,
  mapBrowseForTracking,
  TrackingProperties,
  titleCase,
  mapEditOptionForTracking,
  BuyOfferTrxnType,
} from './utils';
import FirebaseAnalytics from './firebase';
import FacebookAnalytics from './facebook';

const cleanObject = (obj?: TrackingProperties): TrackingProperties => {
  if (!obj) return {};
  const newObj = { ...obj };
  Object.keys(newObj).forEach(
    (key) => (newObj[key] === undefined || newObj[key] === null) && delete newObj[key]
  );
  return newObj;
};

class AnalyticsManager {
  mixpanel!: Mixpanel;

  firebase: typeof FirebaseAnalytics;

  facebook: typeof FacebookAnalytics;

  currency!: string;

  constructor({
    firebase,
    facebook,
  }: {
    firebase: typeof FirebaseAnalytics;
    facebook: typeof FacebookAnalytics;
  }) {
    this.firebase = firebase;
    this.facebook = facebook;
  }

  setContext = ({ currency, country }: { currency: CurrencyType; country: CountryType }) => {
    this.currency = currency.code;
    this.firebase.setContext({ currency });
    this.facebook.setContext({ currency, country });
  };

  init = () => {
    if (this.mixpanel) return Promise.resolve(this.mixpanel);

    return Mixpanel.init(envConstants.MIXPANEL_TOKEN).then((mixpanel) => {
      this.mixpanel = mixpanel;
      this.mixpanel.registerSuperProperties({ Platform: Platform.OS });
      return this.mixpanel;
    });
  };

  track = async (eventName: string, properties?: TrackingProperties) => {
    await this.init();

    this.mixpanel.track(titleCase(eventName), cleanObject(properties));
  };

  identify = async (user?: UserType) => {
    await this.init();

    if (user?.id) {
      // Facebook
      this.facebook.identify(user);
      // Firebase
      this.firebase.setUserId(String(user.id));
      // Mixpanel
      this.mixpanel.identify(String(user.id));
      this.setPeople({ Platform: Platform.OS });
    }
  };

  alias = async (alias?: number, distinctId?: string | number) => {
    await this.init();

    this.mixpanel?.alias(String(alias), String(distinctId));
  };

  setPeople = async (userProperties: TrackingProperties) => {
    await this.init();

    Object.keys(userProperties).forEach((p) => {
      this.mixpanel.getPeople().set(String(p), String(userProperties[p]));
    });
  };

  click = (click: string, properties?: TrackingProperties) => {
    this.track(`Click ${click}`, properties);
  };

  login = async (user: UserType, method: 'email' | 'facebook' | 'google' | 'apple') => {
    await this.init();

    this.identify(user);
    // Mixpanel
    this.track('Login', { Method: method });
    // Firebase
    this.firebase.logLogin(method);
  };

  signup = async (
    event: 'Complete',
    user?: UserType,
    method?: 'email' | 'facebook' | 'google' | 'apple',
    properties?: TrackingProperties
  ) => {
    // Facebook
    this.facebook.lead(method);

    // Mixpanel
    await this.init();

    const distinctId = await this.mixpanel.getDistinctId();
    this.alias(user?.id, distinctId);
    this.track(`Signup: ${event}`, {
      // Name: user?.fullname,
      Email: user?.email,
      ...properties,
    });

    this.setPeople({
      'User ID': user?.id,
      'Signup Date': new Date().toISOString(),
      'Signup Method': method,
    });

    // Firebase
    if (method) this.firebase.logSignUp(method);
  };

  signupEvent = (
    event: 'Method select' | 'Request OTP' | 'Confirm OTP',
    properties?: TrackingProperties
  ) => {
    this.track(`Signup: ${event}`, { ...properties });
  };

  logout = async () => {
    // Facebook
    this.facebook.logout();
    // Mixpanel
    await this.init();

    this.mixpanel.reset();
  };

  unsubscribeEmail = async (unsubscribe: boolean, reason: string) => {
    await this.init();

    if (unsubscribe) this.setPeople({ $unsubscribed: 'true' });
    else this.mixpanel.getPeople().unset('$unsubscribed');

    if (reason !== '') {
      this.track('Email Unsubscribe', { Reason: reason });
    }
  };

  addPaymentEvent = (location: 'Buy' | 'Sell') => {
    // Mixpanel
    this.track('Add Payment', {
      Location: location,
    });
    // Facebook
    this.facebook.addPaymentInfo();
  };

  profileUpdate = (Form: 'profile' | 'buying' | 'selling' | 'notification' | 'vacation-mode') => {
    this.track('Profile: Update', { Form });
  };

  referralCodeApplied = (referralCode: string) => {
    this.track('Referral Code Applied', { 'Referral Code': referralCode });
  };

  redeemVoucher = (coupon: { name: string }) => {
    this.track('Profile: Redeem Voucher', {
      'Coupon Name': coupon.name,
    });
  };

  referralShare = () => {
    this.track('Referral Share');
  };

  homepageProductCategory = (Category: string) => {
    this.track(`Homepage Category`, { Category });
  };

  homepageViewMoreClick = (Section: string) => {
    this.track(`Homepage View More`, { Section });
  };

  productCardClick = (product: ProductType, Section: string) => {
    this.track(`Product Click`, { ...mapProductForTracking(product), Section });
  };

  trackScreenView = async (route?: Route<string>) => {
    if (route) {
      // Firebase
      this.firebase.logScreenView(route.name);
      // Mixpanel
      await this.init();
      this.track(`ScreenView: ${route.name}`, { ...route.params });
    }
  };

  productView = (product: ProductType) => {
    if (!product?.id) return;
    // Mixpanel
    this.track(`Product View`, mapProductForTracking(product));
    // Firebase
    this.firebase.logViewItem(product);
    // Facebook
    const price = toList(product.lowest_listing_price) || 0;
    if (price) {
      this.facebook.trackFBPixelForDynamicAds({
        event: 'ViewContent',
        product,
        value: price,
      });
    }

    UserViewedProductService.add(product);
  };

  productWishListed = (properties: TrackingProperties, product: ProductType) => {
    // Firebase
    this.firebase.logAddToWishlist(product);
    // Mixpanel
    this.track(`Product Wishlisted`, properties);
    // Facebook
    this.facebook.addToWishlist(product);
  };

  lookbookPostCreated = (properties: TrackingProperties) => {
    this.track(`Lookbook Post Created`, properties);
  };

  lookbookPostEdited = (properties: TrackingProperties) => {
    this.track(`Lookbook Post Edited`, properties);
  };

  browseView = (properties: AlgoliaParams) => {
    this.track(`Browse View`, mapBrowseForTracking(properties));
  };

  productSearch = (operation: 'Search', search: string, total: number) => {
    // Facebook
    this.facebook.search(search);
    // Firebase
    this.firebase.logSearch(search);
    // Mixpanel
    this.track(operation, {
      Term: search,
      'Term Length': search.length,
      '# of Results': total,
    });
    this.mixpanel.getPeople().increment('# of Searches', 1);
  };

  productSearchClick = (product: ProductType) => {
    this.track(`Search Click`, mapProductForTracking(product));
  };

  productShare = (product: ProductType) => {
    this.track('Product Share', mapProductForTracking(product));
  };

  sizeSelect = (operation: string, product: ProductType) => {
    this.track(`${operation} Size Select`, mapProductForTracking(product));
  };

  promocodeApply = (product: ProductType, buy: BuyOfferTrxnType, promocode: PromocodeType) => {
    // Firebase
    this.firebase.logSelectPromotion(product, buy, promocode);
    // Mixpanel
    this.track(`${buy.isOffer ? 'Offer' : 'Purchase'} Apply Promocode`, {
      Promocode: promocode.code,
    });
  };

  // promocodeView = (promocode: PromocodeType) => {
  //   firebase.logViewPromotion(promocode);
  // };

  // Buy/Offer
  buyInitiate = (product: ProductType) => {
    this.track(`Buy Initiate`, mapProductForTracking(product));
  };

  initiateCheckout = ({ product, buy }: { product: ProductType; buy: BuyOfferTrxnType }) => {
    // Facebook
    this.facebook.initiateCheckout({
      product,
      value: buy?.local_price || buy?.offer_price_local,
    });
    // Firebase
    this.firebase.logBeginCheckout(product, buy);
  };

  removeFromCart = (product: ProductType, buy: BuyOfferTrxnType) =>
    this.firebase.logRemoveFromCart(product, buy);

  buyPromoSelect = (product: ProductType, buy: BuyOfferTrxnType, promocode?: PromocodeType) => {
    // Firebase
    this.firebase.logViewPromotion(product, buy, promocode);
    // Mixpanel
    this.track(`Buy Promocode Select`, mapProductForTracking(product));
  };

  buyOfferConfirm = (
    buy: BuyOfferTrxnType,
    product: ProductType,
    operation: 'Offer' | 'Purchase',
    view: 'Confirm' | 'Review',
    properties?: TrackingProperties
  ) => {
    const isBuy = operation === 'Purchase';
    const trackingData = {
      ...mapProductForTracking(product),
      Size: buy.size,
      'Delivery Fee': isBuy ? buy.fee_delivery : buy.fees.delivery,
      'Processing Fee': isBuy ? buy.fee_processing_buy : buy.fees.processing_buy,
      'Promocode Discount': buy.promocode_value,
      'Payment Method': buy.payment_method,
      'Product Price': parseInt(buy.local_price || buy.offer_price_local),
      Editing: buy.isEdit,
      ...properties,
    };
    // Mixpanel
    this.track(`${operation} ${view}`, trackingData);

    if (operation === 'Purchase' && view === 'Review') {
      // Firebase
      this.firebase.logAddToCart(product, buy, trackingData);
      // Facebook
      this.facebook.trackFBPixelForDynamicAds({
        event: 'AddToCart',
        product,
        value: trackingData['Product Price'] || 0,
      });
    }

    if (view === 'Confirm') {
      AlgoliaInsights.productConversion({ name_slug: product.name_slug, mode: operation });
    }

    if (operation === 'Purchase' && view === 'Confirm') {
      // Firebase
      this.firebase.logPurchase(product, { ...buy, isOffer: !isBuy });
      // Facebook
      this.facebook.trackFBPixelForDynamicAds({
        event: 'Purchase',
        product,
        value: buy?.local_price || buy?.offer_price_local,
      });
    }

    if (operation === 'Offer' && view === 'Confirm') {
      API.post(`me/offer-lists/${buy.id}/log`, trackingData);
    }
  };

  // Sell/List
  sellInitiate = (product: ProductType) => {
    this.track('Sell Initiate', mapProductForTracking(product));
  };

  sellListConfirm = (
    sell: BuyOfferTrxnType,
    product: ProductType,
    seller: UserType,
    operation: 'List' | 'Sale' | 'Consignment',
    view: 'Confirm' | 'Review',
    properties?: TrackingProperties
  ) => {
    const trackingData = {
      ...mapProductForTracking(product),
      Size: sell.size,
      ...(operation === 'Consignment'
        ? {}
        : {
            'Seller Fee':
              ((operation === 'Sale' ? sell.fee_selling : sell.fees.selling) * 100) /
                (sell.local_price || sell.list_price_local) || undefined,
          }),
      'Product Price': sell.local_price || sell.list_price_local,
      'Shipping From Country': seller.shipping_country.shortcode,
      Editing: sell.isEdit,
      ...properties,
    };
    this.track(`${operation} ${view}`, trackingData);
    if (view === 'Confirm') {
      AlgoliaInsights.productConversion({ name_slug: product.name_slug, mode: operation });
    }

    if (operation === 'List' && view === 'Confirm') {
      API.post(`me/offer-lists/${sell.id}/log`, trackingData);
    }
  };

  deleteOfferList = (mode: string, offerList: OfferListType) => {
    const offerListId =
      mode === 'Offer' ? { 'Offer ID': offerList.id } : { 'List ID': offerList.id };
    this.track(`Delete ${mode}`, {
      Size: offerList.size,
      'Product ID': offerList.product_id,
      'Product Price': offerList.local_price,
      ...offerListId,
    });
  };

  orderView = (Type: string) => {
    this.track(`Order View`, { Type });
  };

  resellStorageClick = (product: ProductType, user_id: number) => {
    this.track(`Resell/Storage Click`, { ...mapProductForTracking(product), 'User ID': user_id });
  };

  bulkListEdit = ({
    operation,
    edit_option,
    edit_value,
    updated_lists,
  }: {
    operation: 'Confirm' | 'Review';
    edit_option: 'increaseByValue' | 'decreaseByValue' | 'beatLowestListByValue' | 'setToValue';
    edit_value: number;
    updated_lists?: {
      id: number;
      size: string;
      product_id: number;
      new_price: number;
      old_price: number;
    }[];
  }) => {
    let newPrices: number[] = [];
    let oldPrices: number[] = [];
    const UPDATE_LISTS_DATA_LIMIT = 10;
    if (updated_lists) {
      const lists = updated_lists.splice(0, UPDATE_LISTS_DATA_LIMIT);
      newPrices = lists.map((l) => l.new_price);
      oldPrices = lists.map((l) => l.old_price);
    }
    this.track(`Bulk List ${operation}`, {
      'Edit Option': mapEditOptionForTracking[edit_option],
      'Edit Value': edit_value,
      ...(operation === 'Confirm'
        ? {
            'New Lists Price': JSON.stringify(newPrices),
            'Old Lists Price': JSON.stringify(oldPrices),
          }
        : {}),
    });
  };

  contactUsClick = () => {
    // Mixpanel
    this.track('Click Contact Us');
    // Facebook
    this.facebook.contact();
  };

  // Raffle
  raffleTrack = (
    name: 'Notify Me Click' | 'Initiate' | 'Size Select',
    raffle: RaffleProductType
  ) => {
    this.track(`Raffle ${name}`, {
      'Raffle ID': raffle.id,
      ...mapProductForTracking(raffle.product),
    });
  };

  raffleReviewConfirm = (
    operation: 'Review' | 'Confirm',
    raffle: RaffleProductType,
    properties?: TrackingProperties
  ) => {
    try {
      this.track(`Raffle ${operation}`, {
        'Raffle ID': raffle.id,
        ...mapProductForTracking(raffle.product),
        Currency: this.currency,
        ...properties,
      });
    } catch (error) {
      sentryCapture(error);
    }
  };
}

const Analytics = new AnalyticsManager({
  firebase: FirebaseAnalytics,
  facebook: FacebookAnalytics,
});

export default Analytics;
