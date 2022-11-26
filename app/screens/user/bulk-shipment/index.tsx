import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { BulkShipmentRoutes } from 'types/navigation';
import MakeBulkShipment from './MakeBulkShipment';
import BulkShipmentDetails from './BulkShipmentDetails';

const BulkShipmentStack = createStackNavigator<BulkShipmentRoutes>();

const BulkShipment = () => (
  <BulkShipmentStack.Navigator screenOptions={{ headerShown: false }}>
    <BulkShipmentStack.Screen name="MakeBulkShipment" component={MakeBulkShipment} />
    <BulkShipmentStack.Screen name="ConfirmedBulkShipment" component={BulkShipmentDetails} />
    <BulkShipmentStack.Screen name="ShipmentDetails" component={BulkShipmentDetails} />
  </BulkShipmentStack.Navigator>
);

export default BulkShipment;
