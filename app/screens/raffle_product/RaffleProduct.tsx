import React, { useContext, useEffect, useState } from 'react';
import { RaffleRoutes, RootRoutes } from 'types/navigation';
import { i18n } from '@lingui/core';
import { t, Trans } from '@lingui/macro';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';

import { Box, Button, Text } from 'app/components/base';
import {
  Footer,
  KeyboardAwareContainer,
  SafeAreaScreenContainer,
  ScrollContainer,
} from 'app/components/layout';
import Analytics from 'app/services/analytics';
import { cacheGet, cacheSet } from 'app/services/asyncStorage';
import { useStoreState } from 'app/store';
import { toDate } from 'common/utils/time';
import Toast from 'react-native-toast-message';
import ProductImageCarousel from '../product/components/product/ProductImageCarousel';
import RaffleCountdown from './components/RaffleCountdown';
import RaffleProductCheckoutContext from './context';

type ProductNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RaffleRoutes, 'RaffleProductSizes'>,
  StackNavigationProp<RootRoutes, 'AuthStack'>
>;

const RaffleProduct = () => {
  const { raffleProduct, isFetching, raffleRegistered } = useContext(RaffleProductCheckoutContext);

  const navigation = useNavigation<ProductNavigationProp>();
  const isAuthenticated = useStoreState((s) => s.user.user.id);
  const currentLanguage = useStoreState((s) => s.language.current);
  const [isNotificationOn, setIsNotificationOn] = useState<boolean>(false);
  const [isRaffleEnded, setIsRaffleEnded] = useState<boolean>(false);

  const raffleStatus: typeof raffleProduct.raffle_status = isRaffleEnded
    ? 'ended'
    : raffleProduct.raffle_status;

  const { isUserRaffleRegistered } = raffleRegistered;
  const mapTextByRaffleStatus: Record<
    string,
    {
      resultText: string;
      timerText: string;
      ctaText: string;
      timerTextColor: 'gray3' | 'textBlack';
      isCtaDisabled: boolean;
    }
  > = {
    upcoming: {
      resultText: i18n._(t`Coming Soon`),
      timerText: i18n._(t`RAFFLE NOT STARTED YET`),
      ctaText: isNotificationOn ? i18n._(t`NOTIFICATION SUBSCRIBED`) : i18n._(t`NOTIFY ME`),
      timerTextColor: 'gray3',
      isCtaDisabled: !!isNotificationOn,
    },
    running: {
      resultText: `${raffleProduct.stats.totalEntries} ${
        raffleProduct.stats.totalEntries > 1 ? i18n._(t`Participants`) : i18n._(t`Participant`)
      }`,
      timerText: i18n._(t`RAFFLE CLOSES IN`),
      ctaText: isUserRaffleRegistered ? i18n._(t`REGISTERED`) : i18n._(t`ENTER RAFFLE`),
      timerTextColor: 'textBlack',
      isCtaDisabled: !!isUserRaffleRegistered,
    },
    ended: {
      resultText: `${raffleProduct.stats.totalEntries} ${
        raffleProduct.stats.totalEntries > 1 ? i18n._(t`Participants`) : i18n._(t`Participant`)
      }`,
      timerText: i18n._(t`RAFFLE CLOSED`),
      ctaText: i18n._(t`RAFFLE CLOSED`),
      timerTextColor: 'gray3',
      isCtaDisabled: true,
    },
  };

  const raffleStatusText = mapTextByRaffleStatus[raffleStatus];

  const goToNextPage = () => {
    if (!isAuthenticated) {
      return navigation.navigate('AuthStack', { screen: 'SignUp' });
    }
    if (raffleProduct.raffle_status === 'upcoming') {
      cacheSet(`is_raffle_notification_on_${raffleProduct.id}`, true, 30 * 24 * 60);
      setIsNotificationOn(true);
      Analytics.raffleTrack('Notify Me Click', raffleProduct);
      Toast.show({
        type: 'default',
        text1: `${i18n._(t`You have successfully subscribed to the notification`)}`,
        position: 'bottom',
        bottomOffset: 120,
      });
    } else if (raffleProduct.raffle_status === 'running' && !isUserRaffleRegistered) {
      Analytics.raffleTrack('Initiate', raffleProduct);
      if (raffleProduct.product.is_one_size) {
        Analytics.raffleReviewConfirm('Review', raffleProduct, {
          Size: 'OS',
          Price: raffleProduct.price,
        });
        return navigation.navigate('RaffleProductReview', { size: 'OS' });
      }
      return navigation.navigate('RaffleProductSizes');
    }
  };

  useEffect(() => {
    cacheGet<boolean>(`is_raffle_notification_on_${raffleProduct.id}`).then((d) =>
      setIsNotificationOn(d !== undefined)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raffleProduct.id]);

  if (isFetching || !raffleProduct.id) {
    return null;
  }

  return (
    <SafeAreaScreenContainer>
      <KeyboardAwareContainer>
        <ScrollContainer>
          <Box mt={4}>
            <ProductImageCarousel gallery={raffleProduct.product.gallery} />
          </Box>
          <Box mt={5} mx={6} mb={8}>
            <Text
              mb={3}
              textAlign="center"
              variant="title"
              textTransform="uppercase"
              lineHeight={20}
            >
              {raffleProduct.product.name}
            </Text>

            <Text textAlign="center" fontSize={2} color="gray3" fontFamily="medium">
              {raffleStatusText.resultText}
            </Text>
          </Box>
          <Box height={1} mx={5} bg="dividerGray" />
          <Box mt={4} mx={5}>
            <Text
              mb={3}
              fontSize={2}
              letterSpacing={2}
              textAlign="center"
              textTransform="uppercase"
              color={raffleStatusText.timerTextColor}
            >
              {raffleStatusText.timerText}
            </Text>
          </Box>
          <Box>
            <RaffleCountdown
              raffleStatus={raffleStatus}
              setIsRaffleEnded={setIsRaffleEnded}
              productEndDate={raffleProduct.end_date}
              timerTextColor={raffleStatusText.timerTextColor}
            />
          </Box>
          <Box height={1} mx={5} mt={5} bg="dividerGray" />
          <Box mx={5} mt={7}>
            <Text fontSize={3} fontFamily="bold">
              <Trans>EVENT DATE</Trans>
            </Text>
            <Text fontSize={2} fontFamily="regular" mt={3} mb={5}>
              {toDate(raffleProduct.start_date, 'DD MMM YYYY')} -{' '}
              {toDate(raffleProduct.end_date, 'DD MMM YYYY')}
            </Text>
            <Text fontSize={3} mt={2} fontFamily="bold">
              <Trans>EVENT DESCRIPTION</Trans>
            </Text>
            <Box mt={3} mb={5}>
              {/* @ts-ignore ignore */}
              {(raffleProduct[`description_${currentLanguage}`] || raffleProduct.description)
                .split('\n')
                .map((description: string, i: number) => (
                  <Text key={i} fontSize={2} mb={5} fontFamily="regular">
                    {description}
                  </Text>
                ))}
            </Box>
          </Box>

          <Box my={8} />
        </ScrollContainer>

        <Footer>
          <Button
            variant="black"
            size="lg"
            text={raffleStatusText.ctaText}
            disabled={raffleStatusText.isCtaDisabled}
            onPress={goToNextPage}
          />
        </Footer>
      </KeyboardAwareContainer>
    </SafeAreaScreenContainer>
  );
};

export default RaffleProduct;
