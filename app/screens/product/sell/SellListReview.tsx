import { ProductRoutes, RootRoutes } from 'types/navigation';
import { TransactionType } from 'types/resources/transaction';
import { OfferListType } from 'types/resources/offerList';
import { PromotionType } from 'types/resources/promotion';

import React, { useContext, useState } from 'react';
import { CommonActions, CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { t, Trans } from '@lingui/macro';
import { Alert } from 'react-native';
import { i18n } from '@lingui/core';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  SafeAreaScreenContainer,
  KeyboardAwareContainer,
  ScrollContainer,
  PageContainer,
  Footer,
} from 'app/components/layout';
import { getShippingFeePromotion, getSellerFeePromotion } from 'common/utils/sell';
import { mapOfferListLogDataForTracking } from 'app/services/analytics/utils';
import { Box, Button, ImgixImage, Text } from 'app/components/base';
import { useStoreState } from 'app/store';
import { canCreateList } from 'common/constants/transaction';
import { addressString } from 'common/utils/address';
import { cardString } from 'common/utils/payment';
import BuySellAlertMessage from 'app/components/widgets/BuySellAlertMessage';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import ConfirmDialog from 'app/components/dialog/ConfirmDialog';
import CheckBoxInput from 'app/components/form/CheckBox';
import Analytics from 'app/services/analytics';
import theme from 'app/styles/theme';
import API from 'common/api';

import ProductCheckoutContext from '../context';
import SellFromStorageTicker from '../../user/components/SellFromStorageTicker';
import ReviewProfileEditBar from '../components/common/ReviewProfileEditBar';
import ProductImageHeader from '../components/common/ProductImageHeader';
import TermsAndPrivacy from '../components/common/TermsAndPrivacy';
import SellListItems from '../components/sell/SellListItems';
import FollowSocial from '../components/common/FollowSocial';
import AddEmailBar from '../components/common/AddEmailBar';
import AddPhoneBar from '../components/common/AddPhoneBar';
import ListItem from '../components/common/ListItem';

type SellListReviewNavigationProp = CompositeNavigationProp<
  StackNavigationProp<ProductRoutes, 'SellReview'>,
  StackNavigationProp<RootRoutes, 'UserStack'>
>;

