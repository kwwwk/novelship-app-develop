import { TrxnDeliverToType, TransactionType } from 'types/resources/transaction';
import { PaymentMethodEnumType } from 'types/resources/paymentMethod';
import { ProductRoutes, RootRoutes } from 'types/navigation';
import { OfferListType } from 'types/resources/offerList';
import { UserType } from 'types/resources/user';
import { Alert } from 'react-native';
import React, { useContext, useState, useEffect, useRef } from 'react';
import {
  CompositeNavigationProp,
  useLinkBuilder,
  CommonActions,
  RouteProp,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useConfirmPayment } from '@stripe/stripe-react-native';
import { t, Trans } from '@lingui/macro';
import { defaultPromocode } from 'types/resources/promocode';
import { i18n } from '@lingui/core';
import Toast from 'react-native-toast-message';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';

import {
  SafeAreaScreenContainer,
  KeyboardAwareContainer,
  ScrollContainer,
  PageContainer,
  Footer,
} from 'app/components/layout';
import { Anchor, Box, Button, ButtonBase, ImgixImage, Text } from 'app/components/base';
import { getRedirectToSchemeUrl, InAppBrowserOpen } from 'app/services/url';
import { cardString, paymentMethodString, PaymentRedirectResponseType } from 'common/utils/payment';
import { canBuyActions, SALE_STATUS_FAILED } from 'common/constants/transaction';
import { mapOfferListLogDataForTracking } from 'app/services/analytics/utils';
import API, { ERROR_MSG_DEFAULT } from 'common/api';
import { addressString } from 'common/utils/address';
import { useStoreState } from 'app/store';
import { fieldToTitle } from 'common/utils/string';
import { Radio } from 'app/components/form';
import { LB } from 'common/constants';
import BuySellAlertMessage from 'app/components/widgets/BuySellAlertMessage';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import ConfirmDialog from 'app/components/dialog/ConfirmDialog';
import LoadingScreen from 'app/components/misc/LoadingScreen';
import CheckBoxInput from 'app/components/form/CheckBox';
import FollowSocial from 'app/screens/product/components/common/FollowSocial';
import StorageIcon from 'app/components/icons/StorageIcon';
import getFaqLink from 'common/constants/faq';
import HintDialog from 'app/components/dialog/HintDialog';
import Analytics from 'app/services/analytics';
import theme from 'app/styles/theme';
import useOnUpdatedOnly from 'app/hooks/useOnUpdatedOnly';

import { CryptoValue } from 'app/components/widgets/Crypto';
import ProductCheckoutContext from '../context';
import DeliveryDeclaration from '../components/buy/DeliveryDeclaration';
import ProductImageHeader from '../components/common/ProductImageHeader';
import TermsAndPrivacy from '../components/common/TermsAndPrivacy';
import PromocodeButton from '../components/buy/PromocodeButton';
import BuyOfferItems from '../components/buy/BuyOfferItems';
import PaymentButton from '../components/buy/PaymentButton';
import AddPhoneBar from '../components/common/AddPhoneBar';
import AddEmailBar from '../components/common/AddEmailBar';
import ListItem from '../components/common/ListItem';
import BuyConfirmExitDialog from '../components/buy/BuyConfirmExitDialog';

type BuyOfferReviewNavigationProp = CompositeNavigationProp<
  StackNavigationProp<ProductRoutes, 'BuyReview'>,
  StackNavigationProp<RootRoutes, 'UserStack'>
