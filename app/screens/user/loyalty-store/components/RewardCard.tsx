import { Trans, t } from '@lingui/macro';
import { Box, Button, Text } from 'app/components/base';
import useToggle from 'app/hooks/useToggle';
import React from 'react';
import { UserType } from 'types/resources/user';
import { VoucherType } from 'types/resources/voucher';
import { i18n } from '@lingui/core';
import { $, getCurrentCurrency } from 'common/utils/currency';
import { isVoucherDiscountAvailable } from 'common/constants/campaign';
import CollectiblesIcon from 'app/components/icons/CollectiblesIcon';
import ShippingIcon from 'app/components/icons/ShippingIcon';
import SneakersIcon from 'app/components/icons/SneakersIcon';
import ApparelIcon from 'app/components/icons/ApparelIcon';
import { useQuery } from 'react-query';
import ExchangeRewardDialog from './ExchangeRewardDialog';

type VouchersByCategoryType = {
  Shipping: number;
  Sneakers: number;
  Apparel: number;
  Collectibles: number;
};

const RewardCard = ({ voucher, user }: { user: UserType; voucher: VoucherType }) => {
  const [isExchangeRewardDialogOpen, toggleExchangeRewardDialog] = useToggle(false);
  const {
    data: voucherDiscounts = {
      Shipping: 0,
      Sneakers: 0,
      Apparel: 0,
      Collectibles: 0,
    },
  } = useQuery<VouchersByCategoryType>('/vouchers/promotion');

  const { Shipping, Sneakers, Apparel, Collectibles } = voucherDiscounts;
  const {
    voucherDiscounts: { [voucher.category]: discount },
  } = { voucherDiscounts };

  const voucherDiscount = isVoucherDiscountAvailable({
    shippingDiscount: Shipping,
    sneakerDiscount: Sneakers,
    apparelDiscount: Apparel,
    collectiblesDiscount: Collectibles,
  })[voucher.category]
    ? Math.ceil((voucher.cost * discount) / 100)
    : 0;

  const voucherCost = voucher.cost - voucherDiscount;

  const canBuy = voucher.limit
    ? voucher.limit > voucher.brought && voucherCost <= user.points
    : voucherCost <= user.points;

  return (
    <Box backgroundColor="white" borderBottomWidth={2} borderColor="dividerGray" px={7} py={4}>
      <Box width="100%" flexDirection="row">
        <Box>
          {voucher.category === 'Shipping' && <ShippingIcon />}
          {voucher.category === 'Sneakers' && <SneakersIcon />}
          {voucher.category === 'Apparel' && <ApparelIcon />}
          {voucher.category === 'Collectibles' && (
            <Box center width={80}>
              <CollectiblesIcon />
            </Box>
          )}
        </Box>

        <Box px={8}>
          {voucher.category === 'Shipping' ? (
            <>
              <Text fontSize={2}>{i18n._(voucher.name)}&nbsp;</Text>
              <Text fontSize={2} fontFamily="bold" mt={2}>
                <Trans>Up to</Trans> {$(voucher.value, getCurrentCurrency())}
              </Text>
            </>
          ) : (
            <Box>
              <Text fontSize={2} fontFamily="bold">
                {$(voucher.value, getCurrentCurrency())}&nbsp;<Trans>Discount</Trans>
              </Text>
            </Box>
          )}
          <Box mt={2} flexDirection="row" alignItems="center">
            <Text fontSize={2} color="gray1">
              <Trans>Cost:</Trans>&nbsp;
            </Text>

            {voucherCost === voucher.cost ? (
              <Text fontSize={2} fontFamily="bold">
                <Trans>{voucherCost} NSP</Trans>
              </Text>
            ) : (
              <>
                <Text fontSize={2} style={{ textDecorationLine: 'line-through' }}>
                  <Trans>{voucher.cost} NSP</Trans>
                </Text>
                <Text fontSize={2} color="green">
                  {' '}
                  <Trans>{voucherCost} NSP</Trans>
                </Text>
              </>
            )}
          </Box>
          <Box mt={4}>
            <Button
              variant="black"
              width={200}
              onPress={toggleExchangeRewardDialog}
              text={i18n._(t`EXCHANGE`)}
              disabled={!canBuy}
              size="sm"
            />
          </Box>
        </Box>
      </Box>

      <ExchangeRewardDialog
        isExchangeRewardDialogOpen={isExchangeRewardDialogOpen}
        toggleExchangeRewardDialog={toggleExchangeRewardDialog}
        voucherCost={voucherCost}
        user={user}
        voucher={voucher}
      />
    </Box>
  );
};

export default React.memo(RewardCard);
