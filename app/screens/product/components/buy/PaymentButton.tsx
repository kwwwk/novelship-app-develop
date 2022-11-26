import React from 'react';
import { Trans } from '@lingui/macro';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { cardImage, cardString, paymentMethodString } from 'common/utils/payment';
import { Box, Text, ImgixImage, ButtonBase } from 'app/components/base';
import { PaymentMethodEnumType } from 'types/resources/paymentMethod';
import { PaymentPartnerIcons } from 'app/components/misc/Payment';
import { CVCRecheckText } from 'app/components/form/CVCRecheck';
import { UserType } from 'types/resources/user';
import theme from 'app/styles/theme';

const PaymentButton = ({
  mode = 'sell',
  user,
  currentPaymentMethod,
  selectPayment,
}: {
  mode: 'buy' | 'sell';
  user: UserType;
  currentPaymentMethod: PaymentMethodEnumType;
  selectPayment: () => void;
}) => {
  const isBuyingCardDisabled =
    user.buying_card_disabled && currentPaymentMethod === 'stripe' && mode === 'buy';

  return (
    <ButtonBase
      style={{
        borderColor: isBuyingCardDisabled ? theme.colors.red : theme.colors.gray1,
        borderRadius: 4,
        borderWidth: 1,
      }}
      android_ripple={{ color: theme.colors.rippleGray }}
      onPress={selectPayment}
    >
      <>
        <Box center flexDirection="row" minHeight={48} p={4}>
          <Text
            fontFamily="medium"
            fontSize={2}
            color={currentPaymentMethod === 'stripe' && !user.hasBuyCard ? 'red' : 'gray1'}
          >
            <Trans>Select Payment</Trans>
          </Text>
          <Box center flexDirection="row" style={{ marginLeft: 'auto' }}>
            {user.hasBuyCard && currentPaymentMethod === 'stripe' ? (
              <ImgixImage height={20} width={40} src={cardImage(user.stripe_buyer)} />
            ) : currentPaymentMethod.startsWith('triple-a') ? (
              <Box>
                <PaymentPartnerIcons slug={currentPaymentMethod} height={24} width={24} />
              </Box>
            ) : (
              <></>
            )}
            <Text ml={3} fontSize={2} fontFamily="bold" textTransform="capitalize" mr={2}>
              {currentPaymentMethod === 'stripe'
                ? user.hasBuyCard && cardString(user.stripe_buyer)
                : paymentMethodString(currentPaymentMethod)}
            </Text>
            <Ionicon
              name="md-chevron-forward"
              size={20}
              color={
                theme.colors[
                  currentPaymentMethod === 'stripe' && !user.hasBuyCard ? 'red' : 'textBlack'
                ]
              }
            />
          </Box>
        </Box>
        {isBuyingCardDisabled && <CVCRecheckText pr={4} pb={3} />}
      </>
    </ButtonBase>
  );
};

export default PaymentButton;
