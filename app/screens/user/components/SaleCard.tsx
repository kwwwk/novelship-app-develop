import * as React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { SALE_STATUS_FAILED, getPayoutStatus, getSaleStatus } from 'common/constants/transaction';
import { ButtonBase, Text, Box } from 'app/components/base';
import { defaultProduct } from 'types/resources/product';
import { RootRoutes } from 'types/navigation';
import { TransactionType } from 'types/resources/transaction';
import { toDate } from 'common/utils/time';
import theme from 'app/styles/theme';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import { i18n } from '@lingui/core';
import { Trans } from '@lingui/macro';
import { LB } from 'common/constants';
import ListCardProductImage from './ListCardProductImage';
import ListCardProductInfo from './ListCardProductInfo';

const SaleCard = ({
  item,
  mode,
  selectCheckBox,
}: {
  item: TransactionType;
  mode: 'buy' | 'sell';
  selectCheckBox?: React.ReactNode;
}) => {
  const { $ } = useCurrencyUtils();
  const navigation = useNavigation<StackNavigationProp<RootRoutes, 'UserStack'>>();

  const isSell = mode === 'sell';
  if (!item.product) item.product = defaultProduct;

  const statusColor = [...SALE_STATUS_FAILED, 'confirmed'].includes(item.status) ? 'red' : 'green';

  return (
    <Box
      flexDirection="row"
      center
      px={selectCheckBox ? 4 : 5}
      pt={4}
      pb={3}
      style={{ borderBottomColor: theme.colors.dividerGray, borderBottomWidth: 1 }}
    >
      {selectCheckBox}
      <ButtonBase
        onPress={() =>
          navigation.push('UserStack', {
            screen: mode === 'buy' ? 'PurchaseDetails' : 'SaleDetails',
            params: { sale_ref: item.ref },
          })
        }
        style={{ width: selectCheckBox ? '90%' : '100%' }}
      >
        <Box flexDirection="row" alignItems="center">
          <Box center mr={4}>
            <ListCardProductImage product={item.product} />
          </Box>

          <Box flex={1}>
            <Box flexDirection="row" justifyContent="space-between">
              <ListCardProductInfo product={item.product} size={item.local_size} width="50%" />

              <Box width="50%" alignItems="flex-end" justifyContent="space-between">
                <Box flexDirection="row-reverse" alignItems="center">
                  <Text fontSize={1} textAlign="right" fontFamily="medium" color={statusColor}>
                    {i18n._(getSaleStatus(item, mode))}
                    {i18n._(getPayoutStatus(item, mode)) && LB}
                    {i18n._(getPayoutStatus(item, mode))}
                  </Text>
                </Box>

                {isSell ? (
                  <Text mt={1} mb={2} color="gray3" fontSize={1} fontFamily="regular">
                    <Trans>Date: {toDate(String(item.created_at), 'DD/MM/YYYY')}</Trans>
                  </Text>
                ) : (
                  <Text mt={1} fontSize={2} textAlign="right" fontFamily="bold">
                    {item.type === 'consignment' ? (
                      <Trans>Consignment</Trans>
                    ) : (
                      $(item.offer_price_local, item.buyer_currency)
                    )}
                  </Text>
                )}
              </Box>
            </Box>

            {isSell && (
              <Box
                px={3}
                py={2}
                my={1}
                flexDirection="row"
                justifyContent="space-between"
                borderRadius={4}
                style={{
                  borderColor: theme.colors.dividerGray,
                  borderWidth: 1,
                }}
              >
                <Box center flex={1}>
                  <Text color="gray3" fontSize={0}>
                    <Trans>Sale Price</Trans>
                  </Text>
                  <Text
                    color="gray1"
                    fontSize={item.seller_currency.code === 'IDR' ? 0 : 1}
                    fontFamily="bold"
                  >
                    {item.type === 'consignment' ? (
                      <Trans>Consignment</Trans>
                    ) : (
                      $(item.list_price_local, item.seller_currency)
                    )}
                  </Text>
                </Box>

                <Box width={1} bg="dividerGray" />

                <Box center flex={1}>
                  <Text color="gray3" fontSize={0}>
                    <Trans>Payout</Trans>
                  </Text>
                  <Text
                    color="gray1"
                    fontSize={item.seller_currency.code === 'IDR' ? 0 : 1}
                    fontFamily="bold"
                  >
                    {item.type === 'consignment' ? (
                      <Trans>NA</Trans>
                    ) : (
                      $(item.payout_amount_local, item.seller_currency)
                    )}
                  </Text>
                </Box>
              </Box>
            )}
          </Box>

          <Box alignItems="flex-end" ml={1}>
            <Ionicon name="chevron-forward" size={24} color={theme.colors.textBlack} />
          </Box>
        </Box>
      </ButtonBase>
    </Box>
  );
};

export default SaleCard;
