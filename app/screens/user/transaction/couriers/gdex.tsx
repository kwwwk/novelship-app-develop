import { ShippingPayloadType, ShippingScreenType } from 'types/views/label-generation';
import { TransactionSellerType } from 'types/resources/transactionSeller';

import React, { useState, useEffect } from 'react';
import { Trans, t } from '@lingui/macro';
import { i18n } from '@lingui/core';

import {
  SafeAreaScreenContainer,
  ScrollContainer,
  PageContainer,
  Footer,
} from 'app/components/layout';
import { Text, Box, Button } from 'app/components/base';
import { toDate, toTime } from 'common/utils/time';
import { useStoreState } from 'app/store';
import ProductImageHeader from 'app/screens/product/components/common/ProductImageHeader';
import useToggle from 'app/hooks/useToggle';
import API from 'common/api';

import { PickupFrom, RadioButton, TitleText } from '../components';
import ShippingErrorInfoDialog from '../components/ShippingErrorInfoDialog';

const GDEXPickupScreen = ({
  sale,
  setCurrentScreen,
}: {
  sale: TransactionSellerType;
  setCurrentScreen: (_: ShippingScreenType) => void;
}) => {
  const user = useStoreState((s) => s.user.user);

  // Data
  const [shipmentPayload, setShipmentPayload] = useState<ShippingPayloadType>({});
  const [pickupStartTime, setPickupStartTime] = useState('');
  const [timeSlotsByDate, setTimeSlotsByDate] = useState();
  const [pickupEndTime, setPickupEndTime] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [pickupDates, setPickupDates] = useState([]);
  const [pickupDate, setPickupDate] = useState(0);

  // UI Selectors
  const [loading, toggleLoading] = useToggle(false);

  // UI Selectors: Dialogs
  const [errorInfoDialog, errorInfoDialogToggle] = useToggle(false);

  const onPickupDateChange = (index: number) => {
    setPickupDate(index);
    const pickup_date = String(pickupDates[index]);
    let _shipmentPayload = {
      ...shipmentPayload,
      pickup_date,
    };
    if (timeSlotsByDate) {
      const timeSlots: any[] = timeSlotsByDate[pickup_date];
      const endIndex = timeSlots && timeSlots.length >= 8 ? 8 : timeSlots.length - 1;
      _shipmentPayload = {
        ..._shipmentPayload,
        pickup_start_time: timeSlots[0],
        pickup_end_time: timeSlots[endIndex],
      };
      setPickupStartTime(toTime(`${pickup_date.slice(0, 11)}${timeSlots[0]}`));
      setPickupEndTime(toTime(`${pickup_date.slice(0, 11)}${timeSlots[endIndex]}`));
    }
    setShipmentPayload(_shipmentPayload);
  };

  const generateLabel = () => {
    toggleLoading();
    setErrorMessage('');
    return API.post('me/sales/shipment', {
      ref: sale.ref,
      type: 'GDEX',
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

  useEffect(() => {
    API.fetch(`integrations/gdex/locations/${user.shipping_address.zip}`)
      .then((res: any) => {
        setShipmentPayload({ location_id: res.locationId, district: res.district });
        setPickupDates(
          res.shipmentDateAndTime
            .map((date: any) => date.date)
            .sort()
            .slice(0, 2)
        );
        setTimeSlotsByDate(
          res.shipmentDateAndTime.reduce((dates: any, d: any) => {
            dates[d.date] = d.timeSlots;
            return dates;
          }, {})
        );
      })
      .catch(errorInfoDialogToggle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onPickupDateChange(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeSlotsByDate]);

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
          {!pickupDates.length && (
            <Text fontSize={2}>
              <Trans>Fetching pickup dates...</Trans>
            </Text>
          )}
          <RadioButton
            returnIndex
            options={pickupDates}
            value={String(pickupDate)}
            formatFunc={(d) => toDate(d, 'weekdays')}
            onChange={(i) => onPickupDateChange(parseInt(i, 10))}
          />
        </PageContainer>

        <Box mt={6} borderBottomWidth={1} borderBottomColor="gray6" />

        <PageContainer style={{ marginBottom: 0 }}>
          <TitleText my={6} textAlign="center">
            <Trans>Pick Up Time</Trans>
          </TitleText>
          <Text fontSize={2}>
            {!timeSlotsByDate ? (
              <Trans>Fetching time slots...</Trans>
            ) : (
              <Trans>
                Parcel collection time will be between{' '}
                <Text fontSize={2} fontFamily="bold">
                  {pickupStartTime} - {pickupEndTime}
                </Text>{' '}
                on the selected pick-up date.
              </Trans>
            )}
          </Text>
        </PageContainer>

        <Box mt={6} borderBottomWidth={1} borderBottomColor="gray6" />

        <PageContainer>
          <PickupFrom user={user} sale={sale} />
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

export default GDEXPickupScreen;
