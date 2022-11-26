import { RootRoutes } from 'types/navigation';

import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { Trans, t } from '@lingui/macro';
import { i18n } from '@lingui/core';

import { Anchor, Text, Box } from 'app/components/base';
import { LB } from 'common/constants';
import InfoDialog from 'app/components/dialog/InfoDialog';

const ShippingErrorDialog = ({
  isOpen,
  onClose,
  errorMessage,
}: {
  isOpen: boolean;
  onClose: () => void;
  errorMessage: string;
}) => {
  const navigation = useNavigation<StackNavigationProp<RootRoutes>>();

  const close = () => {
    navigation.goBack();
    onClose();
  };

  return (
    <InfoDialog isOpen={isOpen} onClose={close} buttonText={i18n._(t`CLOSE`)}>
      <Box p={6} my={4}>
        <Text fontSize={2} textAlign="left">
          {errorMessage &&
            errorMessage.split('. ').map((m, i) => (
              <Text fontSize={2} fontFamily="bold" key={i}>
                {m && '- '} {m} {m && '.'}
                {LB}
              </Text>
            ))}
        </Text>
        <Text fontSize={2}>
          {errorMessage ? (
            <Trans>Please make amendments on the issues mentioned above and try again.</Trans>
          ) : (
            <Trans>Shipping label creation has failed. Please try again after some time.</Trans>
          )}{' '}
          <Trans>If the issue persists, please contact us at</Trans>{' '}
        </Text>
        <Anchor to="mailto:support@novelship.com">support@novelship.com</Anchor>
      </Box>
    </InfoDialog>
  );
};

export default ShippingErrorDialog;
