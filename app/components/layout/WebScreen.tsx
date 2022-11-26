import { RootRoutes } from 'types/navigation';

import React, { useRef } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { WebViewNavigation } from 'react-native-webview/lib/WebViewTypes';
import { Linking } from 'react-native';
import { URL } from 'react-native-url-polyfill';
import WebView, { WebViewProps } from 'react-native-webview';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { navigateBackOrGoToHome } from 'app/services/navigation';
import { Box, ButtonBase } from 'app/components/base';
import { externalRoutes } from 'common/constants/url';
import { useStoreState } from 'app/store';
import { Header } from 'app/components/layout';
import LoadingIndicator from 'app/components/misc/LoadingIndicator';
import theme from 'app/styles/theme';
import API from 'common/api';

// todo: make it easy to go back to app stack if app can handle the route
const BACK_TO_APP_ROUTES: Record<string, keyof RootRoutes> = {
  raffles: 'RaffleProductStack',
  raffle: 'RaffleProductStackOld',
} as const;

const ALLOWED_NS_DOMAINS = ['https://novelship.com', 'https://test.novelship.com'];

const WebScreen = ({
  navigation,
  ...props
}: { navigation: StackNavigationProp<RootRoutes, 'NotFoundScreen'> } & WebViewProps) => {
  const token = useStoreState((s) => s.user.token);
  const webViewRef = useRef<WebView>(null);
  const isFirstPage = useRef<boolean>(false);

  // handling API urls, proxied under the client domain
  // On iOS, API urls excluded with AASA configuration
  // On android, redirect to api domain

  // @ts-ignore ignore
  const url = props.source?.uri;
  const isURLofAPI = /\/api|\/test-api/.test(url);

  if (isURLofAPI) {
    const redirectApiURL = url.includes('/test-api')
      ? url.replace('test.novelship.com/test-api', 'api-test.novelship.com')
      : url.replace('novelship.com/api', 'api.novelship.com').replace('wwww.', '');

    Linking.openURL(redirectApiURL);
    navigateBackOrGoToHome(navigation);
    return null;
  }

  const handleNavigationChangeRequest = (request: WebViewNavigation) => {
    isFirstPage.current = !request.canGoBack;
    if (request.canGoBack) {
      const navigateToURL = new URL(request.url);

      // check only urls starting with WEB_APP_URL for deeplinking
      const urlRouteArray = ALLOWED_NS_DOMAINS.some((domain) =>
        navigateToURL.href.startsWith(domain)
      )
        ? navigateToURL.pathname.split('/').filter(Boolean)
        : [];

      if (urlRouteArray.length === 1) {
        const currentURLRoute = urlRouteArray[0];
        const isExternal = externalRoutes.includes(currentURLRoute);

        if (!isExternal) {
          // if url isn't intended to be opened externally, check if a product is present and open in app
          API.fetch(`products/slug/${currentURLRoute}`)
            .then(() => {
              navigation.replace('ProductStack', { slug: currentURLRoute, screen: 'Product' });
              webViewRef.current?.stopLoading();
            })
            .catch((err) => console.log(err));
        }
      } else if (urlRouteArray.length >= 2) {
        if (BACK_TO_APP_ROUTES[urlRouteArray[0]])
          navigation.replace(
            // @ts-ignore no typing
            BACK_TO_APP_ROUTES[urlRouteArray[0] as 'RaffleProductStackOld' | 'RaffleProductStack'],
            { slug: urlRouteArray[1] }
          );
      }
    }
  };

  return (
    <>
      <Header>
        <Box flexDirection="row" justifyContent="space-between" width="100%">
          <Box width={theme.constants.HEADER_ICON_SIZE}>
            <ButtonBase
              onPress={() =>
                isFirstPage.current
                  ? navigateBackOrGoToHome(navigation)
                  : webViewRef.current?.goBack()
              }
              android_ripple={{ color: theme.colors.white, borderless: true }}
            >
              <Ionicon
                name="ios-arrow-back"
                size={theme.constants.HEADER_ICON_SIZE}
                color={theme.colors.white}
              />
            </ButtonBase>
          </Box>
          <ButtonBase
            onPress={() => navigateBackOrGoToHome(navigation)}
            android_ripple={{ color: theme.colors.white, borderless: true }}
          >
            <Ionicon
              name="ios-close"
              size={theme.constants.HEADER_ICON_SIZE}
              color={theme.colors.white}
            />
          </ButtonBase>
        </Box>
      </Header>
      <WebView
        ref={webViewRef}
        pullToRefreshEnabled
        startInLoadingState
        renderLoading={() => <LoadingIndicator size="large" style={{ flex: 1 }} />}
        onNavigationStateChange={handleNavigationChangeRequest}
        // https://github.com/react-native-webview/react-native-webview/issues/1869#issuecomment-822368928
        setSupportMultipleWindows={false}
        injectedJavaScriptBeforeContentLoaded={`
          window.isNativeApp = true;
          localStorage.setItem('token', '${token}');
        `}
        {...props}
      />
    </>
  );
};

export default WebScreen;
