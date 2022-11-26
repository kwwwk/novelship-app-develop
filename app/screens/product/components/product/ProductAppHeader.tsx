import React, { useContext } from 'react';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { StackHeaderProps } from '@react-navigation/stack';
import { RouteProp, useRoute } from '@react-navigation/native';

import theme from 'app/styles/theme';
import { Box, ButtonBase, Text } from 'app/components/base';
import { Header, HeaderBackButton } from 'app/components/layout';

import { ProductRoutes } from 'types/navigation';
import Analytics from 'app/services/analytics';
import ProductCheckoutContext from '../../context';
import ProductShareButton from '../common/ProductShareButton';
import DeleteOfferList from '../common/DeleteOfferList';
import ProductWishlistButton from '../common/ProductWishlistButton';

const ProductAppHeader = ({ navigation, options }: StackHeaderProps) => {
  const {
    product,
    refetchOfferLists,
    buy: { buy },
    sell: { sell },
  } = useContext(ProductCheckoutContext);
  const { headerTitle } = options;

  const route =
    useRoute<RouteProp<ProductRoutes, 'Product' | 'MakeList' | 'MakeOffer' | 'BuyReview'>>();
  const isConfirmedPage = route.name.includes('Confirmed');
  const isProductPage = route.name === 'Product';
  const isOfferUpdate = route.name === 'MakeOffer' && route.params?.edit;
  const isListUpdate = route.name === 'MakeList' && route.params?.edit;

  const isReviewPage = route.name === 'BuyReview';

  return (
    <Header>
      <Box flexDirection="row" justifyContent="space-between" width="100%">
        <Box width={theme.constants.HEADER_ICON_SIZE}>
          {!isConfirmedPage && (
            <HeaderBackButton
              onGoBack={isReviewPage ? () => Analytics.removeFromCart(product, buy) : undefined}
            />
          )}
        </Box>

        <Box center width={headerTitle ? '75%' : '60%'}>
          <Text
            color="white"
            fontFamily="medium"
            textAlign="center"
            fontSize={3}
            letterSpacing={theme.constants.LETTER_SPACINGS_TEXT_TITLE}
            numberOfLines={1}
            textTransform="uppercase"
          >
            {headerTitle || ''}
          </Text>
        </Box>

        <Box width={theme.constants.HEADER_ICON_SIZE}>
          {isProductPage && <ProductShareButton product={product} />}
          {(isOfferUpdate || isListUpdate) && (
            <DeleteOfferList
              refetch={refetchOfferLists}
              offerList={isOfferUpdate ? buy : sell}
              buttonMode="icon"
            />
          )}
          {isConfirmedPage && (
            <ButtonBase
              onPress={() =>
                navigation.navigate('BottomNavStack', {
                  screen: 'HomeStack',
                  params: { screen: product.class },
                })
              }
              android_ripple={{ color: theme.colors.white, borderless: true }}
            >
              <Ionicon
                name="ios-close"
                size={theme.constants.HEADER_ICON_SIZE}
                color={theme.colors.white}
              />
            </ButtonBase>
          )}
        </Box>

        {isProductPage && (
          <Box width={theme.constants.HEADER_ICON_SIZE}>
            <ProductWishlistButton mode="header" />
          </Box>
        )}
      </Box>
    </Header>
  );
};

export default ProductAppHeader;
