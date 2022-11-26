import React, { useState, useEffect } from 'react';
import { Image, Alert } from 'react-native';
import { useStoreState, useStoreActions } from 'app/store';
import { Box, Text, Anchor, ImgixImage, Button, ButtonBase } from 'app/components/base';
import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import { useQuery } from 'react-query';
import getFaqLink from 'common/constants/faq';
import { FeeType } from 'types/resources/fee';
import { ScrollContainer } from 'app/components/layout';
import ErrorMessage from 'app/components/form/ErrorMessage';
import API from 'common/api';
import { getSGTTime, toDate } from 'common/utils/time';

import { ProfileTopTabRoutes, RootRoutes } from 'types/navigation';
import {
  CURRENCY_CONSTANTS,
  POWER_SELLER_EXPEDITED_PAYOUT_THRESHOLD,
} from 'common/constants/currency';
import { cacheGet, cacheSet } from 'app/services/asyncStorage';
import { i18n } from '@lingui/core';
import { t, Trans } from '@lingui/macro';
import HintAlert from 'app/components/dialog/HintAlert';

type SellingStatsType = {
  amount: number;
  count: number;
  powerSellerAmount: number;
  powerSellerCount: number;
  powerSellerBefore90DaysAmount: number;
  powerSellerBefore90DaysCount: number;
  seller90DaysAmount: number;
  seller90DaysCount: number;
};

type PowerSellerType = {
  name?: string;
  penalty_fee_waiver_count?: number;
  return_shipping_fee_waiver_count?: number;
  ship_out_time?: string;
  loyalty_point?: number;
  priority_account_management?: boolean;
  payout_request_waiver_threshold?: number;
  img?: string;
};

type SellerNextLevelStatsType = {
  stats: FeeType;
  powerSellerStats: FeeType;
};

type SellingProfileNavigationType = CompositeNavigationProp<
  StackNavigationProp<ProfileTopTabRoutes, 'Selling'>,
  StackNavigationProp<RootRoutes, 'UserStack'>
>;
type SellingProfileRouteProp = RouteProp<ProfileTopTabRoutes, 'Selling'>;

