import * as React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import { SearchRoutes } from 'types/navigation';

import SearchHeader from './components/SearchHeader';
import Search from './Search';

const SearchStack = createStackNavigator<SearchRoutes>();

const SearchNavigator = () => (
  <SearchStack.Navigator
    screenOptions={{
      // @ts-ignore rn-navigation unsupported type
      header: SearchHeader,
      headerMode: 'float',
      ...TransitionPresets.SlideFromRightIOS,
    }}
  >
    <SearchStack.Screen name="Search" component={Search} />
  </SearchStack.Navigator>
);

export default SearchNavigator;
