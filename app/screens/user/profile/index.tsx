import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { ProfileTopTabRoutes } from 'types/navigation';
import { TAB_BAR_SCREEN_OPTIONS } from 'common/constants/layout';

import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';
import Profile from './Profile';
import BuyingProfile from './BuyingProfile';
import SellingProfile from './SellingProfile';

const Tab = createMaterialTopTabNavigator<ProfileTopTabRoutes>();

const UserProfile = () => (
  <Tab.Navigator screenOptions={TAB_BAR_SCREEN_OPTIONS}>
    <Tab.Screen name="User" options={{ tabBarLabel: i18n._(t`Profile`) }} component={Profile} />
    <Tab.Screen
      name="Buying"
      options={{ tabBarLabel: i18n._(t`Buying`) }}
      component={BuyingProfile}
    />
    <Tab.Screen
      name="Selling"
      options={{ tabBarLabel: i18n._(t`Selling`) }}
      component={SellingProfile}
    />
  </Tab.Navigator>
);

export default UserProfile;
