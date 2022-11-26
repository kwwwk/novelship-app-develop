import React, { useContext, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { i18n } from '@lingui/core';
import { t, Trans } from '@lingui/macro';

import { Box, Button, Text } from 'app/components/base';
import Dialog from 'app/components/dialog/Dialog';
import theme from 'app/styles/theme';
import ProductCheckoutContext from '../../context';
import ListItem from '../common/ListItem';

function BuyConfirmExitDialog({
  confirmExitDialog,
  confirmExitDialogToggle,
  exitNavigationAction,
}: {
  confirmExitDialog: boolean;
  confirmExitDialogToggle: (arg0: boolean) => void;
  exitNavigationAction: any;
}) {
  const [isWishListing, setIsWishListing] = useState(false);
  const navigation = useNavigation();
  const goBack = () => navigation.dispatch(exitNavigationAction.current?.data?.action);

  const {
    product,
    wishlistProductSize,
    wishListedSizes,
    buy: { buy },
  } = useContext(ProductCheckoutContext);

  const confirmExitClose = () => {
    confirmExitDialogToggle(false);
    goBack();
  };

  const isWishListedAlready = wishListedSizes.includes(buy.size);
  const addToWishList = () => {
    setIsWishListing(true);

    return wishlistProductSize(
      product.is_one_size
        ? { size: 'OS', local_size: 'OS' }
        : { size: buy.size, local_size: buy.local_size }
    ).finally(() => {
      confirmExitDialogToggle(false);
      setIsWishListing(false);
      goBack();
    });
  };

  return (
    <Dialog
      center
      width={340}
      bg="white"
      onClose={() => confirmExitDialogToggle(false)}
      isOpen={confirmExitDialog}
    >
      <Text
        mt={4}
        mb={3}
        pb={1}
        fontSize={4}
        fontFamily="bold"
        textAlign="center"
        letterSpacing={theme.constants.LETTER_SPACINGS_TEXT_TITLE}
      >
        <Trans>EXIT CHECKOUT</Trans>
      </Text>
      <Box height={1} width="100%" mt={2} bg="dividerGray" />
      <Box p={5} px={7} width="100%">
        <ListItem center mb={6}>
          <Text fontSize={2}>
            <Trans>Are you sure you don't want checkout now?</Trans>
          </Text>
        </ListItem>
        <Box width="100%">
          {!isWishListing && (
            <Button
              variant="black"
              onPress={() => confirmExitDialogToggle(false)}
              text={i18n._(t`CONTINUE CHECKOUT`)}
            />
          )}

          {!isWishListedAlready && (
            <Box mt={3}>
              <Button
                variant="white"
                onPress={addToWishList}
                loading={isWishListing}
                text={i18n._(t`ADD TO WISHLIST AND EXIT`)}
              />
            </Box>
          )}

          {!isWishListing && (
            <ListItem mt={4} center>
              <Text fontSize={2} padding={3} fontFamily="medium" onPress={confirmExitClose}>
                <Trans>EXIT CHECKOUT</Trans>
              </Text>
            </ListItem>
          )}
        </Box>
      </Box>
    </Dialog>
  );
}

export default BuyConfirmExitDialog;
