import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { i18n } from '@lingui/core';
import { t, Trans } from '@lingui/macro';

import theme from 'app/styles/theme';
import { useStoreState } from 'app/store';
import { Text, Box, ButtonBase } from 'app/components/base';
import { ProductRoutes, RootRoutes } from 'types/navigation';
import usePushState from 'app/hooks/usePushState';
import { LB } from 'common/constants';
import ReferralWidget from './ReferralWidget';

type ConfirmedNavigationProp = CompositeNavigationProp<
  StackNavigationProp<
    ProductRoutes,
    'ConfirmedPurchase' | 'ConfirmedOffer' | 'ConfirmedDelivery' | 'ConfirmedList' | 'ConfirmedSale'
  >,
  StackNavigationProp<RootRoutes, 'UserStack'>
>;

const ConfirmedPageWidgets = ({
  mode,
  navigation,
}: {
  mode: 'list' | 'sell' | 'buy' | 'offer';
  navigation: ConfirmedNavigationProp;
}) => {
  const { isPushEnabled } = usePushState();
  const user = useStoreState((s) => s.user.user);

  const notificationMessages: Record<typeof mode, string> = {
    list: i18n._(t`Get notified when your${LB}list is sold!`),
    offer: i18n._(t`Get notified when your${LB}offer is accepted!`),
    sell: i18n._(t`Get notified when your${LB}item passes quality check!`),
    buy: i18n._(t`Get notified when your${LB}item is shipped!`),
  };

  return (
    <Box mt={4} backgroundColor="yellow" borderRadius={4}>
      {(!isPushEnabled || !user.notification_preferences.sale_updates.push) && (
        <Box pt={4} px={4}>
          <ButtonBase
            onPress={() => {
              navigation.navigate('UserStack', { screen: 'PushNotificationForm' });
            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box ml={1}>
              <Text fontSize={3} fontFamily="bold" mr={2}>
                {notificationMessages[mode]}
              </Text>
              <Text fontSize={2} textDecorationLine="underline" pt={2}>
                <Trans>Tap here to update your preferences</Trans>
              </Text>
            </Box>
            <Box mr={3}>
              <MaterialCommunityIcons
                name="bell-ring-outline"
                size={32}
                color={theme.colors.textBlack}
              />
            </Box>
          </ButtonBase>
          <Box borderBottomColor="textBlack" borderBottomWidth={1} mt={4} />
        </Box>
      )}
      <ReferralWidget user={user} />
    </Box>
  );
};

export default ConfirmedPageWidgets;
