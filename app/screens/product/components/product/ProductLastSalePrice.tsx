import * as React from 'react';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { Trans } from '@lingui/macro';

import { ProductType } from 'types/resources/product';
import { Box, Text } from 'app/components/base';

import theme from 'app/styles/theme';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import ProductSectionHeading from './ProductSectionHeading';

const ProductLastSale = ({
  product: { last_sale_price, last_sale_price_2 },
}: {
  product: ProductType;
}) => {
  const { $toList } = useCurrencyUtils();

  const lastSalePricesDiff = last_sale_price - last_sale_price_2;
  let lastSalePricesDiffPercent: number | string =
    (lastSalePricesDiff / (last_sale_price_2 || 1)) * 100;
  lastSalePricesDiffPercent =
    (lastSalePricesDiffPercent < 1 && lastSalePricesDiffPercent > 0) ||
    (lastSalePricesDiffPercent < 0 && lastSalePricesDiffPercent > -1)
      ? lastSalePricesDiffPercent.toFixed(1)
      : Math.floor(lastSalePricesDiffPercent);

  return last_sale_price ? (
    <Box center>
      <ProductSectionHeading>
        <Trans>LAST SALE</Trans>
      </ProductSectionHeading>

      <Box center flexDirection="row">
        <Text
          textAlign={last_sale_price_2 ? 'right' : 'center'}
          fontFamily="bold"
          color="blue"
          fontSize={4}
        >
          {$toList(last_sale_price)}
        </Text>
        {!!(last_sale_price_2 && lastSalePricesDiff) && (
          <>
            <Ionicon
              name={lastSalePricesDiff > 0 ? 'trending-up-sharp' : 'trending-down-sharp'}
              size={22}
              color={theme.colors[lastSalePricesDiff > 0 ? 'green' : 'orange']}
              style={{ marginLeft: 4 }}
            />
            <Text
              color={lastSalePricesDiff > 0 ? 'green' : 'orange'}
              fontSize={2}
              fontFamily="medium"
              ml={2}
            >
              {lastSalePricesDiff > 0 ? '+' : !!lastSalePricesDiff && '-'}
              {$toList(Math.abs(lastSalePricesDiff))} ({lastSalePricesDiffPercent}%)
            </Text>
          </>
        )}
      </Box>
    </Box>
  ) : null;
};

export default ProductLastSale;
