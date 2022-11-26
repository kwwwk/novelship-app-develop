import { PromotionType } from 'types/resources/promotion';
import { ProductRoutes } from 'types/navigation';
import { ProductType } from 'types/resources/product';

import React, { useContext } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { t, Trans } from '@lingui/macro';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { BuySellPromotionDiscountDisplay } from 'app/components/promotion/BuySellPromotion';
import { getDeliveryFeePromotion } from 'common/utils/buy';
import { Box, ButtonBase, Text } from 'app/components/base';
import { useStoreState } from 'app/store';
import ProductCheckoutContext from 'app/screens/product/context';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import theme from 'app/styles/theme';

import { i18n } from '@lingui/core';
import { CryptoValue } from 'app/components/widgets/Crypto';
import ListItem from '../common/ListItem';
import ProductAddOnSelect from '../common/ProductAddOnSelect';

const BuyOfferItems = ({
  view,
  size,
  product,
  isDeliveryPaid = false,
}: {
  view: 'buy' | 'delivery';
  size?: string;
  product: ProductType;
  isDeliveryPaid?: boolean;
}) => {
  const user = useStoreState((s) => s.user.user);
  const {
    buy: {
      buy,
      paymentMethod,
      promocode: { currentPromocode },
    },
  } = useContext(ProductCheckoutContext);
  const { $$, toBaseCurrency } = useCurrencyUtils();

  const navigation = useNavigation<StackNavigationProp<ProductRoutes, 'BuyReview'>>();
  const buyPrice = buy.isOffer ? buy.local_price : buy.price;
  const isBuyOrOffer = view !== 'delivery';
  // const isInstantBuy = buy.instant_fee_applicable;

  const deliveryFeePromotion: PromotionType = getDeliveryFeePromotion({
    deliveryFeeRegular: buy.fees.deliveryFeeRegular,
    price: buyPrice,
    product,
    user,
  });
  const isDeliveryPromotionApplicable = !!deliveryFeePromotion.id && buy.deliver_to !== 'storage';
  const deliveryPrepaidText = (isDeliveryPaid && i18n._(t`(Prepaid)`)) || '';

  return (
    <Box>
      {(size || buy.size) !== 'OS' && (
        <ListItem>
          <Text fontFamily="medium">
            <Trans>Size</Trans>
          </Text>
          {size ? (
            <Text fontFamily="bold">{size}</Text>
          ) : (
            <ButtonBase
              onPress={() => navigation.navigate('Sizes', { flow: 'buy' })}
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <Text fontFamily="bold" mr={3}>
                {buy.local_size}
              </Text>
              <MaterialCommunityIcon name="pencil" size={20} color={theme.colors.textBlack} />
            </ButtonBase>
          )}
        </ListItem>
      )}

      {buy.isOffer && (
        <ListItem>
          <Text fontFamily="medium">
            <Trans>Offer Expiration</Trans>
          </Text>
          <Text fontFamily="bold">
            <ButtonBase
              onPress={() => navigation.goBack()}
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <Text fontFamily="bold" mr={3}>
                <Trans>{buy.expiration} Days</Trans>
              </Text>
              <MaterialCommunityIcon name="pencil" size={20} color={theme.colors.textBlack} />
            </ButtonBase>
          </Text>
        </ListItem>
      )}

      {isBuyOrOffer && (
        <ListItem>
          <Text fontFamily="medium">
            {buy.isOffer ? <Trans>Offer Price</Trans> : <Trans>Product Price</Trans>}
          </Text>
          <Text fontFamily="medium">{$$(buyPrice + buy.fees.deliveryInstant)}</Text>
        </ListItem>
      )}

      <ProductAddOnSelect />
      <ListItem>
        <Box flexDirection="row">
          <Text fontFamily="medium">
            <Trans>Delivery</Trans> {deliveryPrepaidText}
          </Text>
        </Box>
        <Text fontFamily="medium">{$$(buy.fees.deliveryFeeRegular)}</Text>
      </ListItem>

      {/* {!!buy.fees.deliverySurcharge && (
        <ListItem>
          <ShippingSurchargeInfoDialog deliveryPrepaidText={deliveryPrepaidText} />
          <Text fontFamily="medium">{$$(buy.fees.deliverySurcharge)}</Text>
        </ListItem>
      )} */}

      {isDeliveryPromotionApplicable && (
        <ListItem>
          <Box flexDirection="row">
            <Text color="green" fontFamily="medium">
              <Trans>Delivery Discount</Trans>
            </Text>
            <BuySellPromotionDiscountDisplay
              isPromotionApplicable={isDeliveryPromotionApplicable}
              promotion={deliveryFeePromotion}
            />
          </Box>
          <Text color="green" fontFamily="medium">
            - {$$(buy.fees.deliveryFeeRegular - deliveryFeePromotion.fee)}
          </Text>
        </ListItem>
      )}

      {/* {isInstantBuy && (
        <ListItem>
          <InstantDeliveryInfoDialog />
          <Text fontFamily="medium">{$$(buy.fees.deliveryInstant)}</Text>
        </ListItem>
      )} */}

      {isBuyOrOffer && (
        <ListItem>
          <Text>
            <Text fontFamily="medium">
              <Trans>Processing Fee</Trans>&nbsp;
              {/* ({buy.fees.processingBuyPercent * 100}%) */}
            </Text>
          </Text>
          <Text fontFamily="medium">{$$(buy.fees.processing_buy)}</Text>
        </ListItem>
      )}

      {isBuyOrOffer && !!buy.buyer_delivery_declared && (
        <ListItem>
          <Text fontFamily="medium">
            <Trans>Delivery Protection</Trans>
          </Text>
          <Text fontFamily="medium">{$$(buy.fees.delivery_insurance)}</Text>
        </ListItem>
      )}

      <ListItem>
        <Text>
          <Text fontFamily="bold">
            <Trans>Total Price</Trans> &nbsp;{deliveryPrepaidText}
          </Text>
          <Text fontFamily="bold" color="green">
            {currentPromocode.value ? `(-${$$(currentPromocode.value)})` : ''}
          </Text>
        </Text>
        <Text fontFamily="bold">{$$(buy.totalPrice)}</Text>
      </ListItem>
      {paymentMethod.startsWith('triple-a') && (
        <ListItem>
          <Text fontFamily="bold">
            <Trans>Pay By Crypto</Trans>
          </Text>
          <Text>
            <CryptoValue
              priceSGD={toBaseCurrency(buy.totalPrice)}
              crypto={paymentMethod}
              fontFamily="bold"
              fontSize={3}
            />
          </Text>
        </ListItem>
      )}
    </Box>
  );
};

export default BuyOfferItems;
