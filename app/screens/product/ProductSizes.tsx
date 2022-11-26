import React, { useContext, useState, useRef, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { ProductRoutes, RootRoutes } from 'types/navigation';

import { BottomSheetModalProvider, BottomSheetModal } from '@gorhom/bottom-sheet';
import { CompositeNavigationProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { t, Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { Footer, ScrollContainer, SafeAreaScreenContainer } from 'app/components/layout';
import { getHighLowOfferList } from 'common/utils/offerLists';
import { Anchor, Box, Button, ButtonBase, Text } from 'app/components/base';
import { getBuyerDeliveryInstantFee } from 'common/utils/buy';
import { useStoreState } from 'app/store';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import getFaqLink from 'common/constants/faq';
import Analytics from 'app/services/analytics';
import theme from 'app/styles/theme';

import ProductCheckoutContext from './context';
import BuyOfferBottomSheet from './buy/BuyOfferBottomSheet';
import ProductImageHeader from './components/common/ProductImageHeader';

type SizesNavigationProp = CompositeNavigationProp<
  StackNavigationProp<ProductRoutes, 'Sizes'>,
  StackNavigationProp<RootRoutes, 'AuthStack'>
>;
type ProductSizesRouteProp = RouteProp<ProductRoutes, 'Sizes'>;

const ProductSizes = ({
  route,
  navigation,
}: {
  navigation: SizesNavigationProp;
  route: ProductSizesRouteProp;
}) => {
  const {
    product,
    offerLists,
    highLowOfferLists,
    size: { getDisplaySize, preferredSize },
    buy: { buy },
    sell: { sell },
  } = useContext(ProductCheckoutContext);
  const user = useStoreState((s) => s.user.user);
  const userId = user.id;
  const userSize = product.is_sneaker ? user.sneakerSize : user.teeSize;

  const productSizes = product.sizes.map((size) => {
    const { displaySize, defaultSize } = getDisplaySize(size);
    return { displaySize, defaultSize, size };
  });
  const hasDuplicateDisplaySizes = productSizes.some(
    ({ displaySize }, i) => productSizes.findIndex((ps) => ps.displaySize === displaySize) < i
  );

  const { $, toList, toOffer } = useCurrencyUtils();

  const isSell = route.params.flow === 'sell';

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isCantBuyOwnShown, setIsCantBuyOwnShown] = useState<boolean>(false);

  const {
    instant_lists: lowestInstantLists,
    non_instant_lists: lowestNonInstantLists,
    offers: highestOffers,
  } = highLowOfferLists;
  const instantDeliveryFee = getBuyerDeliveryInstantFee(user);

  const { highestOfferPrice } = getHighLowOfferList(highLowOfferLists, selectedSize);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handlePresentModalPress = () => bottomSheetModalRef.current?.present();
  const handleDismissModalPress = () => bottomSheetModalRef.current?.dismiss();

  const ownOfferLists = offerLists.filter((ol) => ol.user_id && ol.user_id === userId);
  const ownOffers = ownOfferLists.filter((ol) => ol.type === 'buying');
  const ownLists = ownOfferLists.filter((ol) => ol.type === 'selling');

  const selectSize = (size: string, ownList: boolean) => {
    Analytics.sizeSelect(isSell ? 'sell' : 'buy', product);
    setIsCantBuyOwnShown(ownList);
    setSelectedSize(ownList ? '' : size);
  };

  const selectedSizeOfferPrice = selectedSize
    ? highestOffers[selectedSize] && toOffer(highestOffers[selectedSize].price)
    : 0;

  const selectedNormalList = lowestNonInstantLists[selectedSize] || {};
  const selectedInstantList = lowestInstantLists[selectedSize] || {};

  const goToNextPageBuy = ({
    _mode,
    size,
    listId,
    listPrice,
  }: {
    _mode: 'offer' | 'buy';
    size: string;
    listId: 'offer' | number;
    listPrice?: number;
  }) => {
    if (_mode === 'buy') {
      if (!userId) {
        return navigation.navigate('AuthStack', { screen: 'SignUp' });
      }
      Analytics.buyOfferConfirm(buy, product, 'Purchase', 'Review', {
        'Product Price': listPrice || 0,
        Size: selectedSize,
      });

      return navigation.navigate('BuyReview', {
        offer_list_id: listId,
      });
    }

    const ownOffer = ownOffers.find((o) => o.size === selectedSize);
    const params = {
      size: size || selectedSize,
      ...(ownOffer
        ? {
            offer_list_id: ownOffer.id,
            price: ownOffer.local_price,
            edit: true,
          }
        : {}),
    };

    return navigation.navigate('MakeOffer', { offer_list_id: 'offer', ...params });
  };

  const goToNextPageSell = (_mode: 'list' | 'sell' | 'consign') => {
    if (_mode === 'sell') {
      if (!userId) {
        return navigation.navigate('AuthStack', { screen: 'SignUp' });
      }
      const offer = highestOffers[selectedSize] || {};
      if (offer.id) {
        Analytics.sellListConfirm(sell, product, user, 'Sale', 'Review', {
          'Product Price': selectedSizeOfferPrice,
          Size: selectedSize,
        });
        return navigation.navigate('SellReview', { offer_list_id: offer.id });
      }
    }

    if (_mode === 'consign') {
      return navigation.navigate('ConsignReview', { size: selectedSize });
    }

    const ownList = ownLists.find((o) => o.size === selectedSize);
    const params = {
      size: selectedSize,
      ...(ownList
        ? {
            offer_list_id: ownList.id,
            price: ownList.local_price,
            edit: true,
          }
        : {}),
    };
    return navigation.navigate('MakeList', { offer_list_id: 'list', ...params });
  };

  useEffect(() => {
    if (preferredSize && product.sizes.includes(preferredSize)) {
      if (isSell) {
        const offer = highestOffers[preferredSize] || {};
        const ownOffer = user.id && user.id === offer.user_id;
        if (!ownOffer) {
          setSelectedSize(preferredSize);
        }
      } else {
        const normalList = lowestNonInstantLists[preferredSize] || {};
        const _instantList = lowestInstantLists[preferredSize] || {};
        const ownList =
          user.id && (user.id === normalList.user_id || user.id === _instantList.user_id);
        if (!ownList) {
          setSelectedSize(preferredSize);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferredSize]);

  return (
    <SafeAreaScreenContainer>
      <BottomSheetModalProvider>
        <Box mt={4} px={5}>
          <Box alignItems="center" justifyContent="space-between" flexDirection="row">
            {(product.class === 'Sneakers' ||
              (product.is_apparel && user.id) ||
              product.size_chart_url) &&
              (product.size_chart_url ? (
                <Anchor
                  to={product.size_chart_url}
                  fontSize={2}
                  color="blue"
                  fontFamily="bold"
                  textDecorationLine="underline"
                >
                  <Trans>SIZE CHART</Trans>
                </Anchor>
              ) : (
                <Text
                  onPress={() => navigation.navigate('SizeChart')}
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
              to={getFaqLink(isSell ? 'sellers_guide' : 'buyers_guide')}
              fontSize={2}
              color="blue"
              fontFamily="bold"
              textDecorationLine="underline"
            >
              {isSell ? <Trans>SELLER GUIDE</Trans> : <Trans>BUYER GUIDE</Trans>}
            </Anchor>
          </Box>
          <ProductImageHeader
            product={product}
            showInstantDeliveryText={!isSell && Object.keys(lowestInstantLists).length !== 0}
            mt={3}
          />
        </Box>

        <ScrollContainer>
          <Box px={5}>
            {productSizes.map(({ size, displaySize, defaultSize }) => {
              const offer = highestOffers[size] || {};
              const offerPrice = toOffer(offer.price);

              const normalList = lowestNonInstantLists[size] || {};
              const hasNormalList = !!normalList.id;
              const normalListPrice = toList(normalList.price);

              const instantList = lowestInstantLists[size] || {};
              const hasInstantList = !!instantList.id;
              const instantListWithInstantDeliveryFee =
                toList(instantList.price) + instantDeliveryFee;

              const ownOffer = user.id && user.id === offer.user_id;
              const ownList =
                user.id && (user.id === normalList.user_id || user.id === instantList.user_id);

              const isSelectedSizeCurrent = selectedSize === size;
              const _defaultSize =
                hasDuplicateDisplaySizes && displaySize !== defaultSize ? `(${defaultSize})` : '';

              return (
                <ButtonBase
                  key={size}
                  style={{ width: '100%' }}
                  onPress={() => {
                    selectSize(size, isSell ? !!ownOffer : !!ownList);
                    if (!isSell && !ownList) {
                      handlePresentModalPress();
                    }
                  }}
                  android_ripple={{ color: theme.colors.rippleGray }}
                >
                  <Box
                    center
                    mx={5}
                    height={72}
                    borderTopWidth={1}
                    borderColor="dividerGray"
                    flexDirection="row"
                  >
                    <Box
                      width="46%"
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      {isSell ? (
                        ownOffer ? (
                          <Box
                            borderWidth={1}
                            borderColor="textBlack"
                            borderRadius={15}
                            px={3}
                            py={1}
                          >
                            <Text fontSize={0} fontFamily="bold">
                              <Trans>YOUR OFFER</Trans>
                            </Text>
                          </Box>
                        ) : (
                          <Text>&nbsp;</Text>
                        )
                      ) : ownList ? (
                        <Box
                          borderWidth={1}
                          borderColor="textBlack"
                          borderRadius={15}
                          px={3}
                          py={1}
                        >
                          <Text fontSize={0} fontFamily="bold">
                            <Trans>YOUR LIST</Trans>
                          </Text>
                        </Box>
                      ) : (
                        <Text>&nbsp;</Text>
                      )}
                      <Box>
                        <Box flexDirection="row" alignItems="center" justifyContent="flex-end">
                          {isSelectedSizeCurrent && (
                            <MaterialCommunityIcon
                              name="check-bold"
                              size={18}
                              color={theme.colors.blue}
                            />
                          )}
                          <Text
                            textAlign="right"
                            fontFamily="bold"
                            ml={3}
                            fontSize={3}
                            color={isSelectedSizeCurrent ? 'blue' : 'textBlack'}
                          >
                            {product.is_one_size ? 'ONE SIZE' : displaySize}
                          </Text>
                        </Box>
                        {!!_defaultSize && (
                          <Text fontSize={2} textAlign="right">
                            {_defaultSize}
                          </Text>
                        )}
                      </Box>
                    </Box>
                    <Box width="50%" justifyContent="center" style={{ marginLeft: '4%' }}>
                      {isSell ? (
                        offerPrice ? (
                          <Text
                            fontSize={3}
                            fontFamily="bold"
                            color={isSelectedSizeCurrent ? 'blue' : 'red'}
                          >
                            {$(offerPrice)}
                          </Text>
                        ) : (
                          <Text
                            fontFamily="bold"
                            fontSize={2}
                            color={isSelectedSizeCurrent ? 'blue' : 'gray3'}
                          >
                            <Trans>MAKE LIST</Trans>
                          </Text>
                        )
                      ) : hasInstantList || hasNormalList ? (
                        <Box>
                          {hasNormalList && (
                            <Text
                              fontSize={3}
                              fontFamily="bold"
                              color={isSelectedSizeCurrent ? 'blue' : 'red'}
                            >
                              {$(normalListPrice)}
                            </Text>
                          )}

                          {hasInstantList && (
                            <Box flexDirection="row" alignItems="center">
                              <Ionicon name="flash-sharp" size={14} color={theme.colors.green} />
                              <Text
                                color="green"
                                fontSize={hasInstantList && !hasNormalList ? 3 : 2}
                                ml={1}
                                fontFamily="bold"
                              >
                                {$(instantListWithInstantDeliveryFee)}
                              </Text>
                            </Box>
                          )}
                        </Box>
                      ) : (
                        <Text
                          fontFamily="bold"
                          fontSize={2}
                          color={isSelectedSizeCurrent ? 'blue' : 'gray3'}
                        >
                          <Trans>MAKE OFFER</Trans>
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

        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={['75%', '75%']}
          style={styles.shadow}
        >
          <BuyOfferBottomSheet
            handleDismissModalPress={handleDismissModalPress}
            normalList={selectedNormalList}
            instantList={selectedInstantList}
            selectedSize={selectedSize}
            highestOfferPrice={highestOfferPrice}
            goToNextPageBuy={goToNextPageBuy}
          />
        </BottomSheetModal>

        {isCantBuyOwnShown && !isSell && (
          <Box alignItems="center" justifyContent="space-between" flexDirection="row" py={3}>
            <Text
              textAlign="center"
              color="red"
              fontFamily="bold"
              fontSize={2}
              style={{ width: '100%' }}
            >
              <Trans>You have selected your own List</Trans>
            </Text>
          </Box>
        )}

        {isSell && (
          <Footer>
            <Box alignItems="center" justifyContent="space-between" flexDirection="row" pb={3}>
              {selectedSize ? (
                <>
                  <Text fontFamily="bold" fontSize={2}>
                    <Trans>SELECTED</Trans>
                  </Text>
                  <Text fontFamily="bold" fontSize={2}>
                    {getDisplaySize(selectedSize).collatedTranslatedSize} &nbsp;{' '}
                    {$(selectedSizeOfferPrice)}
                  </Text>
                </>
              ) : isCantBuyOwnShown ? (
                <Text
                  textAlign="center"
                  color="red"
                  fontFamily="bold"
                  fontSize={2}
                  style={{ width: '100%' }}
                >
                  <Trans>You have selected your own Offer</Trans>
                </Text>
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
                variant="white"
                size="lg"
                width="49%"
                text={i18n._(t`MAKE LIST`)}
                disabled={!selectedSize}
                onPress={() => goToNextPageSell('list')}
              />
              <Button
                variant="black"
                size="lg"
                width="49%"
                text={userId ? i18n._(t`SELL NOW`) : i18n._(t`LOGIN TO SELL`)}
                disabled={!(!userId || selectedSizeOfferPrice)}
                onPress={() => goToNextPageSell('sell')}
              />
            </Box>
            {isSell &&
              user.seller_type === 'power-seller' &&
              user.shipping_country.selling_consignment_enabled && (
                <Box mt={3}>
                  <Button
                    variant="white"
                    size="lg"
                    width="100%"
                    text={i18n._(t`CONSIGNMENT`)}
                    disabled={!selectedSize}
                    onPress={() => goToNextPageSell('consign')}
                  />
                </Box>
              )}
          </Footer>
        )}
      </BottomSheetModalProvider>
    </SafeAreaScreenContainer>
  );
};

const styles = StyleSheet.create({
  shadow: {
    borderRadius: 14,
    shadowColor: '#000',
    shadowRadius: 10,
    shadowOpacity: 0.2,
    elevation: 24,
  },
});

export default ProductSizes;
