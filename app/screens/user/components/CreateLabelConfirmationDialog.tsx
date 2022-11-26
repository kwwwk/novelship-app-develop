import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/core';
import { i18n } from '@lingui/core';
import { t, Trans } from '@lingui/macro';

import { Button, Text, Box } from 'app/components/base';
import { RootRoutes } from 'types/navigation';
import { TransactionSellerType } from 'types/resources/transactionSeller';
import Dialog from 'app/components/dialog/Dialog';

import { LB } from 'common/constants';
import ShippingFromInfo from './ShippingFromInfo';

const CreateLabelConfirmationDialog = ({
  sale,
  isOpen,
  onClose,
}: {
  sale: TransactionSellerType;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const navigation = useNavigation<StackNavigationProp<RootRoutes>>();

  const toEdit = () => {
    navigation.push('UserStack', { screen: 'SellingForm', params: { limited: true } });
    onClose();
  };

  const toLabelGen = () => {
    navigation.push('UserStack', { screen: 'LabelGeneration', params: { sale_ref: sale.ref } });
    onClose();
  };

  return (
    <Dialog p={5} bg="white" width={340} isOpen={isOpen} onClose={onClose}>
      <Box center p={2}>
        <Text mt={2} mb={6} fontSize={3} textAlign="center" fontFamily="bold">
          <Trans>
            PLEASE CONFIRM YOUR
            {LB}
            SHIP FROM ADDRESS
          </Trans>
        </Text>

        <ShippingFromInfo sale={sale} />

        <Box mt={8} width="100%" flexDirection="row" justifyContent="space-between">
          <Button text={i18n._(t`EDIT`)} width="48%" variant="white" onPress={toEdit} />
          <Button text={i18n._(t`CONFIRM`)} width="48%" variant="black" onPress={toLabelGen} />
        </Box>
      </Box>
    </Dialog>
  );
};

export default CreateLabelConfirmationDialog;
