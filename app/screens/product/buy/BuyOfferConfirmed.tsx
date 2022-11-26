import { defaultOfferList, OfferListType } from 'types/resources/offerList';
import { ProductRoutes, RootRoutes } from 'types/navigation';
import { TransactionType } from 'types/resources/transaction';

import React, { useContext, useEffect, useRef } from 'react';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQuery } from 'react-query';
import { t, Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';

import {
  Footer,
  PageContainer,
  ScrollContainer,
  SafeAreaScreenContainer,
} from 'app/components/layout';
import { ImgixImage, Text, Box, Button, ButtonBase } from 'app/components/base';
import { useStoreState } from 'app/store';
import { expireIn } from 'common/utils/time';
import { LB } from 'common/constants';
import AppStoreReviewPrompt from 'app/services/appStoreReviewPrompt';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import ConfirmationTick from 'app/components/icons/ConfirmationTick';

import { paymentMethodString } from 'common/utils/payment';
import Analytics from 'app/services/analytics';
import ProductCheckoutContext from '../context';
import ConfirmedPageWidgets from '../components/common/ConfirmedPageWidgets';
import ListItem from '../components/common/ListItem';

type ConfirmedRouteProp = RouteProp<ProductRoutes, 'ConfirmedPurchase' | 'ConfirmedOffer'>;
type ConfirmedNavigationProp = CompositeNavigationProp<
  StackNavigationProp<ProductRoutes, 'ConfirmedPurchase' | 'ConfirmedOffer' | 'ConfirmedDelivery'>,
  StackNavigationProp<RootRoutes, 'UserStack'>
>;

const BuyOfferConfirmed = ({
  navigation,
  route,
}: {
  navigation: ConfirmedNavigationProp;
  route: ConfirmedRouteProp;
}) => {
  const mode = route.name.split('Confirmed')[1] as 'Purchase' | 'Offer' | 'Delivery';
  const isBuyOrDelivery = /(Purchase|Delivery)/.test(mode);
  const { id } = route.params;

  const { product } = useContext(ProductCheckoutContext);
  const user = useStoreState((s) => s.user.user);
  const { $$: _$$ } = useCurrencyUtils();

  const interval = useRef<NodeJS.Timer | null>();
  const { data: item = defaultOfferList, refetch } = useQuery<OfferListType>(
    [`me/${isBuyOrDelivery ? 'sales/buying' : 'offer-lists'}/${id}`],
    { initialData: defaultOfferList }
  );

  const isPendingConfirm = (item as unknown as TransactionType).status === 'pending';

  const deliverToStorage = item.deliver_to === 'storage';
  const address = (item as unknown as TransactionType).delivery_address || user.address;
  address.country = (item as unknown as TransactionType).buyer_country || user.country;
  const currency =
    mode === 'Offer' ? item.currency : (item as unknown as TransactionType).buyer_currency;

  const $$ = (input: number) => _$$(input, currency);

  useEffect(() => {
    if (mode !== 'Delivery') {
      AppStoreReviewPrompt(mode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isPendingConfirm) {
      interval.current = setInterval(() => refetch(), 15e3);
    } else if (interval.current) {
      // interval.current will be set only isPendingConfirm was true before.
      // this ensures that the following event is only called once, and only once when pending sale is confirmed
      Analytics.buyOfferConfirm(item, product, 'Purchase', 'Confirm');
      clearInterval(interval.current);
    }

    return () => clearInterval(interval.current as NodeJS.Timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPendingConfirm]);

  const navigateToProductHome = () => {
    navigation.popToTop();
    navigation.navigate('Product');
  };

  return (
    <SafeAreaScreenContainer>
      <ScrollContainer>
        <PageContainer mt={4}>
          <Box borderBottomWidth={1} borderBottomColor="dividerGray" pb={4}>
            <Box center>
              <ConfirmationTick />
              <Text fontFamily="bold" textTransform="uppercase" mt={2} fontSize={3}>
                <Trans>Congratulations!</Trans>
              </Text>
            </Box>

            <Text textAlign="center" fontSize={2}>
              {mode === 'Purchase' &&
                (item.is_delivery_instant
                  ? i18n._(
                      t`Your purchase is processing.${LB}This product is pre-verified and ready to ship directly from Novelship.`
                    )
                  : i18n._(
                      t`Your purchase is processing.${LB}Once confirmed, seller will be notified and be instructed to Ship.`
                    ))}
              {mode === 'Offer' &&
                i18n._(
                  t`Your offer is confirmed.${LB}Now sit tight and wait for a seller to accept your offer.`
                )}
              {mode === 'Delivery' && i18n._(t`Your delivery is confirmed.`)}
            </Text>

            <ConfirmedPageWidgets
              mode={mode === 'Offer' ? 'offer' : 'buy'}
              navigation={navigation}
            />
          </Box>

          {isPendingConfirm && (
            <Box bg="gray7" py={2} px={3} mt={4} borderRadius={4}>
              <Text color="red" fontFamily="bold" fontSize={2} textAlign="center">
                <Trans>
                  Your payment from {paymentMethodString(item.payment_method)} is being verified.
                </Trans>
              </Text>
              <Text mt={1} color="red" fontSize={1} textAlign="center">
                <Trans>
                  Please wait between 10 to 20 minutes while we verify your payment with{' '}
                  {paymentMethodString(item.payment_method)}. You will be notified once the payment
                  and order is confirmed.
                </Trans>
              </Text>
            </Box>
          )}

          <Box mt={5}>
            <Text textAlign="center" fontFamily="bold" fontSize={4} mb={7}>
              {mode === 'Delivery' ? (
                <Trans>DELIVERY DETAILS</Trans>
              ) : mode === 'Offer' ? (
                <Trans>OFFER DETAILS</Trans>
              ) : (
                <Trans>PURCHASE DETAILS</Trans>
              )}
            </Text>

            <ButtonBase onPress={() => navigateToProductHome()}>
              <ImgixImage src={product.image} height={64} />
            </ButtonBase>

            <Text
              mt={6}
              textAlign="center"
              fontFamily="bold"
              textTransform="uppercase"
              fontSize={3}
            >
              {product.name}
            </Text>

            <Box my={6}>
              {!product.is_one_size && (
                <ListItem>
                  <Text fontFamily="medium">
                    <Trans>Size</Trans>
                  </Text>
                  <Text fontFamily="medium">{item.local_size}</Text>
                </ListItem>
              )}
              <ListItem>
                <Text fontFamily="medium">
                  <Trans>Authenticity</Trans>
                </Text>
                <Text fontFamily="medium">
                  <Trans>100% Certified Authentic</Trans>
                </Text>
              </ListItem>
              {!!item.add_on_quantity && (
                <>
                  <ListItem>
                    <Text fontFamily="medium">
                      <Trans>Add-On</Trans>
                    </Text>
                    {item?.add_ons?.map((addOn, index) => (
                      <Text fontFamily="medium" key={index}>
                        {addOn.quantity > 0 ? `${addOn.quantity} ×` : ''} {addOn.add_on_name}
                      </Text>
                    ))}
                  </ListItem>
                  <ListItem>
                    <Text fontFamily="medium">
                      <Trans>Add-On Price</Trans>
                    </Text>
                    <Text fontFamily="medium">{$$(item.fee_add_on || 0)}</Text>
                  </ListItem>
                </>
              )}
              <ListItem>
                <Text fontFamily="medium">
                  <Trans>Condition</Trans>
                </Text>
                <Text fontFamily="medium">
                  <Trans>Brand New</Trans>
                </Text>
              </ListItem>

              {!!item.expired_at && (
                <ListItem>
                  <Text fontFamily="medium">
                    <Trans>Expiration</Trans>
                  </Text>
                  <Text fontFamily="medium">{expireIn(item.expired_at)}</Text>
                </ListItem>
              )}
              {mode === 'Offer' && (
                <ListItem>
                  <Text fontFamily="bold">
                    <Trans>Offer Price</Trans>
                  </Text>
                  <Text fontFamily="bold">{$$(item.local_price)}</Text>
                </ListItem>
              )}
              {mode === 'Purchase' && (
                <ListItem>
                  <Text fontFamily="medium">
                    <Trans>Delivery Method</Trans>
                  </Text>
                  <Text fontFamily="medium">
                    {item.is_delivery_instant ? (
                      <Trans>Instant Delivery</Trans>
                    ) : (
                      <Trans>Normal Delivery</Trans>
                    )}
                  </Text>
                </ListItem>
              )}

              {isBuyOrDelivery && !deliverToStorage && (
                <ListItem>
                  <Text fontFamily="medium">
                    {item.is_delivery_instant ? (
                      <Trans>Ships Out In</Trans>
                    ) : (
                      <Trans>Est. Delivery Time</Trans>
                    )}
                  </Text>
                  <Text fontFamily="medium">
                    {item.is_delivery_instant ? (
                      <Trans>1-2 Workdays</Trans>
                    ) : item.is_pre_order ? (
                      <Trans>9-15 Workdays</Trans>
                    ) : (
                      <Trans>5-9 Workdays</Trans>
                    )}
                  </Text>
                </ListItem>
              )}

              {mode === 'Purchase' && (
                <ListItem>
                  <Text fontFamily="bold">
                    <Trans>Total Price</Trans>
                  </Text>
                  <Text fontFamily="bold">{$$(item.total_price_local)}</Text>
                </ListItem>
              )}

              {mode === 'Delivery' && (
                <ListItem>
                  <Text fontFamily="bold">
                    <Trans>Delivery Fee</Trans>
                  </Text>
                  <Text fontFamily="bold">
                    {$$((item as unknown as TransactionType).fee_delivery)}
                  </Text>
                </ListItem>
              )}

              <ListItem>
                <Text fontFamily="medium">
                  {deliverToStorage ? i18n._(t`Storage`) : i18n._(t`Delivery To`)}
                </Text>
                <Text textAlign="right" style={{ width: 200 }}>
                  {deliverToStorage ? (
                    <Trans>Your purchase will be stored at Novelship Storage</Trans>
                  ) : (
                    ` ${address.line_1},
                  ${address.line_2}, ${address.city}, ${address.state}
                  ${address.country.name}, ${address.zip}`
                  )}
                </Text>
              </ListItem>
            </Box>
            <Button
              variant="white"
              size="lg"
              text={isBuyOrDelivery ? i18n._(t`CONTINUE BROWSING`) : i18n._(t`MAKE ANOTHER OFFER`)}
              onPress={() => {
                if (isBuyOrDelivery) {
                  return navigation.navigate('BottomNavStack', {
                    screen: 'HomeStack',
                    params: { screen: product.class },
                  });
                }
                return navigateToProductHome();
              }}
            />
          </Box>
        </PageContainer>
      </ScrollContainer>
      <Footer>
        <Button
          variant="black"
          size="lg"
          text={` ${isBuyOrDelivery ? i18n._(t`VIEW PURCHASE`) : i18n._(t`VIEW MY OFFERS`)}`}
          onPress={() =>
            navigation.replace(
              'UserStack',
              isBuyOrDelivery
                ? {
                    screen: 'PurchaseDetails',
                    params: { sale_ref: String(id) },
                  }
                : { screen: 'Buying', params: { screen: 'Offers' } }
            )
          }
        />
      </Footer>
    </SafeAreaScreenContainer>
  );
};

export default BuyOfferConfirmed;
