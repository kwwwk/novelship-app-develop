import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { i18n } from '@lingui/core';
import { t, Trans } from '@lingui/macro';

import { useStoreState } from 'app/store';
import { Anchor, Box, Button, ButtonBase, Text } from 'app/components/base';
import getFaqLink from 'common/constants/faq';
import HintDialog from 'app/components/dialog/HintDialog';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import theme from 'app/styles/theme';
import { OfferListType } from 'types/resources/offerList';
import { getBuyerDeliveryInstantFee } from 'common/utils/buy';
import { LB } from 'common/constants';
import { CryptoAcceptedText } from 'app/components/widgets/Crypto';
import { InstantDeliveryInfoDialogContent } from '../components/common/InstantDeliveryInfoDialog';
import ProductCheckoutContext from '../context';

const BuyOfferBottomSheet = ({
  handleDismissModalPress,
  normalList,
  instantList,
  selectedSize,
  highestOfferPrice,
  goToNextPageBuy,
}: {
  handleDismissModalPress: () => void;
  normalList: OfferListType;
  instantList: OfferListType;
  selectedSize: string;
  highestOfferPrice: number;
  goToNextPageBuy: ({
    _mode,
    size,
    listId,
    listPrice,
  }: {
    _mode: 'offer' | 'buy';
    size: string;
    listId: 'offer' | number;
    listPrice?: number;
  }) => void;
}) => {
  const user = useStoreState((s) => s.user.user);
  const {
    product: { is_buy_now_only },
    size: { getDisplaySize },
  } = useContext(ProductCheckoutContext);
  const instantDeliveryFee = getBuyerDeliveryInstantFee(user);

  const { $, toList } = useCurrencyUtils();

  const hasList = !!normalList.id;
  const normalListPrice = hasList ? toList(normalList.price) : 0;

  const hasInstantList = !!instantList.id;
  const instantListWithInstantDeliveryFee = hasInstantList
    ? toList(instantList.price) + instantDeliveryFee
    : 0;

  const buyOptions: {
    id: 'offer' | number;
    type: 'offer' | 'normal' | 'instant';
    title: string;
    heading?: string;
    subHeading: string;
    ctaText: string;
    price: number;
  }[] = [
    {
      id: 'offer',
      type: 'offer',
      title: i18n._(t`Make highest offer`),
      subHeading: i18n._(t`Beat the competition with your best offer.`),
      ctaText: i18n._(t`MAKE OFFER`),
      price: highestOfferPrice,
    },
    {
      id: normalList.id,
      type: 'normal',
      title: i18n._(t`Buy Now (Regular)`),
      heading: i18n._(
        normalList.is_pre_order
          ? t`Est. Arrival in 9-15 working days`
          : t`Est. Arrival in 5-9 working days`
      ),
      subHeading: i18n._(t`Ships to Novelship first for verification.`),
      ctaText: user.id ? i18n._(t`BUY NOW`) : i18n._(t`LOGIN TO BUY`),
      price: normalListPrice,
    },
    {
      id: instantList.id,
      type: 'instant',
      title: i18n._(t`Buy Now (Instant Delivery)`),
      heading: i18n._(t`Ships out in 1-2 working days`),
      subHeading: i18n._(
        t`Pre verified with priority processing. Item will be shipped out in 1-2 working days.`
      ),
      ctaText: user.id ? i18n._(t`BUY NOW`) : i18n._(t`LOGIN TO BUY`),
      price: instantListWithInstantDeliveryFee,
    },
  ];
  if (!hasList && !hasInstantList) {
    buyOptions.splice(1, 2);
  }
  if (!hasList) {
    buyOptions.splice(1, 1);
  }

  if (!hasInstantList) {
    buyOptions.splice(2);
  }

  if (is_buy_now_only) {
    const index = buyOptions.findIndex((elem) => elem.type === 'offer');
    if (index > -1) buyOptions.splice(index, 1);
  }

  const hasBuy = hasList || hasInstantList;

  const renderItem = (item: {
    id: any;
    type: string;
    title: string;
    heading?: string;
    subHeading: string;
    ctaText: string;
    price: number;
  }) => (
    <Box
      key={item.type}
      flexDirection="row"
      justifyContent="space-between"
      borderBottomWidth={1}
      borderBottomColor="dividerGray"
      mt={6}
      mx={5}
    >
      <Box mb={4} width="64%">
        <Text fontFamily="bold" color={item.type === 'instant' ? 'green' : 'black2'}>
          {item.type === 'offer' ? $(item.price) || <Trans>NO OFFER</Trans> : $(item.price)}
        </Text>
        <Box flexDirection="row" alignItems="center" mt={2}>
          {item.type === 'normal' ? (
            <Text my={1} fontSize={1} textTransform="uppercase">
              {item.title}
            </Text>
          ) : (
            <HintDialog
              hintContent={
                <Box flexDirection="row" alignItems="center">
                  <Text
                    my={1}
                    fontSize={1}
                    textTransform="uppercase"
                    color={item.type === 'instant' ? 'green' : 'black2'}
                  >
                    {item.title}
                  </Text>
                  {item.type === 'instant' && (
                    <Ionicon name="flash-sharp" size={14} color={theme.colors.green} />
                  )}
                  <Box ml={1}>
                    <Ionicon name="information-circle" size={16} color={theme.colors.textBlack} />
                  </Box>
                </Box>
              }
            >
              {item.type === 'instant' ? (
                <InstantDeliveryInfoDialogContent instantDeliveryFee={$(instantDeliveryFee)} />
              ) : (
                <Box p={2}>
                  <Text textAlign="center" fontSize={4} fontFamily="bold">
                    <Trans>MAKE HIGHEST OFFER</Trans>
                  </Text>
                  <Text textAlign="center" fontSize={2} my={4}>
                    <Trans>
                      Making a highest offer will result in a bidding process between sellers who
                      are able to match your offer.{' '}
                      <Text mt={2}>
                        <Anchor
                          fontSize={2}
                          textDecorationLine="underline"
                          to={getFaqLink('offer_guide')}
                        >
                          Learn more
                        </Anchor>
                      </Text>
                      {LB}
                      {LB}
                      Choosing the ‘Buy Now’ option will instantly match you with the best priced
                      seller.
                    </Trans>
                  </Text>
                </Box>
              )}
            </HintDialog>
          )}
        </Box>
        {item.type !== 'offer' && (
          <Text my={2} fontSize={1} fontFamily="bold">
            {item.heading}
          </Text>
        )}
        <Text fontSize={1}>{item.subHeading}</Text>
      </Box>
      <Button
        variant={item.type === 'offer' ? 'white' : 'black'}
        size="sm"
        width="34%"
        text={item.ctaText}
        onPress={() =>
          item.type === 'offer'
            ? goToNextPageBuy({
                _mode: 'offer',
                size: selectedSize,
                listId: 'offer',
              })
            : goToNextPageBuy({
                _mode: 'buy',
                size: selectedSize,
                listId: item.id,
                listPrice: item.price,
              })
        }
      />
    </Box>
  );

  return (
    <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
      <Box flexDirection="row" justifyContent="space-between" style={styles.sectionHeaderContainer}>
        <Text fontSize={1} fontFamily="bold">
          <Trans>SIZE SELECTED</Trans>
          {LB}
          <Text fontSize={2}>{getDisplaySize(selectedSize).collatedTranslatedSize}</Text>
        </Text>
        <ButtonBase
          onPress={handleDismissModalPress}
          android_ripple={{ color: theme.colors.white, borderless: true }}
        >
          <Ionicon name="ios-close" size={30} color={theme.colors.black2} />
        </ButtonBase>
      </Box>
      {buyOptions.map(renderItem)}
      {hasBuy && (
        <Box px={5} mt={5}>
          <CryptoAcceptedText />
        </Box>
      )}
    </BottomSheetScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: '#fff',
  },
  sectionHeaderContainer: {
    backgroundColor: theme.colors.gray7,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
});

export default BuyOfferBottomSheet;
