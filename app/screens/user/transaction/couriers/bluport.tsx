import { ShippingGenerateConfigType, ShippingScreenType } from 'types/views/label-generation';
import { TransactionSellerType } from 'types/resources/transactionSeller';

import React, { useState, useEffect } from 'react';
import { t, Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';

import {
  SafeAreaScreenContainer,
  ScrollContainer,
  PageContainer,
  Footer,
} from 'app/components/layout';
import { Button, Text, Box } from 'app/components/base';
import { Select, Radio } from 'app/components/form';
import { useStoreState } from 'app/store';
import { LB } from 'common/constants';
import ProductImageHeader from 'app/screens/product/components/common/ProductImageHeader';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import ConfirmDialog from 'app/components/dialog/ConfirmDialog';
import useToggle from 'app/hooks/useToggle';
import API from 'common/api';

import { TitleText } from '../components';
import ShippingErrorInfoDialog from '../components/ShippingErrorInfoDialog';

const BluPortNotes = ({
  isDropOff,
  config,
}: {
  isDropOff: boolean;
  config: ShippingGenerateConfigType;
}) =>
  isDropOff && config.dropOffCourier === 'BLUPORT' ? (
    <Box px={3} mb={3} flexDirection="row">
      <Text style={{ marginTop: -2 }}>{'\u2022'}</Text>
      <Text ml={2} fontSize={2} lineHeight={18}>
        <Trans>
          You have up to{' '}
          <Text fontSize={2} fontFamily="bold">
            24 hours
          </Text>{' '}
          after shipping label creation to deposit your item in the selected bluPort locker. Please
          contact our customer support at support@novelship.com for extensions.
        </Trans>
      </Text>
    </Box>
  ) : null;

const BluePortDropOffScreen = ({
  sale,
  setCurrentScreen,
}: {
  sale: TransactionSellerType;
  setCurrentScreen: (_: ShippingScreenType) => void;
}) => {
  const { $toList } = useCurrencyUtils();
  const user = useStoreState((s) => s.user.user);
  const isHeavyProduct = sale.product.actual_weight > 4000;
  const isRearrange = sale.seller_courier === 'BLUPORT';

  // Data
  const [bluPortLockerSize, setBluPortLockerSize] = useState<'L' | 'M'>(isHeavyProduct ? 'L' : 'M');
  const [dropOffPoints, setDropOffPoints] = useState<any[]>([]);
  const [dropOffPoint, setDropOffPoint] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  // UI Selectors: Dialogs
  const [errorInfoDialog, errorInfoDialogToggle] = useToggle(false);
  const [loading, toggleLoading] = useToggle(false);

  // UI Selector: Dialog
  const [confirmationDialog, confirmationDialogToggle] = useToggle(false);

  const generateLabel = () => {
    if (confirmationDialog) {
      confirmationDialogToggle();
      setErrorMessage('');
      toggleLoading();
      API.post('me/sales/shipment', {
        ref: sale.ref,
        type: 'BLUPORT',
        bluPort_id: dropOffPoints[dropOffPoint].id,
        bluPort_locker_size: bluPortLockerSize,
      })
        .then(() => setCurrentScreen('confirmation'))
        .catch(errorInfoDialogToggle)
        .finally(toggleLoading);
    }
    confirmationDialogToggle();
  };

  useEffect(() => {
    API.fetch(`integrations/bluport/locations/${user.shipping_address.zip}`)
      .then((r: any) => {
        setDropOffPoints(r);
      })
      .catch(errorInfoDialogToggle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <Trans>Select Drop Off Location</Trans>
          </TitleText>
          <Select
            onChangeText={(i) => setDropOffPoint(parseInt(i, 10))}
            value={String(dropOffPoint)}
            items={dropOffPoints.map((d, i) => ({
              label: d.name && d.name.replace('bluPort - ', ''),
              value: String(i),
              key: i,
            }))}
            placeholder="Select"
          />
        </PageContainer>

        <Box mt={6} borderBottomWidth={1} borderBottomColor="gray6" />

        <PageContainer style={{ marginBottom: 0 }}>
          <TitleText my={6} textAlign="center">
            <Trans>Drop Off Time</Trans>
          </TitleText>
          <Text fontSize={2}>
            <Trans>
              You have up to 24 hours after shipping label creation to deposit your item in the
              selected bluPort locker.
            </Trans>
          </Text>
        </PageContainer>

        <Box mt={6} borderBottomWidth={1} borderBottomColor="gray6" />

        <PageContainer style={{ marginBottom: 0 }}>
          <TitleText my={6} textAlign="center">
            <Trans>BluPort Address</Trans>
          </TitleText>
          {dropOffPoints[dropOffPoint] && (
            <Text fontSize={2}>
              <Text fontSize={2} fontFamily="bold">
                {dropOffPoints[dropOffPoint].name}
              </Text>{' '}
              {LB}
              {dropOffPoints[dropOffPoint].description} {LB}
              {dropOffPoints[dropOffPoint].address_line_1}, {LB}
              {dropOffPoints[dropOffPoint].address_line_2 && (
                <>
                  {dropOffPoints[dropOffPoint].address_line_2}, {LB}
                </>
              )}
              {dropOffPoints[dropOffPoint].region !== '1' &&
                `${dropOffPoints[dropOffPoint].region} `}
              {dropOffPoints[dropOffPoint].country} {dropOffPoints[dropOffPoint].postal_code}
            </Text>
          )}
        </PageContainer>

        <Box mt={6} borderBottomWidth={1} borderBottomColor="gray6" />

        <PageContainer>
          <TitleText my={6} textAlign="center">
            <Trans>Select Locker Size</Trans>
          </TitleText>
          <Radio.Group<'L' | 'M'>
            value={bluPortLockerSize}
            setValue={(v: 'L' | 'M') => setBluPortLockerSize(v)}
          >
            <Radio.Button
              justifyContent="space-between"
              flexDirection="row-reverse"
              disabled={isHeavyProduct}
              alignItems="center"
              value="M"
              py={2}
            >
              <Text ml={3} fontSize={2} color={isHeavyProduct ? 'gray2' : 'black2'}>
                <Trans>Medium</Trans>
              </Text>
            </Radio.Button>
            <Radio.Button
              justifyContent="space-between"
              flexDirection="row-reverse"
              alignItems="center"
              value="L"
              py={2}
            >
              <Text ml={3} fontSize={2}>
                <Trans>Large</Trans>
                {LB}
                <Trans>Extra Shipping Cost</Trans>:{' '}
                <Text fontSize={2} fontFamily="bold">
                  {$toList(3)}
                </Text>{' '}
                (Upgrade)
              </Text>
            </Radio.Button>
          </Radio.Group>
        </PageContainer>
      </ScrollContainer>

      <Footer>
        <Button
          text={i18n._(t`CREATE DROP OFF`)}
          onPress={generateLabel}
          loading={loading}
          variant="black"
        />
      </Footer>

      <ConfirmDialog
        isOpen={confirmationDialog}
        onClose={confirmationDialogToggle}
        onConfirm={generateLabel}
      >
        <TitleText mt={2} mb={3}>
          <Trans>Confirm Drop Off</Trans>
        </TitleText>
        <Text mb={4} fontSize={2} textAlign="center">
          {bluPortLockerSize === 'M' ? (
            <Trans>You have chosen the Medium (default) size BluPort Locker.</Trans>
          ) : (
            <Trans>
              You have chosen a large size BluPort Locker.{' '}
              <Text fontSize={2} fontFamily="bold">
                Extra {$toList(3)}
              </Text>{' '}
              will be deducted from your payout.
            </Trans>
          )}

          {isRearrange && (
            <Text>
              {LB}
              <Trans>
                By rearranging drop off appointment, you need to pay{' '}
                <Text fontFamily="bold">Extra {$toList(4)}</Text>. It will be added into the
                shipment fee and deducted automatically from your payout.
              </Trans>
            </Text>
          )}
        </Text>
      </ConfirmDialog>

      <ShippingErrorInfoDialog
        isOpen={errorInfoDialog}
        onClose={errorInfoDialogToggle}
        errorMessage={errorMessage}
      />
    </SafeAreaScreenContainer>
  );
};

export { BluPortNotes };
export default BluePortDropOffScreen;
