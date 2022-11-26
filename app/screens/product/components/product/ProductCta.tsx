import { ProductRoutes, RootRoutes } from 'types/navigation';

import React, { useContext } from 'react';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import { Trans } from '@lingui/macro';

import { Box, ButtonBase, Text } from 'app/components/base';
import { Footer } from 'app/components/layout';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import Analytics from 'app/services/analytics';
import theme from 'app/styles/theme';

import PayLaterPaymentMessage from '../common/PayLaterPaymentMessage';
import ProductCheckoutContext from '../../context';

type ProductNavigationProp = CompositeNavigationProp<
  StackNavigationProp<ProductRoutes, 'Product'>,
  StackNavigationProp<RootRoutes, 'AuthStack'>
>;

const ProductCta = () => {
  const { product, highLowOfferLists } = useContext(ProductCheckoutContext);
  const navigation = useNavigation<ProductNavigationProp>();
  const { $toList, $toOffer } = useCurrencyUtils();

  // similar to ProductSizes.tsx.goToNextPage()
  const goToNextPage = (mode: 'sell' | 'buy') => navigation.navigate('Sizes', { flow: mode });

  const buyPrice = highLowOfferLists.lowest_listing_price
    ? $toList(highLowOfferLists.lowest_listing_price)
    : '--';

  const sellPrice = highLowOfferLists.highest_offer_price
    ? $toOffer(highLowOfferLists.highest_offer_price)
    : '--';

  return (
    <Footer>
      <Box justifyContent="center" flexDirection="row" width="100%">
        {product.is_buy_now_only ? (
          <ButtonBase
            onPress={() => {
              goToNextPage('buy');
              Analytics.buyInitiate(product);
            }}
            android_ripple={{ color: theme.colors.white }}
            style={{
              backgroundColor: theme.colors.buttonBgBlack,
              marginLeft: 4,
              ...styles.buttonContainer,
              minWidth: '100%',
            }}
          >
            <Text fontSize={2} mb={1} fontFamily="medium" color="white">
              <Trans>BUY NOW</Trans>
            </Text>
            <Text fontSize={4} color="white" style={styles.buttonText}>
              {buyPrice}
            </Text>
          </ButtonBase>
        ) : (
          <>
            <ButtonBase
              onPress={() => {
                goToNextPage('sell');
                Analytics.sellInitiate(product);
              }}
              android_ripple={{ color: theme.colors.rippleGray }}
              style={{
                borderColor: theme.colors.buttonTextBlack,
                borderWidth: 2,
                marginRight: 4,
                ...styles.buttonContainer,
              }}
            >
              <Text fontSize={2} mb={1} fontFamily="medium" color="buttonTextBlack">
                <Trans>SELL/LIST</Trans>
              </Text>
              <Text fontSize={4} color="buttonTextBlack" style={styles.buttonText}>
                {sellPrice}
              </Text>
            </ButtonBase>

            <ButtonBase
              onPress={() => {
                goToNextPage('buy');
                Analytics.buyInitiate(product);
              }}
              android_ripple={{ color: theme.colors.white }}
              style={{
                backgroundColor: theme.colors.buttonBgBlack,
                marginLeft: 4,
                ...styles.buttonContainer,
              }}
            >
              <Text fontSize={2} mb={1} fontFamily="medium" color="white">
                <Trans>BUY/OFFER</Trans>
              </Text>
              <Text fontSize={4} color="white" style={styles.buttonText}>
                {buyPrice}
              </Text>
            </ButtonBase>
          </>
        )}
      </Box>
      <PayLaterPaymentMessage
        price={highLowOfferLists.lowest_listing_price || product.lowest_listing_price}
      />
    </Footer>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    height: 56,
    borderRadius: 4,
    minWidth: '48%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: theme.fonts.bold,
    textAlign: 'center',
    lineHeight: 20,
    letterSpacing: theme.constants.LETTER_SPACINGS_BUTTON_TEXT,
  },
});

export default ProductCta;
