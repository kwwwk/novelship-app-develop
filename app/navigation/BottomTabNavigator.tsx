import * as React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { BottomTabRoutes } from 'types/navigation';
import { ButtonBase } from 'app/components/base';
import AccountNavigator from 'app/screens/account';
import BrowseNavigator from 'app/screens/browse';
import HomeNavigator from 'app/screens/home';
import theme from 'app/styles/theme';

type Icons = 'home' | 'text-search' | 'account';
const TabBarIcon = ({ focused, ...props }: { name: Icons; color: string; focused: boolean }) => (
  <ButtonBase style={{ height: focused ? 26 : 24 }}>
    <MaterialCommunityIcon
      size={focused ? 25 : 24}
      {...props}
      style={{
        position: 'relative',
        width: 25,
        left: focused ? -0.5 : 0,
        top: focused ? -0.5 : 0,
      }}
    />
  </ButtonBase>
);

const BottomTab = createMaterialBottomTabNavigator<BottomTabRoutes>();

type TabBarIconProps = { color: string; focused: boolean };

const TabBarIconHome = (props: TabBarIconProps) => <TabBarIcon name="home" {...props} />;
const TabBarIconSearch = (props: TabBarIconProps) => <TabBarIcon name="text-search" {...props} />;
const TabBarIconAccount = (props: TabBarIconProps) => <TabBarIcon name="account" {...props} />;

const BottomTabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <BottomTab.Navigator
      initialRouteName="HomeStack"
      labeled={false}
      activeColor={theme.colors.white}
      inactiveColor={theme.colors.gray3}
      barStyle={{
        justifyContent: 'center',
        backgroundColor: theme.colors.black2,
        height: theme.constants.LAYOUT_BAR_ELEMENT_LARGE_HEIGHT + insets.bottom,
      }}
    >
      <BottomTab.Screen
        name="HomeStack"
        component={HomeNavigator}
        options={{
          tabBarIcon: TabBarIconHome,
        }}
      />
      <BottomTab.Screen
        name="BrowseStack"
        component={BrowseNavigator}
        options={{
          tabBarIcon: TabBarIconSearch,
        }}
      />
      <BottomTab.Screen
        name="AccountStack"
        component={AccountNavigator}
        options={{
          tabBarIcon: TabBarIconAccount,
        }}
      />
    </BottomTab.Navigator>
  );
};

export default BottomTabNavigator;
