import * as React from 'react';
import { Trans } from '@lingui/macro';
import ConfirmDialog from 'app/components/dialog/ConfirmDialog';
import { Text } from 'app/components/base';
import { LB } from 'common/constants';

const StoreInStorageConfirmDialog = ({
  isOpen,
  toggleDialog,
  onConfirm,
  title,
}: {
  isOpen: boolean;
  toggleDialog: () => void;
  onConfirm: () => void;
  title: string;
}) => (
  <ConfirmDialog isOpen={isOpen} onClose={toggleDialog} onConfirm={onConfirm} title={title}>
    <Text textAlign="center" fontSize={2} my={4} px={4}>
      <Text fontSize={2}>
        <Trans>
          Upon confirmation, your product will be put in Novelship Storage. You can manage stored
          products in the{' '}
          <Text fontFamily="bold" fontSize={2}>
            STORAGE
          </Text>{' '}
          dashboard.{' '}
        </Trans>
      </Text>
      {LB}
      <Text fontSize={2}>
        <Trans>
          Should you sell your storage product, your delivery fee will be refunded to you in the
          form of a Discount code.
        </Trans>
      </Text>
    </Text>
  </ConfirmDialog>
);

export default StoreInStorageConfirmDialog;
