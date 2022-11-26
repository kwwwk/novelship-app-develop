import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { TAB_BAR_SCREEN_OPTIONS } from 'common/constants/layout';

import { t } from '@lingui/macro';
import { i18n } from '@lingui/core';
import CurrentOffers from './CurrentOffers';
import SalesList from '../components/SalesList';

const Tab = createMaterialTopTabNavigator();

const UserBuyingNavigator = () => (
  <Tab.Navigator screenOptions={TAB_BAR_SCREEN_OPTIONS}>
    <Tab.Screen
      name="Offers"
      component={CurrentOffers}
      options={{ tabBarLabel: i18n._(t`Offers`) }}
    />
    <Tab.Screen
      name="ConfirmedPurchases"
      component={SalesList}
      options={{ tabBarLabel: i18n._(t`Confirmed`) }}
    />
    <Tab.Screen
      name="PastPurchases"
      component={SalesList}
      options={{ tabBarLabel: i18n._(t`History`) }}
    />
  </Tab.Navigator>
);

export default UserBuyingNavigator;
