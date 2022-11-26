import React from 'react';
import { i18n } from '@lingui/core';
import { Trans, t } from '@lingui/macro';
import InfoDialog from 'app/components/dialog/InfoDialog';
import { Box, Text } from 'app/components/base';
import { LB } from 'common/constants';

const ResellInfoDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
  <InfoDialog isOpen={isOpen} buttonText={i18n._(t`GOT IT`)} onClose={onClose}>
    <Box center>
      <Text mt={3} mb={7} fontSize={2} textAlign="center">
        <Text fontSize={2} fontFamily="bold">
          <Trans>Store for free:</Trans>
        </Text>
        {LB}
        <Trans>Put in Novelship Storage for free. Request delivery when you are ready!</Trans>
        {LB}
        {LB}
        <Text fontSize={2} fontFamily="bold">
          <Trans>Resell at lower selling fee:</Trans>
        </Text>
        {LB}
        <Trans>Sell from Storage and enjoy up to 50% off on selling fee.</Trans>
        {LB}
        {LB}
        <Trans>
          Delivery fee paid will be refunded if you sell from storage. Refund will be in the form of
          a Discount Code.
        </Trans>
      </Text>
    </Box>
  </InfoDialog>
);

export default ResellInfoDialog;
