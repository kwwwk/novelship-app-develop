import * as React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { SALE_STATUS_FAILED, getSaleStatus } from 'common/constants/transaction';
import { Text, Box, Button } from 'app/components/base';
import { defaultProduct } from 'types/resources/product';
import { RootRoutes } from 'types/navigation';
import { TransactionType } from 'types/resources/transaction';
import theme from 'app/styles/theme';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';
import ListCardProductImage from './ListCardProductImage';
import ListCardProductInfo from './ListCardProductInfo';
import AddOnButton from './AddOnButton';
import ResellButton from './ResellButton';

const PurchaseConfirmCard = ({ item, mode }: { item: TransactionType; mode: 'buy' | 'sell' }) => {
  const { $ } = useCurrencyUtils();
  const navigation = useNavigation<StackNavigationProp<RootRoutes, 'UserStack'>>();

  if (!item.product) item.product = defaultProduct;

  return (
    <Box
      flexDirection="row"
      center
      px={5}
      pt={3}
      pb={3}
      style={{ borderBottomColor: theme.colors.dividerGray, borderBottomWidth: 1 }}
    >
      <Box center mr={4}>
        <ListCardProductImage product={item.product} />
      </Box>

      <Box flex={1} flexDirection="row" justifyContent="space-between">
        <Box width="50%">
          <ListCardProductInfo
            product={item.product}
            size={item.local_size}
            addOnQuantity={item.add_on_quantity}
            addOns={item.add_ons}
          />
          <Text
            fontSize={1}
            textAlign="left"
            fontFamily="medium"
            color={SALE_STATUS_FAILED.includes(item.status) ? 'red' : 'green'}
          >
            {i18n._(getSaleStatus(item, mode))}
          </Text>
        </Box>
        <Box width="50%" alignItems="flex-end">
          <Text fontSize={2} fontFamily="bold" textAlign="center">
            {$(item.offer_price_local, item.buyer_currency)}
          </Text>

          <Box ml={4} mt={1} minWidth={100} maxWidth="72%">
            <Button
              variant="white"
              size="xs"
              text={i18n._(t`DETAILS`)}
              onPress={() =>
                navigation.push('UserStack', {
                  screen: 'PurchaseDetails',
                  params: { sale_ref: item.ref },
                })
              }
              mb={2}
            />
            <Box my={2}>
              <AddOnButton sale={item} variant="white" size="xs" />
            </Box>
            <Box>
              <ResellButton sale={item} variant="white" size="xs" />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PurchaseConfirmCard;
