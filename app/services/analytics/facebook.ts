import { AppEventsLogger, AEMReporterIOS } from 'react-native-fbsdk-next';
import { ProductType } from 'types/resources/product';
import { UserType } from 'types/resources/user';
import { sentryCapture } from 'app/services/sentry';
import { CurrencyType } from 'types/resources/currency';
import { CountryType } from 'types/resources/country';
import { mapDynamicAdsPixelEvent } from './utils';

class FacebookAnalyticsManager {
  currency!: string;

  country!: string;

  setContext({ currency, country }: { currency: CurrencyType; country: CountryType }) {
    this.currency = currency.code;
    this.country = country.shortcode;
  }

  track = ({
    eventName,
    properties = {},
    value = 0,
  }: {
    eventName: string;
    properties?: { [key: string]: string | number };
    value?: number;
  }) => {
    // console.info(eventName, properties, value);
    try {
      if (eventName === 'Purchase') {
        AppEventsLogger.logPurchase(value, this.currency, properties);
      } else {
        AppEventsLogger.logEvent(eventName, value, properties);
      }
      AEMReporterIOS.logAEMEvent(
        eventName === 'Purchase' ? 'fb_mobile_purchase' : eventName,
        value || 0,
        this.currency || '',
        properties
      );
    } catch (error) {
      sentryCapture(error);
    }
  };

  identify = (user: UserType) => {
    AppEventsLogger.setUserID(String(user.id));

    AppEventsLogger.setUserData({
      email: user?.email,
      firstName: user?.firstname,
      lastName: user?.lastname,
      country: this.country,
    });
  };

  logout = () => {
    AppEventsLogger.setUserID(null);
  };

  lead = (method?: 'email' | 'facebook' | 'google' | 'apple') => {
    if (method) {
      this.track({
        eventName: AppEventsLogger.AppEvents.CompletedRegistration,
        properties: {
          [AppEventsLogger.AppEventParams.Currency]: this.currency,
          [AppEventsLogger.AppEventParams.RegistrationMethod]: method,
        },
      });
    }
  };

  search = (search: string) => {
    this.track({
      eventName: AppEventsLogger.AppEvents.Searched,
      properties: {
        [AppEventsLogger.AppEventParams.SearchString]: search,
        [AppEventsLogger.AppEventParams.ContentType]: 'product',
        [AppEventsLogger.AppEventParams.Success]: 1,
      },
    });
  };

  addPaymentInfo = () => {
    this.track({
      eventName: AppEventsLogger.AppEvents.AddedPaymentInfo,
      properties: { [AppEventsLogger.AppEventParams.Success]: 1 },
    });
  };

  addToWishlist = (product: ProductType) => {
    this.track({
      eventName: AppEventsLogger.AppEvents.AddedToWishlist,
      properties: {
        [AppEventsLogger.AppEventParams.ContentType]: 'product',
        [AppEventsLogger.AppEventParams.ContentID]: product.id,
      },
    });
  };

  contact = () => {
    this.track({ eventName: AppEventsLogger.AppEvents.Contact });
  };

  initiateCheckout = ({ product, value }: { product: ProductType; value: number | null }) => {
    if (value) {
      this.track({
        eventName: AppEventsLogger.AppEvents.InitiatedCheckout,
        properties: {
          [AppEventsLogger.AppEventParams.NumItems]: 1,
          [AppEventsLogger.AppEventParams.Currency]: this.currency,
          [AppEventsLogger.AppEventParams.ContentType]: 'product',
          [AppEventsLogger.AppEventParams.ContentID]: product.id,
        },
        value,
      });
    }
  };

  trackFBPixelForDynamicAds = ({
    event,
    product,
    value,
  }: {
    event: 'Purchase' | 'AddToCart' | 'ViewContent';
    product: ProductType;
    value: number | null;
  }) => {
    if (!value) return;

    this.track({
      eventName: mapDynamicAdsPixelEvent[event],
      properties: {
        [AppEventsLogger.AppEventParams.Currency]: this.currency,
        [AppEventsLogger.AppEventParams.ContentType]: 'product',
        [AppEventsLogger.AppEventParams.ContentID]: product.id,
        _valueToSum: value,
      },
      value,
    });
  };
}

const FacebookAnalytics = new FacebookAnalyticsManager();

export default FacebookAnalytics;
