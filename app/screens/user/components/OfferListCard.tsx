import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { i18n } from '@lingui/core';
import { RootRoutes } from 'types/navigation';
import { t, Trans } from '@lingui/macro';

import { Text, Box, Button } from 'app/components/base';
import { defaultProduct } from 'types/resources/product';
import { OfferListType } from 'types/resources/offerList';
import { expireIn } from 'common/utils/time';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import theme from 'app/styles/theme';
import ListCardProductImage from './ListCardProductImage';
import ListCardProductInfo from './ListCardProductInfo';

const OfferListCard = ({
  item,
  mode,
  selectCheckBox,
}: {
  item: OfferListType;
  mode: 'offer' | 'list';
  selectCheckBox?: React.ReactNode;
}) => {
  const { $toList, $toOffer, $ } = useCurrencyUtils(item.currency);
  const navigation = useNavigation<StackNavigationProp<RootRoutes, 'ProductStack'>>();

  if (!item.product) item.product = defaultProduct;

  const expiredText = expireIn(item.expired_at);
  const ll = item.product_stat?.lowest_list_price || 0;
  const ho = item.product_stat?.highest_offer_price || 0;
  const spread = item.product_stat?.price_spread;

  const gotoEdit = () =>
    navigation.navigate('ProductStack', {
      screen: item.type === 'buying' ? 'MakeOffer' : 'MakeList',
      slug: item.product.name_slug,
      params: {
        offer_list_id: item.id,
        size: item.size,
        price: item.local_price,
        edit: true,
      },
    });

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
      <Box style={{ width: selectCheckBox ? '90%' : '100%' }} flexDirection="row">
        <Box flex={1}>
          <Box flexDirection="row" justifyContent="space-between">
            <ListCardProductImage product={item.product} />
            <Box px={2} />
            <ListCardProductInfo product={item.product} size={item.local_size} flex={1} />
            <Box px={2} />
            <Box alignItems="flex-end">
              <Text fontSize={1} color="gray2" fontFamily="medium">
                {expiredText}
                {expiredText !== 'Expired' ? ` ${i18n._(t`left`)}` : ''}
              </Text>
              {mode === 'list' && (
                <Text mt={2} color="gray2" fontSize={1} fontFamily="regular">
                  <Trans>Stock x{item.stock_count}</Trans>
                </Text>
              )}
            </Box>
          </Box>

          <Box flexDirection="row" justifyContent="space-between">
            <Box
              px={3}
              py={3}
              flexDirection="row"
              justifyContent="space-between"
              borderRadius={4}
              style={{
                borderColor: theme.colors.dividerGray,
                borderWidth: 1,
              }}
              flex={0.96}
            >
              <Box center flex={3 / 10}>
                <Text color="gray3" fontSize={0}>
                  <Trans>Highest Offer</Trans>
                </Text>
                <Text mt={1} fontSize={0} fontFamily="medium">
                  {ho ? $toOffer(ho) : '--'}
                </Text>
              </Box>

              <Box width={1} bg="dividerGray" />

              <Box center flex={3 / 10}>
                <Text color="gray3" fontSize={0}>
                  <Trans>Lowest List</Trans>
                </Text>
                <Text mt={1} fontSize={0} fontFamily="medium">
                  {ll ? $toList(ll) : '--'}
                </Text>
              </Box>

              <Box width={1} bg="dividerGray" />

              <Box center flex={4 / 10}>
                <Text fontSize={0} color="gray3">
                  {mode === 'offer' ? <Trans>My Offer</Trans> : <Trans>My List</Trans>}
                  {!!spread && (
                    <>
                      <Text fontSize={0} color="gray3">
                        {' '}
                        /{' '}
                      </Text>
                      <Trans>Spread</Trans>
                    </>
                  )}
                </Text>
                <Text
                  mt={1}
                  fontSize={0}
                  fontFamily="medium"
                  color={
                    (mode === 'offer' && ho === item.price) ||
                    (mode === 'list' && ll === item.price)
                      ? 'green'
                      : 'red'
                  }
                >
                  {$(item.local_price)}
                  {spread && spread > 0 && [' ', '/', ' ', $toList(spread)]}
                </Text>
              </Box>
            </Box>

            <Box center>
              <Button
                text={i18n._(t`EDIT`)}
                variant="white"
                size="xs"
                width={38}
                onPress={gotoEdit}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default OfferListCard;
