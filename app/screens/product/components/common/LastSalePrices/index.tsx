import React, { useContext, useState } from 'react';
import { Trans, t } from '@lingui/macro';
import { i18n } from '@lingui/core';
import { Box, Text, ButtonBase } from 'app/components/base';

import ProductCheckoutContext from 'app/screens/product/context';
import LastSalePricesChart from './LastSalePricesChart';
import LastSalePricesList from './LastSalePricesList';

const LastSalePrices = ({ isBuy, size }: { isBuy: boolean; size: string }) => {
  const {
    product: { id: productId },
    lastSalesPricesForSize,
  } = useContext(ProductCheckoutContext);

  const [view, setView] = useState<'chart' | 'list'>(isBuy ? 'chart' : 'list');

  if (!lastSalesPricesForSize?.length) return null;

  function Selector({ forView, title }: { forView: 'chart' | 'list'; title: string }) {
    return (
      <ButtonBase onPress={() => setView(forView)} style={{ flex: 1 }}>
        <Box
          center
          justifyContent="center"
          borderBottomWidth={forView === view ? 2 : 0}
          borderColor="black3"
        >
          <Text p={2} color="bgBlack" fontFamily="bold" textTransform="uppercase">
            {i18n._(title)}
          </Text>
        </Box>
      </ButtonBase>
    );
  }

  return (
    <Box width="100%" center>
      <Box flexDirection="row" justifyContent="space-evenly">
        <Selector title={i18n._(t`Price history`)} forView="chart" />
        <Selector title={i18n._(t`Last Sales`)} forView="list" />
      </Box>

      <Box mt={0} center width="100%">
        {view === 'chart' && size && productId ? (
          <LastSalePricesChart size={size} productId={productId} />
        ) : (
          <LastSalePricesList />
        )}
      </Box>
      <Text mt={2} fontSize={1} color="gray3">
        <Trans>Last sale prices includes global data from other sources.</Trans>
      </Text>
    </Box>
  );
};

export default LastSalePrices;
