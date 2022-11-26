import { i18n } from '@lingui/core';
import { Alert } from 'react-native';
import { t, Trans } from '@lingui/macro';
import React, { useEffect, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';

import { UserRoutes } from 'types/navigation';
import { PayoutConfigType } from 'types/resources/country';
import { PayoutMethodType } from 'types/resources/payoutRequest';

import API from 'common/api';
import theme from 'app/styles/theme';
import { LB } from 'common/constants';
import { useStoreState } from 'app/store';
import { toDate } from 'common/utils/time';
import { Radio } from 'app/components/form';
import List from 'app/components/blocks/List';
import getFaqLink from 'common/constants/faq';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import { Anchor, Box, Button, Text } from 'app/components/base';
import ConfirmDialog from 'app/components/dialog/ConfirmDialog';
import { PaymentPartnerIcons } from 'app/components/misc/Payment';
import { normalizeNumber, toPrecision } from 'common/utils/currency';
import { POWER_SELLER_EXPEDITED_PAYOUT_THRESHOLD } from 'common/constants/currency';
import {
  KeyboardAwareContainer,
  PageContainer,
  SafeAreaScreenContainer,
  ScrollContainer,
} from 'app/components/layout';

type ReducedPayoutConfigType = {
  [key in PayoutMethodType]: PayoutConfigType;
};

const getWeekArray = (dateValue: Date) => {
  const weekArray = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 1; i <= 7; i++) {
    const date = new Date(dateValue);
    const weekDayDate = date.getDate() - date.getDay() + i;
    date.setDate(weekDayDate);
    weekArray.push(date);
  }
  return weekArray;
};

const currentWeekDate = new Date();
// set current week's first day
currentWeekDate.setDate(
  currentWeekDate.getDate() - currentWeekDate.getDay() + (currentWeekDate.getDay() === 0 ? -6 : 1)
);
const currentWeek = getWeekArray(currentWeekDate);

const getNormalProcessingDate = (weekDay: number) => {
  const transferInWeeksCount = 2;
  const weekDate = new Date();

  // set next week's first day
  weekDate.setDate(
    weekDate.getDate() +
      (weekDate.getDay() === 0 ? 1 : transferInWeeksCount * 7 - weekDate.getDay() + 1)
  );
  const normalProcessingWeek = getWeekArray(weekDate);
  return normalProcessingWeek[weekDay];
};

// Early Payout
const getEarlyProcessingDate = () => {
  const earlyDate = new Date();
  const currentDate = earlyDate.getDate();
  const currentDay = earlyDate.getDay();

  if (earlyDate.getDay() < 3) {
    // Updates Date to current week wednesday
    earlyDate.setDate(currentDate + 3 - currentDay);
  } else if (currentDay >= 3 && currentDay < 5) {
    // Updates Date to current week saturday
    earlyDate.setDate(currentDate + 5 - currentDay);
  } else if (currentDay >= 5) {
    // Updates Date to next week wednesday
    earlyDate.setDate(currentDate + 3 - currentDay + 7);
  }

  return earlyDate;
};

const earlyProcessingDate = getEarlyProcessingDate();

const PAYOUT_DATES = {
  period: `${toDate(currentWeek[0], 'MMM DD')} - ${toDate(
    currentWeek[currentWeek.length - 1],
    'MMM DD'
  )}`,
  deadline: toDate(currentWeek[currentWeek.length - 1], 'weekdays'),
  normal_date: toDate(getNormalProcessingDate(2), 'weekdays'),
  expedited_date: toDate(earlyProcessingDate, 'weekdays'),
  crypto_payout_date: toDate(new Date(new Date().getTime() + 24 * 60 * 60 * 1000)),
};

