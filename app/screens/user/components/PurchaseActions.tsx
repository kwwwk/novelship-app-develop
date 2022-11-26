import React from 'react';
import { Alert, Linking } from 'react-native';

import API from 'common/api';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { ButtonProps, Button } from 'app/components/base/Buttons';
import { RootRoutes } from 'types/navigation';
import { TransactionType } from 'types/resources/transaction';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { Box } from 'app/components/base';
import AddOnButton from './AddOnButton';
import ResellButton from './ResellButton';

const PurchaseActions = ({ sale }: { sale: TransactionType }) => {
  const navigation = useNavigation<StackNavigationProp<RootRoutes>>();

  const confirmDelivery = () => {
    API.put(`me/sales/${sale.ref}/confirm-delivery`).then(() => navigation.goBack());
  };

  const showDeliveryConfirmDialog = () =>
    Alert.alert(
      i18n._(t`Order Received`),
      i18n._(t`I confirm that I have received my order.`),
      [
        {
          text: i18n._(t`Dismiss`),
          style: 'cancel',
        },
        { text: i18n._(t`Confirm`), onPress: confirmDelivery },
      ],
      { cancelable: true }
    );

  const buttonsByStatus: Record<string, ButtonProps[]> = {
    in_storage: [
      {
        onPress: () =>
          navigation.navigate('ProductStack', {
            screen: 'DeliveryReview',
            slug: sale.product.name_slug,
            params: { sale_ref: sale.ref },
          }),
        variant: 'black',
        text: i18n._(t`DELIVER`),
      },
      {
        onPress: () =>
          navigation.navigate('ProductStack', {
            screen: 'MakeList',
            slug: sale.product.name_slug,
            params: { size: sale.size, sale_storage_ref: sale.ref, offer_list_id: 'list' },
          }),
        variant: 'black',
        text: i18n._(t`SELL FROM STORAGE`),
      },
    ],
    delivering: [
      {
        onPress: () => {
          const trackingLink = sale.buyer_courier_tracking_url;
          if (trackingLink) {
            Linking.openURL(trackingLink);
          }
        },
        variant: 'black',
        text: i18n._(t`TRACK DELIVERY`),
      },
      {
        onPress: showDeliveryConfirmDialog,
        variant: 'black',
        text: i18n._(t`CONFIRM DELIVERY`),
      },
    ],
    payment_failed: [
      {
        onPress: () =>
          navigation.navigate('ProductStack', {
            screen: 'Sizes',
            slug: sale.product.name_slug,
            params: { flow: 'buy' },
          }),
        variant: 'black',
        text: i18n._(t`TRY AGAIN`),
      },
    ],
    default: [
      {
        onPress: () =>
          navigation.navigate('ProductStack', {
            screen: 'Product',
            slug: sale.product.name_slug,
          }),
        variant: 'black',
        text: i18n._(t`BUY AGAIN`),
      },
    ],
  };

  const buttons: ButtonProps[] = buttonsByStatus[sale.status] || buttonsByStatus.default;

  if (!buttons.length) {
    return null;
  }

  return (
    <>
      {buttons.map((b: ButtonProps) => (
        <Button key={b.text} width="100%" style={{ marginBottom: 4 }} {...b} size="sm" />
      ))}
      <Box width="100%" mt={2}>
        <AddOnButton sale={sale} variant="black" size="sm" />
      </Box>
      <Box width="100%" mt={3}>
        <ResellButton sale={sale} variant="black" size="sm" />
      </Box>
    </>
  );
};

export default PurchaseActions;
