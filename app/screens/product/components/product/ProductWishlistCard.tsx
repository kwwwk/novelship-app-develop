import * as React from 'react';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { Trans } from '@lingui/macro';

import { ProductType } from 'types/resources/product';
import { Box, Text } from 'app/components/base';

import theme from 'app/styles/theme';
import ProductSectionHeading from './ProductSectionHeading';

const ProductWishListCard = ({
  product: { wishlist_active_count, wishlist_change_percentage },
}: {
  product: ProductType;
}) =>
  wishlist_active_count ? (
    <Box center>
      <ProductSectionHeading>
        <Trans>WISHLIST</Trans>
      </ProductSectionHeading>

      <Box center flexDirection="row">
        <Text fontFamily="bold" color="blue" fontSize={4}>
          {wishlist_active_count}
        </Text>
        {!!(wishlist_active_count && wishlist_change_percentage) && (
          <>
            <Ionicon
              name={wishlist_change_percentage > 0 ? 'trending-up-sharp' : 'trending-down-sharp'}
              size={22}
              color={theme.colors[wishlist_change_percentage > 0 ? 'green' : 'orange']}
              style={{ marginLeft: 4 }}
            />
            <Text
              color={wishlist_change_percentage > 0 ? 'green' : 'orange'}
              fontSize={2}
              fontFamily="medium"
              ml={2}
            >
              {wishlist_change_percentage > 0 && '+'}
              {wishlist_change_percentage}%
            </Text>
          </>
        )}
      </Box>
    </Box>
  ) : null;

export default ProductWishListCard;
