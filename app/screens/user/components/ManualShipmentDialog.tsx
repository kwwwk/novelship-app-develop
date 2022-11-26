import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { i18n } from '@lingui/core';
import { t, Trans } from '@lingui/macro';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Button, Text, Box, ButtonBase } from 'app/components/base';
import { Field } from 'app/components/form';
import ErrorMessage from 'app/components/form/ErrorMessage';
import useForm from 'app/hooks/useForm';
import Dialog from 'app/components/dialog/Dialog';
import API from 'common/api';
import BarcodeQrScanner from 'app/components/misc/BarcodeQrScanner';
import theme from 'app/styles/theme';
import { TransactionSellerType } from 'types/resources/transactionSeller';
import { getAvailableShippingMethods } from 'common/constants/transaction';
import { useStoreState } from 'app/store';
import { nsOfficeAddressString } from 'common/utils/address';

const initialValues = {
  seller_courier: '',
  seller_courier_name: '',
  seller_courier_tracking: '',
};

const ManualShipmentDialog = ({
  trxn,
  isOpen,
  onClose,
  refetch,
}: {
  trxn: TransactionSellerType;
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}) => (
  <Dialog p={5} center bg="white" width={340} isOpen={isOpen} onClose={onClose}>
    <Box px={4} minWidth={300}>
      <Text my={4} mb={6} fontSize={4} textAlign="center" fontFamily="bold">
        <Trans>ENTER TRACKING INFO</Trans>
      </Text>
      <ManualShipmentForm
        trxn={trxn}
        onSubmit={() => {
          onClose();
          refetch();
        }}
      />
    </Box>
  </Dialog>
);

