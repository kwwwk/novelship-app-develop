import {
  ShippingGenerateConfigType,
  ShippingMethodType,
  ShippingScreenType,
} from 'types/views/label-generation';
import { UserRoutes } from 'types/navigation';
import { TransactionSellerType } from 'types/resources/transactionSeller';

import React, { useState } from 'react';
import { RouteProp } from '@react-navigation/native';
import { useQuery } from 'react-query';

import { getAvailableShippingMethods } from 'common/constants/transaction';
import { useStoreState } from 'app/store';
import SelectShippingMethodScreen from './components/SelectShippingMethodScreen';
import ShippingConfirmScreen from './components/ShippingConfirmScreen';
import DropOffInfoScreen from './couriers/bluport';
import PickupInfoScreen from './components/PickupInfoScreen';

const Screens = ['shipping-method', 'pickup-info', 'drop-off-info', 'confirmation'];
type TransactionRouteProp = RouteProp<
  UserRoutes,
  'PurchaseDetails' | 'SaleDetails' | 'LabelGeneration'
>;

const initialTransaction = {
  status: 'pending',
  size: '',
  seller_country: {},
} as TransactionSellerType;

const LabelGeneration = ({ route }: { route: TransactionRouteProp }) => {
  const id = route.params.sale_ref;
  const mode = /Purchase/.test(route.name) ? 'buying' : 'selling';

  const { data: sale = initialTransaction, refetch } = useQuery<TransactionSellerType>(
    [`me/sales/${mode}/${id}`],
    { initialData: initialTransaction }
  );

  const sellerType = useStoreState((s) => s.user.user.seller_type);

  const shippingMethods = getAvailableShippingMethods(sale, sellerType);
  const shippingConfig = shippingMethods['seller-generate'] as ShippingGenerateConfigType;

  const isRearrange = sale.seller_courier === 'BLUPORT';
  const initShippingMethod = isRearrange ? 'drop-off' : shippingConfig.defaultMethod;
  const initCurrentScreen = (
    isRearrange ? Screens[2] : Screens[shippingConfig.startScreen]
  ) as ShippingScreenType;

  const [shippingMethod, setShippingMethod] = useState<ShippingMethodType>(initShippingMethod);
  const [currentScreen, setCurrentScreen] = useState<ShippingScreenType>(initCurrentScreen);

  if (shippingConfig.method !== 'seller-generate') return null;

  return (
    <>
      {currentScreen === 'shipping-method' ? (
        <SelectShippingMethodScreen
          sale={sale}
          config={shippingConfig}
          shippingMethod={shippingMethod}
          setShippingMethod={setShippingMethod}
          setCurrentScreen={setCurrentScreen}
        />
      ) : currentScreen === 'drop-off-info' ? (
        <DropOffInfoScreen sale={sale} setCurrentScreen={setCurrentScreen} />
      ) : currentScreen === 'pickup-info' ? (
        <PickupInfoScreen sale={sale} config={shippingConfig} setCurrentScreen={setCurrentScreen} />
      ) : (
        <ShippingConfirmScreen
          sale={sale}
          config={shippingConfig}
          shippingMethod={shippingMethod}
          refetch={refetch}
        />
      )}
    </>
  );
};

export default LabelGeneration;
