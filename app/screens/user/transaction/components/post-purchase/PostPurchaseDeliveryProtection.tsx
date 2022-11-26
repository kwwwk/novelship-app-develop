import React from 'react';
import { Trans, t } from '@lingui/macro';
import { i18n } from '@lingui/core';

import { ImgixImage, Text, Box } from 'app/components/base';
import { getImgixUrl } from 'common/constants';

import { TransactionBuyerType } from 'types/resources/transactionBuyer';
import { CURRENCY_CONSTANTS } from 'common/constants/currency';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootRoutes, UserRoutes } from 'types/navigation';
import ErrorMessage from 'app/components/form/ErrorMessage';
import ListItem from 'app/screens/product/components/common/ListItem';
import PriceInput from 'app/screens/product/components/common/PriceInput';
import PaymentButton from 'app/screens/product/components/buy/PaymentButton';
import TermsAndPrivacy from 'app/screens/product/components/common/TermsAndPrivacy';
import { useStoreState } from 'app/store';
import { PostDeliveryProtectionNotes } from './PostDeliveryProtectionNotes';

type PostPurchaseNavigationProp = CompositeNavigationProp<
  StackNavigationProp<UserRoutes, 'PostPurchase'>,
  StackNavigationProp<RootRoutes, 'ProductStack'>
>;

const PostPurchaseDeliveryProtection = ({
  transaction,
  buyDeclared,
  setBuyDeclared,
  buyDeclareError,
  setBuyDeclareError,
  deliveryInsurance,
}: {
  transaction: TransactionBuyerType;
  buyDeclared: number;
  setBuyDeclared: (b: number) => void;
  buyDeclareError: string;
  setBuyDeclareError: (e: string) => void;
  deliveryInsurance: number;
}) => {
  const navigation = useNavigation<PostPurchaseNavigationProp>();
  const user = useStoreState((s) => s.user.user);
  const buyPrice = transaction.offer_price_local;

  const { $$ } = useCurrencyUtils();

  const { deliveryInsuranceMaxFree } = CURRENCY_CONSTANTS[transaction.buyer_currency.code];
  const buyerDeliveryInsuranceMaxFree = $$(deliveryInsuranceMaxFree, transaction.buyer_currency);

  const onBuyDeclareChange = (e: string) => {
    setBuyDeclareError('');
    setBuyDeclared(parseInt(e));
    const _effectiveBuyDeclared = parseInt(e, 10);

    if (_effectiveBuyDeclared <= deliveryInsuranceMaxFree) {
      return setBuyDeclareError(
        i18n._(t`We already provide free protection up to ${buyerDeliveryInsuranceMaxFree}`)
      );
    }
    if (_effectiveBuyDeclared > buyPrice) {
      return setBuyDeclareError(
        i18n._(t`The value of your protection is capped by the product price.`)
      );
    }
  };

  return (
    <>
      <PostDeliveryProtectionNotes />

      <Box mt={3} borderTopWidth={1} borderTopColor="dividerGray">
        <ListItem mt={5}>
          <Text fontFamily="medium">
            <Trans>Size</Trans>
          </Text>
          <Text fontFamily="medium">{transaction.local_size}</Text>
        </ListItem>
        <ListItem>
          <Text fontFamily="medium">
            <Trans>Product Price</Trans>
          </Text>
          <Text fontFamily="medium">{$$(buyPrice, transaction.buyer_currency)}</Text>
        </ListItem>
        <ListItem>
          <Text fontFamily="medium">
            <Trans>Delivery Protection</Trans>
          </Text>
          <Text fontFamily="medium" color="blue">
            {$$(deliveryInsurance, transaction.buyer_currency)}
          </Text>
        </ListItem>
        <Box mt={4} center>
          <Text fontFamily="bold" fontSize={2}>
            <ImgixImage src={getImgixUrl('icons/delivery_protection.png')} height={14} width={14} />{' '}
            <Trans>Declare Value of Declaration and Protection</Trans>
          </Text>
        </Box>
        <Box center mt={3}>
          <Text textAlign="center" fontFamily="bold" color="gray2">
            {transaction.buyer_currency.code}
          </Text>
          <PriceInput min={0} step={1} value={buyDeclared} onChangeText={onBuyDeclareChange} />
          <ErrorMessage mt={2} style={{ opacity: buyDeclareError ? 1 : 0 }}>
            {buyDeclareError || '--'}
          </ErrorMessage>
        </Box>
        <Box mt={5}>
          <PaymentButton
            currentPaymentMethod="stripe"
            mode="buy"
            user={user}
            selectPayment={() =>
              navigation.push('ProductStack', {
                screen: 'PaymentSelect',
                slug: transaction.product.name_slug,
                params: {
                  cardOnly: true,
                },
              })
            }
          />
        </Box>
        <TermsAndPrivacy />
      </Box>
    </>
  );
};

export default PostPurchaseDeliveryProtection;