const SellListReview = ({ navigation }: { navigation: SellListReviewNavigationProp }) => {
  const {
    product,
    refetchOfferLists,
    offerLists,
    highLowOfferLists,
    lastSalesPricesForSize,
    sell: { sell },
  } = useContext(ProductCheckoutContext);

  const user = useStoreState((s) => s.user.user);
  const currencyCode = useStoreState((s) => s.currency.current.code);
  const [saving, setSaving] = useState<boolean>(false);
  const [confirmDialog, setConfirmDialog] = useState<boolean>(false);
  const [newCheck, setNewCheck] = useState<boolean>(false);
  const [shipCheck, setShipCheck] = useState<boolean>(false);

  const { $$ } = useCurrencyUtils();

  const { isList } = sell;
  const mode = isList ? 'List' : 'Sale';
  const canProceed = canCreateList(user) && newCheck && shipCheck;

  const sellPrice = sell.isList ? sell.local_price : sell.price;
  const sellerFeeArgs = {
    price: sellPrice,
    seller: user,
    product,
  };
  const shippingFeePromotion: PromotionType = getShippingFeePromotion({
    shippingFeeRegular: sell.fees.shippingFeeRegular,
    ...sellerFeeArgs,
  });
  const sellingFeePromotion = getSellerFeePromotion({
    isSellFromStorage: !!sell.sale_storage_ref,
    mode: sell.isList ? 'list' : 'sell',
    ...sellerFeeArgs,
  });
  const isShippingPromotionApplicable = !!shippingFeePromotion.id;
  const isSellingPromotionApplicable = !!sellingFeePromotion.id;

  const sellError = (error: string) => {
    setSaving(false);

    return Alert.alert(
      '',
      error,
      [
        {
          text: /vacation/i.test(error) ? 'OK' : 'RETRY',
          onPress: () => {
            refetchOfferLists();

            if (/vacation/i.test(error)) {
              return navigation.push('UserStack', { screen: 'Settings' });
            }
            return navigation.navigate('Sizes', { flow: 'sell' });
          },
        },
      ],
      { cancelable: false }
    );
  };

  const afterCreate = (item: OfferListType | TransactionType) => {
    setSaving(false);
    refetchOfferLists();
    Analytics.sellListConfirm(item, product, user, mode, 'Confirm', {
      Currency: currencyCode,
      ...mapOfferListLogDataForTracking({
        offerList: item as OfferListType,
        offerLists,
        highLowOfferLists,
        lastSalesPricesForSize,
      }),
    });
    if (isList) {
      return navigation.dispatch((state) => {
        const routes = [
          ...state.routes.slice(0, -2),
          { name: 'ConfirmedList', params: { id: item.id } },
        ];
        return CommonActions.reset({
          ...state,
          index: routes.length - 1,
          routes,
        });
      });
    }
    return navigation.replace('ConfirmedSale', { id: (item as TransactionType).ref });
  };

  const createList = () => {
    setSaving(true);
    const saveList = sell.isEdit
      ? API.put<OfferListType>(`me/offer-lists/list/${sell.id}`, sell)
      : API.post<OfferListType>('me/offer-lists/list', sell);

    return saveList.then(afterCreate).catch(sellError);
  };

  const createSell = () => {
    setSaving(true);
    return API.post<TransactionType>('me/sales/capture', sell).then(afterCreate).catch(sellError);
  };

  return (
    <SafeAreaScreenContainer>
      <KeyboardAwareContainer behavior="position">
        <ScrollContainer>
          {!user.country.selling_enabled && (
            <Box width="auto">
              <BuySellAlertMessage>
                <Text fontFamily="bold" fontSize={2} color="white" lineHeight={16} pr={3}>
                  <Trans>We are not available yet in your country for selling.</Trans>{' '}
                  <FollowSocial />
                </Text>
              </BuySellAlertMessage>
            </Box>
          )}
          {sell.sale_storage_ref && <SellFromStorageTicker />}

          <PageContainer>
            <ProductImageHeader product={product} />
            <SellListItems product={product} />

            <Box height={1} bg="dividerGray" mt={4} mb={3} />

            <AddPhoneBar user={user} />
            <AddEmailBar user={user} />

            <ReviewProfileEditBar
              label={i18n._(t`Shipping Address`)}
              infoPresent={addressString(user.shipping_address, user.shipping_country)}
              infoMissing={i18n._(t`Add Shipping address`)}
              isFilled={user.hasShippingAddress}
              formName="SellingForm"
              Icon={
                <MaterialCommunityIcon
                  name="home-outline"
                  size={20}
                  color={theme.colors.textBlack}
                />
              }
            />

            <ReviewProfileEditBar
              label={i18n._(t`Payment Info`)}
              infoPresent={cardString(user.stripe_seller)}
              infoMissing={i18n._(t`Add Payment Info`)}
              isFilled={user.hasSellCard}
              formName="SellingForm"
              Icon={
                <MaterialCommunityIcon
                  name="credit-card-outline"
                  size={20}
                  color={theme.colors.textBlack}
                />
              }
            />

            <ReviewProfileEditBar
              label={i18n._(t`Billing Address`)}
              infoPresent={addressString(user.selling_address, user.selling_country)}
              infoMissing={i18n._(t`Add Billing address`)}
              isFilled={user.hasSellingAddress}
              formName="SellingForm"
              Icon={
                <MaterialCommunityIcon
                  name="home-outline"
                  size={20}
                  color={theme.colors.textBlack}
                />
              }
            />

            <ReviewProfileEditBar
              label={i18n._(t`Payout Info`)}
              infoPresent={`${user.payout_info.account_number} at ${user.payout_info.bank_name}`}
              infoMissing={i18n._(t`Add Payout Info`)}
              isFilled={user.hasPayout}
              formName="SellingForm"
              Icon={
                <MaterialCommunityIcon
                  name="currency-usd"
                  size={20}
                  color={theme.colors.textBlack}
                />
              }
            />

            <TermsAndPrivacy />
          </PageContainer>
        </ScrollContainer>
      </KeyboardAwareContainer>

      <Footer>
        <Box style={{ marginBottom: -6 }}>
          <CheckBoxInput checked={newCheck} onChecked={setNewCheck}>
            <Text color="gray1" fontSize={13} lineHeight={15}>
              <Trans>My item is brand new and unworn</Trans>
            </Text>
          </CheckBoxInput>
        </Box>
        <Box style={{ marginTop: -6 }}>
          <CheckBoxInput checked={shipCheck} onChecked={setShipCheck}>
            <Text color="gray1" fontSize={13} lineHeight={15}>
              {!isList && (
                <Text color="gray1" fontSize={13} lineHeight={15}>
                  <Trans>I have the product on hand and</Trans>{' '}
                </Text>
              )}
              <Trans>Upon sale, I will ship out within 2 business days to avoid penalties</Trans>
            </Text>
          </CheckBoxInput>
        </Box>
        <Box>
          <Button
            variant="black"
            size="lg"
            text={isList ? i18n._(t`CONFIRM LIST`) : i18n._(t`CONFIRM SALE`)}
            loading={saving}
            disabled={!canProceed}
            onPress={() => setConfirmDialog(true)}
          />
        </Box>
      </Footer>

      {/* Dialogs */}

      <ConfirmDialog
        isOpen={confirmDialog}
        onClose={() => setConfirmDialog(false)}
        onConfirm={isList ? createList : createSell}
        title={isList ? i18n._(t`CONFIRM YOUR LIST`) : i18n._(t`CONFIRM YOUR SALE`)}
        confirmText={isList ? i18n._(t`CONFIRM LIST`) : i18n._(t`CONFIRM SALE`)}
      >
        <Box mt={6} mb={4} mx={2} width="100%">
          <ImgixImage src={product.image} height={50} width={200} style={{ alignSelf: 'center' }} />
          <Text textAlign="center" fontSize={2} fontFamily="medium" my={4} px={4}>
            {product.name}
          </Text>

          {isList && (
            <ListItem>
              <Text fontSize={2} fontFamily="medium" color="gray2">
                <Trans>List Expiration</Trans>
              </Text>
              <Text fontSize={2} fontFamily="bold">
                <Trans>{sell.expiration} Days</Trans>
              </Text>
            </ListItem>
          )}

          {sell.size !== 'OS' && (
            <ListItem>
              <Text fontSize={2} fontFamily="medium" color="gray2">
                <Trans>Size</Trans>
              </Text>
              <Text fontSize={2} fontFamily="bold">
                {sell.local_size}
              </Text>
            </ListItem>
          )}
          {!isList && (
            <ListItem>
              <Text fontSize={2} fontFamily="medium" color="gray2">
                <Trans>Product Price</Trans>
              </Text>
              <Text fontSize={2} fontFamily="bold">
                {$$(sell.local_price)}
              </Text>
            </ListItem>
          )}
          <ListItem>
            <Text fontSize={2} fontFamily="medium" color="gray2">
              <Trans>Total Payout</Trans>
            </Text>
            <Text fontSize={2} fontFamily="bold" color="blue">
              {$$(sell.totalPrice)}
            </Text>
          </ListItem>

          {(isShippingPromotionApplicable || isSellingPromotionApplicable) && sell.isList && (
            <ListItem>
              <Text fontSize={1} fontFamily="bold" textAlign="center">
                <Trans>
                  Reduced seller fee is only valid during the promotional period. Selling fee
                  discount will not apply after the promotion ends.
                </Trans>
              </Text>
            </ListItem>
          )}
        </Box>
      </ConfirmDialog>
    </SafeAreaScreenContainer>
  );
};

export default SellListReview;
