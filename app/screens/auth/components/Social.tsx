import { AuthRoutes } from 'types/navigation';

import React, { useState } from 'react';
import { StyleSheet, Linking, Platform } from 'react-native';
import appleAuth, { appleAuthAndroid } from '@invertase/react-native-apple-authentication';
import { RouteProp, useRoute } from '@react-navigation/native';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';

import {
  getSocialAuthAppleAndroidOptions,
  getSocialAuthWithRedirect,
  getAuthState,
} from 'common/utils/social';
import { useStoreState, useStoreActions } from 'app/store';
import { ButtonBase, Box, Text } from 'app/components/base';
import { sentryCapture } from 'app/services/sentry';
import { getDeepLink } from 'app/services/url';
import LoadingOverlay from 'app/components/dialog/LoadingOverlay';
import GoogleIcon from 'app/components/icons/GoogleIcon';
import Analytics from 'app/services/analytics';
import LineIcon from 'app/components/icons/LineIcon';
import theme from 'app/styles/theme';
import API from 'common/api';
import envConstants from 'app/config';

import { signupDropOffTracking } from '../utils/signup';

const SocialAuth = ({ screen }: { screen: 'login' | 'signup' }) => {
  const { id: countryId, shortcode } = useStoreState((s) => s.country.current);
  const currentLanguage = useStoreState((s) => s.language.current);
  const { authorize } = useStoreActions((a) => a.user);
  const openReferralInputDialog = useStoreActions((a) => a.referralInputDialog.openDialog);

  const route = useRoute<RouteProp<AuthRoutes, 'SignUp'>>();
  const signup_reference = route.params?.signup_reference;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const authenticate = async (type: 'facebook' | 'google' | 'line') => {
    setIsSubmitting(true);
    const deepLink = getDeepLink(`auth`);
    const url = encodeURI(getSocialAuthWithRedirect(type, countryId, deepLink, signup_reference));
    try {
      if (await InAppBrowser.isAvailable()) {
        const response = await InAppBrowser.openAuth(url, deepLink, {
          ephemeralWebSession: false,
          showTitle: false,
          enableUrlBarHiding: true,
          enableDefaultShare: false,
        });
        if (response.type === 'success' && response.url) {
          Linking.openURL(response.url);
        }
      } else Linking.openURL(url);
    } catch (error) {
      sentryCapture(error);
      Linking.openURL(url);
    } finally {
      setIsSubmitting(false);
    }
  };

  const authenticateApple = async () => {
    if (screen === 'signup') {
      Analytics.signupEvent('Method select', { Method: 'apple' });
      signupDropOffTracking({ shortcode, language: currentLanguage });
    }
    const loginUser = ({ token, signup }: { token?: string; signup?: boolean }) => {
      if (token) {
        authorize(token)
          .then((user) => {
            if (signup) {
              Analytics.signup('Complete', user, 'apple');
              setTimeout(openReferralInputDialog, 1000);
            }
          })
          .finally(() => setIsSubmitting(false));
      }
    };

    try {
      if (Platform.OS === 'android') {
        const options = getSocialAuthAppleAndroidOptions(countryId, signup_reference);
        appleAuthAndroid.configure(options);
        const response = await appleAuthAndroid.signIn();
        if (response) {
          setIsSubmitting(true);
          const {
            // code,
            id_token,
            user,
            state,
          } = response;
          // console.log({ code, id_token, user, state });
          API.post<{ token: string }>('auth/apple', {
            id_token,
            user,
            state,
          }).then(loginUser);
        }
      } else if (Platform.OS === 'ios') {
        const response = await appleAuth.performRequest({
          requestedOperation: appleAuth.Operation.LOGIN,
          requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
        });
        const {
          // user,
          // email,
          // nonce,
          identityToken,
          fullName,
        } = response;
        // console.log({ user, email, nonce, identityToken });
        if (identityToken) {
          setIsSubmitting(true);
          API.post<{ token: string }>('auth/apple', {
            id_token: identityToken,
            user: { firstName: fullName?.givenName, lastName: fullName?.familyName },
            state: getAuthState({ countryId, redirectTo: 'no-redirect', signup_reference }),
          }).then(loginUser);
        }
      }
    } catch (error) {
      sentryCapture(error);
      setIsSubmitting(false);
    }
  };

  const socialMethodSelect = (method: 'facebook' | 'google' | 'line') => {
    authenticate(method);
    if (screen === 'signup') {
      Analytics.signupEvent('Method select', { Method: method });
      signupDropOffTracking({ shortcode, language: currentLanguage });
    }
  };

  return (
    <>
      {(appleAuthAndroid.isSupported || appleAuth.isSupported) && (
        <>
          <ButtonBase
            onPress={authenticateApple}
            android_ripple={{ color: theme.colors.rippleGray }}
          >
            <Box center borderColor="gray4" borderWidth={1} style={styles.buttonContainer}>
              <Box style={{ paddingRight: 6, marginBottom: 2 }}>
                <Ionicon name="logo-apple" size={22} />
              </Box>
              <Box>
                <Text color="textBlack" style={styles.buttonText}>
                  {i18n._(t`Continue with Apple`)}
                </Text>
              </Box>
            </Box>
          </ButtonBase>
          <Box my={2} />
        </>
      )}

      <ButtonBase
        onPress={() => socialMethodSelect('google')}
        android_ripple={{ color: theme.colors.rippleGray }}
      >
        <Box center borderColor="gray4" borderWidth={1} style={styles.buttonContainer}>
          <Box style={{ paddingRight: 8, transform: [{ scale: 1.1 }] }}>
            <GoogleIcon />
          </Box>
          <Box>
            <Text color="textBlack" style={styles.buttonText}>
              {i18n._(t`Continue with Google`)}
            </Text>
          </Box>
        </Box>
      </ButtonBase>

      <Box my={2} />

      <ButtonBase
        onPress={() => socialMethodSelect('facebook')}
        android_ripple={{ color: theme.colors.rippleGray }}
      >
        <Box center borderColor="gray4" borderWidth={1} style={styles.buttonContainer}>
          <Box style={{ paddingRight: 6, marginBottom: 1 }}>
            <MaterialCommunityIcons name="facebook" size={22} color={theme.colors.facebook} />
          </Box>
          <Text color="textBlack" style={styles.buttonText}>
            {i18n._(t`Continue with Facebook`)}
          </Text>
        </Box>
      </ButtonBase>

      {['JP', 'TW'].includes(shortcode) && !!envConstants.CLIENT_ID_LINE_TW && (
        <>
          <Box my={2} />
          <ButtonBase
            onPress={() => socialMethodSelect('line')}
            android_ripple={{ color: theme.colors.rippleGray }}
          >
            <Box center borderColor="gray4" borderWidth={1} style={styles.buttonContainer}>
              <Box style={{ paddingRight: 8, transform: [{ scale: 1.5 }] }}>
                <LineIcon />
              </Box>
              <Text color="textBlack" style={styles.buttonText}>
                {i18n._(t`Continue with LINE`)}
              </Text>
            </Box>
          </ButtonBase>
        </>
      )}
      <LoadingOverlay isOpen={isSubmitting} />
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    height: theme.constants.BUTTON_HEIGHT,
    borderRadius: 4,
    flexDirection: 'row',
  },
  buttonText: {
    fontFamily: theme.fonts.medium,
  },
});

export { SocialAuth };
