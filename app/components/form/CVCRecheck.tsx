import { UserType } from 'types/resources/user';

import React, { useState } from 'react';
import { useStripe, useConfirmPayment } from '@stripe/stripe-react-native';
import { t, Trans } from '@lingui/macro';
import { Alert } from 'react-native';
import { i18n } from '@lingui/core';
import Ionicon from 'react-native-vector-icons/FontAwesome';

import { ButtonBase, ImgixImage, Button, Text, Box } from 'app/components/base';
import { useStoreActions } from 'app/store';
import { BoxProps } from 'app/components/base/Box';
import { Input } from 'app/components/form';
import useToggle from 'app/hooks/useToggle';
import theme from 'app/styles/theme';
import API from 'common/api';

import { CardVerifyChargeMessage } from './PaymentCardInput';
import ErrorMessage from './ErrorMessage';

const defaultErrorMsg = i18n._(t`Could not verify your card. Please try again`);

const StripeCardCVCInput = ({ setCVCInput }: { setCVCInput: (_: string) => void }) => (
  <Box alignItems="center" flexDirection="row">
    <ImgixImage
      style={{ marginLeft: 16, marginRight: -44 }}
      src="icons/card-cvc-icon.png"
      height={28}
      width={28}
    />
    <Input
      onChangeText={setCVCInput}
      placeholder="CVC"
      style={{
        paddingLeft: 54,
        width: '100%',
        height: theme.constants.BUTTON_HEIGHT,
      }}
    />
  </Box>
);

const CVCRecheck = ({ user }: { user: UserType }) => {
  const fetchUser = useStoreActions((a) => a.user.fetch);
  const { createTokenForCVCUpdate } = useStripe();
  const { confirmPayment } = useConfirmPayment();

  const [showInput, toggleShowInput] = useToggle(false);
  const [cvcInput, setCVCInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const verifyCard = () => {
    setLoading(true);
    setError('');

    if (!cvcInput) return;

    return createTokenForCVCUpdate(cvcInput)
      .then((cvcUpdate) => {
        if (!cvcUpdate.tokenId) throw new Error(defaultErrorMsg);
        return API.post<{ payment_intent_client_secret: string }>(
          'integrations/stripe/create-cvc-intent',
          { stripeToken: cvcUpdate.tokenId }
        ).then((paymentIntent) =>
          confirmPayment(paymentIntent.payment_intent_client_secret, {
            type: 'Card',
            cvc: cvcInput,
            paymentMethodId: user.stripe_buyer.id,
          }).then((cvcConfirmed) => API.post('integrations/stripe/verify-cvc', { cvcConfirmed }))
        );
      })
      .then(() => fetchUser())
      .then(toggleShowInput)
      .catch((stripeError) => {
        const errorMsg =
          typeof stripeError === 'string' ? stripeError : stripeError.message || defaultErrorMsg;
        setError(errorMsg);
      })
      .finally(() => setLoading(false));
  };

  return showInput ? (
    <Box mt={5}>
      <StripeCardCVCInput setCVCInput={setCVCInput} />
      <CardVerifyChargeMessage />
      <ErrorMessage>{error}</ErrorMessage>
      <Box mt={4} flexDirection="row">
        <Button
          text={i18n._(t`VERIFY CARD`)}
          disabled={!cvcInput}
          onPress={verifyCard}
          loading={loading}
          variant="white"
          size="sm"
          width="49%"
        />
        <Box width="2%" />
        <Button
          text={i18n._(t`CANCEL`)}
          onPress={toggleShowInput}
          variant="white"
          size="sm"
          width="49%"
        />
      </Box>
    </Box>
  ) : (
    <Box pt={4} pb={3} width="100%" flexDirection="row" justifyContent="space-between">
      <CVCRecheckText mr={3} />
      <Button
        onPress={toggleShowInput}
        text={i18n._(t`VERIFY`)}
        variant="red-inverted"
        width={80}
        size="xs"
      />
    </Box>
  );
};

const CVCRecheckText = (props: BoxProps) => (
  <Box alignItems="center" flexDirection="row" justifyContent="flex-end" pt={1} {...props}>
    <ButtonBase
      onPress={() =>
        Alert.alert(
          '',
          i18n._(
            t`Your card has been disabled for security reasons. You can re-activate your card by entering your CVC code and completing the verification. If you don't have access to this card, you can add a new card or use a different payment method.`
          ),
          [{ text: i18n._(t`GOT IT`) }]
        )
      }
    >
      <Text fontSize={1}>
        <Ionicon name="exclamation-circle" size={18} color={theme.colors.red} />
      </Text>
    </ButtonBase>
    <Text ml={1} color="red" fontSize={1}>
      <Trans>Enter CVC to verify card</Trans>
    </Text>
  </Box>
);

export default CVCRecheck;
export { CVCRecheckText };
