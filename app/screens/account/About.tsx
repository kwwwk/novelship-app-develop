import * as React from 'react';
import Ionicon from 'react-native-vector-icons/Ionicons';
import VersionCheck from 'react-native-version-check';
import { Linking } from 'react-native';

import { Text, Box, ButtonBase } from 'app/components/base';
import theme from 'app/styles/theme';

import envConstants from 'app/config';
import { t, Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';
import { LB } from 'common/constants';
import MenuItem from './components/AccountMenuItem';

const About = () => (
  <Box px={5}>
    <Box mt={3}>
      <MenuItem text={i18n._(t`TERMS`)} link={`${envConstants.WEB_APP_URL}terms`} />
      <MenuItem text={i18n._(t`PRIVACY`)} link={`${envConstants.WEB_APP_URL}privacy`} />
      <MenuItem text={i18n._(t`AUTHENTICITY`)} link={`${envConstants.WEB_APP_URL}authentication`} />
      <MenuItem text={i18n._(t`HOW IT WORKS`)} link={`${envConstants.WEB_APP_URL}about`} />
      <MenuItem text={i18n._(t`REVIEWS`)} link="https://trustpilot.com/review/novelship.com" />
    </Box>

    <Box mt={8}>
      <Box center my={4} flexDirection="row">
        <Box px={4}>
          <ButtonBase
            onPress={() =>
              Linking.openURL('https://www.youtube.com/channel/UCrM3j2jFIbrJuT9zppM5vBQ')
            }
          >
            <Ionicon name="logo-youtube" size={38} color={theme.colors.textBlack} />
          </ButtonBase>
        </Box>
        <Box px={4}>
          <ButtonBase onPress={() => Linking.openURL('https://instagram.com/novelship/')}>
            <Ionicon name="logo-instagram" size={36} color={theme.colors.textBlack} />
          </ButtonBase>
        </Box>
        <Box px={4}>
          <ButtonBase onPress={() => Linking.openURL('https://facebook.com/novelship/')}>
            <Ionicon name="logo-facebook" size={36} color={theme.colors.textBlack} />
          </ButtonBase>
        </Box>
        <Box px={4}>
          <ButtonBase onPress={() => Linking.openURL('https://twitter.com/Novelship')}>
            <Ionicon name="logo-twitter" size={36} color={theme.colors.textBlack} />
          </ButtonBase>
        </Box>
      </Box>
      <Text color="textSecondary" fontSize={2} fontFamily="regular" textAlign="center">
        <Trans>
          Follow us now to receive
          {LB}
          the latest news and promotions
        </Trans>
      </Text>
    </Box>

    <Box mt={6} center>
      <Text fontSize={1} color="textSecondary">
        v{VersionCheck.getCurrentVersion()}
      </Text>
    </Box>
  </Box>
);

export default About;
