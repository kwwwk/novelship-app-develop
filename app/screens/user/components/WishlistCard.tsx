import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { ButtonBase, Text, Box, Button } from 'app/components/base';
import { RootRoutes } from 'types/navigation';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import theme from 'app/styles/theme';
import { useStoreState } from 'app/store';
import LoadingIndicator from 'app/components/misc/LoadingIndicator';
import { UserWishlistType } from 'types/resources/wishlist';
import { useMutation } from 'react-query';
import API from 'common/api';
import { t, Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { getBuyerDeliveryInstantFee } from 'common/utils/buy';
import ListCardProductImage from './ListCardProductImage';
import ListCardProductInfo from './ListCardProductInfo';

const WishlistCard = ({ item, refetch }: { item: UserWishlistType; refetch: () => void }) => {
  const { $, toList, $toList, $toOffer } = useCurrencyUtils();
  const currencyCode = useStoreState((s) => s.currency.current.code);
  const user = useStoreState((s) => s.user.user);
  const navigation = useNavigation<StackNavigationProp<RootRoutes, 'ProductStack'>>();

  const instantDeliveryFee = getBuyerDeliveryInstantFee(user);

  const { mutate: deleteItem, isLoading } = useMutation<UserWishlistType, unknown>(
    () => API.put('me/wishlist/', { product_id: item.product_id, size: item.size }),
    { onSettled: () => refetch() }
  );

  const RightSwipeActions = () => (
    <ButtonBase onPress={() => deleteItem()}>
      <Box center minWidth={120} bg="red" justifyContent="center" flex={1}>
        {isLoading ? (
          <Box center p={5}>
            <LoadingIndicator color={theme.colors.white} />
          </Box>
        ) : (
          <Box center>
            <Ionicon name="ios-trash-outline" size={22} color={theme.colors.white} />
            <Text
              color="white"
              px={8}
              fontSize={1}
              fontFamily="bold"
              letterSpacing={theme.constants.LETTER_SPACINGS_BUTTON_TEXT}
            >
              <Trans>DELETE</Trans>
            </Text>
          </Box>
        )}
      </Box>
    </ButtonBase>
  );

  const lowestList = item.product_stat?.lowest_list_price;
  const highestOffer = item.product_stat?.highest_offer_price;
  const instantListPrice = item.product_stat?.instant_list_price
    ? toList(item.product_stat?.instant_list_price || 0) + instantDeliveryFee
    : 0;
  const lastSalePrice = item.product_stat?.last_sale_price;

  return (
    <Swipeable renderRightActions={RightSwipeActions} overshootRight={false}>
      <Box
        flex={1}
        px={5}
        pt={4}
        pb={3}
        flexDirection="row"
        bg="white"
        style={{ borderBottomColor: theme.colors.dividerGray, borderBottomWidth: 1 }}
      >
        <Box mr={4}>
          <ListCardProductImage product={item.product} />
        </Box>

        <Box flexDirection="row" justifyContent="space-between" flex={1}>
          <Box flex={1}>
            <ListCardProductInfo product={item.product} size={item.local_size} />
            <Box
              px={1}
              py={1}
              flexDirection="row"
              justifyContent="space-evenly"
              borderRadius={4}
              style={{ borderColor: theme.colors.gray7, borderWidth: 1 }}
            >
              <Box center width="50%">
                <Text color="gray3" fontSize={0}>
                  <Trans>Highest Offer</Trans>
                </Text>
                <Text fontSize={currencyCode === 'IDR' ? 0 : 11} fontFamily="bold">
                  {highestOffer ? $toOffer(highestOffer) : '--'}
                </Text>
              </Box>

              <Box width={1} bg="gray7" />

              <Box center width="50%">
                <Text color="gray3" fontSize={0}>
                  <Trans>Lowest List</Trans>
                </Text>
                <Text fontSize={currencyCode === 'IDR' ? 0 : 11} fontFamily="bold">
                  {lowestList ? $toList(lowestList) : '--'}
                </Text>
              </Box>
            </Box>
            <Box
              mt={1}
              px={1}
              py={1}
              flexDirection="row"
              justifyContent="space-evenly"
              borderRadius={4}
              style={{ borderColor: theme.colors.gray7, borderWidth: 1 }}
            >
              <Box center width="50%">
                <Text color="gray3" fontSize={0}>
                  <Trans>Last Sale</Trans>
                </Text>
                <Text color="blue" fontSize={currencyCode === 'IDR' ? 0 : 11} fontFamily="bold">
                  {lastSalePrice ? $toOffer(lastSalePrice) : '--'}
                </Text>
              </Box>

              <Box width={1} bg="gray7" />

              <Box center width="50%">
                <Text color="gray3" fontSize={0}>
                  <Trans>Instant Delivery</Trans>
                </Text>
                <Text color="green" fontSize={currencyCode === 'IDR' ? 0 : 11} fontFamily="bold">
                  {instantListPrice ? $(instantListPrice) : '--'}
                </Text>
              </Box>
            </Box>
          </Box>
          <Box width="32%" ml={4} justifyContent="space-between">
            <Box mt={2}>
              <Button
                variant="black"
                size="xs"
                text={i18n._(t`BUY`)}
                onPress={() =>
                  navigation.navigate('ProductStack', {
                    slug: item.product.name_slug,
                    screen: 'Sizes',
                    params: { flow: 'buy' },
                  })
                }
              />
              <Box mt={2}>
                <Button
                  variant="white"
                  size="xs"
                  text={i18n._(t`MAKE OFFER`)}
                  onPress={() =>
                    navigation.navigate('ProductStack', {
                      slug: item.product.name_slug,
                      screen: 'MakeOffer',
                      params: { size: item.size, offer_list_id: 'offer' },
                    })
                  }
                />
              </Box>
              <Box mt={2}>
                <Button
                  variant="white"
                  size="xs"
                  text={i18n._(t`MAKE LIST`)}
                  onPress={() =>
                    navigation.navigate('ProductStack', {
                      screen: 'MakeList',
                      slug: item.product.name_slug,
                      params: { size: item.size, offer_list_id: 'list' },
                    })
                  }
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Swipeable>
  );
};

export default WishlistCard;
