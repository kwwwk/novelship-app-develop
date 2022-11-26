import * as React from 'react';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StackHeaderProps } from '@react-navigation/stack';

import { TAB_BAR_SCREEN_OPTIONS } from 'common/constants/layout';
import { HomeTopTabRoutes } from 'types/navigation';
import theme from 'app/styles/theme';

import HomeHeader from './components/HomeHeader';
import HomeTab from './components/HomeTab';

const Tab = createMaterialTopTabNavigator<HomeTopTabRoutes>();

const HomeNavigator = (props: StackHeaderProps) => (
  <>
    <HomeHeader {...props} />
    <Tab.Navigator
      screenOptions={{
        ...TAB_BAR_SCREEN_OPTIONS,
        swipeEnabled: false,
        tabBarScrollEnabled: true,
        tabBarActiveTintColor: theme.colors.goldenrod,
        tabBarIndicatorStyle: { backgroundColor: theme.colors.goldenrod },
        tabBarStyle: { backgroundColor: theme.colors.black2 },
        tabBarItemStyle: {
          width: 414 / 3,
          height: theme.constants.LAYOUT_BAR_ELEMENT_LARGE_HEIGHT,
        },
      }}
    >
      <Tab.Screen
        name="Sneakers"
        component={HomeTab}
        options={{ tabBarLabel: i18n._(t`Sneakers`) }}
      />
      <Tab.Screen
        name="Apparel"
        component={HomeTab}
        options={{ tabBarLabel: i18n._(t`Apparel`) }}
      />
      <Tab.Screen
        name="Collectibles"
        component={HomeTab}
        options={{ tabBarLabel: i18n._(t`Collectibles`) }}
      />
    </Tab.Navigator>
  </>
);

export default HomeNavigator;
