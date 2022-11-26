import { ProductRoutes, RootRoutes } from 'types/navigation';

import React, { useContext } from 'react';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { i18n } from '@lingui/core';
import { Trans, t } from '@lingui/macro';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { Footer, SafeAreaScreenContainer, ScrollContainer } from 'app/components/layout';
import { Box, Button, ButtonBase, Text, ImgixImage } from 'app/components/base';
import { getBuyerDeliveryInstantFee } from 'common/utils/buy';
import { useStoreState } from 'app/store';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import theme from 'app/styles/theme';

import ProductCheckoutContext from './context';
import ProductWishlistButton from './components/common/ProductWishlistButton';

type WishlistNavigationProp = CompositeNavigationProp<
  StackNavigationProp<ProductRoutes, 'SizesWishlist'>,
  StackNavigationProp<RootRoutes, 'UserStack'>
>;

const ProductSizeWishlist = ({ navigation }: { navigation: WishlistNavigationProp }) => {
  const {
    product,
    highLowOfferLists: { instant_lists, non_instant_lists },
    size: { getDisplaySize },
  } = useContext(ProductCheckoutContext);
  const { $, toList, $toList } = useCurrencyUtils();
  const user = useStoreState((s) => s.user.user);
  const instantDeliveryFee = getBuyerDeliveryInstantFee(user);
  const showHeader = navigation.getState()?.routes[0]?.name !== 'SizesWishlist';

  return (
    <SafeAreaScreenContainer>
      <Box my={5} px={5}>
        {showHeader && (
          <Box flexDirection="row" justifyContent="space-between" alignItems="center">
            <Box width={theme.constants.HEADER_ICON_SIZE} />
            <Text fontFamily="bold" fontSize={3}>
              <Trans>ADD TO WISHLIST</Trans>
            </Text>
            <Box>
              <ButtonBase
                onPress={() => navigation.goBack()}
                android_ripple={{ color: theme.colors.white, borderless: true }}
              >
                <Ionicon
                  name="ios-close"
                  size={theme.constants.HEADER_ICON_SIZE}
                  color={theme.colors.textBlack}
                />
              </ButtonBase>
            </Box>
          </Box>
        )}

        <Box center mt={4}>
          <ImgixImage src={product.image} width={140} height={80} />
          <Text
            fontSize={3}
            fontFamily="medium"
            textTransform="uppercase"
            textAlign="center"
            mt={5}
            px={1}
          >
            {product.name}
          </Text>
          {!!product.sku && (
            <Text mt={2} fontFamily="bold" fontSize={1} color="gray3">
              <Trans>SKU: {product.sku}</Trans>
            </Text>
          )}
          <Text mt={3} fontSize={1}>
            <Trans>Select your size to get notifications for price drops and restocks.</Trans>
          </Text>
        </Box>
      </Box>
      <ScrollContainer style={{ borderColor: theme.colors.borderLightGray, borderTopWidth: 1 }}>
        {product.sizes.map((size) => {
          const instantList = instant_lists[size] || {};
          const normalList = non_instant_lists[size] || {};
          const instantListWithInstantDeliveryFee = toList(instantList.price) + instantDeliveryFee;

          const { displaySize } = getDisplaySize(size);

          return (
            <Box key={size}>
              <Box
                flexDirection="row"
                borderBottomColor="borderLightGray"
                borderBottomWidth={1}
                alignItems="center"
                justifyContent="space-between"
                py={7}
                mx={6}
                px={3}
              >
                <Box flexDirection="row" center>
                  <Box width={75}>
                    <Text textAlign="left" fontFamily="bold" fontSize={3}>
                      {displaySize}
                    </Text>
                  </Box>
                  {instantList.id || normalList.id ? (
                    <Box flexDirection="row">
                      {normalList.id && (
                        <Text fontSize={3} fontFamily="bold" color="blue">
                          {$toList(normalList.price)}
                        </Text>
                      )}

                      {instantList.id && (
                        <Box flexDirection="row" alignItems="center" ml={4}>
                          <Ionicon name="flash-sharp" size={14} color={theme.colors.green} />
                          <Text
                            color="green"
                            fontSize={instantList.id && !normalList.id ? 3 : 2}
                            ml={1}
                            fontFamily="bold"
                          >
                            {$(instantListWithInstantDeliveryFee)}
                          </Text>
                        </Box>
                      )}
                    </Box>
                  ) : (
                    <Text fontFamily="bold" fontSize={2} color="gray5">
                      <Trans>NO LIST PRICE</Trans>
                    </Text>
                  )}
                </Box>
                <ProductWishlistButton mode="sizes" size={size} />
              </Box>
            </Box>
          );
        })}
      </ScrollContainer>
      <Footer>
        <Button
          variant="black"
          size="lg"
          text={user.id ? i18n._(t`VIEW MY WISHLIST`) : i18n._(t`LOG IN`)}
          onPress={() =>
            user.id
              ? navigation.navigate('UserStack', { screen: 'Wishlist' })
              : navigation.navigate('AuthStack', { screen: 'SignUp' })
          }
        />
      </Footer>
    </SafeAreaScreenContainer>
  );
};

export default ProductSizeWishlist;
