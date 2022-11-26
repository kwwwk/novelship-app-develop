import React from 'react';
import { StatusBar } from 'react-native';
import { QueryClientProvider } from 'react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@shopify/restyle';
import { StoreProvider } from 'easy-peasy';
import { StripeProvider } from '@stripe/stripe-react-native';
import codePush from 'react-native-code-push';
import * as Sentry from '@sentry/react-native';

import ErrorBoundary from 'app/components/misc/ErrorBoundary';
import AppBase from 'app/AppBase';
import Store from 'app/store';
import theme from 'app/styles/theme';
import { queryClient } from 'common/api';
import envConstants from 'app/config';

const codePushOptions = {
  checkFrequency: __DEV__ ? codePush.CheckFrequency.MANUAL : codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.IMMEDIATE,
};

Sentry.init({
  dsn: envConstants.SENTRY_DSN,
  environment: envConstants.RELEASE,
  enabled: !__DEV__,
});

const App = () => (
  <ErrorBoundary>
    <Sentry.TouchEventBoundary>
      <SafeAreaProvider>
        <StoreProvider store={Store}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
              <StripeProvider
                publishableKey={envConstants.STRIPE_KEY}
                urlScheme={envConstants.APP_URL_SCHEME}
              >
                <AppBase />
              </StripeProvider>
              <StatusBar backgroundColor="transparent" translucent barStyle="light-content" />
            </ThemeProvider>
          </QueryClientProvider>
        </StoreProvider>
      </SafeAreaProvider>
    </Sentry.TouchEventBoundary>
  </ErrorBoundary>
);

export default __DEV__ ? App : codePush(codePushOptions)(App);
