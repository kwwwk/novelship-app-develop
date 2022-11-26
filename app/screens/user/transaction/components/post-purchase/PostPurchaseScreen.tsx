import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Trans, t } from '@lingui/macro';
import { i18n } from '@lingui/core';

import {
  SafeAreaScreenContainer,
  ScrollContainer,
  PageContainer,
  Footer,
  KeyboardAwareContainer,
} from 'app/components/layout';
import { Button, Text, Box, Anchor } from 'app/components/base';
import { LB } from 'common/constants';
import ProductImageHeader from 'app/screens/product/components/common/ProductImageHeader';
import useToggle from 'app/hooks/useToggle';

import { TransactionBuyerType } from 'types/resources/transactionBuyer';
import { CURRENCY_CONSTANTS } from 'common/constants/currency';
import { SALE_STATUS_BUYER_DELIVERY_PROTECTION_AVAILABLE } from 'common/constants/transaction';
import API from 'common/api';
import CheckBoxInput from 'app/components/form/CheckBox';
import { useStoreState } from 'app/store';
import getFaqLink from 'common/constants/faq';
import { getDeliveryInsuranceFee } from 'common/utils/buy';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootRoutes, UserRoutes } from 'types/navigation';
import PostPurchaseConfirmDialog from './PostPurchaseConfirmDialog';
import PostPurchaseDeliveryProtection from './PostPurchaseDeliveryProtection';
import PostPurchaseButton from './PostPurchaseButton';

type PostPurchaseNavigationProp = CompositeNavigationProp<
  StackNavigationProp<UserRoutes, 'PostPurchase'>,
  StackNavigationProp<RootRoutes, 'ProductStack'>
>;

const PostPurchaseScreen = ({ transaction }: { transaction: TransactionBuyerType }) => {
  const navigation = useNavigation<PostPurchaseNavigationProp>();
  const user = useStoreState((s) => s.user.user);
  const buyPrice = transaction.offer_price_local;

  const [buyDeclared, setBuyDeclared] = useState<number>(
    transaction.buyer_delivery_declared || buyPrice
  );
  const [buyDeclareError, setBuyDeclareError] = useState<string>('');
  const [dutyCheck, setDutyCheck] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmationDialog, confirmationDialogToggle] = useToggle(false);

  const { deliveryInsuranceMaxFree } = CURRENCY_CONSTANTS[transaction.buyer_currency.code];
  const isDeliveryProtected = buyPrice <= deliveryInsuranceMaxFree;

  const disableDeliveryProtection = !!(
    transaction.deliver_to === 'storage' ||
    transaction.buyer_delivery_declared ||
    !SALE_STATUS_BUYER_DELIVERY_PROTECTION_AVAILABLE.includes(transaction.status) ||
    isDeliveryProtected
  );

  const canProceed =
    user.hasBuyCardAndEnabled &&
    dutyCheck &&
    !!buyDeclared &&
    !buyDeclareError &&
    !disableDeliveryProtection;

  const deliveryInsurance = getDeliveryInsuranceFee({
    deliveryDeclare: buyDeclared,
    currency: transaction.buyer_currency,
  });

  const postPurchaseError = (error: string) => {
    setLoading(false);

    return Alert.alert(
      '',
      error,
      [
        {
          text: i18n._(t`RETRY`),
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const afterCreate = () => {
    setLoading(false);
    navigation.push('PostPurchaseConfirmed', {
      sale_ref: transaction.ref,
    });
  };

  const confirmDeliveryDeclare = () => {
    setLoading(true);
    API.put(`me/sales/${transaction.ref}/delivery-insurance`, {
      buyer_delivery_declared: buyDeclared,
    })
      .then(afterCreate)
      .catch(postPurchaseError)
      .finally(() => setLoading(false));
  };

  return (
    <SafeAreaScreenContainer>
      <KeyboardAwareContainer behavior="position">
        <ScrollContainer>
          <ProductImageHeader
            transactionRef={transaction.ref}
            p={5}
            size={transaction.local_size}
            product={transaction.product}
            borderBottomWidth={1}
            borderBottomColor="gray6"
          />
          <PageContainer py={4} px={5}>
            <Box mt={4} width="100%" justifyContent="center" alignItems="center" mb={5}>
              <Box width="50%" flex={1} mr={2}>
                <PostPurchaseButton
                  iconSrc="icons/delivery_protection.png"
                  selected
                  disabled={disableDeliveryProtection}
                >
                  <Trans>
                    Purchase {LB}
                    Delivery{LB}
                    Protection
                  </Trans>
                </PostPurchaseButton>
              </Box>
            </Box>

            <PostPurchaseDeliveryProtection
              transaction={transaction}
              buyDeclared={buyDeclared}
              setBuyDeclared={setBuyDeclared}
              buyDeclareError={buyDeclareError}
              setBuyDeclareError={setBuyDeclareError}
              deliveryInsurance={deliveryInsurance}
            />
          </PageContainer>
        </ScrollContainer>
      </KeyboardAwareContainer>

      <Footer>
        <>
          <CheckBoxInput checked={dutyCheck} onChecked={setDutyCheck}>
            <Text color="gray1" fontSize={13} lineHeight={15}>
              <Trans>
                I understand I am responsible for import duties, taxes and fees.{' '}
                <Anchor
                  to={getFaqLink('duty_tax')}
                  fontSize={13}
                  textDecorationLine="underline"
                  color="blue"
                >
                  Learn more
                </Anchor>
              </Trans>
            </Text>
          </CheckBoxInput>
          <Box>
            <Button
              variant="black"
              size="lg"
              text={`${i18n._(t`CONFIRM PURCHASE`)}`}
              loading={loading}
              disabled={!canProceed}
              onPress={confirmationDialogToggle}
            />
          </Box>
        </>
      </Footer>

      <PostPurchaseConfirmDialog
        isOpen={confirmationDialog}
        onConfirm={confirmDeliveryDeclare}
        toggleDialog={confirmationDialogToggle}
        title={i18n._(t`CONFIRM PURCHASE`)}
        transaction={transaction}
        deliveryInsurance={deliveryInsurance}
      />
    </SafeAreaScreenContainer>
  );
};

export default PostPurchaseScreen;