>;
type BuyOfferReviewRouteProp = RouteProp<ProductRoutes, 'BuyReview'>;
const BuyOfferReview = ({
  navigation,
  route,
}: {
  navigation: BuyOfferReviewNavigationProp;
  route: BuyOfferReviewRouteProp;
}) => {
  const {
    product,
    refetchOfferLists,
    offerLists,
    highLowOfferLists,
    lastSalesPricesForSize,
    buy: {
      buy,
      paymentMethod,
      setPaymentMethod,
      deliverTo,
      setDeliveryTo,
      promocode: {
        currentPromocode,
        fetchApplicablePromocodes,
        setCurrentPromocode,
        verifyPromocode,
      },
      productAddOn,
    },
  } = useContext(ProductCheckoutContext);
  const user = useStoreState((s) => s.user.user);
  const getPaymentMethodBySlug = useStoreState((s) => s.base.getPaymentMethodBySlug);
  const currencyCode = useStoreState((s) => s.currency.current.code);

  const loyaltyMultiplierConfig = useStoreState((s) => s.base.promotionLoyaltyMultiplier);

  const { $$, toBaseCurrency } = useCurrencyUtils();
  const [saving, setSaving] = useState<boolean>(false);
  const [isPaymentValidating, setIsPaymentValidating] = useState<boolean>(false);
  const [dutyCheck, setDutyCheck] = useState<boolean>(false);
  const [confirmDialog, setConfirmDialog] = useState<boolean>(false);
  const [confirmExitDialog, confirmExitDialogToggle] = useState<boolean>(false);

  const { confirmPayment: confirmStripeWalletPayment } = useConfirmPayment();
  const linkBuilder = useLinkBuilder();

  const isInstantBuy = buy.instant_fee_applicable;
  const { isOffer } = buy;
  const mode = isOffer ? 'Offer' : 'Purchase';

  const loyaltyMultiplier = loyaltyMultiplierConfig.reduce((prev, curr) => {
    if (
      (curr.country_id === user.country_id || !curr.country_id) &&
      (curr.payment_method === buy.payment_method || !curr.payment_method) &&
      curr.multiplier > prev
    ) {
      // eslint-disable-next-line no-param-reassign
      prev = curr.multiplier;
    }
    return prev;
  }, 1);

  const exitNavigationAction = useRef(null);
  const confirmExitScreen = (e: any) => {
    if (['GO_BACK', 'POP'].includes(e?.data?.action?.type)) {
      confirmExitDialogToggle(true);
      e.preventDefault();
      exitNavigationAction.current = e;
    }
  };

  const canProceed =
    (paymentMethod === 'stripe' ? user.hasBuyCardAndEnabled : paymentMethod) &&
    canBuyActions(user) &&
    dutyCheck;

  const buyError = (error: string) => {
    setSaving(false);

    return Alert.alert(
      '',
      error,
      [
        {
          text: /vacation/i.test(error) ? i18n._(t`OK`) : i18n._(t`Continue`),
          onPress: () => {
            refetchOfferLists();

            if (/vacation/i.test(error)) {
              return navigation.push('UserStack', { screen: 'Settings' });
            }
            return navigation.navigate('Sizes', { flow: 'buy' });
          },
        },
      ],
      { cancelable: false }
    );
  };

  const afterCreate = (item: OfferListType | TransactionType | any) => {
    setSaving(false);
    refetchOfferLists();
    if (isOffer) {
      Analytics.buyOfferConfirm(item, product, mode, 'Confirm', {
        Promocode: currentPromocode?.code,
        Currency: currencyCode,
        ...mapOfferListLogDataForTracking({
          offerList: item as OfferListType,
          offerLists,
          highLowOfferLists,
          lastSalesPricesForSize,
        }),
      });
      return navigation.dispatch((state) => {
        const routes = [
          ...state.routes.slice(0, -2),
          { name: 'ConfirmedOffer', params: { id: item.id } },
        ];
        return CommonActions.reset({ ...state, index: routes.length - 1, routes });
      });
    }
    if (item.status === 'confirmed') {
      Analytics.buyOfferConfirm(item, product, mode, 'Confirm');
    }

    return navigation.replace('ConfirmedPurchase', { id: (item as TransactionType).ref });
  };

  const createOffer = () => {
    setSaving(true);
    const saveOffer = buy.isEdit
      ? API.put<OfferListType>(`me/offer-lists/offer/${buy.id}`, buy)
      : API.post<OfferListType>('me/offer-lists/offer', buy);

    return saveOffer.then(afterCreate).catch(buyError);
  };

  const confirmBuy = (ref: string) =>
    API.put<TransactionType>('me/sales/confirm', { ref }).then(afterCreate).catch(buyError);

  const createBuy = () => {
    setSaving(true);
    Analytics.initiateCheckout({ product, buy });
    const [payment_method, payment_installment] = paymentMethod.split('_:x:_');
    const _buy = {
      ...buy,
      payment_method,
      payment_installment,
      redirectUrl: getRedirectToSchemeUrl(
        linkBuilder(route.name, { ...route.params, payment_method }) as string
      ),
      addOns:
        productAddOn?.quantity > 0
          ? [{ count: productAddOn.quantity, id: productAddOn.addOn?.id }]
          : null,
    };

    const captureOrCreateBuy =
      paymentMethod === 'stripe'
        ? API.post<TransactionType>('me/sales/capture', _buy).then(afterCreate)
        : API.post<PaymentRedirectResponseType>('me/sales/create', _buy).then(
            ({ ref, charge = {} }) => {
              if (
                charge.client_secret &&
                charge.payment_method &&
                ['stripe_grabpay', 'stripe_alipay'].includes(charge.payment_method)
              ) {
                confirmStripeWalletPayment(charge.client_secret, {
                  type: charge.payment_method === 'stripe_alipay' ? 'Alipay' : 'GrabPay',
                }).then(() => confirmBuy(ref));
              } else if (charge.redirect) {
                InAppBrowserOpen(charge.redirect.url).then(() =>
                  validatePaymentSale(ref, payment_method)
                );
              }
            }
          );

    return captureOrCreateBuy.catch(buyError);
  };

  const validatePaymentSale = (ref: string, payment_method: PaymentMethodEnumType | string) => {
    const _paymentMethod = getPaymentMethodBySlug(payment_method as PaymentMethodEnumType);
    setIsPaymentValidating(true);
    if (_paymentMethod?.response === 'redirect') {
      confirmBuy(ref);
    } else if (_paymentMethod?.response === 'callback') {
      API.fetch<TransactionType>(`me/sales/buying/${ref}`).then((sale) => {
        if (SALE_STATUS_FAILED.includes(sale.status)) {
          return buyError(
            i18n._(
              t`Your order was declined by ${fieldToTitle(
                payment_method
              )}. Please try with other payment methods.`
            )
          );
        }
        return afterCreate(sale);
      });
    } else buyError(ERROR_MSG_DEFAULT);
  };

  const storageSwitchDialogToggle = () =>
    Alert.alert(
      i18n._(t`Switch to storage?`),
      i18n._(t`This will remove the Delivery Protection option you’ve added.`),
      [
        { text: i18n._(t`Dismiss`), style: 'cancel' },
        { text: i18n._(t`Confirm`), onPress: () => setDeliveryTo('storage') },
      ],
      { cancelable: true }
    );

  const setDeliveryMode = (value: TrxnDeliverToType) =>
    buy.buyer_delivery_declared && value === 'storage'
      ? storageSwitchDialogToggle()
      : setDeliveryTo(value);

  useEffect(() => {
    if (isOffer) {
      setPaymentMethod('stripe');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOffer]);

  const buyPrice = buy.isOffer ? buy.local_price : buy.price;

  useEffect(() => {
    fetchApplicablePromocodes(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buyPrice, buy.isOffer]);

  const trackOnce = useRef<boolean>(false);
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', confirmExitScreen);

    if (!trackOnce.current && buy.size) {
      API.post('misc/purchase-offer-drop-off-track', {
        product_id: product.id,
        size: buy.size,
        action: mode,
      });
      trackOnce.current = true;
    }

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buy.size]);

  useOnUpdatedOnly(() => {
    if (currentPromocode.code) {
      verifyPromocode(currentPromocode.code).catch((err) => {
        setCurrentPromocode(defaultPromocode);
        Toast.show({ type: 'default', text1: i18n._(err), position: 'bottom', bottomOffset: 120 });
        fetchApplicablePromocodes();
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buy.deliver_to, buy.payment_method]);

  if (isPaymentValidating) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaScreenContainer>
      <KeyboardAwareContainer behavior="position">
        <ScrollContainer>
          {!user.country.buying_enabled && (
            <Box width="auto">
              <BuySellAlertMessage>
                <Text fontFamily="bold" fontSize={2} color="white" lineHeight={16} pr={3}>
                  <Trans>We are not available yet in your country for buying.</Trans>{' '}
                  <FollowSocial />
                </Text>
              </BuySellAlertMessage>
            </Box>
          )}
          <PageContainer>
            <ProductImageHeader product={product} />
            <BuyOfferItems view="buy" product={product} />

            <Box height={1} bg="dividerGray" mt={3} mb={3} />

            <AddPhoneBar user={user} />
            <AddEmailBar user={user} />

            {user.country.buying_storage_enabled ? (
              <Radio.Group<TrxnDeliverToType> value={deliverTo} setValue={setDeliveryMode}>
                <Radio.Button value="buyer" my={3}>
                  <DeliverTo user={user} navigation={navigation} />
                </Radio.Button>
                <Radio.Button value="storage" my={3}>
                  <Box center flexDirection="row">
                    <MaterialCommunityIcon
                      name="package-variant-closed"
                      size={17}
                      color={theme.colors.textBlack}
                    />
                    <Text fontFamily="medium" ml={2}>
                      <Trans>Storage</Trans>
                    </Text>
                  </Box>
                  <Box style={{ flexDirection: 'row', marginLeft: 'auto' }}>
                    <HintDialog
                      hintContent={
                        <Box flexDirection="row" alignItems="center">
                          <Text fontSize={2} textAlign="right" mr={3}>
                            <Trans>Store your purchase{LB}at Novelship Storage</Trans>
                          </Text>
                          <Ionicon
                            name="information-circle"
                            size={22}
                            color={theme.colors.textBlack}
                          />
                        </Box>
                      }
                    >
                      <Box center p={2}>
                        <StorageIcon />
                        <Text my={4} fontSize={4} fontFamily="bold">
                          <Trans>What is Novelship Storage?</Trans>
                        </Text>
                        <Text textAlign="center" fontSize={2}>
                          <Trans>
                            Want to save space at home?
                            {LB}
                            Select Novelship Storage as your delivery option at checkout and we’ll
                            secure your product until you’re ready to receive.
                          </Trans>
                        </Text>
                        <Text mt={2}>
                          <Anchor
                            fontSize={2}
                            textDecorationLine="underline"
                            to={getFaqLink('storage')}
                          >
                            <Trans>Learn more</Trans>
                          </Anchor>
                        </Text>
                      </Box>
                    </HintDialog>
                  </Box>
                </Radio.Button>
              </Radio.Group>
            ) : (
              <ListItem>
                <DeliverTo user={user} navigation={navigation} />
              </ListItem>
            )}
            <DeliveryDeclaration />

            <Box height={1} bg="dividerGray" mt={2} mb={5} />

            <Box mt={5}>
              <PaymentButton
                currentPaymentMethod={paymentMethod}
                mode="buy"
                user={user}
                selectPayment={() =>
                  navigation.navigate('PaymentSelect', {
                    offer_list_id: buy.offer_list_id,
                    cardOnly: isOffer,
                  })
                }
              />
            </Box>

            <Box mt={3} mb={1}>
              <PromocodeButton
                selectPromocode={() => {
                  Analytics.buyPromoSelect(product, buy, currentPromocode);
                  navigation.navigate('PromocodeSelect', { ...route.params });
                }}
              />
            </Box>

            <Text fontSize={2} color="gray1" mt={3} ml={1}>
              {loyaltyMultiplier > 1 ? (
                <Trans>
                  Your NS points have been boosted by {loyaltyMultiplier}x to{' '}
                  <Text fontFamily="bold" fontSize={2} color="gray1">
                    {Math.ceil(buy.loyaltyPoints * loyaltyMultiplier)} loyalty points.{' '}
                  </Text>
                  (usually {buy.loyaltyPoints} NSP)
                </Trans>
              ) : (
                <Trans>
                  You will earn{' '}
                  <Text fontFamily="bold" fontSize={2} color="gray1">
                    {buy.loyaltyPoints} loyalty points{' '}
                  </Text>
                  upon successful purchase.
                </Trans>
              )}
            </Text>

            <TermsAndPrivacy />
          </PageContainer>
        </ScrollContainer>
      </KeyboardAwareContainer>

      <Footer>
        <CheckBoxInput checked={dutyCheck} onChecked={setDutyCheck}>
          <Text color="gray1" fontSize={13} lineHeight={15}>
            <Trans>
              I understand I am responsible for import duties, taxes and fees.{' '}
              <Anchor
                to={getFaqLink('duty_tax')}
                fontSize={13}
                textDecorationLine="underline"
                color="blue"
              >
                Learn more
              </Anchor>
            </Trans>
          </Text>
        </CheckBoxInput>
        <Box>
          <Button
            variant="black"
            size="lg"
            text={` ${isOffer ? i18n._(t`CONFIRM OFFER`) : i18n._(t`CONFIRM PURCHASE`)}`}
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
        onConfirm={isOffer ? createOffer : createBuy}
        title={isOffer ? i18n._(t`CONFIRM YOUR OFFER`) : i18n._(t`CONFIRM YOUR PURCHASE`)}
        confirmText={isOffer ? i18n._(t`CONFIRM OFFER`) : i18n._(t`CONFIRM PURCHASE`)}
      >
        <Box mt={6} mb={4} mx={2} width="100%">
          <ImgixImage src={product.image} height={50} width={200} style={{ alignSelf: 'center' }} />
          <Text textAlign="center" fontSize={2} fontFamily="medium" my={4} px={4}>
            {product.name}
          </Text>
          {buy.size !== 'OS' && (
            <ListItem>
              <Text fontSize={2} fontFamily="medium" color="gray2">
                <Trans>Size</Trans>
              </Text>
              <Text fontSize={2} fontFamily="bold">
                {buy.local_size}
              </Text>
            </ListItem>
          )}
          {productAddOn?.quantity > 0 && (
            <ListItem>
              <Text fontSize={2} fontFamily="medium" color="gray2">
                <Trans>Add-On</Trans>
              </Text>
              <Text fontSize={2} fontFamily="bold">
                {productAddOn.quantity} × {productAddOn.addOn?.name}
              </Text>
            </ListItem>
          )}
          {isOffer && (
            <>
              <ListItem>
                <Text fontSize={2} fontFamily="medium" color="gray2">
                  <Trans>Offer Price</Trans>
                </Text>
                <Text fontSize={2} fontFamily="bold">
                  {$$(buy.local_price)}
                </Text>
              </ListItem>
              <ListItem>
                <Text fontSize={2} fontFamily="medium" color="gray2">
                  <Trans>Offer Expiration</Trans>
                </Text>
                <Text fontSize={2} fontFamily="bold">
                  <Trans>{buy.expiration} Days</Trans>
                </Text>
              </ListItem>
            </>
          )}
          {!isOffer && (
            <ListItem>
              <Text fontSize={2} fontFamily="medium" color="gray2">
                <Trans>Payment Method</Trans>
              </Text>
              <Text fontSize={2} fontFamily="bold">
                {paymentMethod === 'stripe'
                  ? cardString(user.stripe_buyer)
                  : paymentMethodString(paymentMethod)}
              </Text>
            </ListItem>
          )}

          {!isOffer && (
            <ListItem>
              <Text fontSize={2} fontFamily="medium" color="gray2">
                {isInstantBuy ? <Trans>Ships Out In</Trans> : <Trans>Est. Delivery</Trans>}
              </Text>
              <Text fontSize={2} fontFamily="bold">
                {isInstantBuy ? (
                  <Trans>1-2 Work Days</Trans>
                ) : highLowOfferLists.lists[buy.size]?.is_pre_order ? (
                  <Trans>9-15 Work Days</Trans>
                ) : (
                  <Trans>5-9 Work Days</Trans>
                )}
              </Text>
            </ListItem>
          )}
          {deliverTo === 'storage' && (
            <ListItem>
              <Text fontSize={2} fontFamily="medium" color="gray2">
                <Trans>Deliver To</Trans>
              </Text>
              <Text fontSize={2} fontFamily="bold">
                <Trans>Novelship Storage</Trans>
              </Text>
            </ListItem>
          )}
          <ListItem>
            <Text fontSize={2} fontFamily="medium" color="gray2">
              <Trans>Total Payable</Trans>
            </Text>
            <Text fontSize={2} fontFamily="bold" color="blue">
              {$$(buy.totalPrice)}
            </Text>
          </ListItem>
          {paymentMethod.startsWith('triple-a') && (
            <ListItem>
              <Text fontSize={2} fontFamily="medium" color="gray2">
                <Trans>Pay By Crypto</Trans>
              </Text>
              <Text>
                <CryptoValue
                  priceSGD={toBaseCurrency(buy.totalPrice)}
                  crypto={paymentMethod}
                  fontSize={2}
                  color="blue"
                  fontFamily="bold"
                />
              </Text>
            </ListItem>
          )}
          {!!buy.buyer_delivery_declared && (
            <ListItem>
              <Text fontSize={2} fontFamily="medium" color="gray2">
                <Trans>Delivery Protection Value</Trans>
              </Text>
              <Text fontSize={2} fontFamily="bold">
                {$$(buy.buyer_delivery_declared)}
              </Text>
            </ListItem>
          )}
        </Box>
      </ConfirmDialog>

      <BuyConfirmExitDialog
        confirmExitDialog={confirmExitDialog}
        confirmExitDialogToggle={confirmExitDialogToggle}
        exitNavigationAction={exitNavigationAction}
      />
    </SafeAreaScreenContainer>
  );
};

const DeliverTo = ({
  user,
  navigation,
}: {
  user: UserType;
  navigation: BuyOfferReviewNavigationProp;
}) => (
  <>
    <Box center flexDirection="row">
      <MaterialCommunityIcon name="home-outline" size={18} color={theme.colors.textBlack} />
      <Text fontFamily="medium" ml={2}>
        <Trans>Deliver</Trans>
      </Text>
    </Box>
    <ButtonBase
      onPress={() => navigation.push('UserStack', { screen: 'BuyingForm' })}
      style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 'auto' }}
    >
      {user.hasDelivery ? (
        <Text fontSize={2} textAlign="right" mr={3} style={{ width: 170 }}>
          {addressString(user.address, user.country)}
        </Text>
      ) : (
        <Text fontSize={2} fontFamily="medium" color="red" mr={3}>
          <Trans>Add Delivery address</Trans>
        </Text>
      )}
      <MaterialCommunityIcon
        name="pencil"
        size={20}
        color={theme.colors[user.hasDelivery ? 'textBlack' : 'red']}
      />
    </ButtonBase>
  </>
);

export default BuyOfferReview;