const PayoutRequest: React.FC<StackScreenProps<UserRoutes, 'PayoutRequest'>> = ({ navigation }) => {
  const user = useStoreState((s) => s.user.user);
  const currency = useStoreState((s) => s.currency.current);
  const { cryptoRates, payoutCryptoConfig } = useStoreState((s) => s.base);

  const [payoutMode, setPayoutMode] = useState<'requested' | 'expedited_requested' | 'crypto'>(
    'requested'
  );
  const [payoutAmount, setPayoutAmount] = useState<number>(0);
  const [confirmDialog, setConfirmDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { $$, $, toBaseCurrency } = useCurrencyUtils();

  const {
    account_number,
    account_type,
    bank_country,
    bank_name,
    branch_code,
    branch_name,
    bsb_code,
    dob,
  } = user.payout_info;

  const payoutConfig = user.shipping_country.payout_config.reduce((prev, curr) => {
    prev[curr.method] = curr;
    return prev;
  }, {} as ReducedPayoutConfigType);

  const bankDetails = [
    { label: i18n._(t`BANK NAME`), value: bank_name || '-' },
    ...(bank_country === 'JP'
      ? [{ label: i18n._(t`BRANCH CODE`), value: branch_code || '-' }]
      : bank_country === 'TW'
      ? [{ label: i18n._(t`BRANCH NAME`), value: branch_name || '-' }]
      : bank_country === 'AU'
      ? [{ label: i18n._(t`BSB CODE`), value: bsb_code || '-' }]
      : []),
    { label: i18n._(t`BANK COUNTRY`), value: bank_country || '-' },
    { label: i18n._(t`ACCOUNT TYPE`), value: i18n._(account_type || '') || '-' },
    { label: i18n._(t`BANK ACCT. NO.`), value: account_number || '-' },
    {
      label: i18n._(t`ACCT. HOLDER`),
      value: `${user.selling_address.firstname} ${user.selling_address.lastname}`.toUpperCase(),
    },
    { label: i18n._(t`DATE OF BIRTH`), value: dob || '-' },
  ];

  const { payoutThresholdTier3, payoutThresholdTier4 } =
    POWER_SELLER_EXPEDITED_PAYOUT_THRESHOLD[currency.code];

  const isPowerSellerPayoutExpeditedFreePossible =
    user.power_seller_stats?.tier === 'Tier 3' || user.power_seller_stats?.tier === 'Tier 4';

  const powerSellerPayoutExpeditedFreeMinThreshold =
    (user.power_seller_stats?.tier === 'Tier 3' && payoutThresholdTier3) ||
    (user.power_seller_stats?.tier === 'Tier 4' && payoutThresholdTier4);

  const shouldApplyPayoutDiscount =
    !!user.power_seller_stats &&
    ((user.power_seller_stats.tier === 'Tier 3' && payoutAmount >= payoutThresholdTier3) ||
      (user.power_seller_stats.tier === 'Tier 4' && payoutAmount >= payoutThresholdTier4));

  const _cryptoChoice = payoutCryptoConfig.tokens.find((p) => p.name === payoutMode);
  const cryptoChoice = _cryptoChoice?.name || '';
  const cryptoCode = _cryptoChoice?.code as 'BTC' | 'ETH' | 'USDT' | 'BINANCE';
  const payoutMethod = cryptoChoice ? 'crypto' : payoutMode;

  const effectiveFeePercent = shouldApplyPayoutDiscount
    ? payoutConfig[payoutMethod].fee_percent_discounted
    : payoutConfig[payoutMethod].fee_percent;
  const effectiveFeeFixed = shouldApplyPayoutDiscount
    ? payoutConfig[payoutMethod].fee_fixed_discounted
    : payoutConfig[payoutMethod].fee_fixed;

  const isPayoutFeeFree = !user.selling_fee.payout_fee_applicable;

  const isPayoutNormal = payoutMode === 'requested';

  const _totalPayoutFee = isPayoutFeeFree
    ? 0
    : payoutAmount > 0
    ? effectiveFeeFixed + (payoutAmount * effectiveFeePercent) / 100
    : 0;

  const totalPayoutFee = toPrecision(_totalPayoutFee, currency.payout_precision, 'up');

  const payoutAmountRequested = payoutAmount - totalPayoutFee;

  const cryptoAmount = (code: 'BTC' | 'ETH' | 'USDT') => {
    const cryptoFeePercent = shouldApplyPayoutDiscount
      ? payoutConfig.crypto.fee_percent_discounted
      : payoutConfig.crypto.fee_percent;
    const cryptoFeeFixed = shouldApplyPayoutDiscount
      ? payoutConfig.crypto.fee_fixed_discounted
      : payoutConfig.crypto.fee_fixed;

    const _cryptoPayoutFee = isPayoutFeeFree
      ? 0
      : payoutAmount > 0
      ? cryptoFeeFixed + (payoutAmount * cryptoFeePercent) / 100
      : 0;

    const cryptoPayoutFee = toPrecision(_cryptoPayoutFee, currency.payout_precision, 'up');
    const cryptoPayoutAmount = payoutAmount - cryptoPayoutFee;
    return normalizeNumber((toBaseCurrency(cryptoPayoutAmount) / cryptoRates[code]) * 0.992, 8);
  };

  const payoutInBaseCurrency = toBaseCurrency(payoutAmount);
  const isCryptoPayoutAvailable =
    payoutInBaseCurrency >= payoutCryptoConfig.min &&
    payoutInBaseCurrency <= payoutCryptoConfig.balance;

  const requestPayout = () => {
    setLoading(true);
    API.post('me/sales/payout-request', {
      payout_request_mode: payoutMethod,
      cryptoChoice,
    })
      .then(() => {
        setLoading(false);
        setConfirmDialog(false);
        navigation.push('PayoutHistory');
      })
      .catch((error) => {
        setLoading(false);
        return Alert.alert(
          '',
          error,
          [
            {
              text: i18n._(t`Close`),
              onPress: () => navigation.goBack(),
            },
          ],
          { cancelable: true, onDismiss: () => navigation.goBack() }
        );
      })
      .finally(() => setLoading(false));
  };

  const canProceed =
    payoutMethod === 'crypto' ||
    ((bank_country === 'AU' ? bsb_code : true) &&
      (bank_country === 'JP' ? branch_code : true) &&
      (bank_country === 'TW' ? branch_name : true) &&
      dob);

  useEffect(() => {
    API.fetch<{ totalPayout: number }>('me/sales/payout-ready-amount').then((data) => {
      if (data && data.totalPayout) setPayoutAmount(data.totalPayout);
    });
  }, []);

  return (
    <SafeAreaScreenContainer>
      <KeyboardAwareContainer>
        <ScrollContainer>
          <PageContainer mt={2} mb={10}>
            <Box alignItems="center">
              <Text color="textSecondary" fontSize={2} fontFamily="bold" mt={4}>
                <Trans>PAYOUT AMOUNT AVAILABLE</Trans>
              </Text>
              <Text fontFamily="bold" fontSize={6} mt={3}>
                {$$(payoutAmount)}
              </Text>
              {isPowerSellerPayoutExpeditedFreePossible &&
                !shouldApplyPayoutDiscount &&
                powerSellerPayoutExpeditedFreeMinThreshold && (
                  <Box>
                    <Text color="green" textAlign="center" fontSize={2} mt={2}>
                      <Trans>
                        Sell{' '}
                        {$(powerSellerPayoutExpeditedFreeMinThreshold - payoutAmount, currency)}{' '}
                        more to use
                        {LB}
                        Early Payout for only{' '}
                        {$(payoutConfig.expedited_requested.fee_fixed_discounted, currency)}.
                      </Trans>
                    </Text>
                  </Box>
                )}
              <Text fontSize={2} mt={4}>
                <Trans>Application period:</Trans> {PAYOUT_DATES.period}
              </Text>
            </Box>
            <Box
              px={3}
              py={2}
              my={3}
              flexDirection="row"
              justifyContent="space-between"
              borderRadius={4}
              style={{
                borderColor: theme.colors.dividerGray,
                borderWidth: 1,
              }}
            >
              <Box center flex={1}>
                <Text color="textSecondary" fontSize={1}>
                  <Trans>Request Before</Trans>
                </Text>
                <Text color="textSecondary" fontSize={2} fontFamily="bold">
                  {PAYOUT_DATES.deadline}
                </Text>
              </Box>
              <Box width={1} bg="dividerGray" />
              <Box center flex={1}>
                <Text color="textSecondary" fontSize={1}>
                  <Trans>Transfer Date</Trans>
                </Text>
                <Text color="textSecondary" fontSize={2} fontFamily="bold">
                  {cryptoChoice
                    ? PAYOUT_DATES.crypto_payout_date
                    : isPayoutNormal
                    ? PAYOUT_DATES.normal_date
                    : PAYOUT_DATES.expedited_date}
                </Text>
              </Box>
            </Box>
            <Box alignItems="center">
              <Text fontSize={1} px={8}>
                <Trans>
                  Early payouts will be processed within 3 working days. {LB}
                  <Anchor
                    to={getFaqLink('payout_request')}
                    fontSize={1}
                    textDecorationLine="underline"
                  >
                    Learn more
                  </Anchor>
                </Trans>
              </Text>
            </Box>

            <Box width={10} bg="dividerGray" />

            <Box width="100%" mt={8} px={4} flexDirection="row" justifyContent="space-between">
              <Box width="50%">
                <Text mr={5} fontSize={4} fontFamily="bold">
                  <Trans>BANK DETAILS</Trans>
                </Text>
              </Box>
              <Button
                variant={canProceed ? 'white' : 'red-inverted'}
                text={i18n._(t`EDIT`)}
                size="xs"
                width="25%"
                onPress={() => navigation.push('SellingForm')}
              />
            </Box>
            <Box center px={2} mt={2}>
              <List items={bankDetails} />
            </Box>

            <Box width="100%" mt={8} px={4}>
              <Text mr={5} fontSize={4} fontFamily="bold">
                <Trans>PAYOUT DETAILS</Trans>
              </Text>
            </Box>
            <Radio.Group<'requested' | 'expedited_requested' | 'crypto'>
              value={payoutMode}
              setValue={setPayoutMode}
            >
              <Radio.Button
                key={1}
                value="requested"
                flexDirection="row-reverse"
                justifyContent="space-between"
                alignItems="center"
                p={4}
              >
                <PayoutOptionFeeDetails
                  mode="requested"
                  config={payoutConfig}
                  isPayoutFeeFree={isPayoutFeeFree}
                  shouldApplyPayoutDiscount={shouldApplyPayoutDiscount}
                />
              </Radio.Button>

              <Radio.Button
                key={2}
                value="expedited_requested"
                flexDirection="row-reverse"
                justifyContent="space-between"
                alignItems="center"
                p={4}
              >
                <PayoutOptionFeeDetails
                  mode="expedited_requested"
                  config={payoutConfig}
                  isPayoutFeeFree={isPayoutFeeFree}
                  shouldApplyPayoutDiscount={shouldApplyPayoutDiscount}
                />
              </Radio.Button>

              {payoutConfig.crypto && (payoutConfig.crypto.admin_only ? user.isAdmin : true) && (
                <Box py={4}>
                  <Box px={4} pb={2}>
                    <PayoutOptionFeeDetails
                      mode="crypto"
                      config={payoutConfig}
                      isPayoutFeeFree={isPayoutFeeFree}
                      shouldApplyPayoutDiscount={shouldApplyPayoutDiscount}
                      isCryptoPayoutAvailable={isCryptoPayoutAvailable}
                    />
                  </Box>
                  {payoutCryptoConfig.tokens.map(({ name, code }) => (
                    <Radio.Button
                      key={name}
                      value={name}
                      flexDirection="row-reverse"
                      justifyContent="space-between"
                      alignItems="center"
                      px={4}
                      py={3}
                      style={{ opacity: isCryptoPayoutAvailable ? 1 : 0.4 }}
                      disabled={!isCryptoPayoutAvailable}
                    >
                      <Box
                        width="90%"
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Box flexDirection="row" alignItems="center">
                          <PaymentPartnerIcons
                            slug={
                              `triple-a_${name.trim().toLowerCase().replace(/\s+/g, '_')}` as
                                | 'triple-a_bitcoin'
                                | 'triple-a_ethereum'
                                | 'triple-a_tether'
                                | 'triple-a_binance_pay'
                            }
                            height={24}
                            width={24}
                          />
                          <Text fontSize={2} fontFamily="medium" ml={4}>
                            {name}
                          </Text>
                        </Box>
                        <Text fontSize={2} color="gray2" ml={4}>
                          {/* @ts-ignore ignore */}
                          {cryptoAmount(code) ? <Trans>Est.</Trans> : ' '} {/* @ts-ignore ignore */}
                          {cryptoAmount(code) || ''} {cryptoAmount(code) ? code : ''}
                        </Text>
                      </Box>
                    </Radio.Button>
                  ))}
                </Box>
              )}
            </Radio.Group>

            {!canProceed && (
              <Box alignItems="center" mt={5}>
                <Text color="red" fontSize={1}>
                  <Trans>Please correct the input information above to proceed.</Trans>
                </Text>
              </Box>
            )}

            <Box width="100%" mt={3}>
              <Button
                disabled={!payoutAmount || !canProceed}
                loading={loading}
                variant="black"
                onPress={() => setConfirmDialog(true)}
                text={`${i18n._(t`REQUEST PAYOUT`)} ${
                  cryptoCode && cryptoCode !== 'BINANCE'
                    ? i18n._(t`EST. ${cryptoAmount(cryptoCode)} ${cryptoCode}`)
                    : $$(payoutAmountRequested)
                }`}
              />
            </Box>
          </PageContainer>
        </ScrollContainer>
      </KeyboardAwareContainer>

      <ConfirmDialog
        isOpen={confirmDialog}
        onClose={() => setConfirmDialog(false)}
        onConfirm={requestPayout}
        title={i18n._(t`CONFIRM PAYOUT REQUEST`)}
        confirmText={i18n._(t`CONFIRM REQUEST`)}
      >
        <Box mt={6} mb={4} px={3} width="100%">
          <Box my={3} flexDirection="row" justifyContent="space-between" alignItems="center">
            <Text fontSize={2} fontFamily="medium" color="textSecondary">
              <Trans>Payout Mode</Trans>
            </Text>
            <Text fontSize={2} fontFamily="bold">
              {cryptoChoice ? (
                <Trans>CRYPTO</Trans>
              ) : isPayoutNormal ? (
                <Trans>NORMAL</Trans>
              ) : (
                <Trans>EARLY</Trans>
              )}
            </Text>
          </Box>
          <Box my={3} flexDirection="row" justifyContent="space-between" alignItems="center">
            <Text fontSize={2} fontFamily="medium" color="textSecondary">
              {cryptoChoice ? <Trans>Payout Ready Fiat</Trans> : <Trans>Payout Ready</Trans>}
            </Text>
            <Text fontSize={2} fontFamily="bold">
              {$$(payoutAmount)}
            </Text>
          </Box>
          <Box my={3} flexDirection="row" justifyContent="space-between" alignItems="center">
            <Text fontSize={2} fontFamily="medium" color="textSecondary">
              {cryptoChoice ? <Trans>Payout Fee Fiat</Trans> : <Trans>Payout Fee</Trans>}
            </Text>
            <Text fontSize={2} fontFamily="bold">
              - {$$(totalPayoutFee)}
            </Text>
          </Box>
          <Box my={3} flexDirection="row" justifyContent="space-between" alignItems="center">
            <Text fontSize={2} fontFamily="medium" color="textSecondary">
              {cryptoChoice ? <Trans>Payout Fiat Amount</Trans> : <Trans>Payout Amount</Trans>}
            </Text>
            <Text fontSize={2} fontFamily="bold">
              {$$(payoutAmountRequested)}
            </Text>
          </Box>
          {!!cryptoChoice && (
            <>
              <Box my={3} flexDirection="row" justifyContent="space-between" alignItems="center">
                <Text fontSize={2} fontFamily="medium" color="textSecondary">
                  <Trans>Crypto Choice</Trans>
                </Text>
                <Text fontSize={2} fontFamily="bold">
                  {cryptoChoice}
                </Text>
              </Box>
              {cryptoCode !== 'BINANCE' && (
                <Box my={3} flexDirection="row" justifyContent="space-between" alignItems="center">
                  <Text fontSize={2} fontFamily="medium" color="textSecondary">
                    <Trans>Crypto Payout</Trans>
                  </Text>
                  <Text fontSize={2} fontFamily="bold">
                    <Trans>
                      Est. {cryptoAmount(cryptoCode)} {cryptoCode}
                    </Trans>
                  </Text>
                </Box>
              )}
            </>
          )}
          <Box my={3} flexDirection="row" justifyContent="space-between" alignItems="center">
            <Text fontSize={2} fontFamily="medium" color="textSecondary">
              <Trans>Transfer Date</Trans>
            </Text>
            <Text fontSize={2} fontFamily="bold">
              {cryptoChoice
                ? PAYOUT_DATES.crypto_payout_date
                : isPayoutNormal
                ? PAYOUT_DATES.normal_date
                : PAYOUT_DATES.expedited_date}
            </Text>
          </Box>

          {!!cryptoChoice && (
            <Text fontSize={1} color="gray3" my={2} textAlign="center">
              <Trans>
                Please check your email after confirmation to enter wallet information and receive
                the payout. The exchange rate may vary depending on when your email confirmation is
                made.
              </Trans>
            </Text>
          )}
        </Box>
      </ConfirmDialog>
    </SafeAreaScreenContainer>
  );
};

const PayoutOptionFeeDetails = ({
  mode,
  config,
  isPayoutFeeFree,
  shouldApplyPayoutDiscount,
  isCryptoPayoutAvailable = false,
}: {
  mode: PayoutMethodType;
  config: ReducedPayoutConfigType;
  isPayoutFeeFree: boolean;
  shouldApplyPayoutDiscount: boolean;
  isCryptoPayoutAvailable?: boolean;
}) => {
  const feePercent = config[mode].fee_percent;
  const feePercentDiscounted = config[mode].fee_percent_discounted;
  const feeFixed = config[mode].fee_fixed;
  const feeFixedDiscounted = config[mode].fee_fixed_discounted;

  const { $$ } = useCurrencyUtils();

  return (
    <Box width="90%" flexDirection="row" alignItems="center">
      <Box width={mode === 'crypto' ? '100%' : '80%'}>
        <Text fontSize={2} fontFamily="medium">
          {mode === 'requested' ? (
            <Trans>Payout [Normal]</Trans>
          ) : mode === 'expedited_requested' ? (
            <Trans>Payout [Early]</Trans>
          ) : (
            <>
              <Trans>Crypto Payout [Instant]</Trans>
              {LB}
              <Text fontSize={1} color="gray3" fontFamily="medium">
                {isCryptoPayoutAvailable ? (
                  <Trans>[BETA - limited to first US$30,000 per week]</Trans>
                ) : (
                  <Trans>[BETA - fully redeemed this week]</Trans>
                )}
              </Text>
            </>
          )}
        </Text>
        <Box flexDirection="row">
          <Text fontSize={2} mt={2} textDecorationLine={isPayoutFeeFree ? 'line-through' : 'none'}>
            <Trans>Fee: {$$(shouldApplyPayoutDiscount ? feeFixedDiscounted : feeFixed)}</Trans>
          </Text>
          {!!feePercent && (
            <Text
              fontSize={2}
              mt={2}
              textDecorationLine={
                isPayoutFeeFree || shouldApplyPayoutDiscount ? 'line-through' : 'none'
              }
            >
              {' '}
              + <Trans>{feePercent}% of Payout Amount</Trans>
            </Text>
          )}
        </Box>
        <Box flexDirection="row">
          {isPayoutFeeFree ? (
            <Text fontSize={2} mt={2} color="green" fontFamily="bold">
              <Trans>Free</Trans>
            </Text>
          ) : feePercent && shouldApplyPayoutDiscount ? (
            <Text fontSize={2} mt={2} color="green" fontFamily="bold">
              {feePercentDiscounted ? (
                <Trans>+ {feePercentDiscounted}% of Payout Amount</Trans>
              ) : (
                <Trans>% Fee Waived</Trans>
              )}
            </Text>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
};

export default PayoutRequest;