const SellingProfile = ({
  navigation,
  route,
}: {
  navigation: SellingProfileNavigationType;
  route: SellingProfileRouteProp;
}) => {
  const user = useStoreState((s) => s.user.user);
  const currency = useStoreState((s) => s.currency.current);
  const fetchUser = useStoreActions((a) => a.user.fetch);

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>();
  const { $ } = useCurrencyUtils();
  const showPowerSellerDialog = !!route.params?.power_seller_enrolled;
  const { payoutThresholdTier3, payoutThresholdTier4 } =
    POWER_SELLER_EXPEDITED_PAYOUT_THRESHOLD[currency.code];

  const POWER_SELLER_TIER_PERKS: { [key: string]: PowerSellerType } = {
    Tier1: {
      name: 'bronze',
      penalty_fee_waiver_count: 2,
      loyalty_point: 360,
      img: 'email/bronze_icon_powerseller.png',
    },
    Tier2: {
      name: 'silver',
      penalty_fee_waiver_count: 6,
      return_shipping_fee_waiver_count: 1,
      loyalty_point: 645,
      img: 'email/silver_icon_powerseller.png',
    },
    Tier3: {
      name: 'gold',
      penalty_fee_waiver_count: 20,
      return_shipping_fee_waiver_count: 3,
      ship_out_time: '72 HRS',
      loyalty_point: 930,
      priority_account_management: true,
      payout_request_waiver_threshold: payoutThresholdTier3,
      img: 'email/gold_icon_powerseller.png',
    },
    Tier4: {
      name: 'platinum',
      penalty_fee_waiver_count: 50,
      return_shipping_fee_waiver_count: 6,
      ship_out_time: '72 HRS',
      loyalty_point: 1245,
      priority_account_management: true,
      payout_request_waiver_threshold: payoutThresholdTier4,
      img: 'email/platinum_icon_powerseller.png',
    },
  };

  const {
    data: sellingStats = {
      amount: 0,
      count: 0,
      powerSellerCount: 0,
      powerSellerAmount: 0,
      powerSellerBefore90DaysCount: 0,
      powerSellerBefore90DaysAmount: 0,
      seller90DaysAmount: 0,
      seller90DaysCount: 0,
    },
  } = useQuery<SellingStatsType>([
    'me/sales/selling/stats',
    { filter: { seller_currency_id: currency.id } },
  ]);

  const {
    data: nextTier = {
      stats: { sales: 0 },
      powerSellerStats: { sales: 0, level: 0, value: 0 },
    },
  } = useQuery<SellerNextLevelStatsType>('fees/fee-ladder');

  const isPowerSeller = !!user.power_seller_stats;
  const isPowerSellerEligible = user.groups.includes('power-seller-eligible');

  const currentPeriodStartDate = user?.power_seller_stats?.current_period_started_at;
  const powerSellerTierStartDate =
    !!currentPeriodStartDate && toDate(String(currentPeriodStartDate));
  const date = !!currentPeriodStartDate && new Date(currentPeriodStartDate);
  const powerSellerTierEndDate = !!date && toDate(date.setDate(date.getDate() + 90));

  // Pre Power Seller
  const today = new Date();
  const todayDate = toDate(String(getSGTTime()));
  const date90DaysAgo = toDate(today.setDate(getSGTTime().getDate() - 90));

  const submit = () => {
    setError('');
    setIsSubmitting(true);

    API.put<undefined>('me/power-seller-enrol')
      .then(fetchUser)
      .catch(setError)
      .finally(() => setIsSubmitting(false));
  };

  const powerSellerEnrolledAlert = () =>
    Alert.alert(
      i18n._(t`Power Seller Program`),
      i18n._(
        t`Congratulations, you are successfully elevated to a Power Seller! Enjoy exclusive selling fees & perks. Sell more to lower it further!`
      ),
      [
        {
          text: i18n._(t`Got It`),
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );

  const powerSellerPerks = isPowerSeller
    ? {
        ...POWER_SELLER_TIER_PERKS[(user.power_seller_stats?.tier || '').replace(' ', '')],
      }
    : {};

  const operationStats = [
    {
      name: i18n._(t`Pending to ship`),
      value: user.shipping_stats.to_ship_count || '-',
      description: i18n._(t`Number of confirmed sales that have yet to be shipped out.`),
    },
    {
      name: i18n._(t`Pending arrival`),
      value: user.shipping_stats.shipping_count || '-',
      description: i18n._(t`Number of confirmed sales that are in transit to Novelship.`),
    },
    {
      name: i18n._(t`Unfulfilled`),
      value: user.shipping_stats.unfulfilled_count || '-',
      description: i18n._(t`Number of sales that have failed to ship.`),
    },
    {
      name: i18n._(t`Delayed shipping rate`),
      value: `${user.shipping_stats.to_ship_delayed_rate || '-'}%`,
      description: i18n._(
        t`Rate at which sales were shipped out beyond given deadline. Does not include any sales from storage or self drop-offs.`
      ),
    },
    {
      name: i18n._(t`Average shipping time`),
      value: i18n._(t`${user.shipping_stats.to_ship_time_avg || '-'} days`),
      description: i18n._(
        t`Average time taken to ship out all confirmed sales. Does not include any sales from storage or self drop-offs.`
      ),
    },
  ];

  useEffect(() => {
    if (showPowerSellerDialog) {
      cacheGet<boolean>('power_seller_dialog').then((d) => {
        if (d === undefined) {
          cacheSet('power_seller_dialog', true);
          setTimeout(powerSellerEnrolledAlert, 1500);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScrollContainer>
      <Box p={5}>
        <Text fontSize={3} fontFamily="bold" mt={2}>
          <Trans>SELLER STATISTICS</Trans>
        </Text>

        <Box justifyContent="space-between" flexDirection="row" mt={7} flexWrap="wrap">
          <Box width="50%" mt={2} alignItems="flex-start">
            <Text fontSize={1} fontFamily="medium" color="gray2">
              <Trans>Seller Fees</Trans>
            </Text>
            <Text fontFamily="bold" fontSize={2} mt={2}>
              {user.selling_fee.value}%
            </Text>
          </Box>
          <Box width="50%" mt={2} alignItems="flex-start">
            <Text fontSize={1} fontFamily="medium" color="gray2">
              <Trans>Total Sales Value</Trans>
            </Text>
            <Text fontFamily="bold" fontSize={2} mt={2}>
              {$(sellingStats.amount)}
            </Text>
          </Box>

          {!isPowerSeller && (
            <Box width="50%" mt={7} alignItems="flex-start" flexDirection="column">
              <Box>
                <Text fontSize={1} fontFamily="medium" color="gray2">
                  <Trans>Seller Level</Trans>
                </Text>
                <Box flexDirection="row">
                  <Box mt={3} height={16} width={16}>
                    <Image
                      style={{ flex: 1 }}
                      height={16}
                      width={16}
                      resizeMode="contain"
                      source={require('assets/images/graphics/selling-crown.png')}
                    />
                  </Box>
                  <Text fontFamily="bold" fontSize={2} mt={2} ml={2}>
                    {user.selling_fee.level}
                  </Text>
                </Box>
              </Box>
              <Box flexDirection="row" justifyContent="space-between">
                <Anchor
                  mt={7}
                  mb={4}
                  color="gray1"
                  fontSize={1}
                  textDecorationLine="underline"
                  to={getFaqLink('seller_rewards')}
                >
                  <Trans>How do I level up?</Trans>
                </Anchor>
              </Box>
            </Box>
          )}

          <Box width="50%" mt={7} alignItems="flex-start">
            <Box>
              <Text fontSize={1} fontFamily="medium" color="gray2">
                <Trans>Total Sales Count</Trans>
              </Text>
              <Text fontFamily="bold" fontSize={2} mt={2}>
                {sellingStats.count}
              </Text>
            </Box>
          </Box>
        </Box>
        {!!nextTier.powerSellerStats && isPowerSeller && (
          <Box justifyContent="space-between" flexDirection="row" flexWrap="wrap">
            <Box width="50%" mt={7} alignItems="flex-start">
              <Text fontSize={1} fontFamily="bold">
                <Trans>Next Level</Trans>
              </Text>
              <Text mt={2}>
                {nextTier.powerSellerStats.level} ({nextTier.powerSellerStats.value}%)
              </Text>
            </Box>
            <Box width="50%" mt={7} alignItems="flex-start">
              <Text fontSize={1} fontFamily="bold">
                <Trans>Sales Value Needed</Trans>
              </Text>
              <Text mt={2}>
                {$(
                  CURRENCY_CONSTANTS[currency.code].powerSellerLevelSalesValues[
                    nextTier.powerSellerStats.level - 1
                  ] - sellingStats.powerSellerBefore90DaysAmount
                )}
              </Text>
            </Box>
            <Box width="50%" mt={7} alignItems="flex-start">
              <Text fontSize={1} fontFamily="bold">
                <Trans>New Sales Needed</Trans>
              </Text>
              <Text mt={2}>
                {nextTier.powerSellerStats.sales - sellingStats.powerSellerBefore90DaysCount}
              </Text>
            </Box>
          </Box>
        )}

        {user.selling_fee.name === 'auto-level' && !!nextTier.stats.sales && (
          <Box my={3}>
            <Text fontSize={1} fontFamily="medium" color="gray2">
              <Trans>Sales to Reach Next Level</Trans>
            </Text>
            <Box mt={2} height={20} bg="gray5">
              <Box
                height={20}
                bg="orange2"
                width={
                  sellingStats.count && nextTier.stats.sales
                    ? `${(sellingStats.count * 100) / nextTier.stats.sales}%`
                    : '0%'
                }
              />
            </Box>
            <Text mt={2} fontSize={1} fontFamily="medium">
              <Trans>
                TO REACH LEVEL {user.selling_fee.level + 1}, YOU NEED{' '}
                {nextTier.stats.sales - sellingStats.count} SALES
              </Trans>
            </Text>
          </Box>
        )}

        <Box mt={8} mb={3} height={1} bg="dividerGray" />

        <Text fontSize={3} fontFamily="bold" mt={6}>
          <Trans>SELLER OPERATION PERFORMANCE</Trans>
        </Text>
        <Box justifyContent="space-between">
          {operationStats.map((stat) => (
            <React.Fragment key={stat.name}>
              <Box flexDirection="row" alignItems="center" mt={7}>
                <Text fontSize={1} fontFamily="medium" color="gray2">
                  {stat.name}
                </Text>
                <HintAlert title={stat.name} text={stat.description} />
              </Box>
              <Text fontFamily="bold" fontSize={2} mt={2}>
                {stat.value}
              </Text>
            </React.Fragment>
          ))}
        </Box>

        <Box mt={7}>
          <Button
            variant="white"
            text={i18n._(t`VIEW YOUR LISTS AND SALES`)}
            width="100%"
            fontSize={2}
            onPress={() =>
              navigation.push('UserStack', { screen: 'Selling', params: { screen: 'Lists' } })
            }
          />
        </Box>

        <Box mt={8} mb={3} height={1} bg="dividerGray" />

        {isPowerSeller && (
          <>
            <Box justifyContent="space-between" flexDirection="row">
              <Box>
                <Text fontSize={3} fontFamily="bold" textTransform="uppercase" mt={8}>
                  <Trans>Power Seller Tier:</Trans> {powerSellerPerks.name}
                </Text>
                <ButtonBase onPress={() => navigation.push('PowerSeller')}>
                  <Text color="textSecondary" fontSize={1} textDecorationLine="underline">
                    <Trans>Learn More</Trans>
                  </Text>
                </ButtonBase>
              </Box>
              <Box style={{ marginTop: 30 }}>
                <ImgixImage src={powerSellerPerks.img || ''} width={50} height={50} />
              </Box>
            </Box>
            <Box flexDirection="row" justifyContent="space-between" flexWrap="wrap">
              <Box width="100%" alignItems="flex-start" mt={7}>
                <Text fontSize={1} fontFamily="medium" color="gray2">
                  <Trans>Current Period</Trans>
                </Text>
                <Text fontFamily="bold" fontSize={2} mt={2}>
                  {powerSellerTierStartDate} TO {powerSellerTierEndDate}
                </Text>
              </Box>
              <Box width="50%" alignItems="flex-start" mt={7}>
                <Text fontSize={1} fontFamily="medium" color="gray2">
                  <Trans>Level</Trans>
                </Text>
                <Text fontFamily="bold" fontSize={2} mt={2}>
                  {user.selling_fee.level}
                </Text>
              </Box>
              <Box width="50%" alignItems="flex-start" mt={7}>
                <Text fontSize={1} fontFamily="medium" color="gray2">
                  <Trans>Penalty Fee Waiver Remaining</Trans>
                </Text>
                <Text fontFamily="bold" fontSize={2} mt={2}>
                  {user?.power_seller_stats?.penalty_fee_waiver_count}
                </Text>
              </Box>
              {!!powerSellerPerks.return_shipping_fee_waiver_count &&
                !!user?.power_seller_stats?.return_shipping_fee_waiver_count && (
                  <Box width="50%" alignItems="flex-start" mt={7}>
                    <Text fontSize={1} fontFamily="medium" color="gray2">
                      <Trans>Return Shipping Fee Waiver Remaining</Trans>
                    </Text>
                    <Text fontFamily="bold" fontSize={2} mt={2}>
                      {user?.power_seller_stats?.return_shipping_fee_waiver_count}
                    </Text>
                  </Box>
                )}
              {!!powerSellerPerks.payout_request_waiver_threshold && (
                <Box width="50%" alignItems="flex-start" mt={7}>
                  <Text fontSize={1} fontFamily="medium" color="gray2">
                    <Trans>Expedited Payout Threshold</Trans>
                  </Text>
                  <Text fontFamily="bold" fontSize={2} mt={2}>
                    {$(powerSellerPerks.payout_request_waiver_threshold)}
                  </Text>
                </Box>
              )}
              {!!powerSellerPerks.ship_out_time && (
                <Box width="50%" alignItems="flex-start" mt={7}>
                  <Text fontSize={1} fontFamily="medium" color="gray2">
                    <Trans>Time To Ship</Trans>
                  </Text>
                  <Text fontFamily="bold" fontSize={2} mt={2}>
                    {powerSellerPerks.ship_out_time}
                  </Text>
                </Box>
              )}
              <Box width="50%" alignItems="flex-start" mt={7}>
                <Text fontSize={1} fontFamily="medium" color="gray2">
                  <Trans>Priority Account Management</Trans>
                </Text>
                <Text fontFamily="bold" fontSize={2} mt={2}>
                  {powerSellerPerks.priority_account_management
                    ? i18n._(t`YES`)
                    : i18n._(t`NOT YET`)}
                </Text>
              </Box>
              {!!powerSellerPerks.loyalty_point && (
                <Box width="50%" alignItems="flex-start" mt={7}>
                  <Text fontSize={1} fontFamily="medium" color="gray2">
                    <Trans>Loyalty Points (NSP) Awarded</Trans>
                  </Text>
                  <Box flexDirection="row">
                    <Box mt={3} height={16} width={16}>
                      <Image
                        style={{ flex: 1 }}
                        height={16}
                        width={16}
                        resizeMode="contain"
                        source={require('assets/images/graphics/loyalty-icon.png')}
                      />
                    </Box>
                    <Text fontFamily="bold" fontSize={2} mt={2}>
                      {' '}
                      {powerSellerPerks.loyalty_point}
                    </Text>
                  </Box>
                </Box>
              )}

              <Box width="100%" alignItems="flex-start" mt={7}>
                <Text fontSize={1} fontFamily="medium" color="gray2">
                  <Trans>Total Sales Count</Trans>
                </Text>
                <Text fontFamily="bold" fontSize={2} mt={2}>
                  <Trans>
                    {sellingStats.powerSellerBefore90DaysCount} ({sellingStats.powerSellerCount} in
                    Current Period)
                  </Trans>
                </Text>
              </Box>

              <Box width="100%" alignItems="flex-start" mt={7}>
                <Text fontSize={1} fontFamily="medium" color="gray2">
                  <Trans>Total Sales Value</Trans>
                </Text>
                <Text fontFamily="bold" fontSize={2} mt={2}>
                  <Trans>
                    {$(sellingStats.powerSellerBefore90DaysAmount)} (
                    {$(sellingStats.powerSellerAmount)} in Current Period)
                  </Trans>
                </Text>
              </Box>
            </Box>
          </>
        )}
        {!isPowerSeller && (
          <>
            <Text fontSize={3} fontFamily="bold" mt={6}>
              <Trans>POWER SELLER PROGRAM</Trans>
            </Text>
            <Box mt={7} justifyContent="space-between">
              <Text fontSize={1} fontFamily="medium" color="gray2">
                <Trans>Enrolement Status</Trans>
              </Text>

              <Text fontFamily="bold" fontSize={2} mt={2}>
                <Trans>Not Enroled</Trans>
              </Text>
              <Text fontSize={1} fontFamily="medium" color="gray2" mt={7}>
                <Trans>
                  Total Sales Count ({date90DaysAgo} to {todayDate})
                </Trans>
              </Text>
              <Text fontFamily="bold" fontSize={2} mt={2}>
                {sellingStats.seller90DaysCount}
              </Text>
              <Text fontSize={1} fontFamily="medium" color="gray2" mt={7}>
                <Trans>
                  Total Sales Value ({date90DaysAgo} to {todayDate})
                </Trans>
              </Text>
              <Text fontFamily="bold" fontSize={2} mt={2}>
                {$(sellingStats.seller90DaysAmount)}
              </Text>

              {isPowerSellerEligible && (
                <Box mt={7}>
                  <ButtonBase onPress={() => navigation.push('PowerSeller')}>
                    <Text color="textSecondary" fontSize={2} textDecorationLine="underline">
                      <Trans>Learn More</Trans>
                    </Text>
                  </ButtonBase>
                </Box>
              )}
            </Box>
            {isPowerSellerEligible ? (
              <Box mt={7}>
                <Button
                  width="100%"
                  text={i18n._(t`ENROL`)}
                  variant="black"
                  fontSize={2}
                  onPress={submit}
                  loading={isSubmitting}
                />
                <ErrorMessage mt={2}>{error}</ErrorMessage>
              </Box>
            ) : (
              <Box mt={7}>
                <Button
                  width="100%"
                  text={i18n._(t`LEARN MORE`)}
                  fontSize={2}
                  variant="black"
                  onPress={() => navigation.push('PowerSeller')}
                />
              </Box>
            )}
          </>
        )}
      </Box>
      <Box my={5} />
    </ScrollContainer>
  );
};

export default SellingProfile;
