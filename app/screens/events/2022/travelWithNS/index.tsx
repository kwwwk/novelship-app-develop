import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { i18n } from '@lingui/core';
import { t, Trans } from '@lingui/macro';
import { useQuery } from 'react-query';
import { Alert } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { Box, ButtonBase, Text } from 'app/components/base';
import {
  Header,
  KeyboardAwareContainer,
  SafeAreaScreenContainer,
  ScrollContainer,
} from 'app/components/layout';
import LoadingScreen from 'app/components/misc/LoadingScreen';
import { navigateBackOrGoToHome } from 'app/services/navigation';
import { useStoreState } from 'app/store';
import theme from 'app/styles/theme';
import { RootRoutes } from 'types/navigation';
import TravelWithNSBanner from './components/TravelWithNSBanner';
import TravelWithNSCityCollection from './components/TravelWithNSCityCollection';
import TravelWithNSHowToPlay from './components/TravelWithNSHowToPlay';
import TravelWithNSSpinWheel from './components/TravelWithNSSpinWheel';
import { EventConfigType } from './utils';

type TravelWithNSNavigationProp = StackNavigationProp<RootRoutes, 'TravelWithNS'>;

const TravelWithNS = ({ navigation }: { navigation: TravelWithNSNavigationProp }) => {
  const currentCountryCode = useStoreState((s) => s.country.current.shortcode);
  const isAuthenticated = useStoreState((s) => s.user.user.id);
  const [hasError, setHasError] = useState(false);

  const onError = (err: unknown) => {
    setHasError(true);
    return Alert.alert('', i18n._(err as string), [
      { text: i18n._(t`OK`), onPress: () => navigateBackOrGoToHome(navigation) },
    ]);
  };

  const {
    data: eventConfig = { start: '', end: '', banners: {}, eligibleCountry: [] },
    isFetching,
  } = useQuery<EventConfigType>([`event/twns2022`], { onError });

  const isCampaignEligibleCountry = eventConfig.eligibleCountry.includes(currentCountryCode);

  return (
    <>
      <Header>
        <Box flexDirection="row" justifyContent="space-between" width="100%">
          <Box width={theme.constants.HEADER_ICON_SIZE}>
            <ButtonBase
              onPress={() => navigateBackOrGoToHome(navigation)}
              android_ripple={{ color: theme.colors.white, borderless: true }}
            >
              <Ionicon
                name="ios-arrow-back"
                size={theme.constants.HEADER_ICON_SIZE}
                color={theme.colors.white}
              />
            </ButtonBase>
          </Box>

          <Box center>
            <Text
              color="white"
              fontFamily="bold"
              textTransform="uppercase"
              letterSpacing={theme.constants.LETTER_SPACINGS_TEXT_TITLE}
              fontSize={3}
            >
              <Trans>WHERE TO NEXT?</Trans>
            </Text>
          </Box>
          <ButtonBase
            onPress={() => navigateBackOrGoToHome(navigation)}
            android_ripple={{ color: theme.colors.white, borderless: true }}
          >
            <Ionicon name="ios-close" size={theme.constants.HEADER_ICON_SIZE} color="transparent" />
          </ButtonBase>
        </Box>
      </Header>

      {isFetching ? (
        <LoadingScreen />
      ) : (
        <SafeAreaScreenContainer>
          <KeyboardAwareContainer>
            <ScrollContainer>
              {isAuthenticated && !isCampaignEligibleCountry && !hasError ? (
                <Box center mx={5} mt={7}>
                  <Text fontSize={2}>
                    <Trans>Sorry, the campaign is not available in your country</Trans>
                  </Text>
                </Box>
              ) : (
                <>
                  <TravelWithNSBanner eventConfig={eventConfig} />
                  <TravelWithNSSpinWheel />
                  <TravelWithNSHowToPlay />
                  <TravelWithNSCityCollection />
                </>
              )}
            </ScrollContainer>
          </KeyboardAwareContainer>
        </SafeAreaScreenContainer>
      )}
    </>
  );
};

export default TravelWithNS;
