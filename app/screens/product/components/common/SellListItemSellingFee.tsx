import { UserType } from 'types/resources/user';

import React, { useContext } from 'react';
import { Trans } from '@lingui/macro';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { getSellerFees, getSellerFeePromotion } from 'common/utils/sell';
import { Box, Text, Anchor } from 'app/components/base';
import { useStoreState } from 'app/store';
import { LB } from 'common/constants';
import HintDialog from 'app/components/dialog/HintDialog';
import getFaqLink from 'common/constants/faq';
import theme from 'app/styles/theme';

import ProductCheckoutContext from '../../context';

const SellingFeeKeyContent = ({
  showPromotionHint,
  sellingFees,
  user,
}: {
  showPromotionHint: boolean;
  sellingFees: number;
  user: UserType;
}) => (
  <Box flexDirection="row" alignItems="center">
    <Text fontFamily="medium">Selling Fee </Text>
    <Text fontFamily="medium" textDecorationLine="line-through">
      ({user.selling_fee.value}%)
    </Text>
    <Text fontFamily="medium" color="green" mr={1}>
      ({sellingFees}%)
    </Text>
    {showPromotionHint && (
      <Ionicon name="information-circle" size={20} color={theme.colors.textBlack} />
    )}
  </Box>
);

const SellListItemSellingFee = () => {
  const {
    sell: { sell },
    product,
  } = useContext(ProductCheckoutContext);

  const user = useStoreState((s) => s.user.user);
  const sellPrice = sell.isList ? sell.local_price : sell.price;
  const sellerFeeArgs = {
    seller: user,
    product,
    mode: sell.isList ? 'list' : 'sell',
    price: sellPrice,
    isSellFromStorage: !!sell.sale_storage_ref,
  };
  const sellingFees = getSellerFees(sellerFeeArgs);
  const sellingFeePromotion = getSellerFeePromotion(sellerFeeArgs);
  const isSellFromStoragePromotion = sellingFeePromotion.name === 'Sell_From_Storage';
  const isSellingFeePromotion = !!sellingFeePromotion.id;

  if (sellingFees === user.selling_fee.value)
    return (
      <Text fontFamily="medium">
        <Trans>Selling Fee ({user.selling_fee.value}%)</Trans>
      </Text>
    );

  if (isSellFromStoragePromotion)
    return (
      <HintDialog
        hintContent={
          <SellingFeeKeyContent
            showPromotionHint={isSellFromStoragePromotion}
            sellingFees={sellingFees}
            user={user}
          />
        }
      >
        <Box center p={2}>
          <Text my={4} fontSize={4} fontFamily="bold">
            <Trans>SELLER FEE DISCOUNT</Trans>
          </Text>
          <Text textAlign="center" fontFamily="bold" fontSize={2}>
            <Trans>Why am I getting 50% off my seller fees ?</Trans>
          </Text>
          <Text textAlign="center" fontSize={2}>
            <Trans>
              Get 50% off your seller fees when you Sell Now or List any item from storage.
            </Trans>
          </Text>
          <Text mt={2}>
            <Anchor
              fontSize={2}
              textDecorationLine="underline"
              to={getFaqLink('sell_from_storage')}
            >
              <Trans>Learn more</Trans>
            </Anchor>
          </Text>
        </Box>
      </HintDialog>
    );

  if (isSellingFeePromotion)
    return (
      <HintDialog
        hintContent={
          <SellingFeeKeyContent
            showPromotionHint={isSellingFeePromotion}
            sellingFees={sellingFees}
            user={user}
          />
        }
      >
        <Box center p={2}>
          <Text my={4} fontSize={4} fontFamily="bold">
            {sellingFeePromotion.discount}% <Trans>OFF SELLER FEE</Trans>
          </Text>
          <Text textAlign="center" fontSize={2}>
            <Trans>
              Enjoy {sellingFeePromotion.discount}% off your Seller Fees when you make a Sale or
              your List is sold on Novelship.
            </Trans>
          </Text>

          {sell.isList && (
            <Text textAlign="center" fontSize={2}>
              {LB}
              <Trans>
                Reduced seller fee is only valid during the promotional period. Selling fee discount
                will not apply after the promotion ends.
              </Trans>
            </Text>
          )}
        </Box>
      </HintDialog>
    );

  return (
    <SellingFeeKeyContent
      showPromotionHint={isSellFromStoragePromotion}
      sellingFees={sellingFees}
      user={user}
    />
  );
};

export default SellListItemSellingFee;
