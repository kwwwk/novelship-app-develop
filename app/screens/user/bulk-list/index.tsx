import React, { useState } from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';

import { BulkListRoutes } from 'types/navigation';
import BulkListContext, { BulkListEditType } from './context';
import BulkListConfirmed from './BulkListConfirmed';
import BulkListHeader from './components/BulkListHeader';
import BulkListReview from './BulkListReview';
import BulkListUpdate from './BulkListUpdate';

const BulkListEditStack = createStackNavigator<BulkListRoutes>();

const UserBulkListNavigator = () => {
  const [selectedListsId, setSelectedListsId] = useState<number[]>([]);
  const [editByValue, setEditByValue] = useState<number>(0);
  const [expiration, setExpiration] = useState<number>(30);
  const [editOption, setEditOption] = useState<BulkListEditType>('beatLowestListByValue');

  return (
    <BulkListContext.Provider
      value={{
        editByValue,
        editOption,
        expiration,
        selectedListsId,
        setEditByValue,
        setEditOption,
        setExpiration,
        setSelectedListsId,
      }}
    >
      <BulkListEditStack.Navigator
        screenOptions={{
          // @ts-ignore rn-navigation not supporting proper types
          header: (props) => <BulkListHeader {...props} />,
          headerMode: 'float',
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
        <BulkListEditStack.Screen
          name="BulkListUpdate"
          component={BulkListUpdate}
          options={{ headerTitle: i18n._(t`UPDATE LISTS`) }}
        />
        <BulkListEditStack.Screen
          name="BulkListReview"
          component={BulkListReview}
          options={{ headerTitle: i18n._(t`CONFIRM LISTS`) }}
        />
        <BulkListEditStack.Screen
          name="BulkListConfirmed"
          component={BulkListConfirmed}
          options={{ headerTitle: i18n._(t`LISTS CONFIRMED`) }}
        />
      </BulkListEditStack.Navigator>
    </BulkListContext.Provider>
  );
};

export default UserBulkListNavigator;
