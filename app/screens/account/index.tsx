import * as React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import { AccountRoutes } from 'types/navigation';

import Account from './Account';
import About from './About';
import AccountAppHeader from './components/AccountAppHeader';

const AccountStack = createStackNavigator<AccountRoutes>();
const AccountNavigator = () => (
  <AccountStack.Navigator
    screenOptions={{
      header: (props) => <AccountAppHeader {...props} />,
      headerMode: 'float',
      ...TransitionPresets.SlideFromRightIOS,
    }}
  >
    <AccountStack.Screen name="Account" component={Account} />
    <AccountStack.Screen name="About" component={About} />
  </AccountStack.Navigator>
);

export default AccountNavigator;
