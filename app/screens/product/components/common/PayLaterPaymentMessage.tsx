import React, { useContext } from 'react';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { Trans } from '@lingui/macro';

import { Box, Text, ImgixImage, AnchorButton } from 'app/components/base';
import { PaymentPartnerIcons } from 'app/components/misc/Payment';
import { useStoreState } from 'app/store';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import HintDialog from 'app/components/dialog/HintDialog';
import Blink from 'app/components/misc/Blink';
import theme from 'app/styles/theme';

import { StyleProp, ImageStyle } from 'react-native';
import { CryptoValue } from 'app/components/widgets/Crypto';
import { PaymentMethodEnumType } from 'types/resources/paymentMethod';
import PayLaterDialog from '../buy/PaylaterDialog';
import ProductCheckoutContext from '../../context';

const payLaterImageProps = {
  pace: {
    height: 12,
    width: 38,
    src: 'partners/Pace_logo.png?fit=fill&bg=FFFFFF&trim=color',
    style: { marginTop: 2 },
  },
  atome: { height: 13, width: 50, src: 'partners/Atome_logo.png', style: { marginTop: -1 } },
  grabpay_paylater: {
    height: 14,
    width: 50,
    src: 'partners/grabpay_paylater.png?fit=fill&bg=FFFFFF&trim=color',
  },
  afterpay: { height: 13, width: 72, src: 'partners/Afterpay_logo.png' },
  chailease: { height: 19, width: 52, src: 'partners/chailease.png', style: { marginTop: -3 } },
  paidy: { height: 19, width: 52, src: 'partners/paidy.png', style: { marginTop: -3 } },
  paypal_paylater: {
    height: 15,
    width: 64,
    src: 'partners/paypal_paylater.png',
    style: { marginTop: -2 },
  },
} as Record<
  PaymentMethodEnumType,
  {
    height: number;
    width: number;
    src: string;
    style?: StyleProp<ImageStyle>;
  }
>;

const PayLaterPaymentMessage = ({ price }: { price: number }) => {
  const { product } = useContext(ProductCheckoutContext);
  const getAvailablePaymentMethods = useStoreState((s) => s.base.getAvailablePaymentMethods);
  const shortcode = useStoreState((s) => s.country.current.shortcode);
  const { $toList } = useCurrencyUtils();

  const availablePaymentMethods = getAvailablePaymentMethods(undefined, product);

  const payLaterMethods = availablePaymentMethods
    .filter((p) => p.type === 'paylater' && Object.keys(payLaterImageProps).includes(p.slug))
    .slice(0, 3);

  const maxInstallments = Math.max(
    ...payLaterMethods.map((p) => p.config.map((c) => c.installments)).flat()
  );

  const tripleAMethods = availablePaymentMethods.filter((pm) => pm.slug.startsWith('triple-a'));

  if (!(!!payLaterMethods.length || !!tripleAMethods.length) && !!price) return null;

  return (
    <Blink mt={2} mb={1}>
      {!!payLaterMethods.length && (
        <Box flexDirection="row" alignItems="center">
          <Text fontSize={1} style={{ marginRight: 3 }}>
            <Trans>Buy with</Trans>
          </Text>
          {payLaterMethods.map((payment, i) => (
            <React.Fragment key={i}>
              <AnchorButton to={payment.countries[shortcode]?.help_url} mx={1} height={11}>
                <ImgixImage {...payLaterImageProps[payment.slug]} fullQuality />
              </AnchorButton>

              {((payment.slug === 'afterpay' && ['AU', 'NZ'].includes(shortcode)) ||
                (payment.slug === 'paidy' && shortcode === 'JP')) && (
                <HintDialog
                  hintContent={
                    <Ionicon name="information-circle" size={16} color={theme.colors.textBlack} />
                  }
                >
                  <PayLaterDialog shortcode={shortcode} paymentMethod={payment.slug} />
                </HintDialog>
              )}

              {payLaterMethods.length - 1 === i && (
                <Text fontSize={1} style={{ marginLeft: 3 }}>
                  {price ? (
                    <Trans>as low as {$toList(price / maxInstallments)}/m</Trans>
                  ) : (
                    <Trans>in {maxInstallments} installments</Trans>
                  )}
                </Text>
              )}

              {payLaterMethods.length > 1 && payLaterMethods.length - 1 !== i && (
                <Text fontSize={1} style={{ paddingHorizontal: 2 }} color="gray5">
                  |
                </Text>
              )}
            </React.Fragment>
          ))}
        </Box>
      )}

      {!!tripleAMethods.length && (
        <Box flexDirection="row" alignItems="center">
          <Text fontSize={1}>
            <Trans>Buy with Cryptos</Trans>{' '}
          </Text>
          {tripleAMethods.map((pm, i) => (
            <Box key={i} ml={1}>
              <PaymentPartnerIcons height={17} width={17} slug={pm.slug} />
            </Box>
          ))}
          <Text> </Text>
          <CryptoValue crypto="triple-a_bitcoin" priceSGD={price} fontSize={1} />
        </Box>
      )}
    </Blink>
  );
};

export default PayLaterPaymentMessage;
