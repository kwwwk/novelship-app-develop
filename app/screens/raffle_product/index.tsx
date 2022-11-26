import React from 'react';
import { createStackNavigator, StackScreenProps, TransitionPresets } from '@react-navigation/stack';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { RaffleRoutes, RootRoutes } from 'types/navigation';
import RaffleProductCheckoutContext from './context';
import ProductAppHeader from '../product/components/product/ProductAppHeader';
import useRaffleProductContextValue from './hooks/useRaffleProductContextValue';
import RaffleProduct from './RaffleProduct';
import RaffleProductSizes from './RaffleProductSizes';
import RaffleProductReview from './RaffleProductReview';
import RaffleProductConfirmed from './RaffleProductConfirmed';
import useProductSizes from '../product/hooks/useProductSizes';

const RaffleProductStack = createStackNavigator<RaffleRoutes>();

const RaffleProductNavigator = ({
  route,
  navigation,
}: StackScreenProps<RootRoutes, 'RaffleProductStack'>) => {
  const raffleProductContextValue = useRaffleProductContextValue({ route, navigation });
  const raffleSizeContextValue = useProductSizes(raffleProductContextValue.raffleProduct.product);

  return (
    <RaffleProductCheckoutContext.Provider
      value={{ ...raffleProductContextValue, size: raffleSizeContextValue }}
    >
      <RaffleProductStack.Navigator
        screenOptions={{
          presentation: 'modal',
          header: (props) => <ProductAppHeader {...props} />,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
        <RaffleProductStack.Screen
          name="RaffleProduct"
          component={RaffleProduct}
          options={{
            ...TransitionPresets.ModalSlideFromBottomIOS,
            headerTitle: i18n._(t`NOVELSHIP RAFFLE`),
          }}
        />
        <RaffleProductStack.Screen
          name="RaffleProductSizes"
          component={RaffleProductSizes}
          options={{
            ...TransitionPresets.ModalSlideFromBottomIOS,
            headerTitle: i18n._(t`SELECT SIZE`),
          }}
        />
        <RaffleProductStack.Screen
          name="RaffleProductReview"
          component={RaffleProductReview}
          options={{ headerTitle: i18n._(t`REVIEW RAFFLE ENTRY`) }}
        />
        <RaffleProductStack.Screen
          name="RaffleProductConfirmed"
          component={RaffleProductConfirmed}
          options={{
            ...TransitionPresets.ModalSlideFromBottomIOS,
            headerTitle: i18n._(t`RAFFLE ENTRY CONFIRMED`),
          }}
        />
      </RaffleProductStack.Navigator>
    </RaffleProductCheckoutContext.Provider>
  );
};

export default RaffleProductNavigator;
