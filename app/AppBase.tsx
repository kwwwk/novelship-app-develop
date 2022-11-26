import { ProductCollectionType } from 'types/resources/productCollection';

import React, { createContext, useEffect, useState, useRef } from 'react';
import * as Sentry from '@sentry/react-native';
import { Alert } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { I18nProvider } from '@lingui/react';
import { i18n } from '@lingui/core';

// import { BasePromotionType } from 'types/resources/promotion';
import { CountryType } from 'types/resources/country';
import { CurrencyType } from 'types/resources/currency';
import Navigation from 'app/navigation';
import Analytics from 'app/services/analytics';
import appStoreUpdateCheck from 'app/services/appStoreUpdateCheck';
import getLocation from 'app/services/location';
import { useStoreActions, useStoreState } from 'app/store';
// import { isCurrentDateInRangeSG } from 'common/utils/time';
import { BaseAPIResponseType, CollectionType } from 'app/store/resources/base';
import API from 'common/api';
import useTrackingPermission from './hooks/useTrackingPermission';
import LoadingScreen from './components/misc/LoadingScreen';
import PushNotification from './services/pushNotification';

export const AppBaseContext = createContext<{ appBaseRefresh: () => void }>({
  appBaseRefresh: () => {},
});

const AppBase = () => {
  const currentUser = useStoreState((s) => s.user.user);
  const updateUser = useStoreActions((a) => a.user.update);
  const { fetch: fetchUser, setTokenFromCache: setUserTokenFromCache } = useStoreActions(
    (a) => a.user
  );
  const setAppBase = useStoreActions((a) => a.base.set);
  const loadLanguage = useStoreActions((a) => a.language.load);
  const setCountries = useStoreActions((a) => a.country.set);
  const setCurrencies = useStoreActions((a) => a.currency.set);
  const lastTrackedUserIdRef = useRef<undefined | number | null>(null);

  const [appBaseSetupStatus, setAppBaseSetupStatus] = useState<'pending' | 'rejected' | 'resolved'>(
    'pending'
  );

  const trackingPermission = useTrackingPermission();

  const setupApp = () => {
    setUserTokenFromCache().then(({ payload: token }: { payload: string }) => {
      const isAuthToken = !!token;
      console.log('isAuthToken', isAuthToken);
      Promise.all([
        getLocation(),
        API.fetch<BaseAPIResponseType>('context/app'),
        isAuthToken ? fetchUser() : undefined,
      ])
        .then(([location, base, user]) => {
          loadLanguage(user ? user.locale : undefined);
          const {
            countries,
            currencies,
            promocodes,
            searchesTrending,
            cryptoRates,
            payoutCryptoConfig,
            promotionLoyaltyMultiplier,
            buyTrxnPaymentFee,
            payment_methods: paymentMethods,
            product_collections: productCollections,
            selling_fee_promotions: sellingFeePromotions,
            shipping_fee_promotions: shippingFeePromotions,
            delivery_fee_promotions: deliveryFeePromotions,
          } = base;

          const detectedCountry =
            location && location.success !== false
              ? countries.find((c) => c.shortcode === location.country_code)
              : null;

          const defaultCountry: CountryType = countries.find(
            (c: CountryType) => c.shortcode === 'US'
          ) as CountryType;

          const userCountryId = user && (user.shipping_country_id || user.country_id);
          const userCountry = countries.find((c: CountryType) => c.id === userCountryId);
          const currentCountry = userCountry || detectedCountry || defaultCountry;

          const currentCurrencyId = currentCountry.currency_id;
          const currentCurrency: CurrencyType = currencies.find(
            (c) => c.id === currentCurrencyId
          ) as CurrencyType;

          // const isPromotionTime = ({ start_at, end_at }: BasePromotionType) =>
          //   !!(start_at && end_at && isCurrentDateInRangeSG(start_at, end_at));

          const filteredProductCollections: CollectionType = { ...productCollections };
          (Object.keys(filteredProductCollections) as (keyof CollectionType)[]).forEach((k) => {
            filteredProductCollections[k] = filteredProductCollections[k].filter(
              (pc: ProductCollectionType) =>
                pc.countries?.length ? pc.countries.includes(currentCountry.shortcode) : true
            );
          });

          setCurrencies({ currencies, currentCurrency });
          setCountries({ countries, currentCountry });
          setAppBase({
            productCollections: filteredProductCollections,
            // sellingFeePromotions: sellingFeePromotions.filter(isPromotionTime),
            // shippingFeePromotions: shippingFeePromotions.filter(isPromotionTime),
            // deliveryFeePromotions: deliveryFeePromotions.filter(isPromotionTime),
            sellingFeePromotions,
            shippingFeePromotions,
            deliveryFeePromotions,
            searchesTrending,
            cryptoRates,
            payoutCryptoConfig,
            promotionLoyaltyMultiplier,
            buyTrxnPaymentFee,
            paymentMethods,
            promocodes,
          });

          if (trackingPermission && lastTrackedUserIdRef.current !== user?.id) {
            lastTrackedUserIdRef.current = user?.id;
            // Services initialize
            if (user?.id) {
              Sentry.setUser({ email: user.email, id: String(user.id) });

              if (!user.notification_preferences.push) {
                updateUser({
                  notification_preferences: { ...user.notification_preferences, push: true },
                });
              }
            } else {
              Sentry.configureScope((scope) => scope.setUser(null));
            }

            Analytics.setContext({ currency: currentCurrency, country: currentCountry });
            Analytics.init().then(() => Analytics.identify(user));

            PushNotification.identify(user);
          }
          setAppBaseSetupStatus('resolved');
        })
        .catch(() => setAppBaseSetupStatus('rejected'));
    });
  };

  const appBaseRefresh = setupApp;
  const appBaseRetrySetup = () => {
    setAppBaseSetupStatus('pending');
    setupApp();
  };

  useEffect(() => {
    setupApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.id, currentUser.country_id, currentUser.shipping_country_id]);

  useEffect(() => {
    if (appBaseSetupStatus !== 'pending') {
      SplashScreen.hide();
    }
    if (appBaseSetupStatus === 'rejected') {
      Alert.alert(
        'No Internet Connection',
        'Looks like you are not connected to the internet. Connect to continue shopping.',
        [{ text: 'Retry', onPress: () => appBaseRetrySetup() }],
        { cancelable: false }
      );
    } else if (appBaseSetupStatus === 'resolved') {
      appStoreUpdateCheck();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appBaseSetupStatus]);

  return appBaseSetupStatus === 'resolved' ? (
    <AppBaseContext.Provider value={{ appBaseRefresh }}>
      <I18nProvider i18n={i18n}>
        <Navigation />
      </I18nProvider>
    </AppBaseContext.Provider>
  ) : (
    <LoadingScreen />
  );
};

export default AppBase;
