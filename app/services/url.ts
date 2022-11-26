import { Linking } from 'react-native';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';

import envConstants from 'app/config';

const getDeepLink = (path = ''): string =>
  `${envConstants.APP_URL_SCHEME}://${path.startsWith('/') ? path.slice(1) : path}`;

const InAppBrowserOpen = async (url: string) => {
  try {
    if (await InAppBrowser.isAvailable()) {
      return await InAppBrowser.open(url, {
        ephemeralWebSession: false,
        showTitle: false,
        enableUrlBarHiding: true,
        enableDefaultShare: false,
      });
    }
    Linking.openURL(url);
    return await Promise.resolve(false);
  } catch (error) {
    Linking.openURL(url);
    return await Promise.resolve(false);
  }
};

const getExternalUrl = (to: string) =>
  to.startsWith('http')
    ? to
    : `${envConstants.WEB_APP_URL}${to.startsWith('/') ? to.slice(1) : to}`;

const openExternalUrl = (to?: string) => to && Linking.openURL(getExternalUrl(to));

const getRedirectToSchemeUrl = (path: string) =>
  `${envConstants.API_URL_PRIMARY}misc/mobile-redirect${path}`;

export { getDeepLink, InAppBrowserOpen, getExternalUrl, openExternalUrl, getRedirectToSchemeUrl };
