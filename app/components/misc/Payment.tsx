import { PaymentMethodEnumType } from 'types/resources/paymentMethod';

import React from 'react';

import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import BinancePayIcon from 'app/components/icons/BinancePayIcon';
import EthereumIcon from 'app/components/icons/EthereumIcon';
import TetherIcon from 'app/components/icons/TetherIcon';
import theme from 'app/styles/theme';

const PaymentPartnerIcons = ({
  slug,
  height = 60,
  width = 60,
}: {
  slug: PaymentMethodEnumType;
  height?: number;
  width?: number;
}) => {
  const icons: any = {
    'triple-a_bitcoin': (
      <MaterialCommunityIcon name="bitcoin" size={height * 1.08} color={theme.colors.bitcoin} />
    ),
    'triple-a_ethereum': <EthereumIcon height={height} width={width} />,
    'triple-a_tether': <TetherIcon height={height} width={width} />,
    'triple-a_binance_pay': <BinancePayIcon height={height} width={width} />,
  };

  return icons[slug];
};

export { PaymentPartnerIcons };
