import React from 'react';
import { StyleSheet } from 'react-native';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';

import theme from 'app/styles/theme';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import { ButtonBase, Text, Box } from 'app/components/base';

const HighestOfferLowestList = ({
  mode,
  highestOfferPrice,
  lowestListPrice,
  setPrice,
  price,
}: {
  mode: 'offer' | 'list';
  highestOfferPrice: number;
  lowestListPrice: number;
  setPrice: (_: number) => void;
  price: number | any;
}) => (
  <Box alignItems="center" flexDirection="row" justifyContent="space-evenly" mt={2}>
    <Button
      textAbove={mode === 'offer' ? i18n._(t`MAKE OFFER`) : i18n._(t`SELL NOW`)}
      textBelow={i18n._(t`MATCH HIGHEST OFFER`)}
      isActive={mode === 'list' && price <= highestOfferPrice}
      price={highestOfferPrice}
      setPrice={setPrice}
    />

    <Button
      textAbove={mode === 'offer' ? i18n._(t`BUY NOW`) : i18n._(t`MAKE LIST`)}
      textBelow={i18n._(t`MATCH LOWEST LIST`)}
      isActive={mode === 'offer' && price >= lowestListPrice}
      price={lowestListPrice}
      setPrice={setPrice}
    />
  </Box>
);

const Button = ({
  textAbove,
  textBelow,
  price,
  isActive,
  setPrice,
}: {
  textAbove: string;
  textBelow: string;
  price: number;
  isActive: boolean;
  setPrice: (_: number) => void;
}) => {
  const { $ } = useCurrencyUtils();
  return (
    <ButtonBase
      style={[styles.button, isActive && styles.buttonActive]}
      onPress={() => setPrice(price)}
      disabled={!price}
      android_ripple={{ color: theme.colors.rippleGray }}
    >
      <Box center>
        <Text
          fontSize={2}
          fontFamily="medium"
          style={[styles.buttonText, isActive && styles.buttonTextActive]}
        >
          {textAbove}
        </Text>
        <Text
          fontSize={3}
          fontFamily="bold"
          style={[styles.buttonText, isActive && styles.buttonTextActive]}
        >
          {$(price) || '--'}
        </Text>
        <Text
          mt={1}
          fontSize={1}
          fontFamily="medium"
          style={[styles.buttonText, isActive && styles.buttonTextActive]}
        >
          {textBelow}
        </Text>
      </Box>
    </ButtonBase>
  );
};

const styles = StyleSheet.create({
  button: {
    borderColor: theme.colors.black2,
    paddingVertical: 8,
    borderRadius: 5,
    maxWidth: '46%',
    borderWidth: 1,
    width: '100%',
    marginHorizontal: 2,
  },
  buttonActive: {
    backgroundColor: theme.colors.black3,
  },
  buttonText: {
    color: theme.colors.black2,
  },
  buttonTextActive: {
    color: theme.colors.white,
  },
});

export default HighestOfferLowestList;
