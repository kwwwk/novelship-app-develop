import React from 'react';
import { createStackNavigator, StackScreenProps, TransitionPresets } from '@react-navigation/stack';

import { RootRoutes, UserRoutes } from 'types/navigation';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';
import UserProfile from './profile';
import UserBuying from './buying';
import UserSelling from './selling';
import Posts from './posts';
import Settings from './settings';
import BuyingForm from './settings/BuyingForm';
import SellingForm from './settings/SellingForm';
import PasswordForm from './settings/PasswordForm';
import PhoneForm from './settings/PhoneForm';
import ProfileForm from './settings/ProfileForm';
import TransactionDetails from './transaction/TransactionDetails';
import LabelGeneration from './transaction/LabelGeneration';
import SalesList from './components/SalesList';
import Promotions from './promotions';
import PayoutRequest from './payout/PayoutRequest';
import PayoutHistory from './payout/PayoutHistory';
import UserAppHeader from './components/UserAppHeader';
import PushNotificationForm from './settings/PushNotificationForm';
import Wishlist from './wishlist';
import BulkShipment from './bulk-shipment';
import UserBulkListNavigator from './bulk-list';
import PostPurchase from './transaction/PostPurchase';
import StoreInStorage from './transaction/StoreInStorage';
import PostPurchaseConfirm from './transaction/PostPurchaseConfirmScreen';
import LoyaltyPointsStore from './loyalty-store';
import SizePreferencesForm from './settings/SizePreferencesForm';
import StoreInStorageConfirm from './transaction/StoreInStorageConfirmScreen';
import ProductLookbookFeed from './posts/PostDetails';
import PostEdit from './lookbook-post';

const UserStack = createStackNavigator<UserRoutes>();

const UserNavigator = ({ route }: StackScreenProps<RootRoutes, 'UserStack'>) => (
  <UserStack.Navigator
    screenOptions={{
      // @ts-ignore rn-navigation not supporting proper types
      header: (props) => <UserAppHeader {...props} />,
      headerMode: 'screen',
      ...TransitionPresets.SlideFromRightIOS,
    }}
  >
    <UserStack.Screen name="Profile" component={UserProfile} />
    <UserStack.Screen
      name="Buying"
      component={UserBuying}
      options={{ headerTitle: i18n._(t`BUYING`) }}
    />
    <UserStack.Screen
      name="Selling"
      component={UserSelling}
      options={{ headerTitle: i18n._(t`SELLING`) }}
    />
    <UserStack.Screen name="Posts" component={Posts} options={{ headerTitle: i18n._(t`POSTS`) }} />
    <UserStack.Screen
      name="PostDetails"
      component={ProductLookbookFeed}
      // @ts-ignore ignore
      options={{ headerTitle: i18n._(route.params?.params?.status || '') }}
    />
    <UserStack.Screen
      name="BulkShipment"
      component={BulkShipment}
      options={{ headerTitle: i18n._(t`SHIPMENT`) }}
    />
    <UserStack.Screen
      name="Storage"
      component={SalesList}
      options={{ headerTitle: i18n._(t`STORAGE`) }}
    />
    <UserStack.Screen
      name="PayoutRequest"
      component={PayoutRequest}
      options={{ headerTitle: i18n._(t`PAYOUT REQUEST`) }}
    />
    <UserStack.Screen
      name="PayoutHistory"
      component={PayoutHistory}
      options={{ headerTitle: i18n._(t`PAYOUT HISTORY`) }}
    />
    <UserStack.Screen
      name="PostPurchase"
      component={PostPurchase}
      options={{ headerTitle: i18n._(t`POST PURCHASE`) }}
    />
    <UserStack.Screen
      name="PostPurchaseConfirmed"
      component={PostPurchaseConfirm}
      options={{ headerTitle: i18n._(t`CONFIRMED`) }}
    />

    <UserStack.Screen
      name="StoreInStorage"
      component={StoreInStorage}
      options={{ headerTitle: i18n._(t`STORE IN STORAGE`) }}
    />
    <UserStack.Screen
      name="StoreInStorageConfirmed"
      component={StoreInStorageConfirm}
      options={{ headerTitle: i18n._(t`CONFIRMED`) }}
    />
    <UserStack.Screen
      name="PurchaseDetails"
      component={TransactionDetails}
      // @ts-ignore ignore
      options={{ headerTitle: i18n._(t`ORDER #${route.params?.params?.sale_ref}`) }}
    />
    <UserStack.Screen
      name="SaleDetails"
      component={TransactionDetails}
      // @ts-ignore ignore
      options={{ headerTitle: i18n._(t`SALE #${route.params?.params?.sale_ref}`) }}
    />
    <UserStack.Screen
      name="LabelGeneration"
      component={LabelGeneration}
      // @ts-ignore ignore
      options={{ headerTitle: i18n._(t`SALE #${route.params?.params?.sale_ref}`) }}
    />
    <UserStack.Screen name="Settings" component={Settings} />
    <UserStack.Screen
      name="BuyingForm"
      component={BuyingForm}
      options={{ headerTitle: i18n._(t`BUYING INFO`) }}
    />
    <UserStack.Screen
      name="SellingForm"
      component={SellingForm}
      options={{ headerTitle: i18n._(t`SELLING INFO`) }}
    />
    <UserStack.Screen
      name="ProfileForm"
      component={ProfileForm}
      options={{ headerTitle: i18n._(t`UPDATE PROFILE`) }}
    />
    <UserStack.Screen
      name="SizePreferencesForm"
      component={SizePreferencesForm}
      options={{ headerTitle: i18n._(t`UPDATE SIZE PREFERENCES`) }}
    />
    <UserStack.Screen
      name="PasswordForm"
      component={PasswordForm}
      options={{ headerTitle: i18n._(t`CHANGE PASSWORD`) }}
    />
    <UserStack.Screen
      name="PhoneForm"
      component={PhoneForm}
      options={{
        // @ts-ignore ignore
        headerTitle: route.params?.params?.edit
          ? i18n._(t`UPDATE PHONE NUMBER`)
          : i18n._(t`ADD PHONE NUMBER`),
      }}
    />
    <UserStack.Screen
      name="PushNotificationForm"
      component={PushNotificationForm}
      options={{ headerTitle: i18n._(t`NOTIFICATIONS`) }}
    />
    <UserStack.Screen
      name="Promotions"
      component={Promotions}
      options={{ headerTitle: i18n._(t`PROMOCODES`) }}
    />
    <UserStack.Screen
      name="LoyaltyPointsStore"
      component={LoyaltyPointsStore}
      options={{ headerTitle: i18n._(t`REDEEM POINTS`) }}
    />
    <UserStack.Screen
      name="Wishlist"
      component={Wishlist}
      options={{ headerTitle: i18n._(t`MY WISHLIST`) }}
    />
    <UserStack.Screen
      name="BulkListEditStack"
      component={UserBulkListNavigator}
      options={{ headerShown: false }}
    />
    <UserStack.Screen name="PostEditStack" component={PostEdit} options={{ headerShown: false }} />
  </UserStack.Navigator>
);

export default UserNavigator;
