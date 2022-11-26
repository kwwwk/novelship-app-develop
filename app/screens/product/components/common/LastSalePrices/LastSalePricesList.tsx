import React, { useContext } from 'react';
import { toDate } from 'common/utils/time';

import { Box, Text } from 'app/components/base';
import ProductCheckoutContext from 'app/screens/product/context';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';

const LastSalePricesList: React.FunctionComponent = () => {
  const { $toList } = useCurrencyUtils();
  const {
    size: { getDisplaySize },
    lastSalesPricesForSize,
  } = useContext(ProductCheckoutContext);

  return (
    <Box center mt={3} mx={5}>
      <Box width="100%">
        {lastSalesPricesForSize.map((lastSale, i) => (
          <Box
            flexDirection="row"
            justifyContent="space-between"
            borderBottomWidth={1}
            borderBottomColor="dividerGray"
            py={4}
            px={1}
            key={i}
          >
            <Text textAlign="left" fontSize={2} style={{ width: '34%' }}>
              {toDate(lastSale.created_at)}
            </Text>
            <Text
              textAlign="center"
              fontSize={2}
              fontFamily="medium"
              style={{ width: '33%' }}
              numberOfLines={1}
            >
              {getDisplaySize(lastSale.size).collatedTranslatedSize}
            </Text>
            <Text textAlign="right" fontSize={2} fontFamily="medium" style={{ width: '33%' }}>
              {$toList(lastSale.base_price)}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default LastSalePricesList;
