import { TransactionType } from 'types/resources/transaction';
import { UserRoutes } from 'types/navigation';

import React, { useEffect } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { t, Trans } from '@lingui/macro';
import { useQuery } from 'react-query';
import { i18n } from '@lingui/core';

import {
  SALE_BUYER_STATUS_PROGRESS_STORAGE,
  SALE_SELLER_STATUS_PROGRESS,
  SALE_BUYER_STATUS_PROGRESS,
  SALE_STATUS_IN_STORAGE,
  SALE_STATUS_FAILED,
  getPayoutStatus,
  getSaleStatus,
} from 'common/constants/transaction';
import { ScrollContainer, SafeAreaScreenContainer } from 'app/components/layout';
import { ImgixImage, Text, Box, AnchorButton } from 'app/components/base';
import { paymentMethodString } from 'common/utils/payment';
import { addressString } from 'common/utils/address';
import { useStoreState } from 'app/store';
import { LB } from 'common/constants';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import List from 'app/components/blocks/List';

import Analytics from 'app/services/analytics';
import TransactionDelayNoticeTicker from '../components/TransactionDelayNoticeTicker';
import SellFromStorageTicker from '../components/SellFromStorageTicker';
import ShipmentDecisionForm from './components/ShipmentDecisionForm';
import PenaltyAppealForm from './components/PenaltyAppealForm';
import SaleProgressFlow from '../components/SaleProgressFlow';
import PurchaseActions from '../components/PurchaseActions';
import SaleActions from '../components/SaleActions';

const initialTransaction = {
  status: 'pending',
  size: '',
  seller_country: {},
} as TransactionType;

