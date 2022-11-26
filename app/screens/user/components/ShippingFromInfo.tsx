import React from 'react';

import { addressString } from 'common/utils/address';
import { useStoreState } from 'app/store';
import { TransactionSellerType } from 'types/resources/transactionSeller';
import { Text } from 'app/components/base';
import { Trans } from '@lingui/macro';
import { LB } from 'common/constants';

const ShippingFromInfo = ({ sale }: { sale: TransactionSellerType }) => {
  const user = useStoreState((s) => s.user.user);

  return (
    <Text fontSize={2} textAlign="center">
      <Text fontFamily="bold">
        <Trans>Ship From Address</Trans>
      </Text>
      {LB}
      {addressString(user.shipping_address, sale.seller_country)}
      {LB}
      {LB}
      <Text fontFamily="bold">
        <Trans>Shipper Particulars</Trans>
      </Text>
      {LB}
      Email: {user.email}
      {LB}
      Phone: {user.shipping_address.country_code || user.country_code}
      {user.shipping_address.phone || user.phone}
    </Text>
  );
};

export default ShippingFromInfo;
