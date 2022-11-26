import * as React from 'react';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { TAB_BAR_SCREEN_OPTIONS } from 'common/constants/layout';

import UserPosts from './UserPosts';

const Tab = createMaterialTopTabNavigator();

const UserPostNavigator = () => (
  <Tab.Navigator screenOptions={TAB_BAR_SCREEN_OPTIONS}>
    <Tab.Screen
      name="PublishedPosts"
      component={UserPosts}
      options={{ tabBarLabel: i18n._(t`Published`) }}
    />
    <Tab.Screen
      name="ReviewingPosts"
      component={UserPosts}
      options={{ tabBarLabel: i18n._(t`Reviewing`) }}
    />
    <Tab.Screen
      name="RejectedPosts"
      component={UserPosts}
      options={{ tabBarLabel: i18n._(t`Rejected`) }}
    />
  </Tab.Navigator>
);

export default UserPostNavigator;
