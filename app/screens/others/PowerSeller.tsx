/* eslint-disable react/jsx-pascal-case */
import React, { useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { RootRoutes } from 'types/navigation';
import { useStoreState, useStoreActions } from 'app/store';
import API from 'common/api';
import ErrorMessage from 'app/components/form/ErrorMessage';
import { Anchor, Box, Button, ImgixImage, Text, ButtonBase } from 'app/components/base';
import { Header, ScrollContainer } from 'app/components/layout';
import { CURRENCY_CONSTANTS } from 'common/constants/currency';
import getFaqLink from 'common/constants/faq';
import theme from 'app/styles/theme';
import { navigateBackOrGoToHome } from 'app/services/navigation';
import { t, Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';
import { LB } from 'common/constants';

type PowerSellerNavigationProp = StackNavigationProp<RootRoutes, 'PowerSeller'>;

const PowerSellerEnrolSection = ({ navigation }: { navigation: PowerSellerNavigationProp }) => {
  const user = useStoreState((s) => s.user.user);
  const fetchUser = useStoreActions((a) => a.user.fetch);

  const [error, setError] = useState('');

  const userId = user.id;
  const isPowerSeller = !!user.power_seller_stats;
  const isPowerSellerEligible = user.groups.includes('power-seller-eligible');

  const submit = () => {
    if (!userId) {
      return navigation.navigate('AuthStack', { screen: 'SignUp' });
    }

    setError('');

    API.put('me/power-seller-enrol')
      .then(() => fetchUser())
      .then(() =>
        navigation.navigate('UserStack', {
          screen: 'Profile',
          params: { screen: 'Selling', params: { power_seller_enrolled: true } },
        })
      )
      .catch(() =>
        setError(
          i18n._(
            t`You do not currently meet the power seller program requirements. Come back once you’ve met the Level 1 criteria.`
          )
        )
      );
  };

  return (
    <Box center flexDirection="column" my={4}>
      {isPowerSeller ? (
        <>
          <Text textAlign="center" fontSize={1}>
            <Trans>
              You are already a Power Seller, sell more to enjoy lower fees and more perks.
            </Trans>
          </Text>
        </>
      ) : (
        <>
          {!userId && (
            <Text textAlign="center" fontSize={1} mb={5}>
              <Trans>
                Please login or register an account on Novelship to view your power seller account
                details.
              </Trans>
            </Text>
          )}
          <Button
            variant="black"
            size="sm"
            width="50%"
            text={
              userId
                ? isPowerSellerEligible
                  ? i18n._(t`ENROL`)
                  : i18n._(t`JOIN NOW`)
                : i18n._(t`CREATE ACCOUNT`)
            }
            onPress={submit}
          />

          <ErrorMessage mt={2}>{error}</ErrorMessage>
        </>
      )}
    </Box>
  );
};
const totalSales = [
  12, 18, 24, 30, 36, 45, 60, 80, 100, 120, 150, 180, 240, 300, 400, 600, 900, 1200, 1800, 2400,
  3000,
];
const sellingFees = [
  7.0, 6.8, 6.6, 6.4, 6.2, 6.0, 5.8, 5.6, 5.4, 5.2, 5.0, 4.8, 4.6, 4.4, 4.2, 4.0, 3.8, 3.6, 3.4,
  3.2, 3.0,
];
const tierRow = (level: number) => ({
  level,
  sellerFee: `${sellingFees[level - 1]}%`,
  min_sale_count: totalSales[level - 1],
  sgd_sale_value: CURRENCY_CONSTANTS.SGD.powerSellerLevelSalesValues[level - 1],
  jpy_sale_value: CURRENCY_CONSTANTS.JPY.powerSellerLevelSalesValues[level - 1],
  idr_sale_value: CURRENCY_CONSTANTS.IDR.powerSellerLevelSalesValues[level - 1],
  myr_sale_value: CURRENCY_CONSTANTS.MYR.powerSellerLevelSalesValues[level - 1],
  twd_sale_value: CURRENCY_CONSTANTS.TWD.powerSellerLevelSalesValues[level - 1],
});
const tilesData = [
  {
    name: t`BRONZE`,
    tierColor: '#9a562f',
    categories: [tierRow(1), tierRow(2), tierRow(3), tierRow(4), tierRow(5), tierRow(6)],
    img: 'email/bronze_icon_powerseller.png',
    perks: [t`2X Penalty Fee Waivers`, t`360 Novelship Points`],
  },
  {
    name: t`SILVER`,
    tierColor: '#8f8b82',
    categories: [tierRow(7), tierRow(8), tierRow(9), tierRow(10), tierRow(11)],
    img: 'email/silver_icon_powerseller.png',
    perks: [t`6X Penalty Fee Waivers`, t`1X Return Shipment Waivers`, t`645 Novelship Points`],
  },
  {
    name: t`GOLD`,
    tierColor: '#c29749',
    categories: [tierRow(12), tierRow(13), tierRow(14), tierRow(15), tierRow(16)],
    img: 'email/gold_icon_powerseller.png',
    perks: [
      t`20X Penalty Fee Waivers`,
      t`3X Return Shipment Waivers`,
      t`930 Novelship Points`,
      t`1% Expedited Payout Fee Waived on Payout Values ≥ S$1000/¥82,000/MYR3200 /IDR11,000,000/TWD21,000**`,
      t`72 Hours to ship`,
      t`Priority Account Management`,
    ],
  },
  {
    name: t`PLATINUM`,
    tierColor: '#809497',
    categories: [tierRow(17), tierRow(18), tierRow(19), tierRow(20), tierRow(21)],
    img: 'email/platinum_icon_powerseller.png',
    perks: [
      t`50X Penalty Fee Waivers`,
      t`6x Return Shipment Waivers`,
      t`1,245 Novelship Points`,
      t`1% Expedited Payout Fee Waived on all Payouts`,
      t`72 Hours to ship`,
      t`Priority Account Management`,
    ],
  },
];

const PowerSeller = ({ navigation }: { navigation: PowerSellerNavigationProp }) => (
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
            <Trans>Power Seller Program</Trans>
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
    <ScrollContainer>
      <Box p={4}>
        <PowerSellerEnrolSection navigation={navigation} />
        <Text textAlign="center" fontSize={4} fontFamily="bold" mt={5}>
          <Trans>POWER SELLER TIERS</Trans>
        </Text>
        <Text textAlign="center" fontSize={1} mt={4} mb={5}>
          <Trans>
            Enrol in our Power Seller Program and quickly level up your account to enjoy seller fees
            as low as 3.0% and other rewards! Find out more below.
          </Trans>
        </Text>

        <ScrollContainer horizontal>
          <Box width={700} alignItems="center" center mt={5}>
            <Box
              center
              flexDirection="row"
              justifyContent="space-between"
              height={50}
              style={{ backgroundColor: '#f6f5f8' }}
              borderRadius={5}
              flexWrap="wrap"
              pt={3}
            >
              <Box flex={1.2} mr={2}>
                <Text fontFamily="bold" fontSize={1} textAlign="center">
                  <Trans>TIER</Trans>
                </Text>
              </Box>
              <Box flex={10} center flexDirection="row" alignItems="center">
                <Box flex={0.5}>
                  <Text fontFamily="bold" fontSize={1} textAlign="center">
                    <Trans>LEVEL</Trans>
                  </Text>
                </Box>
                <Box flex={0.7}>
                  <Text fontFamily="bold" fontSize={1} textAlign="center">
                    <Trans>FEE</Trans>
                  </Text>
                </Box>
                <Box flex={0.7}>
                  <Text fontFamily="bold" fontSize={1} textAlign="center">
                    <Trans>SALES REQUIRED</Trans>
                  </Text>
                </Box>
                <Box flex={1}>
                  <Text fontFamily="bold" fontSize={1} textAlign="center">
                    <Trans>SALE VALUE (SGD)</Trans>
                  </Text>
                </Box>
                <Box flex={1}>
                  <Text fontFamily="bold" fontSize={1} textAlign="center">
                    <Trans>Sale Value (JPY)</Trans>
                  </Text>
                </Box>
                <Box flex={1}>
                  <Text fontFamily="bold" fontSize={1} textAlign="center">
                    <Trans>SALE VALUE (IDR)</Trans>
                  </Text>
                </Box>
                <Box flex={1}>
                  <Text fontFamily="bold" fontSize={1} textAlign="center">
                    <Trans>SALE VALUE (MYR)</Trans>
                  </Text>
                </Box>
                <Box flex={1}>
                  <Text fontFamily="bold" fontSize={1} textAlign="center">
                    <Trans>SALE VALUE (TWD)</Trans>
                  </Text>
                </Box>
              </Box>
            </Box>

            <Box width={700}>
              {tilesData &&
                tilesData.map((tile) => (
                  <Box mt={2} key={tile.name} flexDirection="row">
                    <Box
                      flex={1.2}
                      center
                      width="10%"
                      height={155}
                      mr={2}
                      style={{
                        backgroundColor: `${tile.tierColor}`,
                      }}
                      borderRadius={5}
                    >
                      <Text
                        fontFamily="bold"
                        fontSize={1}
                        textAlign="center"
                        style={{ color: '#fff', transform: [{ rotate: '-90deg' }] }}
                      >
                        {i18n._(tile.name)}
                      </Text>
                    </Box>
                    <Box
                      flex={10}
                      flexDirection="column"
                      justifyContent="space-between"
                      width="90%"
                      height={155}
                    >
                      {tile.categories &&
                        tile.categories.map((itm) => (
                          <Box
                            borderWidth={2}
                            // borderColor={tile.tierColor}
                            borderRadius={4}
                            style={{
                              borderColor: `${tile.tierColor}`,
                            }}
                            key={itm.level}
                          >
                            <Box
                              center
                              justifyContent="space-between"
                              flexDirection="row"
                              height={20}
                              // color="black"
                              key={itm.level}
                            >
                              <Box flex={0.5}>
                                <Text fontFamily="bold" fontSize={1} textAlign="center">
                                  {itm.level}
                                </Text>
                              </Box>
                              <Box flex={0.7}>
                                <Text fontFamily="bold" fontSize={1} textAlign="center">
                                  {itm.sellerFee}
                                </Text>
                              </Box>
                              <Box flex={0.7}>
                                <Text fontFamily="bold" fontSize={1} textAlign="center">
                                  {itm.min_sale_count}
                                </Text>
                              </Box>
                              <Box flex={1}>
                                <Text fontFamily="bold" fontSize={1} textAlign="center">
                                  {itm.sgd_sale_value}
                                </Text>
                              </Box>
                              <Box flex={1}>
                                <Text fontFamily="bold" fontSize={1} textAlign="center">
                                  {itm.jpy_sale_value}
                                </Text>
                              </Box>
                              <Box flex={1}>
                                <Text fontFamily="bold" fontSize={1} textAlign="center">
                                  {itm.idr_sale_value}
                                </Text>
                              </Box>
                              <Box flex={1}>
                                <Text fontFamily="bold" fontSize={1} textAlign="center">
                                  {itm.myr_sale_value}
                                </Text>
                              </Box>
                              <Box flex={1}>
                                <Text fontFamily="bold" fontSize={1} textAlign="center">
                                  {itm.twd_sale_value}
                                </Text>
                              </Box>
                            </Box>
                          </Box>
                        ))}
                    </Box>
                  </Box>
                ))}
            </Box>
          </Box>
        </ScrollContainer>

        <Text textAlign="center" fontSize={4} fontFamily="bold" mt={10}>
          <Trans>POWER SELLER PERKS</Trans>
        </Text>
        <Text textAlign="center" fontSize={1} mt={4} mb={5}>
          <Trans>
            Rise through the ranks on Novelship and earn even greater perks including penalty fee
            waivers, expedited payouts, and bonus loyalty points! Find out more below.
          </Trans>
        </Text>
        <Box flexDirection="column">
          {tilesData &&
            tilesData.map((tile) => (
              <Box
                key={tile.name}
                center
                flexDirection="column"
                height="auto"
                width="100%"
                mb={10}
                borderRadius={5}
                style={{
                  marginTop: 40,
                }}
              >
                <Box
                  // center
                  width="100%"
                  borderRadius={5}
                  style={{
                    backgroundColor: '#f6f5f8',
                  }}
                >
                  <Box center style={{ marginTop: -45 }}>
                    <ImgixImage src={tile.img || ''} width={90} height={90} />
                  </Box>
                  <Text
                    textAlign="center"
                    fontFamily="bold"
                    fontSize={2}
                    mt={5}
                    mb={6}
                    style={{ color: tile.tierColor }}
                  >
                    {i18n._(tile.name)}
                  </Text>
                  <Box mx={5} mb={5} width="80%">
                    {tile.perks &&
                      tile.perks.map((itm) => (
                        <Box key={itm} flexDirection="row" alignItems="center" mt={3} mb={1}>
                          <Ionicon name="ios-checkmark-sharp" size={20} />

                          <Text fontFamily="bold" fontSize={2} ml={4} textAlign="left">
                            {i18n._(itm)}
                          </Text>
                        </Box>
                      ))}
                  </Box>
                </Box>
              </Box>
            ))}
        </Box>
        <Text textAlign="center" fontStyle="italic" fontSize={1} mb={5} color="textSecondary">
          <Trans>
            *All tier benefits are unlocked on the day you join the Power Seller Program and are
            valid for the next 90 days. Your tier benefits will unlock at the beginning of the next
            90 day cycle based on your sales performance.
            {LB}
            {LB}
            **For AUD, NZD, HKD and USD sellers, please contact support to enquire about entry and
            progress requirements.
          </Trans>
        </Text>
        <Box>
          <PowerSellerEnrolSection navigation={navigation} />
        </Box>
        <Box center mt={8} mb={5}>
          <Text textAlign="center" fontFamily="medium" fontSize={2}>
            <Trans>TERMS & CONDITIONS</Trans>
          </Text>
          <Text textAlign="center" mt={4} fontSize={1} color="textSecondary">
            <Trans>
              This program is open to eligible sellers only, to find out more, check out our FAQ
              article{' '}
              <Anchor
                to={getFaqLink('power_seller')}
                fontSize={1}
                textDecorationLine="underline"
                color="blue"
              >
                here
              </Anchor>
              . Should you have any questions or concerns, please reach out to us via live chat or
              email at support@novelship.com.
            </Trans>
          </Text>
        </Box>
      </Box>
      <Box my={8} />
    </ScrollContainer>
  </>
);

export default PowerSeller;
