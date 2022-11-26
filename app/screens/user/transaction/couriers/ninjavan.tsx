import {
  ShippingPayloadType,
  ShippingGenerateConfigType,
  ShippingScreenType,
} from 'types/views/label-generation';
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
import { Text, Box, Anchor, Button } from 'app/components/base';
import { getNextWeekDays, toDate } from 'common/utils/time';
import { addressString } from 'common/utils/address';
import { useStoreState } from 'app/store';
import ProductImageHeader from 'app/screens/product/components/common/ProductImageHeader';
import ConfirmDialog from 'app/components/dialog/ConfirmDialog';
import useToggle from 'app/hooks/useToggle';
import API from 'common/api';

import { PickupFrom, RadioButton, TitleText } from '../components';
import ShippingErrorInfoDialog from '../components/ShippingErrorInfoDialog';

const NinjaVanNotes = ({
  config,
  isDropOff,
  isPickup,
}: {
  config: ShippingGenerateConfigType;
  isDropOff?: boolean;
  isPickup?: boolean;
}) => (
  <>
    {isDropOff && config.dropOffCourier === 'NINJAVAN' && (
      <Box px={3} mb={3} flexDirection="row">
        <Text style={{ marginTop: -2 }}>{'\u2022'}</Text>
        <Text ml={2} fontSize={2} lineHeight={18}>
          <Trans>
            You can tap{' '}
            <Anchor
              to="https://www.ninjavan.co/en-sg/ninja-points#find-a-ninja-point"
              fontSize={2}
              color="blue"
            >
              here
            </Anchor>{' '}
            to find a Ninja Point to drop off your parcel.
          </Trans>
        </Text>
      </Box>
    )}
    {isPickup && config.pickupCourier === 'NINJAVAN' && (
      <Box px={3} mb={3} flexDirection="row">
        <Text style={{ marginTop: -2 }}>{'\u2022'}</Text>
        <Text ml={2} fontSize={2} lineHeight={18}>
          <Trans>
            You can select one slot between 9am - 10pm for parcel collection on the selected pick-up
            date.
          </Trans>
        </Text>
      </Box>
    )}
  </>
);

