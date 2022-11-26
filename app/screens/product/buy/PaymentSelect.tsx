import { PaymentMethodEnumType } from 'types/resources/paymentMethod';
import { ProductRoutes } from 'types/navigation';

import React, { useContext, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { t, Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {
  SafeAreaScreenContainer,
  KeyboardAwareContainer,
  ScrollContainer,
  PageContainer,
  Footer,
} from 'app/components/layout';
import { Button, Anchor, Text, Box, ImgixImage } from 'app/components/base';
import { PaymentCardInput, Radio } from 'app/components/form';
import { PaymentPartnerIcons } from 'app/components/misc/Payment';
import { useStoreState } from 'app/store';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import CVCRecheck from 'app/components/form/CVCRecheck';
import HintDialog from 'app/components/dialog/HintDialog';

import { paymentMethodString } from 'common/utils/payment';
import ProductCheckoutContext from '../context';
import PayLaterDialog from '../components/buy/PaylaterDialog';
import PaymentPromotionText from '../components/common/PaymentPromotionText';

const PaymentSelect = ({ route, navigation }: StackScreenProps<ProductRoutes, 'PaymentSelect'>) => {
  const shortcode = useStoreState((s) => s.country.current.shortcode);
  const getAvailablePaymentMethods = useStoreState((s) => s.base.getAvailablePaymentMethods);
  const user = useStoreState((s) => s.user.user);

  const {
    buy: { buy, paymentMethod, setPaymentMethod },
    product,
  } = useContext(ProductCheckoutContext);
  const { $$ } = useCurrencyUtils();

  const [currentPaymentMethod, setCurrentPaymentMethod] =
    useState<PaymentMethodEnumType>(paymentMethod);

  const stripeOnly = !!buy.isOffer || buy.isEdit;
  const availablePaymentMethods = getAvailablePaymentMethods(buy.totalPrice, product).filter((p) =>
    stripeOnly ? p.slug === 'stripe' : true
  );

  const isStripeOnly = !!route.params?.cardOnly;
  const walletPayments = availablePaymentMethods.filter((p) => p.type === 'wallet');
  const payLaterPayments = availablePaymentMethods.filter((p) => p.type === 'paylater');
  return (
    <SafeAreaScreenContainer>
      <KeyboardAwareContainer>
        <ScrollContainer>
          <PageContainer mt={4}>
            <Radio.Group<PaymentMethodEnumType>
              value={currentPaymentMethod}
              setValue={setCurrentPaymentMethod}
            >
              <PaymentMethodSection title={i18n._(t`CREDIT/DEBIT CARD`)}>
                <Box flexDirection="row" alignItems="flex-start" justifyContent="space-between">
                  <Box mb={3} width="100%">
                    <PaymentCardInput
                      mode="buyer"
                      SelectorButton={<Radio.Button value="stripe" px={2} />}
                    />
                    {user.buying_card_disabled && <CVCRecheck user={user} />}
                  </Box>
                </Box>
              </PaymentMethodSection>
              {!isStripeOnly && (
                <>
                  {!!walletPayments.length && (
                    <PaymentMethodSection title={i18n._(t`WALLETS`)}>
                      {walletPayments.map((payment) => {
                        const isTripleA = payment.slug.startsWith('triple-a');
                        return (
                          <Radio.Button
                            key={payment.slug}
                            value={payment.slug}
                            flexDirection="row-reverse"
                            justifyContent="space-between"
                            alignItems="center"
                            py={2}
                          >
                            <Box width="90%" flexDirection="row" alignItems="center">
                              <Box width="28%">
                                {isTripleA ? (
                                  <Box center py={2} my={1}>
                                    <PaymentPartnerIcons
                                      slug={payment.slug}
                                      height={34}
                                      width={34}
                                    />
                                  </Box>
                                ) : (
                                  <Box center my={1}>
                                    <ImgixImage
                                      fullQuality
                                      src={`partners/${payment.slug}.png`}
                                      height={58}
                                      width={58}
                                    />
                                  </Box>
                                )}
                              </Box>
                              <Box width="72%">
                                <Text fontSize={3} fontFamily="bold" textTransform="capitalize">
                                  {paymentMethodString(payment.slug)}
                                </Text>
                                <PaymentPromotionText user={user} payment={payment} />
                                {payment.slug === 'triple-a_binance_pay' && (
                                  <Box>
                                    <Text fontSize={0} color="gray1" lineHeight={12}>
                                      <Trans>
                                        You can pay with any coin in your Binance wallet with 0
                                        fees.
                                      </Trans>
                                    </Text>
                                    <Anchor
                                      to={payment?.config[0]?.url || ''}
                                      fontSize={0}
                                      fontFamily="bold"
                                      color="gray1"
                                      lineHeight={12}
                                    >
                                      <Trans>Create your Binance account now.</Trans>{' '}
                                      <FontAwesome name="external-link" size={10} />
                                    </Anchor>
                                  </Box>
                                )}
                              </Box>
                            </Box>
                          </Radio.Button>
                        );
                      })}
                    </PaymentMethodSection>
                  )}
                  {!!payLaterPayments.length && (
                    <PaymentMethodSection title={i18n._(t`PAY LATER & INSTALLMENTS`)}>
                      {payLaterPayments.map((payment) => (
                        <Box key={payment.slug}>
                          {payment.config.length > 1 ? (
                            <Box
                              width="100%"
                              flexDirection="row"
                              alignItems="center"
                              justifyContent="space-between"
                              mt={4}
                            >
                              <Box width="25.2%">
                                <ImgixImage
                                  fullQuality
                                  src={`partners/${payment.slug}.png`}
                                  height={70}
                                  width={70}
                                />
                              </Box>
                              <Box width="74.8%">
                                <Text
                                  fontSize={3}
                                  fontFamily="bold"
                                  mb={2}
                                  textTransform="capitalize"
                                >
                                  {paymentMethodString(payment.slug)}
                                </Text>
                                <PaymentPromotionText user={user} payment={payment} />
                                {payment.config.map((c) => {
                                  const option = `${payment.slug}_:x:_${c.installments}`;
                                  return (
                                    <Radio.Button
                                      value={option}
                                      key={option}
                                      flexDirection="row-reverse"
                                      justifyContent="space-between"
                                      my={2}
                                    >
                                      <Text fontSize={2} fontFamily="medium" mb={2}>
                                        <Trans>
                                          {$$(
                                            (buy.totalPrice * (c.interest / 100 + 1)) /
                                              c.installments
                                          )}{' '}
                                          x {c.installments} Installments
                                        </Trans>
                                      </Text>
                                    </Radio.Button>
                                  );
                                })}
                                <Text fontSize={1} color="textSecondary" mb={1} lineHeight={14}>
                                  {payment.config[0].buyer_payment_fee ? (
                                    <Trans>
                                      {payment.config[0].interest +
                                        payment.config[0].buyer_payment_fee}
                                      % fee,
                                    </Trans>
                                  ) : (
                                    <Trans>{payment.config[0].interest}% interest,</Trans>
                                  )}{' '}
                                  <Trans>
                                    pay later in{' '}
                                    {payment.config.map((c) => c.installments).join(', ')}{' '}
                                    installments, due {i18n._(payment.config[0].period)}
                                  </Trans>
                                </Text>
                                <Text color="textSecondary">
                                  {payment.countries[shortcode]?.help_url &&
                                    ((payment.slug === 'afterpay' &&
                                      ['AU', 'NZ'].includes(shortcode)) ||
                                    (payment.slug === 'paidy' && shortcode === 'JP') ? (
                                      <HintDialog
                                        hintContent={<Text fontSize={1}>Learn more here</Text>}
                                      >
                                        <PayLaterDialog
                                          shortcode={shortcode}
                                          paymentMethod={payment.slug}
                                        />
                                      </HintDialog>
                                    ) : (
                                      <Anchor
                                        fontSize={1}
                                        to={payment.countries[shortcode]?.help_url}
                                      >
                                        <Trans>Learn more here</Trans>
                                      </Anchor>
                                    ))}
                                </Text>
                              </Box>
                            </Box>
                          ) : (
                            <Radio.Button
                              value={payment.slug}
                              key={payment.slug}
                              flexDirection="row-reverse"
                              justifyContent="space-between"
                              py={2}
                            >
                              <Box width="90%" flexDirection="row" alignItems="center">
                                <Box width="28%">
                                  <ImgixImage
                                    fullQuality
                                    src={`partners/${payment.slug}.png`}
                                    height={70}
                                    width={70}
                                  />
                                </Box>
                                <Box width="72%">
                                  <Text fontSize={3} fontFamily="bold" textTransform="capitalize">
                                    {paymentMethodString(payment.slug)}
                                  </Text>
                                  <PaymentPromotionText user={user} payment={payment} />
                                  {payment.config.length > 0 && (
                                    <>
                                      <Text fontSize={2} fontFamily="medium" mb={1}>
                                        <Trans>
                                          {$$(
                                            (buy.totalPrice *
                                              (payment.config[0].interest / 100 + 1)) /
                                              payment.config[0].installments
                                          )}{' '}
                                          x {payment.config[0].installments} Installment
                                          {payment.config[0].installments > 1 ? 's' : ''}
                                        </Trans>
                                      </Text>
                                      <Text
                                        fontSize={1}
                                        color="textSecondary"
                                        mb={1}
                                        lineHeight={14}
                                      >
                                        {payment.config[0].buyer_payment_fee ? (
                                          <Trans>
                                            {payment.config[0].interest +
                                              payment.config[0].buyer_payment_fee}
                                            % fee,
                                          </Trans>
                                        ) : (
                                          <Trans>{payment.config[0].interest}% interest,</Trans>
                                        )}{' '}
                                        {payment.config[0].installments > 1
                                          ? i18n._(
                                              t`pay later in ${payment.config[0].installments} installments, due ${payment.config[0].period}`
                                            )
                                          : i18n._(t`pay later next month`)}
                                      </Text>
                                    </>
                                  )}
                                  <Text color="textSecondary">
                                    {payment.countries[shortcode]?.help_url &&
                                      ((payment.slug === 'afterpay' &&
                                        ['AU', 'NZ'].includes(shortcode)) ||
                                      (payment.slug === 'paidy' && shortcode === 'JP') ? (
                                        <HintDialog
                                          hintContent={<Text fontSize={1}>Learn more here</Text>}
                                        >
                                          <PayLaterDialog
                                            shortcode={shortcode}
                                            paymentMethod={payment.slug}
                                          />
                                        </HintDialog>
                                      ) : (
                                        <Anchor
                                          fontSize={1}
                                          to={payment.countries[shortcode]?.help_url}
                                        >
                                          <Trans>Learn more here</Trans>
                                        </Anchor>
                                      ))}
                                  </Text>
                                </Box>
                              </Box>
                            </Radio.Button>
                          )}
                        </Box>
                      ))}
                    </PaymentMethodSection>
                  )}
                </>
              )}
            </Radio.Group>
          </PageContainer>
        </ScrollContainer>
        <Footer>
          <Button
            variant="black"
            size="lg"
            text={i18n._(t`CONTINUE`)}
            onPress={() => {
              setPaymentMethod(currentPaymentMethod);
              navigation.goBack();
            }}
          />
        </Footer>
      </KeyboardAwareContainer>
    </SafeAreaScreenContainer>
  );
};

const PaymentMethodSection = ({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) => (
  <Box
    px={5}
    pt={3}
    pb={3}
    mt={2}
    mb={3}
    borderWidth={1}
    borderRadius={4}
    borderTopWidth={3}
    borderColor="gray6"
    borderTopColor="black2"
  >
    <Text mb={3} fontSize={2} fontFamily="bold">
      {title}
    </Text>
    {children}
  </Box>
);

export default PaymentSelect;
