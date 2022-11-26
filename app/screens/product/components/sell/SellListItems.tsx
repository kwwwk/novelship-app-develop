import { PromotionType } from 'types/resources/promotion';
import { ProductRoutes } from 'types/navigation';
import { ProductType } from 'types/resources/product';
import { UserType } from 'types/resources/user';

import React, { useContext } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { Trans } from '@lingui/macro';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { BuySellPromotionDiscountDisplay } from 'app/components/promotion/BuySellPromotion';
import { PAYMENT_PROCESSING_FEES_SELLING } from 'common/constants/currency';
import { getShippingFeePromotion } from 'common/utils/sell';
import { Box, ButtonBase, Text } from 'app/components/base';
import { useStoreState } from 'app/store';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import theme from 'app/styles/theme';

// import ShippingSurchargeInfoDialog from '../common/ShippingSurchargeInfoDialog';
import SellListItemSellingFee from '../common/SellListItemSellingFee';
import ProductCheckoutContext from '../../context';
import ListItem from '../common/ListItem';

const SellListItems = ({ product }: { product: ProductType }) => {
  const seller: UserType = useStoreState((s) => s.user.user);
  const {
    sell: { sell },
  } = useContext(ProductCheckoutContext);
  const { $$ } = useCurrencyUtils();

  const navigation = useNavigation<StackNavigationProp<ProductRoutes, 'SellReview'>>();

  const sellPrice = sell.isList ? sell.local_price : sell.price;

  const shippingFeePromotion: PromotionType = getShippingFeePromotion({
    shippingFeeRegular: sell.fees.shippingFeeRegular,
    price: sellPrice,
    product,
    seller,
  });
  const isShippingPromotionApplicable = !!shippingFeePromotion.id;

  return (
    <Box>
      {sell.size !== 'OS' && (
        <ListItem>
          <Text fontFamily="medium">
            <Trans>Size</Trans>
          </Text>
          <ButtonBase
            onPress={() => navigation.navigate('Sizes', { flow: 'sell' })}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Text fontFamily="bold" mr={3}>
              {sell.local_size}
            </Text>
            <MaterialCommunityIcon name="pencil" size={20} color={theme.colors.textBlack} />
          </ButtonBase>
        </ListItem>
      )}

      {sell.isList && (
        <ListItem>
          <Text fontFamily="medium">
            <Trans>List Expiration</Trans>
          </Text>
          <Text fontFamily="bold">
            <ButtonBase
              onPress={() => navigation.goBack()}
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <Text fontFamily="bold" mr={3}>
                <Trans>{sell.expiration} Days</Trans>
              </Text>
              <MaterialCommunityIcon name="pencil" size={20} color={theme.colors.textBlack} />
            </ButtonBase>
          </Text>
        </ListItem>
      )}

      <ListItem>
        <Text fontFamily="medium">
          {sell.isList ? <Trans>List Price</Trans> : <Trans>Product Price</Trans>}
        </Text>
        <Text fontFamily="medium">{$$(sellPrice)}</Text>
      </ListItem>

      <ListItem>
        <Text fontFamily="medium">
          <Trans>Shipping</Trans>
        </Text>
        <Text fontFamily="medium">
          {sell.fees.shippingFeeRegular > 0 && '-'} {$$(sell.fees.shippingFeeRegular)}
        </Text>
      </ListItem>

      {/* {!!sell.fees.shippingSurcharge && (
        <ListItem>
          <ShippingSurchargeInfoDialog />
          <Text fontFamily="medium">- {$$(sell.fees.shippingSurcharge)}</Text>
        </ListItem>
      )} */}

      {isShippingPromotionApplicable && (
        <ListItem>
          <Box flexDirection="row">
            <Text color="green" fontFamily="medium">
              <Trans>Shipping Discount</Trans>
            </Text>
            <BuySellPromotionDiscountDisplay
              isPromotionApplicable={isShippingPromotionApplicable}
              promotion={shippingFeePromotion}
            />
          </Box>
          <Text color="green" fontFamily="medium">
            + {$$(sell.fees.shippingFeeRegular - shippingFeePromotion.fee)}
          </Text>
        </ListItem>
      )}

      <ListItem>
        <SellListItemSellingFee />
        <Text fontFamily="medium">- {$$(sell.fees.selling)}</Text>
      </ListItem>

      <ListItem>
        <Text fontFamily="medium">
          <Trans>Processing Fee ({PAYMENT_PROCESSING_FEES_SELLING * 100}%)</Trans>
        </Text>
        <Text fontFamily="medium">- {$$(sell.fees.processing_sell)}</Text>
      </ListItem>

      <ListItem>
        <Text fontFamily="bold">
          <Trans>Total Payout</Trans>
        </Text>
        <Text fontFamily="bold">{$$(sell.totalPrice > 0 ? sell.totalPrice : 0)}</Text>
      </ListItem>
    </Box>
  );
};

export default SellListItems;