type TransactionRouteProp = RouteProp<UserRoutes, 'PurchaseDetails' | 'SaleDetails'>;
const TransactionDetails = ({
  route,
  navigation,
}: {
  route: TransactionRouteProp;
  navigation: StackNavigationProp<UserRoutes>;
}) => {
  const user = useStoreState((s) => s.user.user);
  const { $$: _$$ } = useCurrencyUtils();

  const id = route.params.sale_ref;
  const mode = /Purchase/.test(route.name) ? 'buying' : 'selling';

  const { data: transaction = initialTransaction, refetch } = useQuery<TransactionType>(
    [`me/sales/${mode}/${id}`],
    { initialData: initialTransaction }
  );

  const paymentMethod = useStoreState((s) => s.base.getPaymentMethodBySlug)(
    transaction.payment_method
  );

  useEffect(() => {
    Analytics.orderView(mode);
  }, [mode]);

  if (!transaction.id) {
    return null;
  }

  const isBuy = mode === 'buying';
  const currency = isBuy ? transaction.buyer_currency : transaction.seller_currency;
  const $$ = (input: number) => _$$(input, currency);
  const transactionSpecs = getTransactionSpecs(transaction, $$, isBuy);

  const progress = isBuy
    ? transaction.deliver_to === 'storage'
      ? SALE_BUYER_STATUS_PROGRESS_STORAGE
      : SALE_BUYER_STATUS_PROGRESS
    : SALE_SELLER_STATUS_PROGRESS;
  const progressIndex = progress.indexOf(getSaleStatus(transaction, mode));
  const showProgress =
    transaction.status &&
    !SALE_STATUS_FAILED.includes(transaction.status) &&
    !SALE_STATUS_IN_STORAGE.includes(transaction.status);
  const showReviewWidget = isBuy
    ? transaction.status &&
      ['completed', 'in_storage'].includes(transaction.status) &&
      !!user.showTrustpilotWidget
    : transaction.payout_status &&
      ['processed', 're_processed'].includes(transaction.payout_status) &&
      !!user.showTrustpilotWidget;

  return (
    <SafeAreaScreenContainer>
      <ScrollContainer>
        {isBuy ? (
          transaction.status === 'in_storage' ? (
            <SellFromStorageTicker />
          ) : (
            <TransactionDelayNoticeTicker />
          )
        ) : null}
        <Box center flex={1}>
          <Box
            center
            p={5}
            pb={7}
            width="100%"
            borderBottomWidth={1}
            borderBottomColor="dividerGray"
          >
            <ImgixImage src={transaction.product.image} height={90} width={140} />
            <Text px={5} mt={5} color="black2" fontSize={2} fontFamily="bold" textAlign="center">
              {transaction.product.name}
            </Text>
            {transaction.product.sku && (
              <Text mt={2} color="gray3" fontSize={1}>
                {transaction.product.sku}
              </Text>
            )}

            {!transaction.penalty_appeal_status && (
              <Box center py={3} mt={3} bg="black2" width="100%" maxWidth={300} borderRadius={5}>
                <Text color="white" fontSize={2}>
                  <Trans>STATUS</Trans>
                </Text>
                <Box maxWidth={200}>
                  <Text
                    mt={3}
                    fontSize={2}
                    color="goldenrod"
                    textAlign="center"
                    textTransform="uppercase"
                  >
                    {i18n._(getSaleStatus(transaction, mode))}{' '}
                    {mode === 'selling' &&
                      (transaction.seller_courier === 'JANIO' ? (
                        <Trans>- Pickup Confirmed</Trans>
                      ) : transaction.seller_courier === 'BLUPORT' ? (
                        <Trans>- Drop Off Confirmed</Trans>
                      ) : transaction.seller_courier === 'NINJAVAN' ? (
                        transaction?.seller_courier_pickup_date_time ? (
                          <>
                            <Trans>- Ninjavan Pickup Confirmed at </Trans>
                            {'\n'}
                            {transaction.seller_courier_pickup_date_time}
                          </>
                        ) : (
                          <Trans>- Ninjavan Drop Off Confirmed</Trans>
                        )
                      ) : null)}
                    {getPayoutStatus(transaction, mode)
                      ? `- ${i18n._(getPayoutStatus(transaction, mode))}`
                      : ''}
                  </Text>
                </Box>
                {paymentMethod?.response &&
                  ['callback', 'redirect'].includes(paymentMethod?.response as string) &&
                  transaction.status === 'pending' && (
                    <Text color="white" fontSize={1} px={4}>
                      <Trans>
                        Complete your payment via {paymentMethodString(transaction.payment_method)}{' '}
                        within 10 minutes to confirm your purchase.
                        {LB}
                        {LB}
                        Please wait between 10 to 20 minutes while we verify your payment with
                        {paymentMethodString(transaction.payment_method)}. You will be notified once
                        the payment and order is confirmed.
                      </Trans>
                    </Text>
                  )}
              </Box>
            )}

            <PenaltyAppealForm transaction={transaction} refetch={refetch} />

            <Box center mt={4} width="100%" maxWidth={300}>
              {isBuy ? (
                <PurchaseActions sale={transaction} />
              ) : (
                <SaleActions sale={transaction} refetch={refetch} navigation={navigation} />
              )}
              {!isBuy && transaction.status === 'confirmed' && (
                <ShipmentDecisionForm transaction={transaction} refetch={refetch} />
              )}
            </Box>
          </Box>

          {showProgress && (
            <Box center p={5} width="100%">
              <SaleProgressFlow progress={progress} progressIndex={progressIndex} />
            </Box>
          )}

          <Box center p={3}>
            <List items={transactionSpecs} />
            {(isBuy ? transaction.status === 'delivering' : transaction.status === 'shipping') && (
              <Box
                flexDirection="row"
                justifyContent="space-between"
                borderBottomWidth={1}
                borderBottomColor="dividerGray"
                mt={4}
                pb={3}
                px={1}
              >
                <Text
                  color="gray3"
                  fontFamily="medium"
                  textTransform="uppercase"
                  fontSize={2}
                  style={{ width: '34%' }}
                >
                  <Trans>Tracking ID</Trans>
                </Text>
                <Text
                  color="gray2"
                  fontFamily="medium"
                  textTransform="uppercase"
                  fontSize={2}
                  textAlign="right"
                  style={{ width: '62%' }}
                  selectable
                >
                  {isBuy ? transaction.buyer_courier_tracking : transaction.seller_courier_tracking}
                </Text>
              </Box>
            )}
            {showReviewWidget && (
              <Box mt={8}>
                <TrustpilotReviewWidget />
              </Box>
            )}
          </Box>
          <Box my={10} />
        </Box>
      </ScrollContainer>
    </SafeAreaScreenContainer>
  );
};

