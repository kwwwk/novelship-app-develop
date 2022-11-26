import { ShippingPayloadType, ShippingScreenType } from 'types/views/label-generation';
import { TransactionSellerType } from 'types/resources/transactionSeller';

import React, { useState } from 'react';
import { Trans, t } from '@lingui/macro';
import { i18n } from '@lingui/core';

import {
  SafeAreaScreenContainer,
  ScrollContainer,
  PageContainer,
  Footer,
} from 'app/components/layout';
import { Text, Box, Button } from 'app/components/base';
import { getNextWeekDays, toDate } from 'common/utils/time';
import ProductImageHeader from 'app/screens/product/components/common/ProductImageHeader';
import useToggle from 'app/hooks/useToggle';
import API from 'common/api';

import { RadioButton, TitleText } from '../components';
import ShippingErrorInfoDialog from '../components/ShippingErrorInfoDialog';
import ShippingFromInfo from '../../components/ShippingFromInfo';

const JanioNotes = ({ isPickup, config }: any) =>
  isPickup && config.pickupCourier === 'JANIO' ? (
    <Box px={3} mb={3} flexDirection="row">
      <Text style={{ marginTop: -2 }}>{'\u2022'}</Text>
      <Text ml={2} fontSize={2}>
        <Trans>
          Parcel collection time is between{' '}
          <Text fontSize={2} fontFamily="bold">
            1pm - 7pm
          </Text>{' '}
          on the selected pick-up date.
        </Trans>
      </Text>
    </Box>
  ) : null;

const JanioPickupScreen = ({
  sale,
  setCurrentScreen,
}: {
  sale: TransactionSellerType;
  setCurrentScreen: (_: ShippingScreenType) => void;
}) => {
  // Data
  const [shipmentPayload, setShipmentPayload] = useState<ShippingPayloadType>({});
  const [errorMessage, setErrorMessage] = useState('');
  const [pickupDate, setPickupDate] = useState(0);
  const pickupDates = getNextWeekDays(2);

  // UI Selectors
  const [loading, toggleLoading] = useToggle(false);

  // UI Selectors: Dialogs
  const [errorInfoDialog, errorInfoDialogToggle] = useToggle(false);

  const onPickupDateChange = (index: number) => {
    setPickupDate(index);
    const pickup_date = String(pickupDates[index]);
    setShipmentPayload({ ...shipmentPayload, pickup_date });
  };

  const generateLabel = () => {
    toggleLoading();
    setErrorMessage('');
    return API.post('me/sales/shipment', {
      ref: sale.ref,
      type: 'JANIO',
      ...shipmentPayload,
    })
      .then(() => setCurrentScreen('confirmation'))
      .catch((e) => {
        if (!/^\d+ - /.test(e)) {
          setErrorMessage(e);
        }
        errorInfoDialogToggle();
      })
      .finally(toggleLoading);
  };

  return (
    <SafeAreaScreenContainer>
      <ScrollContainer>
        <ProductImageHeader
          borderBottomColor="gray6"
          borderBottomWidth={1}
          product={sale.product}
          size={sale.local_size}
          p={5}
        />
        <PageContainer style={{ marginBottom: 0 }}>
          <TitleText my={6} textAlign="center">
            <Trans>Select Pick Up Date</Trans>
          </TitleText>
          <RadioButton
            onChange={(i) => onPickupDateChange(parseInt(i, 10))}
            formatFunc={(d) => toDate(d, 'weekdays')}
            value={String(pickupDate)}
            options={pickupDates}
            returnIndex
          />
        </PageContainer>

        <Box mt={6} borderBottomWidth={1} borderBottomColor="gray6" />

        <PageContainer style={{ marginBottom: 0 }}>
          <TitleText my={6} textAlign="center">
            <Trans>Pick Up Time</Trans>
          </TitleText>

          <Text fontSize={2}>
            <Trans>
              Parcel collection time will be between{' '}
              <Text fontSize={2} fontFamily="bold">
                1 - 7pm
              </Text>{' '}
              on the selected pick-up date.
            </Trans>
          </Text>
        </PageContainer>

        <Box mt={6} borderBottomWidth={1} borderBottomColor="gray6" />

        <PageContainer>
          <TitleText my={6} textAlign="center">
            <Trans>Pick Up From</Trans>
          </TitleText>
          <ShippingFromInfo sale={sale} />
        </PageContainer>
      </ScrollContainer>

      <Footer>
        <Button
          text={i18n._(t`CREATE PICKUP`)}
          disabled={!pickupDates.length}
          onPress={generateLabel}
          loading={loading}
          variant="black"
        />
      </Footer>

      <ShippingErrorInfoDialog
        isOpen={errorInfoDialog}
        onClose={errorInfoDialogToggle}
        errorMessage={errorMessage}
      />
    </SafeAreaScreenContainer>
  );
};

export { JanioNotes };
export default JanioPickupScreen;
