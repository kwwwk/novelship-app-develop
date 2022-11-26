import React from 'react';
import { useStoreState } from 'app/store';
import { Box, Text } from 'app/components/base';
import { Trans } from '@lingui/macro';
import { normalizeNumber } from 'common/utils/currency';
import { TextProps } from 'app/components/base/Text';
import { PaymentMethodEnumType } from 'types/resources/paymentMethod';
import { PaymentPartnerIcons } from '../misc/Payment';

function CryptoAcceptedText() {
  const getAvailablePaymentMethods = useStoreState((s) => s.base.getAvailablePaymentMethods);
  const availablePaymentMethods = getAvailablePaymentMethods();
  const tripleAMethods = availablePaymentMethods.filter((pm) => pm.slug.startsWith('triple-a'));

  if (!tripleAMethods.length) return null;

  return (
    <Box flexDirection="row" alignItems="center">
      <Text fontSize={1} color="gray1">
        <Trans>We accept crypto payments</Trans>{' '}
      </Text>
      {tripleAMethods.map((pm, i) => (
        <Box key={i} mx={1}>
          <PaymentPartnerIcons height={18} width={18} slug={pm.slug} />
        </Box>
      ))}
    </Box>
  );
}

const cryptoMap = {
  'triple-a_bitcoin': 'BTC',
  'triple-a_ethereum': 'ETH',
  'triple-a_tether': 'USDT',
  'triple-a_binance_pay': 'BTC',
} as const;

function CryptoValue({
  crypto,
  priceSGD,
  ...props
}: {
  crypto: keyof typeof cryptoMap | PaymentMethodEnumType;
  priceSGD: number;
} & TextProps) {
  const cryptoRates = useStoreState((s) => s.base.cryptoRates);
  const cryptoCode = cryptoMap[crypto as unknown as keyof typeof cryptoMap];

  if (!priceSGD || !cryptoCode) return null;
  const cryptoValue = normalizeNumber(priceSGD / cryptoRates[cryptoCode], 6);

  return (
    <>
      <Text fontSize={2} {...props}>
        <Trans>Around</Trans>
      </Text>
      <Text> </Text>
      <Text fontSize={2} {...props}>
        {cryptoValue} {cryptoCode}
      </Text>
    </>
  );
}

export { CryptoAcceptedText, CryptoValue };
