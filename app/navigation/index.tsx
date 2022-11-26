import React, { createRef, useRef, useEffect } from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import {
  DefaultTheme,
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import { Linking } from 'react-native';
import Toast from 'react-native-toast-message';
import InAppBrowser from 'react-native-inappbrowser-reborn';

import theme from 'app/styles/theme';
import { useStoreState } from 'app/store';
import Analytics from 'app/services/analytics';
import { RootRoutes } from 'types/navigation';
import ProductNavigator from 'app/screens/product';
import SearchNavigator from 'app/screens/search';
import UserNavigator from 'app/screens/user';
import AuthNavigator from 'app/screens/auth';
import NotFoundScreen from 'app/screens/others/NotFoundScreen';
import StartScreen from 'app/screens/others/StartScreen';
import SessionExpiredScreen from 'app/screens/others/SessionExpiredScreen';
import StripePaymentHandler from 'app/screens/others/StripePaymentHandler';
import PowerSeller from 'app/screens/others/PowerSeller';
import TravelWithNS from 'app/screens/events/2022/travelWithNS/index';
import PartnerSalesForm from 'app/screens/others/PartnerSalesForm';
import { sentryCapture } from 'app/services/sentry';
import PushNotificationInfoDialog from 'app/screens/user/components/PushNotificationDialog';
import ReferralInputDialog from 'app/screens/user/components/ReferralInputDialog';
import ToastConfig from 'app/components/misc/ToastContainer';
import RaffleProductNavigator from 'app/screens/raffle_product';
import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';

const navigationRef = createRef<NavigationContainerRef<RootRoutes>>();

const Navigation = () => {
  const routeNameRef = useRef<string>();
  const NavigationTheme = {
    dark: false,
    colors: {
      ...DefaultTheme.colors,
      text: theme.colors.textBlack,
      background: theme.colors.white,
    },
  };

  const urlCallback = (event: { url: string }) => {
    if (event.url && event.url.includes('payment_method=')) {
      // close InAppBrowser for Buy payment redirect
      try {
        InAppBrowser.close();
      } catch (error) {
        sentryCapture(error);
      }
    }
  };

  useEffect(() => {
    const listener = Linking.addEventListener('url', urlCallback);
    return () => listener.remove();
  }, []);

  return (
    <>
      {/* Root Navigator */}
      <NavigationContainer
        ref={navigationRef}
        onReady={() => (routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name)}
        onStateChange={() => {
          // console.info(navigationRef.current?.getCurrentRoute());
          const previousRouteName = routeNameRef.current;
          const currentRoute = navigationRef.current?.getCurrentRoute();
          if (previousRouteName !== currentRoute?.name) {
            Analytics.trackScreenView(currentRoute);
          }
          routeNameRef.current = currentRoute?.name;
        }}
        theme={NavigationTheme}
        linking={LinkingConfiguration}
      >
        <RootNavigator />
      </NavigationContainer>
      {/* Dialogs */}
      <PushNotificationInfoDialog />
      <ReferralInputDialog />
      <Toast config={ToastConfig} />
    </>
  );
};

const transitionDisabled = { animationEnabled: false };
const transitionSlide = { animationEnabled: true, ...TransitionPresets.SlideFromRightIOS };

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootRoutes>();

const RootNavigator = () => {
  const userId = useStoreState((s) => s.user.user.id);

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, ...transitionDisabled }}
      initialRouteName={userId ? 'BottomNavStack' : 'StartScreen'}
    >
      {/* Stacks */}
      <Stack.Screen
        name="BottomNavStack"
        component={BottomTabNavigator}
        options={transitionDisabled}
      />
      <Stack.Screen name="ProductStack" component={ProductNavigator} options={transitionSlide} />
      <Stack.Screen
        name="RaffleProductStack"
        component={RaffleProductNavigator}
        options={transitionSlide}
      />
      {/* todo: @deprecate later */}
      <Stack.Screen
        name="RaffleProductStackOld"
        component={RaffleProductNavigator}
        options={transitionSlide}
      />
      <Stack.Screen name="SearchStack" component={SearchNavigator} options={transitionDisabled} />
      <Stack.Screen name="UserStack" component={UserNavigator} options={transitionSlide} />
      <Stack.Screen name="AuthStack" component={AuthNavigator} options={transitionSlide} />

      {/* Individual Screens */}
      <Stack.Screen name="StartScreen" component={StartScreen} options={transitionSlide} />
      <Stack.Screen name="PowerSeller" component={PowerSeller} options={transitionSlide} />
      <Stack.Screen name="TravelWithNS" component={TravelWithNS} options={transitionSlide} />
      <Stack.Screen name="PartnerSales" component={PartnerSalesForm} options={transitionSlide} />
      <Stack.Screen name="NotFoundScreen" component={NotFoundScreen} options={transitionSlide} />
      <Stack.Screen
        name="SessionExpiredScreen"
        component={SessionExpiredScreen}
        options={transitionDisabled}
      />
      <Stack.Screen
        name="StripePaymentHandler"
        component={StripePaymentHandler}
        options={transitionDisabled}
      />
    </Stack.Navigator>
  );
};
export default Navigation;
export { navigationRef };
