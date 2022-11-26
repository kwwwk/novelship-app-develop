import React, { useEffect, useState } from 'react';
import { createStackNavigator, StackScreenProps, TransitionPresets } from '@react-navigation/stack';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';

import { navigationRef } from 'app/navigation';
import { ProductRoutes, RootRoutes } from 'types/navigation';

import Product from './Product';
import ProductSizes from './ProductSizes';
import ProductAppHeader from './components/product/ProductAppHeader';
import MakeOffer from './buy/MakeOffer';
import BuyOfferReview from './buy/BuyOfferReview';
import PaymentSelect from './buy/PaymentSelect';
import BuyOfferConfirmed from './buy/BuyOfferConfirmed';
import useProductContextValue from './hooks/useProductContextValue';
import ProductCheckoutContext from './context';
import useBuyContextValue from './hooks/useBuyContextValue';
import ProductSizeChart from './ProductSizeChart';
import DeliveryReview from './buy/DeliveryReview';
import useSellContextValue from './hooks/useSellContextValue';
import SellListConfirmed from './sell/SellListConfirmed';
import SellListReview from './sell/SellListReview';
import MakeList from './sell/MakeList';
import ProductSizeWishlist from './ProductSizeWishlist';
import ConsignReview from './sell/ConsignReview';
import useProductSizes from './hooks/useProductSizes';
import PromocodeSelect from './buy/PromocodeSelect';
import ProductLookbookFeed from './ProductLookbookFeed';

const ProductStack = createStackNavigator<ProductRoutes>();

const ProductNavigator = ({ route, navigation }: StackScreenProps<RootRoutes, 'ProductStack'>) => {
  const [params, setParams] = useState<Record<string, any>>(
    navigationRef.current?.getCurrentRoute()?.params || {}
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      setParams(navigationRef.current?.getCurrentRoute()?.params || {});
    });

    return unsubscribe;
  }, [navigation]);

  const productContextValue = useProductContextValue({ params, route, navigation });
  const sizeContextValue = useProductSizes(productContextValue.product);
  const buyContextValue = useBuyContextValue({
    params,
    ...productContextValue,
    getDisplaySize: sizeContextValue.getDisplaySize,
  });
  const sellContextValue = useSellContextValue({
    params,
    ...productContextValue,
    getDisplaySize: sizeContextValue.getDisplaySize,
  });

  return (
    <ProductCheckoutContext.Provider
      value={{
        ...productContextValue,
        buy: buyContextValue,
        sell: sellContextValue,
        size: sizeContextValue,
      }}
    >
      <ProductStack.Navigator
        screenOptions={{
          presentation: 'modal',
          header: (props) => <ProductAppHeader {...props} />,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
        <ProductStack.Screen name="Product" component={Product} />
        <ProductStack.Screen
          name="LookbookFeed"
          component={ProductLookbookFeed}
          options={{
            ...TransitionPresets.ModalSlideFromBottomIOS,
            headerTitle: i18n._(t`LOOKBOOK`),
          }}
        />
        <ProductStack.Screen
          name="Sizes"
          component={ProductSizes}
          options={{
            ...TransitionPresets.ModalSlideFromBottomIOS,
            headerTitle: i18n._(t`SELECT SIZE`),
          }}
        />
        <ProductStack.Screen
          name="SizeChart"
          component={ProductSizeChart}
          options={{
            ...TransitionPresets.ModalSlideFromBottomIOS,
            headerTitle: productContextValue.product.is_sneaker
              ? i18n._(t`${productContextValue.product.main_brand} SIZE CHART`)
              : i18n._(t`MY SIZE`),
          }}
        />
        <ProductStack.Screen
          name="SizesWishlist"
          component={ProductSizeWishlist}
          options={() => {
            const _params: any = navigation.getState()?.routes[1]?.params;
            const headerShown = _params?.screen === 'SizesWishlist';
            return {
              ...TransitionPresets.ModalPresentationIOS,
              headerTitle: headerShown ? i18n._(t`ADD TO WISHLIST`) : '',
              headerShown,
            };
          }}
        />

        {/* -- buy -- */}
        <ProductStack.Screen
          name="MakeOffer"
          component={MakeOffer}
          options={{ headerTitle: params.edit ? i18n._(t`UPDATE OFFER`) : i18n._(t`MAKE OFFER`) }}
        />
        <ProductStack.Screen
          name="BuyReview"
          component={BuyOfferReview}
          options={{
            headerTitle: params.size ? i18n._(t`REVIEW OFFER`) : i18n._(t`REVIEW PURCHASE`),
          }}
        />
        <ProductStack.Screen
          name="PaymentSelect"
          component={PaymentSelect}
          options={{ headerTitle: i18n._(t`SELECT PAYMENT`) }}
        />
        <ProductStack.Screen
          name="PromocodeSelect"
          component={PromocodeSelect}
          options={{
            ...TransitionPresets.ModalPresentationIOS,
            headerShown: false,
          }}
        />
        <ProductStack.Screen
          name="ConfirmedOffer"
          component={BuyOfferConfirmed}
          options={{ headerTitle: i18n._(t`OFFER CONFIRMED`) }}
        />
        <ProductStack.Screen
          name="ConfirmedPurchase"
          component={BuyOfferConfirmed}
          options={{ headerTitle: i18n._(t`PURCHASE CONFIRMED`) }}
        />

        {/* -- storage-delivery -- */}
        <ProductStack.Screen
          name="DeliveryReview"
          component={DeliveryReview}
          options={{ headerTitle: i18n._(t`REVIEW DELIVERY`) }}
        />
        <ProductStack.Screen
          name="ConfirmedDelivery"
          component={BuyOfferConfirmed}
          options={{ headerTitle: i18n._(t`DELIVERY CONFIRMED`) }}
        />

        {/* -- sell -- */}
        <ProductStack.Screen
          name="MakeList"
          component={MakeList}
          options={{ headerTitle: params.edit ? i18n._(t`UPDATE LIST`) : i18n._(t`MAKE LIST`) }}
        />
        <ProductStack.Screen
          name="SellReview"
          component={SellListReview}
          options={{ headerTitle: params.size ? i18n._(t`REVIEW LIST`) : i18n._(t`REVIEW SALE`) }}
        />
        <ProductStack.Screen
          name="ConsignReview"
          component={ConsignReview}
          options={{
            headerTitle: i18n._(t`REVIEW CONSIGNMENT`),
          }}
        />
        <ProductStack.Screen
          name="ConfirmedList"
          component={SellListConfirmed}
          options={{ headerTitle: i18n._(t`LIST CONFIRMED`) }}
        />
        <ProductStack.Screen
          name="ConfirmedSale"
          component={SellListConfirmed}
          options={{ headerTitle: i18n._(t`SALE CONFIRMED`) }}
        />
        <ProductStack.Screen
          name="ConfirmedConsignment"
          component={SellListConfirmed}
          options={{ headerTitle: i18n._(t`CONSIGNMENT CONFIRMED`) }}
        />
      </ProductStack.Navigator>
    </ProductCheckoutContext.Provider>
  );
};

export default ProductNavigator;