const ManualShipmentForm = ({
  trxn,
  trxn_refs,
  onSubmit,
}: {
  trxn: TransactionSellerType;
  trxn_refs?: string[];
  onSubmit: (tracking_id: string) => void;
}) => {
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const sellerType = useStoreState((s) => s.user.user.seller_type);

  const shippingMethods = getAvailableShippingMethods(trxn, sellerType);
  const shippingConfig = shippingMethods.manual;

  const submit = (values: typeof initialValues) => {
    setLoading(true);
    // For countries with no option available to select courier, allow free text input
    if (values.seller_courier === 'Others' || !values.seller_courier) {
      values.seller_courier = values.seller_courier_name;
    }

    if (trxn_refs) {
      // @ts-ignore intended action
      values.trxn_refs = trxn_refs;
    }

    API.put<{ seller_courier_tracking: string }>(
      trxn_refs ? 'me/sales/manual-shipment' : `me/sales/${trxn.ref}/manual-shipment`,
      values
    )
      .then(({ seller_courier_tracking }) => onSubmit(seller_courier_tracking))
      .catch((e) => {
        setFormError(e);
        setLoading(false);
      });
  };

  const items =
    shippingConfig && shippingConfig?.couriers
      ? shippingConfig.couriers
          .filter((c) => (trxn_refs && trxn_refs.length > 6 ? /self\s/i.test(c) : true))
          .map((courier) => ({
            label: i18n._(courier),
            value: courier || '',
            inputLabel: courier,
          }))
      : [];

  const ManualShipmentSchema = Yup.object().shape({
    seller_courier: Yup.string().test(
      'seller_courier',
      i18n._(t`Select a courier`),
      function (value) {
        return items.length ? !!value : !value;
      }
    ),
    seller_courier_name: Yup.string().test(
      'seller_courier_name',
      i18n._(t`Courier name is required`),
      function (value) {
        const { parent } = this;
        return parent.seller_courier === 'Others' || !parent.seller_courier ? !!value : !value;
      }
    ),
    seller_courier_tracking: Yup.string().test(
      'seller_courier_tracking',
      i18n._(t`Tracking number is required`),
      function (value) {
        const { parent } = this;
        return /self\s/i.test(parent.seller_courier) ? true : !!value;
      }
    ),
  });

  const form = useForm({ initialValues, submit, validationSchema: ManualShipmentSchema });

  useEffect(() => {
    form.setFieldValue('seller_courier', '');
    form.setFieldValue('seller_courier_name', '');
    if (trxn_refs && trxn_refs.length > 6) {
      form.setFieldValue('seller_courier', items[0].value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trxn_refs]);

  const courierName = form.getInputFields('seller_courier').value;
  const isSelfDelivery = /self\s/i.test(courierName);

  if (!shippingConfig) return null;

  return (
    <>
      {!!items.length && (
        <Box py={1}>
          <Field
            {...form.getInputFields('seller_courier', 'select')}
            placeholder={i18n._(t`Select Courier`)}
            label=""
            type="select"
            items={items}
          />
        </Box>
      )}

      {(!items.length || form.getInputFields('seller_courier').value === 'Others') && (
        <Box py={1}>
          <Field
            placeholder={i18n._(t`Courier Service Name`)}
            {...form.getInputFields('seller_courier_name')}
          />
        </Box>
      )}

      {!!courierName && (
        <Box mt={3}>
          {trxn.fee_shipping > 0 && (
            <Box mb={3} flexDirection="row">
              <Text>{'\u2022'}</Text>
              <Text ml={2} fontSize={2}>
                <Trans>Your shipping fee will be waived off</Trans>
              </Text>
            </Box>
          )}
          {isSelfDelivery ? (
            <>
              <Box mb={3} flexDirection="row">
                <Text>{'\u2022'}</Text>
                <Text ml={2} fontSize={2}>
                  <Trans>
                    You are choosing to drop off your products{' '}
                    <Text fontSize={2} fontFamily="bold">
                      in person.
                    </Text>
                  </Trans>
                </Text>
              </Box>
              <Box mb={3} flexDirection="row">
                <Text>{'\u2022'}</Text>
                <Text ml={2} fontSize={2}>
                  <Trans>
                    We will generate a unique{' '}
                    <Text fontSize={2} fontFamily="bold">
                      drop-off ID.
                    </Text>{' '}
                    Please{' '}
                    <Text fontSize={2} fontFamily="bold">
                      print out
                    </Text>{' '}
                    the{' '}
                    <Text fontSize={2} fontFamily="bold">
                      bulk shipping document
                    </Text>{' '}
                    plus the drop-off ID.
                  </Trans>
                </Text>
              </Box>
              <Box mb={3} flexDirection="row">
                <Text>{'\u2022'}</Text>
                <Text ml={2} fontSize={2}>
                  <Trans>Bring along the documents in your drop-off shipment.</Trans>
                </Text>
              </Box>
              <Box mb={3}>
                <Box flexDirection="row">
                  <Text>{'\u2022'}</Text>
                  <Text ml={2} fontSize={2} fontFamily="bold">
                    <Trans>Please drop off your products at:</Trans>
                  </Text>
                </Box>
                <Box ml={6} flexDirection="row">
                  <Text>{'\u2022'}</Text>
                  <Text ml={2} fontSize={2}>
                    {nsOfficeAddressString(trxn.processing_country)}
                  </Text>
                </Box>
              </Box>
              <Box mb={3}>
                <Box flexDirection="row">
                  <Text>{'\u2022'}</Text>
                  <Text ml={2} fontSize={2} fontFamily="bold">
                    <Trans>Drop off hours:</Trans>
                  </Text>
                </Box>
                <Box ml={6} flexDirection="row">
                  <Text>{'\u2022'}</Text>
                  <Text ml={2} fontSize={2}>
                    {trxn.processing_country.drop_off_day_time}
                  </Text>
                </Box>
              </Box>
              <Box flexDirection="row">
                <Text>{'\u2022'}</Text>
                <Text ml={2} fontSize={2} lineHeight={18}>
                  <Trans>
                    Please make sure your product is sent to Novelship{' '}
                    <Text fontSize={2} fontFamily="bold">
                      within 2 business days
                    </Text>{' '}
                    to avoid any penalty
                  </Trans>
                </Text>
              </Box>
            </>
          ) : (
            <>
              <Box mb={3}>
                <Box flexDirection="row">
                  <Text>{'\u2022'}</Text>
                  <Text ml={2} fontSize={2} fontFamily="bold">
                    <Trans>Please ship to:</Trans>
                  </Text>
                </Box>
                <Box ml={6} flexDirection="row">
                  <Text>{'\u2022'}</Text>
                  <Text ml={2} fontSize={2}>
                    {nsOfficeAddressString(trxn.processing_country)}
                  </Text>
                </Box>
              </Box>
              <Box mb={3}>
                <Box flexDirection="row">
                  <Text>{'\u2022'}</Text>
                  <Text ml={2} fontSize={2}>
                    <Trans>
                      Please put{' '}
                      <Text fontSize={2} fontFamily="bold">
                        no more than 6 products
                      </Text>{' '}
                      under each tracking number.{' '}
                    </Trans>
                  </Text>
                </Box>
                <Box ml={6} flexDirection="row">
                  <Text>{'\u2022'}</Text>
                  <Text ml={2} fontSize={2}>
                    <Trans>
                      If the courier doesn’t provide a tracking number, please select{' '}
                      <Text fontSize={2} fontFamily="bold">
                        Self Drop-Off.
                      </Text>
                    </Trans>
                  </Text>
                </Box>
              </Box>
              <Box mb={3} flexDirection="row">
                <Text>{'\u2022'}</Text>
                <Text ml={2} fontSize={2}>
                  <Trans>
                    For{' '}
                    <Text fontSize={2} fontFamily="bold">
                      large quantity shipped
                    </Text>
                    , please break up your shipment using{' '}
                    <Text fontSize={2} fontFamily="bold">
                      multiple bulk requests.
                    </Text>
                  </Trans>
                </Text>
              </Box>
              <Box mb={3} flexDirection="row">
                <Text>{'\u2022'}</Text>
                <Text ml={2} fontSize={2}>
                  <Trans>
                    Please print the{' '}
                    <Text fontSize={2} fontFamily="bold">
                      shipping document
                    </Text>
                    , and include it in your bulk.
                  </Trans>
                </Text>
              </Box>
              <Box flexDirection="row">
                <Text>{'\u2022'}</Text>
                <Text ml={2} fontSize={2} lineHeight={18}>
                  <Trans>
                    Please make sure your product is shipped out{' '}
                    <Text fontSize={2} fontFamily="bold">
                      within 2 business days
                    </Text>{' '}
                    to avoid any penalty
                  </Trans>
                </Text>
              </Box>
            </>
          )}
        </Box>
      )}

      {!isSelfDelivery && (
        <Box mt={4} py={1}>
          <Field
            placeholder={i18n._(t`Tracking Number`)}
            iconButton={
              <ButtonBase
                onPress={() => setIsScannerOpen(true)}
                android_ripple={{ color: theme.colors.gray5, borderless: true }}
                style={{ padding: 4 }}
              >
                <MaterialCommunityIcon name="barcode-scan" size={18} color={theme.colors.black2} />
              </ButtonBase>
            }
            {...form.getInputFields('seller_courier_tracking')}
          />
        </Box>
      )}

      <Box py={1} px={2}>
        <ErrorMessage>{formError}</ErrorMessage>
      </Box>

      <Box py={3}>
        <Button
          text={isSelfDelivery ? i18n._(t`GENERATE SELF DROP-OFF ID`) : i18n._(t`SUBMIT`)}
          variant="black"
          loading={loading}
          onPress={form.submitForm}
        />
      </Box>
      <BarcodeQrScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onRead={(code) => {
          form.setFieldValue('seller_courier_tracking', code);
          setIsScannerOpen(false);
        }}
      />
    </>
  );
};

export { ManualShipmentDialog, ManualShipmentForm };
