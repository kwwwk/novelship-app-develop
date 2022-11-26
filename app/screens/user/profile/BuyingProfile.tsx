import React from 'react';
import { Box, Text, Anchor, Button } from 'app/components/base';
import { useStoreState } from 'app/store';
import { Image } from 'react-native';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import { useQuery } from 'react-query';
import getFaqLink from 'common/constants/faq';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileTopTabRoutes, RootRoutes } from 'types/navigation';
import { t, Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';

type BuyingProfileNavigationType = CompositeNavigationProp<
  StackNavigationProp<ProfileTopTabRoutes, 'Buying'>,
  StackNavigationProp<RootRoutes, 'UserStack'>
>;

type BuyingStatsType = {
  amount: number;
  count: number;
};

const BuyingProfile = ({ navigation }: { navigation: BuyingProfileNavigationType }) => {
  const user = useStoreState((s) => s.user.user);
  const { $ } = useCurrencyUtils();
  const currencyId = useStoreState((s) => s.currency.current.id);

  const { data: buyingStats = { amount: 0, count: 0 } } = useQuery<BuyingStatsType>([
    'me/sales/buying/stats',
    { filter: { buyer_currency_id: currencyId } },
  ]);

  return (
    <Box p={5}>
      <Text fontSize={3} fontFamily="bold" mt={2}>
        <Trans>BUYER BENEFITS</Trans>
      </Text>

      <Box mt={5} justifyContent="space-between">
        <Text fontSize={1} fontFamily="medium" color="gray2">
          <Trans>Loyalty Points (NSP)</Trans>
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
          <Text fontFamily="bold" fontSize={2} ml={2} mt={2}>
            {user.points}
          </Text>
        </Box>
        <Anchor
          mt={5}
          color="textSecondary"
          fontSize={1}
          textDecorationLine="underline"
          to={getFaqLink('loyalty')}
        >
          <Trans>How do I get more loyalty points?</Trans>
        </Anchor>
      </Box>

      <Box mt={7}>
        <Button
          width="100%"
          fontSize={2}
          variant="black"
          text={i18n._(t`REDEEM POINTS`)}
          onPress={() => navigation.push('UserStack', { screen: 'LoyaltyPointsStore' })}
        />
      </Box>

      <Text fontSize={3} fontFamily="bold" mt={8}>
        <Trans>BUYER STATISTICS</Trans>
      </Text>
      <Box justifyContent="space-between" flexDirection="row" mt={7} flexWrap="wrap">
        <Box width="50%">
          <Text fontSize={1} fontFamily="medium" color="gray2">
            <Trans>Total Spent</Trans>
          </Text>
          <Text fontFamily="bold" fontSize={2} mt={2}>
            {$(buyingStats.amount)}
          </Text>
        </Box>
        <Box width="50%">
          <Text fontSize={1} fontFamily="medium" color="gray2">
            <Trans>Purchase Count</Trans>
          </Text>
          <Text fontFamily="bold" fontSize={2} mt={2}>
            {buyingStats.count}
          </Text>
        </Box>
      </Box>

      <Box mt={7}>
        <Button
          width="100%"
          fontSize={2}
          variant="black"
          text={i18n._(t`VIEW YOUR OFFERS AND PURCHASES`)}
          onPress={() =>
            navigation.push('UserStack', { screen: 'Buying', params: { screen: 'Offers' } })
          }
        />
      </Box>
    </Box>
  );
};

export default BuyingProfile;
