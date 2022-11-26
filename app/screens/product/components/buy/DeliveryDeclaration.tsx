import { i18n } from '@lingui/core';
import { t, Trans } from '@lingui/macro';
import React, { useContext, useEffect, useState } from 'react';

import { useStoreState } from 'app/store';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import getFaqLink from 'common/constants/faq';
import { Input } from 'app/components/form';
import { CURRENCY_CONSTANTS } from 'common/constants/currency';
import CheckBoxInput from 'app/components/form/CheckBox';
import HintDialog from 'app/components/dialog/HintDialog';
import { Anchor, Box, Button, Text } from 'app/components/base';
import ErrorMessage from 'app/components/form/ErrorMessage';
import theme from 'app/styles/theme';
import ProductCheckoutContext from '../../context';

const BuyDeclareInfoDialog = () => (
  <HintDialog>
    <Box center p={2}>
      <Text fontFamily="bold" fontSize={3} mb={4}>
        <Trans>ALWAYS USE PROTECTION</Trans>
      </Text>
      <Text textAlign="center" fontSize={2} mx={4}>
        <Trans>
          When selecting Delivery to complete your purchase, you can choose how much to declare and
          protect your purchase at. Duties are payable based on declared amount.
        </Trans>
      </Text>
      <Anchor
        to={getFaqLink('delivery_declare')}
        fontSize={2}
        textDecorationLine="underline"
        color="blue"
      >
        <Trans>Learn more</Trans>
      </Anchor>
    </Box>
  </HintDialog>
);

const DeliveryDeclaration = () => {
  const {
    buy: { buy, setDeliveryDeclare },
  } = useContext(ProductCheckoutContext);
  const currentCurrency = useStoreState((s) => s.currency.current);

  const { $$ } = useCurrencyUtils();

  const isStorageDelivery = buy.deliver_to === 'storage';
  const buyPrice = buy.isOffer ? buy.local_price : buy.price;
  const { deliveryInsuranceMaxFree } = CURRENCY_CONSTANTS[currentCurrency.code];

  const [declareCheck, setDeclareCheck] = useState(!!buy.buyer_delivery_declared);
  const [buyDeclared, setBuyDeclared] = useState<number>(buy.buyer_delivery_declared || buyPrice);
  const [buyDeclareError, setBuyDeclareError] = useState<string>('');
  const [isBuyDeclareEditable, setIsBuyDeclareEditable] = useState<boolean>(
    !buy.buyer_delivery_declared
  );

  const toggleBuyDeclared = () => {
    if (declareCheck) {
      setDeliveryDeclare(0);
    }
    setDeclareCheck(!declareCheck);
    setIsBuyDeclareEditable(true);
  };

  const confirmOrEditDeliveryDeclare = () => {
    if (isBuyDeclareEditable) {
      const effectiveBuyDeclared = buyDeclared > buyPrice ? buyPrice : buyDeclared;

      if (effectiveBuyDeclared < deliveryInsuranceMaxFree) {
        return setBuyDeclareError(
          `We already provide free protection up to ${$$(deliveryInsuranceMaxFree)}`
        );
      }

      setBuyDeclareError('');
      setBuyDeclared(effectiveBuyDeclared);
      setDeliveryDeclare(effectiveBuyDeclared);
      setIsBuyDeclareEditable(false);
    } else {
      setIsBuyDeclareEditable(true);
    }
  };

  useEffect(() => {
    if (isStorageDelivery) {
      setDeclareCheck(false);
      setDeliveryDeclare(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStorageDelivery]);

  useEffect(() => {
    setDeclareCheck(false);
    setBuyDeclared(buyPrice);
  }, [buyPrice]);

  return (
    <Box mt={3} mb={3}>
      {buyPrice <= deliveryInsuranceMaxFree ? (
        !isStorageDelivery && (
          <Box flexDirection="row">
            <Text
              fontSize={2}
              mr={1}
              color={isStorageDelivery ? 'gray3' : 'textBlack'}
              style={{ paddingTop: 1 }}
            >
              <Trans>Your delivery is protected free of charge.</Trans>
            </Text>
            <BuyDeclareInfoDialog />
          </Box>
        )
      ) : (
        <>
          <CheckBoxInput
            checked={declareCheck}
            onChecked={toggleBuyDeclared}
            disabled={isStorageDelivery}
          >
            <Box flexDirection="row">
              <Text
                fontSize={2}
                mr={1}
                color={isStorageDelivery ? 'gray3' : 'textBlack'}
                style={{ paddingTop: 1 }}
              >
                <Trans>I would like to declare and protect my delivery</Trans>
              </Text>
              <BuyDeclareInfoDialog />
            </Box>
          </CheckBoxInput>
          {declareCheck && (
            <>
              <Text fontSize={2} mx={1}>
                <Trans>What is the value you want to protect and declare at?</Trans>
              </Text>
              <Box flexDirection="row" justifyContent="space-between" alignItems="center" my={2}>
                {isBuyDeclareEditable ? (
                  <Box
                    width="50%"
                    mr={1}
                    flexDirection="row"
                    alignItems="center"
                    height={theme.constants.BUTTON_HEIGHT}
                  >
                    <Input
                      value={buyDeclared ? buyDeclared.toString() : ''}
                      onChangeText={(e) => setBuyDeclared(parseInt(e))}
                      keyboardType="numeric"
                      style={{ height: 40 }}
                    />

                    <Text fontFamily="medium" ml={3}>
                      {currentCurrency.code}
                    </Text>
                  </Box>
                ) : (
                  <Box center ml={2} height={theme.constants.BUTTON_HEIGHT}>
                    <Text fontFamily="bold">{$$(buy.buyer_delivery_declared)}</Text>
                  </Box>
                )}
                <Box width="30%">
                  <Button
                    variant="white"
                    text={isBuyDeclareEditable ? i18n._(t`CONFIRM`) : i18n._(t`EDIT`)}
                    onPress={confirmOrEditDeliveryDeclare}
                    disabled={isStorageDelivery}
                    size="sm"
                  />
                </Box>
              </Box>
              <ErrorMessage>{buyDeclareError}</ErrorMessage>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default DeliveryDeclaration;
