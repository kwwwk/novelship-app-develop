import React, { useContext, useEffect, useState } from 'react';
import { RaffleRoutes, RootRoutes } from 'types/navigation';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { i18n } from '@lingui/core';
import { t, Trans } from '@lingui/macro';
import { CompositeNavigationProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';

import { Anchor, Box, Button, ButtonBase, Text } from 'app/components/base';
import { Footer, SafeAreaScreenContainer, ScrollContainer } from 'app/components/layout';
import Analytics from 'app/services/analytics';
import { useStoreState } from 'app/store';
import theme from 'app/styles/theme';
import getFaqLink from 'common/constants/faq';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProductImageHeader from '../product/components/common/ProductImageHeader';
import RaffleProductCheckoutContext from './context';

type SizesNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RaffleRoutes, 'RaffleProductSizes'>,
  StackNavigationProp<RootRoutes, 'ProductStack'>
>;

const RaffleProductSizes = ({ navigation }: { navigation: SizesNavigationProp }) => {
  const {
    raffleProduct,
    size: { getDisplaySize, preferredSize },
  } = useContext(RaffleProductCheckoutContext);

  const user = useStoreState((s) => s.user.user);
  const userId = user.id;
  const userSize = raffleProduct.product.is_sneaker ? user.sneakerSize : user.teeSize;

  const productSizes = raffleProduct.product.sizes.map((size) => {
    const { displaySize, defaultSize } = getDisplaySize(size);
    return { displaySize, defaultSize, size };
  });

  const hasDuplicateDisplaySizes = productSizes.some(
    ({ displaySize }, i) => productSizes.findIndex((ps) => ps.displaySize === displaySize) < i
  );

  const [selectedSize, setSelectedSize] = useState<string>('');

  const selectSize = (size: string) => {
    Analytics.raffleTrack('Size Select', raffleProduct);
    setSelectedSize(size);
  };

  const goToNextPageBuy = () => {
    if (!userId) {
      return navigation.navigate('AuthStack', { screen: 'SignUp' });
    }
    const params = { size: selectedSize };

    Analytics.raffleReviewConfirm('Review', raffleProduct, {
      Size: selectedSize,
      Price: raffleProduct.price,
    });
    return navigation.navigate('RaffleProductReview', { ...params });
  };

  useEffect(() => {
    if (preferredSize && raffleProduct.product.sizes.includes(preferredSize)) {
      setSelectedSize(preferredSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferredSize]);

  return (
    <SafeAreaScreenContainer>
      <BottomSheetModalProvider>
        <Box mt={4} px={5}>
          <Box alignItems="center" justifyContent="space-between" flexDirection="row">
            {(raffleProduct.product.class === 'Sneakers' ||
              (raffleProduct.product.is_apparel && user.id) ||
              raffleProduct.product.size_chart_url) &&
              (raffleProduct.product.size_chart_url ? (
                <Anchor
                  to={raffleProduct.product.size_chart_url}
                  fontSize={2}
                  color="blue"
                  fontFamily="bold"
                  textDecorationLine="underline"
                >
                  <Trans>SIZE CHART</Trans>
                </Anchor>
              ) : (
                <Text
                  onPress={() =>
                    navigation.navigate('ProductStack', {
                      screen: 'SizeChart',
                      slug: raffleProduct.product.name_slug,
                    })
                  }
                  fontSize={2}
                  color="blue"
                  fontFamily="bold"
                  textDecorationLine="underline"
                >
                  {user.id ? (
                    <>
                      <Trans>MY SIZE</Trans>
                      {userSize ? `: ${userSize}` : ''}
                    </>
                  ) : (
                    <Trans>SIZE CHART</Trans>
                  )}
                </Text>
              ))}
            <Anchor
              to={getFaqLink('buyers_guide')}
              fontSize={2}
              color="blue"
              fontFamily="bold"
              textDecorationLine="underline"
            >
              <Trans>BUYER GUIDE</Trans>
            </Anchor>
          </Box>
          <ProductImageHeader product={raffleProduct.product} mt={3} />
        </Box>

        <ScrollContainer>
          <Box px={5}>
            {productSizes.map(({ size, displaySize, defaultSize }) => {
              const isSelectedSizeCurrent = selectedSize === size;
              const _defaultSize =
                hasDuplicateDisplaySizes && displaySize !== defaultSize ? `(${defaultSize})` : '';

              return (
                <ButtonBase
                  key={size}
                  style={{ width: '100%' }}
                  onPress={() => selectSize(size)}
                  android_ripple={{ color: theme.colors.rippleGray }}
                >
                  <Box
                    center
                    mx={5}
                    height={68}
                    borderTopWidth={1}
                    borderColor="dividerGray"
                    flexDirection="row"
                  >
                    <Box style={{ marginLeft: -18 + -theme.spacing[3] }}>
                      {isSelectedSizeCurrent ? (
                        <MaterialCommunityIcon
                          name="check-bold"
                          size={18}
                          color={theme.colors.blue}
                        />
                      ) : (
                        <Box width={18} />
                      )}
                    </Box>
                    <Box flexDirection="column" ml={4}>
                      <Text
                        fontFamily="bold"
                        fontSize={3}
                        color={isSelectedSizeCurrent ? 'blue' : 'textBlack'}
                      >
                        {raffleProduct.product.is_one_size ? 'ONE SIZE' : displaySize}
                      </Text>
                      {!!_defaultSize && (
                        <Text fontSize={1} textAlign="center">
                          {_defaultSize}
                        </Text>
                      )}
                    </Box>
                  </Box>
                </ButtonBase>
              );
            })}
          </Box>
          <Box my={8} />
        </ScrollContainer>

        <Footer>
          <Box alignItems="center" justifyContent="space-between" flexDirection="row" pb={3}>
            {selectedSize ? (
              <>
                <Text fontFamily="bold" fontSize={2}>
                  <Trans>SELECTED</Trans>
                </Text>
                <Text fontFamily="bold" fontSize={2}>
                  {getDisplaySize(selectedSize).collatedTranslatedSize} &nbsp;{' '}
                </Text>
              </>
            ) : (
              <Text
                textAlign="center"
                color="gray3"
                fontFamily="medium"
                fontSize={2}
                style={{ width: '100%' }}
              >
                <Trans>SELECT A SIZE</Trans>
              </Text>
            )}
          </Box>

          <Box flexDirection="row" justifyContent="space-between" alignItems="center">
            <Button
              variant="black"
              size="lg"
              width="100%"
              text={i18n._(t`ENTER RAFFLE`)}
              disabled={!selectedSize}
              onPress={goToNextPageBuy}
            />
          </Box>
        </Footer>
      </BottomSheetModalProvider>
    </SafeAreaScreenContainer>
  );
};

export default RaffleProductSizes;
