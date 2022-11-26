import * as React from 'react';
import { i18n } from '@lingui/core';
import { t, Trans } from '@lingui/macro';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { TAB_BAR_SCREEN_OPTIONS } from 'common/constants/layout';

import { Text } from 'app/components/base';
import CurrentLists from './CurrentLists';
import SalesList from '../components/SalesList';
import ConfirmedSalesList from '../components/ConfirmedSales';
import ShipmentPendingAlert from '../components/ShipmentPendingAlert';

const Tab = createMaterialTopTabNavigator();

const UserSellingNavigator = () => (
  <Tab.Navigator screenOptions={TAB_BAR_SCREEN_OPTIONS}>
    <Tab.Screen name="Lists" component={CurrentLists} options={{ tabBarLabel: i18n._(t`Lists`) }} />
    <Tab.Screen
      name="ConfirmedSales"
      component={ConfirmedSalesList}
      options={{
        tabBarLabel: ({ color }) => (
          <ShipmentPendingAlert>
            <Text style={[{ color }, TAB_BAR_SCREEN_OPTIONS.tabBarLabelStyle]}>
              <Trans>CONFIRMED</Trans>
            </Text>
          </ShipmentPendingAlert>
        ),
      }}
    />
    <Tab.Screen
      name="PastSales"
      component={SalesList}
      options={{ tabBarLabel: i18n._(t`History`) }}
    />
  </Tab.Navigator>
);

export default UserSellingNavigator;
