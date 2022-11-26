import { RootRoutes } from 'types/navigation';
import { ProductType } from 'types/resources/product';

import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/core';
import { Trans } from '@lingui/macro';

import { Box, ButtonBase, ImgixImage, Text } from 'app/components/base';
import { BoxProps } from 'app/components/base/Box';
import InstantAvailableIndicator from 'app/components/product/InstantAvailableIndicator';

const ProductImageHeader = ({
  product,
  size,
  showInstantDeliveryText,
  transactionRef,
  ...props
}: {
  product: ProductType;
  size?: string;
  showInstantDeliveryText?: boolean;
  transactionRef?: string;
} & BoxProps) => {
  const navigation = useNavigation<StackNavigationProp<RootRoutes, 'ProductStack'>>();

  return (
    <Box alignItems="center" flexDirection="row" {...props} minHeight={94}>
      <ButtonBase
        style={{ width: '25%', marginRight: '5%' }}
        onPress={() =>
          navigation.navigate('ProductStack', { screen: 'Product', slug: product.name_slug })
        }
      >
        <ImgixImage src={product.image} height={68} style={{ width: '100%' }} />
      </ButtonBase>
      <Box justifyContent="center" width="70%">
        <Text
          fontSize={3}
          fontFamily="medium"
          textTransform="uppercase"
          numberOfLines={2}
          lineHeight={18}
        >
          {product.name}
        </Text>

        {transactionRef ? (
          <Box>
            <Text mt={1} fontFamily="bold" fontSize={2} color="gray3" mr={6}>
              <Trans>Order #{transactionRef}</Trans>
            </Text>
          </Box>
        ) : (
          <Box flexDirection="row" flexWrap="wrap">
            {!!product.sku && (
              <Text mt={1} fontFamily="bold" fontSize={1} color="gray3" mr={6}>
                <Trans>SKU: {product.sku}</Trans>
              </Text>
            )}
            {!!size && size !== 'OS' && (
              <Text mt={1} fontFamily="bold" fontSize={1} color="gray3">
                <Trans>SIZE: {size}</Trans>
              </Text>
            )}
          </Box>
        )}
        {showInstantDeliveryText && (
          <InstantAvailableIndicator mt={2} isInstantAvailable={product.is_instant_available} />
        )}
      </Box>
    </Box>
  );
};

export default ProductImageHeader;
