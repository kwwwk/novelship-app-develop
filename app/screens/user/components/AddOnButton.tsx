import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { Button, ButtonProps } from 'app/components/base/Buttons';
import { RootRoutes } from 'types/navigation';
import { TransactionType } from 'types/resources/transaction';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';

const AddOnButton = ({
  sale,
  variant,
  size,
}: {
  sale: TransactionType;
  variant: ButtonProps['variant'];
  size: ButtonProps['size'];
}) => {
  const navigation = useNavigation<StackNavigationProp<RootRoutes>>();

  const deliverToStoragePurchased = sale.deliver_to === 'storage' && sale.is_delivery_paid;

  const postPurchaseConfirmURL = (ref: string) =>
    navigation.push('UserStack', {
      screen: 'PostPurchaseConfirmed',
      params: {
        sale_ref: ref,
      },
    });

  const addOnURL = (ref: string) =>
    sale.add_on_purchased && !deliverToStoragePurchased
      ? postPurchaseConfirmURL(ref)
      : navigation.push('UserStack', {
          screen: 'PostPurchase',
          params: { sale_ref: ref },
        });

  return sale.add_on_show ? (
    <Button
      variant={variant}
      width="100%"
      size={size}
      text={i18n._(t`ADD ON`)}
      onPress={() => addOnURL(sale.ref)}
    />
  ) : null;
};

export default AddOnButton;
