// @flow

import React from 'react';
import { Trans } from '@lingui/macro';

import { PromotionType } from 'types/resources/promotion';
import { Text, Box } from 'app/components/base';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';

const BuySellPromotionDiscountDisplay = ({
  promotion,
  isPromotionApplicable,
}: {
  promotion: PromotionType;
  isPromotionApplicable: boolean;
}) => {
  const { $$ } = useCurrencyUtils();

  return (
    <>
      {isPromotionApplicable && promotion.type === 'percentage' && (
        <Text color="green" fontFamily="medium">
          &nbsp;(
          {promotion.discount === 100 ? (
            <Trans>Free</Trans>
          ) : (
            <Trans>{promotion.discount}% off</Trans>
          )}
          )
        </Text>
      )}
      {isPromotionApplicable && promotion.type === 'fixed-reduction' && (
        <Text color="green" fontFamily="medium">
          &nbsp;(<Trans>{$$(promotion.discount)} off</Trans>)
        </Text>
      )}
    </>
  );
};

const BuySellPromotionDiscountValue = ({
  regularFee,
  promotionalFee,
  isPromotionApplicable,
}: {
  regularFee: number;
  promotionalFee: number;
  isPromotionApplicable: boolean;
}) => {
  const { $$ } = useCurrencyUtils();

  return (
    <Box flexDirection="row">
      {!isPromotionApplicable ? (
        <Text>{$$(regularFee)}</Text>
      ) : (
        <Box flexDirection="row">
          <Text color="green" fontFamily="medium" textDecorationLine="line-through">
            {$$(regularFee)}
          </Text>
          {promotionalFee > 0 && (
            <Text color="green" fontFamily="medium">
              &nbsp;{$$(promotionalFee)}
            </Text>
          )}
        </Box>
      )}
    </Box>
  );
};

export { BuySellPromotionDiscountDisplay, BuySellPromotionDiscountValue };
