import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { Button, ButtonProps } from 'app/components/base/Buttons';
import { RootRoutes } from 'types/navigation';
import { TransactionType } from 'types/resources/transaction';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';
import Analytics from 'app/services/analytics';

const ResellButton = ({
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

  const storeInStorageConfirmURL = (ref: string) =>
    navigation.push('UserStack', {
      screen: 'StoreInStorageConfirmed',
      params: {
        sale_ref: ref,
      },
    });

  const resellURL = (ref: string) => {
    Analytics.resellStorageClick(sale.product, sale.buyer_id);
    return deliverToStoragePurchased
      ? storeInStorageConfirmURL(ref)
      : navigation.push('UserStack', {
          screen: 'StoreInStorage',
          params: { sale_ref: ref },
        });
  };

  return sale.resell_show ? (
    <Button
      variant={variant}
      width="100%"
      size={size}
      fontSize={0}
      text={i18n._(t`RESELL/STORAGE`)}
      onPress={() => resellURL(sale.ref)}
    />
  ) : null;
};

export default ResellButton;
