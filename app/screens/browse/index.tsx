import * as React from 'react';
import { createStackNavigator, StackScreenProps, TransitionPresets } from '@react-navigation/stack';

import {
  FilterRootRoutes,
  BrowseRootRoutes,
  BottomTabRoutes,
  BrowseRoutes,
} from 'types/navigation';
import { browseScreens } from 'common/constants/browse';
import { navigationRef } from 'app/navigation';

import useBrowseContextValue from './hooks/useBrowseContextValue';
import BrowseContext from './context';
import BrowseHeader from './components/BrowseHeader';
import FilterHeader from './components/FilterHeader';
import Browse from './Browse';
import Filter from './Filter';

const RootStack = createStackNavigator<BrowseRoutes>();
const BrowseStack = createStackNavigator<BrowseRootRoutes>();
const FilterStack = createStackNavigator<FilterRootRoutes>();

function BrowseStackScreen() {
  return (
    <BrowseStack.Navigator
      screenOptions={{
        header: (props) => <BrowseHeader {...props} />,
        headerMode: 'float',
        animationEnabled: false,
      }}
    >
      {Object.keys(browseScreens).map((url) => (
        <BrowseStack.Screen key={url} name={url} component={Browse} />
      ))}
    </BrowseStack.Navigator>
  );
}

function FilterStackScreen() {
  const params: Record<string, any> = navigationRef.current?.getCurrentRoute()?.params || {};

  return (
    <FilterStack.Navigator
      screenOptions={{
        header: (props) => <FilterHeader {...props} />,
        headerMode: 'float',
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      <FilterStack.Screen
        name="Filter"
        component={Filter}
        options={{ headerTitle: params.title }}
      />
    </FilterStack.Navigator>
  );
}

const BrowseNavigator = ({
  route,
  navigation,
}: StackScreenProps<BottomTabRoutes, 'BrowseStack'>) => {
  const browseContextValue = useBrowseContextValue({ route, navigation });

  return (
    <BrowseContext.Provider value={{ ...browseContextValue }}>
      <RootStack.Navigator
        screenOptions={{ presentation: 'modal', ...TransitionPresets.ModalPresentationIOS }}
      >
        <RootStack.Screen
          name="BrowseRoot"
          component={BrowseStackScreen}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="FilterRoot"
          component={FilterStackScreen}
          options={{ headerShown: false }}
        />
      </RootStack.Navigator>
    </BrowseContext.Provider>
  );
};

export default BrowseNavigator;
