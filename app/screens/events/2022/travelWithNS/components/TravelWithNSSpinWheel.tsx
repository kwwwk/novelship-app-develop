import React, { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { i18n } from '@lingui/core';
import { t, Trans } from '@lingui/macro';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQuery } from 'react-query';

import ConfirmDialog from 'app/components/dialog/ConfirmDialog';
import theme from 'app/styles/theme';
import API from 'common/api';
import InfoDialog from 'app/components/dialog/InfoDialog';
import { Box, ButtonBase, ImgixImage, Text } from 'app/components/base';
import { useStoreState } from 'app/store';
import { navigateBackOrGoToHome } from 'app/services/navigation';
import { toCurrencyString } from 'common/utils/currency';
import { BottomTabRoutes, RootRoutes } from 'types/navigation';
import { CollectionCityType, mapCityText } from '../utils';

type TravelRewardType = {
  index: number;
  city: CollectionCityType;
  min_buy: number;
  value: number;
  promocode: string;
};

type NavigationProp = CompositeNavigationProp<
  StackNavigationProp<BottomTabRoutes, 'BrowseStack'>,
  StackNavigationProp<RootRoutes, 'TravelWithNS'>
>;

const WHEEL_WIDTH = 320;
const SLICE_WIDTH = WHEEL_WIDTH / 2 - 19.5;
const SLICE_HEIGHT = SLICE_WIDTH * 1.4;

const SLICE_STYLES = {
  '1': { height: SLICE_WIDTH, width: SLICE_HEIGHT, bottom: WHEEL_WIDTH / 2, right: 12 },
  '2': { height: SLICE_HEIGHT, width: SLICE_WIDTH, top: 12, right: 19.5 },
  '3': { height: SLICE_HEIGHT, width: SLICE_WIDTH, bottom: 12, right: 19.5 },
  '4': { height: SLICE_WIDTH, width: SLICE_HEIGHT, top: WHEEL_WIDTH / 2, right: 12 },
  '5': { height: SLICE_WIDTH, width: SLICE_HEIGHT, top: WHEEL_WIDTH / 2, left: 12 },
  '6': { height: SLICE_HEIGHT, width: SLICE_WIDTH, bottom: 12, left: 19.5 },
  '7': { height: SLICE_HEIGHT, width: SLICE_WIDTH, top: 12, left: 19.5 },
  '8': { height: SLICE_WIDTH, width: SLICE_HEIGHT, bottom: WHEEL_WIDTH / 2, left: 12 },
} as const;

const defaultSpins = 3;

