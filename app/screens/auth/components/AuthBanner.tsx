import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

import { Box, Text } from 'app/components/base';
import { useStoreState } from 'app/store';
import { getWelcomePromo } from 'common/constants/welcomePromo';

import { LB, WINDOW_WIDTH } from 'common/constants';
import theme from 'app/styles/theme';
import { t } from '@lingui/macro';
import { i18n } from '@lingui/core';

const AuthBanner = ({ screen }: { screen: 'login' | 'signup' }) => {
  const country = useStoreState((s) => s.country.current);
  const { value: welcomeDiscount } = getWelcomePromo(country.shortcode);
  const content = {
    login: {
      title: `${i18n._(t`WELCOME BACK TO ${LB} NOVELSHIP!`)}`,
      subTitle: i18n._(
        t`Log In to get access to exclusive in app offers and promos on authentic sneakers and apparel`
      ),
      graphic: require('assets/images/graphics/login-banner.png'),
    },
    signup: {
      title: welcomeDiscount
        ? `${i18n._(t`GET ${welcomeDiscount} OFF YOUR FIRST ${LB} NOVELSHIP PURCHASE`)}`
        : i18n._(t`SIGN UP TO ACCESS IN-APP PROMOS, LATEST RELEASES AND MORE!`),
      subTitle: i18n._(
        t`Join the Novelship community to gain in app access to exclusive offers and promos`
      ),
      graphic: require('assets/images/graphics/signup-banner.png'),
    },
  };
  const { title, subTitle, graphic } = content[screen];

  return (
    <ImageBackground source={graphic} style={styles.banner}>
      <Box style={[styles.banner, { backgroundColor: '#1f1f2124' }]}>
        <Box style={styles.absoluteRightTriangle} />
        <Text
          fontSize={5}
          fontFamily="bold"
          letterSpacing={theme.constants.LETTER_SPACINGS_TEXT_TITLE}
          color="white"
          lineHeight={24}
          style={{ width: WINDOW_WIDTH, paddingHorizontal: 20, paddingTop: 20 }}
        >
          {title}
        </Text>
        <Text
          color="white"
          fontFamily="medium"
          fontSize={2}
          mt={3}
          lineHeight={16}
          style={{ width: WINDOW_WIDTH, paddingHorizontal: 20 }}
        >
          {subTitle}
        </Text>
      </Box>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  banner: {
    height: 166,
    width: WINDOW_WIDTH,
  },
  absoluteRightTriangle: {
    left: 0,
    bottom: 0,
    position: 'absolute',
    borderBottomWidth: 22,
    borderBottomColor: 'white',
    borderRightWidth: WINDOW_WIDTH,
    borderRightColor: 'transparent',

    // https://github.com/facebook/react-native/issues/21945#issuecomment-473965109
    borderRadius: 1,
    borderBottomRightRadius: 4,
  },
});

export default AuthBanner;
