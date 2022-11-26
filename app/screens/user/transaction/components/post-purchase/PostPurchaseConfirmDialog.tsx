// @flow
import type { TransactionBuyerType } from 'types/resources/transactionBuyer';

import * as React from 'react';
import { Trans } from '@lingui/macro';
import ListItem from 'app/screens/product/components/common/ListItem';
import ConfirmDialog from 'app/components/dialog/ConfirmDialog';
import { Box, Text } from 'app/components/base';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';

const PostPurchaseConfirmDialog = ({
  isOpen,
  toggleDialog,
  onConfirm,
  transaction,
  title,
  deliveryInsurance = 0,
}: {
  isOpen: boolean;
  toggleDialog: () => void;
  onConfirm: () => void;
  transaction: TransactionBuyerType;
  title: string;
  deliveryInsurance?: number;
}) => {
  const { $$ } = useCurrencyUtils();
  return (
    <ConfirmDialog isOpen={isOpen} onClose={toggleDialog} onConfirm={onConfirm} title={title}>
      <Box mt={6} mb={4} mx={2} width="100%">
        <Text textAlign="center" fontSize={2} my={4} px={4}>
          <Trans>
            Upon confirmation, you will successfully{' '}
            <Text fontFamily="bold" fontSize={2}>
              protect your product delivery
            </Text>
            . Please note that you{' '}
            <Text fontFamily="bold" fontSize={2}>
              can no longer store this product
            </Text>{' '}
            in Novelship Storage.
          </Trans>
        </Text>

        <ListItem>
          <Text fontSize={2} fontFamily="medium" color="gray2">
            <Trans>Product Price</Trans>
          </Text>
          <Text fontSize={2} fontFamily="bold">
            {$$(transaction.offer_price_local, transaction.buyer_currency)}
          </Text>
        </ListItem>
        <ListItem>
          <Text fontSize={2} fontFamily="medium" color="gray2">
            <Trans>Delivery Protection</Trans>
          </Text>
          <Text fontSize={2} fontFamily="bold" color="blue">
            {$$(deliveryInsurance, transaction.buyer_currency)}
          </Text>
        </ListItem>
      </Box>
    </ConfirmDialog>
  );
};

export default PostPurchaseConfirmDialog;