const NinjaVanDropOffConfirmDialog = ({
  isOpen,
  onClose,
  sale,
  setCurrentScreen,
}: {
  isOpen: boolean;
  onClose: () => void;
  sale: TransactionSellerType;
  setCurrentScreen: (_: ShippingScreenType) => void;
}) => {
  const [errorInfoDialog, errorInfoDialogToggle] = useToggle(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, toggleLoading] = useToggle(false);

  const onConfirm = () => {
    toggleLoading();
    setErrorMessage('');
    API.post('me/sales/shipment', {
      ref: sale.ref,
      type: 'NINJAVAN',
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
    <>
      <ConfirmDialog isOpen={isOpen} onClose={onClose} onConfirm={onConfirm} loading={loading}>
        <Box center p={2} mb={3}>
          <Text mt={2} mb={3} fontSize={4} fontFamily="bold" textTransform="uppercase">
            <Trans>Confirm Drop Off</Trans>
          </Text>
          <Text fontSize={2}>
            <Trans>You have chosen to drop off at a Ninja Point.</Trans>
          </Text>
        </Box>
      </ConfirmDialog>

      <ShippingErrorInfoDialog
        isOpen={errorInfoDialog}
        onClose={errorInfoDialogToggle}
        errorMessage={errorMessage}
      />
    </>
  );
};

const pickupTimes = ['09:00 - 12:00', '12:00 - 15:00', '15:00 - 18:00', '18:00 - 22:00'];
const NinjaVanPickupScreen = ({
  sale,
  setCurrentScreen,
}: {
  sale: TransactionSellerType;
  setCurrentScreen: (_: ShippingScreenType) => void;
}) => {
  const user = useStoreState((s) => s.user.user);

  // Data
  const [errorMessage, setErrorMessage] = useState('');
  const [pickupTime, setPickupTime] = useState('09:00 - 12:00');
  const [pickupDate, setPickupDate] = useState(0);
  const pickupDates = getNextWeekDays(2);
  const [shipmentPayload, setShipmentPayload] = useState<ShippingPayloadType>({
    pickup_date: pickupDates[pickupDate],
    pickup_time: pickupTime,
  });

  // UI Selectors
  const [loading, toggleLoading] = useToggle(false);

  // UI Selectors: Dialogs
  const [confirmationDialog, confirmationDialogToggle] = useToggle(false);
  const [errorInfoDialog, errorInfoDialogToggle] = useToggle(false);

  const onPickupDateChange = (index: number) => {
    setPickupDate(index);
    const pickup_date = String(pickupDates[index]);
    setShipmentPayload({ ...shipmentPayload, pickup_date });
  };

  const onPickupTimeChange = (time: string) => {
    setPickupTime(time);
    setShipmentPayload({ ...shipmentPayload, pickup_time: time });
  };

  const generateLabel = () => {
    toggleLoading();
    setErrorMessage('');
    return API.post('me/sales/shipment', {
      ref: sale.ref,
      type: 'NINJAVAN',
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
          <TitleText mb={4} mt={5} textAlign="center">
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
          <TitleText mb={4} mt={5} textAlign="center">
            <Trans>Select Pick Up Time</Trans>
          </TitleText>
          <RadioButton value={pickupTime} options={pickupTimes} onChange={onPickupTimeChange} />
        </PageContainer>

        <Box mt={6} borderBottomWidth={1} borderBottomColor="gray6" />

        <PageContainer>
          <PickupFrom user={user} sale={sale} />
        </PageContainer>
      </ScrollContainer>

      <Footer>
        <Button
          text={i18n._(t`CREATE PICKUP`)}
          onPress={confirmationDialogToggle}
          disabled={!pickupDates.length}
          loading={loading}
          variant="black"
        />
      </Footer>

      <ConfirmDialog
        isOpen={confirmationDialog}
        onClose={confirmationDialogToggle}
        onConfirm={generateLabel}
        loading={loading}
      >
        <Text mt={2} mb={3} fontSize={4} fontFamily="bold" textTransform="uppercase">
          <Trans>Confirm Your Pick Up</Trans>
        </Text>
        <PickInfoRow
          left={<Trans>Pick Up Date</Trans>}
          right={toDate(String(pickupDates[pickupDate]), 'weekdays')}
        />
        <PickInfoRow left={<Trans>Pick Up time</Trans>} right={pickupTime} />
        <PickInfoRow
          left={<Trans>Ship From</Trans>}
          right={addressString(user.shipping_address, sale.seller_country)}
        />
        <PickInfoRow left={<Trans>Shippers’ Email</Trans>} right={user.email} />
        <PickInfoRow
          left={<Trans>Shippers’ Phone</Trans>}
          right={
            <>
              {user.shipping_address.country_code || user.country_code}
              {user.shipping_address.phone || user.phone}
            </>
          }
        />
        <Box mb={8} />
      </ConfirmDialog>

      <ShippingErrorInfoDialog
        isOpen={errorInfoDialog}
        onClose={errorInfoDialogToggle}
        errorMessage={errorMessage}
      />
    </SafeAreaScreenContainer>
  );
};

const PickInfoRow = ({ left, right }: { left: React.ReactNode; right: React.ReactNode }) => (
  <Box mt={6} width="100%" flexDirection="row" justifyContent="space-between">
    <Box maxWidth="35%">
      <Text color="gray2" fontSize={2} fontFamily="medium" textAlign="left">
        {left}
      </Text>
    </Box>
    <Box maxWidth="60%">
      <Text color="black2" fontSize={2} fontFamily="medium" textAlign="right">
        {right}
      </Text>
    </Box>
  </Box>
);

export { NinjaVanDropOffConfirmDialog, NinjaVanNotes };
export default NinjaVanPickupScreen;
