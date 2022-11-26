import React, { useState } from 'react';
import {
  CardField,
  CardFieldInput,
  CardFieldProps,
  useConfirmPayment,
  useStripe,
} from '@stripe/stripe-react-native';

import { useStoreState, useStoreActions } from 'app/store';
import { cardImage, cardString } from 'common/utils/payment';
import API from 'common/api';
import theme from 'app/styles/theme';
import { t, Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';
import Analytics from 'app/services/analytics';
import { Box, Button, ImgixImage, Text } from '../base';
import ErrorMessage from './ErrorMessage';

const StripeCardInput = ({ onCardChange }: CardFieldProps) => (
  <CardField
    onCardChange={onCardChange}
    style={{
      width: '100%',
      height: 50,
    }}
    cardStyle={{
      placeholderColor: theme.colors.gray4,
      backgroundColor: '#FFFFFF',
      borderRadius: 0,
      borderWidth: 1,
      borderColor: theme.colors.dividerGray,
      textColor: theme.colors.textBlack,
      textErrorColor: theme.colors.red,
    }}
  />
);

const CardVerifyChargeMessage = () => (
  <Text fontSize={11} mt={2} color="textSecondary" lineHeight={14}>
    <Trans>
      We will verify your card by making a small test charge. Don't worry, we'll refund it
      immediately.
    </Trans>
  </Text>
);

const defaultErrorMsg = i18n._(t`Could not add your card. Please try again`);

const PaymentCardInput = ({
  mode,
  title,
  SelectorButton,
}: {
  mode: 'buyer' | 'seller';
  title?: string;
  SelectorButton?: React.ReactNode;
}) => {
  const user = useStoreState((s) => s.user.user);
  const fetchUser = useStoreActions((a) => a.user.fetch);
  const { createPaymentMethod } = useStripe();
  const { confirmPayment } = useConfirmPayment();

  const [cardInput, setCardInput] = useState<CardFieldInput.Details | null>(null);
  const [showUpdate, setShowUpdate] = useState(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const hasCard = mode === 'buyer' ? user.hasBuyCard : user.hasSellCard;
  const card = mode === 'buyer' ? user.stripe_buyer : user.stripe_seller;

  const addCard = () => {
    setLoading(true);
    setError('');

    if (!cardInput?.complete) return;

    return createPaymentMethod({
      type: 'Card',
      setupFutureUsage: 'OffSession',
    })
      .then((paymentMethod) => {
        if (!paymentMethod.paymentMethod?.id) throw new Error(defaultErrorMsg);

        return API.post<{ payment_intent_client_secret: string }>(
          'integrations/stripe/create-intent',
          {
            stripeToken: {
              card: paymentMethod.paymentMethod?.Card,
            },
          }
        ).then((paymentIntent) =>
          confirmPayment(paymentIntent.payment_intent_client_secret, {
            type: 'Card',
            setupFutureUsage: 'OffSession',
          }).then((confirmedIntent) =>
            API.post('integrations/stripe/save', {
              newCard: { paymentIntent: confirmedIntent.paymentIntent },
              userType: mode,
            })
          )
        );
      })
      .then(() => {
        fetchUser();
        Analytics.addPaymentEvent(mode === 'buyer' ? 'Buy' : 'Sell');
      })
      .then(() => setShowUpdate(false))
      .catch((stripeError) => {
        const errorMsg =
          typeof stripeError === 'string' ? stripeError : stripeError.message || defaultErrorMsg;
        setError(errorMsg);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      {title && (
        <Text fontSize={3} fontFamily="bold">
          {title}
        </Text>
      )}
      {hasCard && card ? (
        <>
          <Box flexDirection="row" mt={5} justifyContent="space-between" alignItems="center">
            <Box flexDirection="row">
              <ImgixImage height={20} width={40} src={cardImage(user.stripe_buyer)} />
              <Text fontSize={2} ml={2}>
                {cardString(card)} <Trans>expiring</Trans> {card.exp_month}/{card.exp_year}
              </Text>
            </Box>
            {SelectorButton && <Box width="10%">{SelectorButton}</Box>}
          </Box>
          <Box mt={4}>
            <Button
              variant="white"
              text={showUpdate ? i18n._(t`CANCEL`) : i18n._(t`CHANGE CARD`)}
              onPress={() => setShowUpdate(!showUpdate)}
              size="xs"
              width={110}
            />
          </Box>
          {showUpdate && (
            <Box mt={5}>
              <StripeCardInput onCardChange={setCardInput} />
              <CardVerifyChargeMessage />
              <ErrorMessage>{error}</ErrorMessage>
              <Box mt={4}>
                <Button
                  variant="white"
                  text={i18n._(t`CHANGE CARD`)}
                  onPress={addCard}
                  size="sm"
                  loading={loading}
                  disabled={!cardInput?.complete}
                />
              </Box>
            </Box>
          )}
        </>
      ) : (
        <Box mt={4}>
          <StripeCardInput onCardChange={setCardInput} />
          <ErrorMessage>{error}</ErrorMessage>
          <CardVerifyChargeMessage />
          <Box mt={4}>
            <Button
              variant="white"
              text={i18n._(t`ADD CARD`)}
              onPress={addCard}
              size="sm"
              loading={loading}
              disabled={!cardInput?.complete}
            />
          </Box>
        </Box>
      )}
    </>
  );
};

export default PaymentCardInput;
export { CardVerifyChargeMessage };
