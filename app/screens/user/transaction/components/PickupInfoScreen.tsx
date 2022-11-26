import { ShippingScreenType, ShippingGenerateConfigType } from 'types/views/label-generation';

import React from 'react';

import { TransactionSellerType } from 'types/resources/transactionSeller';
import NinjaVanPickupScreen from '../couriers/ninjavan';
import JanioPickupScreen from '../couriers/janio';
import GDEXPickupScreen from '../couriers/gdex';

const PickupInfoScreen = ({
  sale,
  config,
  setCurrentScreen,
}: {
  sale: TransactionSellerType;
  config: ShippingGenerateConfigType;
  setCurrentScreen: (_: ShippingScreenType) => void;
}) =>
  config.pickupCourier === 'NINJAVAN' ? (
    <NinjaVanPickupScreen sale={sale} setCurrentScreen={setCurrentScreen} />
  ) : config.pickupCourier === 'GDEX' ? (
    <GDEXPickupScreen sale={sale} setCurrentScreen={setCurrentScreen} />
  ) : config.pickupCourier === 'JANIO' ? (
    <JanioPickupScreen sale={sale} setCurrentScreen={setCurrentScreen} />
  ) : null;

export default PickupInfoScreen;