const getTransactionSpecs = (
  transaction: TransactionType,
  $$: (_: number) => string,
  isBuy: boolean
) => {
  const transactionSpecs = [
    { label: i18n._(t`Size`), value: transaction.local_size || i18n._(t`One-Size`) },
    { label: i18n._(t`Condition`), value: i18n._(t`New`) },
    { label: i18n._(t`Authenticity`), value: '100%' },
  ];

  if (isBuy) {
    transactionSpecs.push(
      ...[
        { label: i18n._(t`Purchase Price`), value: $$(transaction.offer_price_local) },
        ...(transaction?.add_on_quantity
          ? [
              {
                label: i18n._(t`Add-On`),
                value: `${transaction.add_on_quantity} × ${transaction.add_ons[0]?.add_on_name}`,
              },
              { label: i18n._(t`Add-On Price`), value: $$(transaction.fee_add_on) },
            ]
          : []),
        { label: i18n._(t`Processing Fee`), value: $$(transaction.fee_processing_buy || 0) },
      ]
    );
    if (transaction.fee_delivery_insurance) {
      transactionSpecs.push({
        label: i18n._(t`Delivery Protection Fee`),
        value: $$(transaction.fee_delivery_insurance),
      });
    }
    transactionSpecs.push({
      label: i18n._(t`Delivery Fee`),
      value: $$(transaction.fee_delivery || 0),
    });
    transactionSpecs.push({
      label: i18n._(t`Instant Delivery Fee`),
      value: $$(transaction.fee_delivery_instant || 0),
    });
    if (transaction.promocode_value) {
      transactionSpecs.push({
        label: i18n._(t`Promocode [${transaction.promocode && transaction.promocode.code}]`),
        value: `- ${$$(transaction.promocode_value || 0)}`,
      });
    }
    transactionSpecs.push({ label: i18n._(t`Total`), value: $$(transaction.total_price_local) });
    if (transaction.delivery_address && transaction.deliver_to !== 'storage') {
      transactionSpecs.push({
        label: i18n._(t`Deliver To:`),
        value: addressString(transaction.delivery_address, transaction.buyer_country),
      });
    }
  } else {
    transactionSpecs.push(
      ...[
        { label: i18n._(t`List Price`), value: $$(transaction.list_price_local) },
        { label: i18n._(t`Processing Fee`), value: `-${$$(transaction.fee_processing_sell || 0)}` },
        { label: i18n._(t`Transaction Fee`), value: `-${$$(transaction.fee_selling || 0)}` },
        ...(transaction.fee_shipping
          ? [{ label: i18n._(t`Shipping`), value: `-${$$(transaction.fee_shipping || 0)}` }]
          : []),
        { label: i18n._(t`Total Payout`), value: $$(transaction.payout_amount_local) },
      ]
    );
  }

  return transactionSpecs;
};

const TrustpilotReviewWidget = () => (
  <>
    <AnchorButton
      to="https://www.trustpilot.com/review/novelship.com"
      style={{ justifyContent: 'center', alignItems: 'center' }}
    >
      <ImgixImage src="authentication/Trustpilot_brandmark.png" width={128} height={40} />
      <ImgixImage
        src="authentication/Trustpilot_ratings.png"
        width={120}
        height={40}
        style={{ marginTop: -8, marginRight: -2 }}
      />
    </AnchorButton>
    <Box>
      <AnchorButton
        size="sm"
        variant="black"
        width={240}
        text={i18n._(t`REVIEW US ON TRUSTPILOT`)}
        to="https://www.trustpilot.com/evaluate/novelship.com"
      />
    </Box>
  </>
);

export default TransactionDetails;
