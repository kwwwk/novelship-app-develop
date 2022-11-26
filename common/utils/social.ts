import { appleAuthAndroid } from '@invertase/react-native-apple-authentication';
import { Platform } from 'react-native';
import envConstants from 'app/config';
import Store from 'app/store';

const getAuthState = ({
  countryId = 0,
  redirectTo,
  signup_reference,
  country_code,
}: {
  countryId: number | void;
  redirectTo: string;
  signup_reference?: string;
  country_code?: string;
}) =>
  encodeURI(
    JSON.stringify({
      redirectTo,
      signup_reference,
      // referral_code,
      country_id: countryId,
      country_code,
      // locale: currentLanguage,
      platform: Platform.OS,
      version: 2,
    })
  );
const getSocialAuthWithRedirect = (
  social: 'facebook' | 'google' | 'line',
  countryId = 0,
  redirectTo: string,
  signup_reference?: string
) => {
  const country_code = Store.getState().country.current.shortcode;
  const CLIENT_COUNTRY = social === 'line' ? `_${country_code}` : '';
  // @ts-ignore fallback provided
  const CLIENT_ID = envConstants[`CLIENT_ID_${social.toUpperCase()}${CLIENT_COUNTRY}`] || '';
  const redirectUrl = `${envConstants.API_URL_PRIMARY}auth/${social}`;
  const state = `state=${getAuthState({ countryId, redirectTo, signup_reference, country_code })}`;

  switch (social) {
    case 'facebook':
      return `https://www.facebook.com/v2.10/dialog/oauth?client_id=${CLIENT_ID}&scope=email&redirect_uri=${redirectUrl}&${state}`;
    case 'google':
      return `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${redirectUrl}&prompt=consent&response_type=code&client_id=${CLIENT_ID}&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile&access_type=offline&${state}`;
    case 'line':
      return `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${redirectUrl}&${state}&scope=profile openid email&nonce=09876xyz`;
    default:
      return '';
  }
};

const getSocialAuthAppleAndroidOptions = (countryId = 0, signup_reference?: string) => {
  const state = getAuthState({ countryId, redirectTo: 'no-redirect', signup_reference });
  return {
    clientId: envConstants.CLIENT_ID_APPLE,
    redirectUri: `${envConstants.API_URL_PRIMARY}auth/apple`,
    scope: appleAuthAndroid.Scope.ALL,
    responseType: appleAuthAndroid.ResponseType.ALL,
    state,
  };
};

export { getSocialAuthWithRedirect, getSocialAuthAppleAndroidOptions, getAuthState };
