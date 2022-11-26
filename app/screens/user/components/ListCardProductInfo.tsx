import React from 'react';

import { Text, Box } from 'app/components/base';
import { ProductType } from 'types/resources/product';
import { BoxProps } from 'app/components/base/Box';
import { TransactionBuyerAddOnType } from 'types/resources/transactionBuyerAddOn';
import { Trans } from '@lingui/macro';

const ListCardProductInfo = ({
  product,
  size,
  addOnQuantity,
  addOns,
  ...props
}: {
  product: ProductType;
  size: string;
  addOnQuantity?: number;
  addOns?: TransactionBuyerAddOnType[];
} & BoxProps) => (
  <Box {...props}>
    <Text fontSize={1} fontFamily="medium" numberOfLines={2} lineHeight={14}>
      {size} / {product.name}
    </Text>
    {!!addOnQuantity &&
      addOns?.map((addOn, index) => (
        <Text mt={1} key={index} fontSize={0} numberOfLines={2} lineHeight={14}>
          <Trans>Add-On:</Trans> {addOn.quantity > 0 ? `${addOn.quantity} × ` : ''}
          {addOn.add_on_name}
        </Text>
      ))}
    {product.sku ? (
      <Text mt={1} mb={2} color="gray3" fontSize={0} fontFamily="regular">
        {product.sku}
      </Text>
    ) : (
      <Box my={2} />
    )}
  </Box>
);

export default ListCardProductInfo;