const TravelWithNSSpinWheel = () => {
  const navigation = useNavigation<NavigationProp>();
  const isAuthenticated = useStoreState((s) => !!s.user.user.id);

  const [dialogOpen, setDialogOpen] = useState<null | 'reward' | 'login' | 'no-spin'>(null);
  const [travelReward, setTravelReward] = useState<TravelRewardType | null>(null);
  const [sliceShown, setSliceShown] = useState(-1);
  const spinInterval = useRef<NodeJS.Timer>();
  const spinStopSlice = useRef<number | null>();
  const isSpinning = useRef<boolean>(false);

  const reset = () => {
    isSpinning.current = false;
    clearInterval(spinInterval.current as NodeJS.Timer);
  };

  const onError = (err: unknown) => {
    reset();
    Alert.alert('', i18n._(err as string), [
      {
        text: i18n._(t`OK`),
        onPress: () =>
          navigateBackOrGoToHome(navigation as unknown as StackNavigationProp<RootRoutes>),
      },
    ]);
  };

  const { data: travelWithNSStats = { spins: defaultSpins }, refetch: refetchSpins } = useQuery<{
    spins: number;
  }>([`event/twns2022/spins`], {
    initialData: { spins: defaultSpins },
    enabled: !!isAuthenticated,
  });

  // reset and spin wheel
  const animateSpin = (stopAt: number) => {
    spinStopSlice.current = stopAt; // store where to stop
    setSliceShown(-1); // start from first slice
    clearInterval(spinInterval.current as NodeJS.Timer); // reset any old spin
    spinInterval.current = setInterval(() => setSliceShown((i) => i + 1), 150); // show next slice with an interval
  };

  const spinTheWheel = () => {
    if (!isAuthenticated) return setDialogOpen('login');
    if (travelWithNSStats.spins === 0) return setDialogOpen('no-spin');

    if (isSpinning.current) return;
    isSpinning.current = true;

    return API.fetch<TravelRewardType>('event/twns2022/daily/checkin/claim')
      .then((res) => {
        if (res.value) {
          animateSpin(res.index + 1);
          setTravelReward(res);
        }
      })
      .catch(onError);
  };

  useEffect(() => {
    const NO_OF_SPINS = 3;
    // if has spun more than NO_OF_SPINS then stop on the spinStopSlice slice
    if (sliceShown >= 8 * NO_OF_SPINS + (spinStopSlice.current || 0) - 1) {
      // wheel stopped here
      reset();
      setTimeout(() => setDialogOpen('reward'), 1200);
      refetchSpins();
    }
  }, [sliceShown, setDialogOpen, refetchSpins]);

  // clear any interval on unmount
  useEffect(() => () => reset(), []);

  return (
    <Box center mx={5} mt={7}>
      <Box
        mt={3}
        center
        height={36}
        width={184}
        style={{
          backgroundColor: theme.colors.gray7,
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
        }}
        flexDirection="row"
        px={4}
      >
        <Text fontFamily="regular" letterSpacing={1} lineHeight={24}>
          <Trans>SPINS LEFT </Trans>{' '}
        </Text>
        <Text fontFamily="bold" letterSpacing={1} lineHeight={24}>
          <Trans>TODAY</Trans>
        </Text>
      </Box>
      <Box
        center
        justifyContent="space-between"
        height={36}
        width={184}
        style={{
          borderColor: theme.colors.gray7,
          borderWidth: 1,
          borderBottomRightRadius: 4,
          borderBottomLeftRadius: 4,
        }}
        px={4}
        mb={5}
      >
        <Text fontFamily="regular" letterSpacing={1} lineHeight={24}>
          {isAuthenticated ? travelWithNSStats.spins : defaultSpins}
        </Text>
      </Box>

      <Box position="relative" height={WHEEL_WIDTH} width={WHEEL_WIDTH}>
        <ImgixImage
          src="events/2022/travelWithNS/wheel/default-wheel.png"
          width={WHEEL_WIDTH}
          height={WHEEL_WIDTH}
          style={{ position: 'relative', top: 1 }}
        />
        {([1, 2, 3, 4, 5, 6, 7, 8] as const).map((i) => (
          <ImgixImage
            key={i}
            src={`events/2022/travelWithNS/wheel/slice-${i}.png`}
            style={{
              ...SLICE_STYLES[i],
              position: 'absolute',
              opacity: sliceShown % 8 === i - 1 ? 1 : 0,
            }}
            width={SLICE_STYLES[i].width}
            height={SLICE_STYLES[i].height}
          />
        ))}
        <ImgixImage
          src="events/2022/travelWithNS/wheel/spin-ring.png"
          style={{ position: 'absolute', top: 6, left: 6 }}
          width={WHEEL_WIDTH - 14}
          height={WHEEL_WIDTH - 14}
        />
        <ButtonBase onPress={spinTheWheel} style={{ width: 44, height: 44, position: 'absolute' }}>
          <ImgixImage
            src={`events/2022/travelWithNS/wheel/spin-button${
              travelWithNSStats.spins === 0 ? '-disabled' : ''
            }.png`}
            style={{
              top: WHEEL_WIDTH / 2 - 50 / 2,
              left: WHEEL_WIDTH / 2 - 50 / 2,
            }}
            width={50}
            height={50}
          />
        </ButtonBase>
      </Box>

      {travelReward?.city && (
        <ConfirmDialog
          isOpen={dialogOpen === 'reward'}
          onClose={() => setDialogOpen(null)}
          onConfirm={() =>
            navigation.navigate('BottomNavStack', {
              screen: 'BrowseStack',
              params: {
                screen: 'BrowseRoot',
                params: { screen: 'All', params: { collection: `${travelReward.city}-edit` } },
              },
            })
          }
          confirmText={i18n._(`SHOP THE ${mapCityText[travelReward.city]?.toUpperCase()} EDIT`)}
          closeText={i18n._(t`CLOSE`)}
          title={i18n._(t`CONGRATULATIONS!`)}
        >
          <Box my={6}>
            <Text fontSize={2}>
              <Trans>
                You've arrived in {mapCityText[travelReward.city]}. Shop the{' '}
                {mapCityText[travelReward.city]} Edit with code{' '}
                <Text fontSize={2} fontFamily="bold">
                  {travelReward.promocode}
                </Text>{' '}
                to get{' '}
                <Text fontSize={2} fontFamily="bold">
                  {toCurrencyString(travelReward.value)}
                </Text>{' '}
                off.
              </Trans>
            </Text>
            <Text fontSize={2} mt={4}>
              <Trans>Promocode has been added to your account.</Trans>
            </Text>
          </Box>
        </ConfirmDialog>
      )}

      <ConfirmDialog
        isOpen={dialogOpen === 'login'}
        onClose={() => setDialogOpen(null)}
        confirmText={i18n._(t`LOGIN`)}
        onConfirm={() => navigation.navigate('AuthStack', { screen: 'LogIn' })}
        closeText={i18n._(t`CLOSE`)}
        title={i18n._(t`YOU ARE NOT LOGGED IN!`)}
      >
        <Box center my={6}>
          <Text fontSize={2}>
            <Trans>You must be logged in to spin the wheel.</Trans>
          </Text>
        </Box>
      </ConfirmDialog>

      <InfoDialog
        isOpen={dialogOpen === 'no-spin'}
        onClose={() => setDialogOpen(null)}
        buttonText={i18n._(t`GOT IT`)}
      >
        <Box center>
          <Text fontSize={4} fontFamily="bold" textTransform="uppercase" textAlign="center">
            <Trans>NO SPINS LEFT</Trans>
          </Text>

          <Text mt={3} mb={7} fontSize={2} textAlign="center">
            <Trans>Come back tomorrow for more spins.</Trans>
          </Text>
        </Box>
      </InfoDialog>
    </Box>
  );
};

export default TravelWithNSSpinWheel;
