import React from 'react';
import { i18n } from '@lingui/core';
import { t, Trans } from '@lingui/macro';
import QRCode from 'react-native-qrcode-svg';
import theme from 'app/styles/theme';

import { getAvailableShippingMethods, getShippingDoc } from 'common/constants/transaction';
import { Text, Box } from 'app/components/base';
import { BoxProps } from 'app/components/base/Box';
import useToggle from 'app/hooks/useToggle';
import { UserRoutes } from 'types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import { TransactionSellerType } from 'types/resources/transactionSeller';
import { useStoreState } from 'app/store';
import CreateLabelConfirmationDialog from './CreateLabelConfirmationDialog';

import { ActionButton, ActionLink } from './ActionLinkButton';
import { ManualShipmentDialog } from './ManualShipmentDialog';

const GrayBox = ({
  title,
  children,
  ...props
}: { title: string; children: React.ReactNode } & BoxProps) => (
  <Box px={5} py={2} bg="gray7" width="100%" {...props}>
    <Text fontSize={2} textAlign="center" fontFamily="bold">
      {title}
    </Text>
    <Box mt={2} width="100%" flexDirection="row" justifyContent="space-between">
      {children}
    </Box>
  </Box>
);

const SaleActions = ({
  sale,
  refetch,
  navigation,
}: {
  sale: TransactionSellerType;
  refetch: () => void;
  navigation: StackNavigationProp<UserRoutes>;
}) => {
  const [confirmAddressDialog, confirmAddressDialogToggle] = useToggle(false);
  const [manualShipmentDialog, manualShipmentDialogToggle] = useToggle(false);
  const sourceShortcode = sale.seller_country.shortcode;

  const sellerType = useStoreState((s) => s.user.user.seller_type);

  const shippingMethods = getAvailableShippingMethods(sale, sellerType);

  return (
    <>
      {sale.payout_status === 'ready' && (
        <ActionButton
          text={i18n._(t`REQUEST PAYOUT`)}
          onPress={() => navigation.push('PayoutRequest')}
        />
      )}

      {sale.status === 'confirmed' &&
        (sale.seller_courier === 'JANIO' ? (
          <ActionLink text={i18n._(t`SHIPPING LABEL`)} to={getShippingDoc(sale.ref)} />
        ) : sale.seller_courier === 'NINJAVAN' ? (
          <>
            <ActionLink text={i18n._(t`SELLER PAPER`)} to={getShippingDoc(sale.ref)} />
            <ActionLink text={i18n._(t`SHIPPING LABEL`)} to={getShippingDoc(sale.ref, 'label')} />
          </>
        ) : sale.seller_courier === 'BLUPORT' ? (
          <>
            <ActionLink text={i18n._(t`SELLER PAPER`)} to={getShippingDoc(sale.ref)} />
            <Text mt={2} mb={3} fontSize={1} textAlign="center">
              <Trans>Missed your Drop off? Rearrange drop off appointment here:</Trans>
            </Text>
            <ActionButton
              text={i18n._(t`REARRANGE DROP OFF`)}
              onPress={confirmAddressDialogToggle}
            />
          </>
        ) : sale.seller_courier === 'GDEX' ? (
          <GrayBox title={i18n._(t`DOWNLOAD SHIPPING DOCUMENTS`)}>
            <ActionLink
              variant="white"
              width="48%"
              to={getShippingDoc(sale.ref)}
              text={i18n._(t`SELLER PAPER`)}
            />
            <ActionLink
              variant="white"
              width="48%"
              to={getShippingDoc(sale.ref, 'label')}
              text={i18n._(t`SHIPPING LABEL`)}
            />
          </GrayBox>
        ) : sale.seller_courier === 'DHL' ? (
          <>
            <GrayBox title={i18n._(t`STEP 1: DOWNLOAD SHIPPING DOCUMENTS`)}>
              <ActionLink
                variant="white"
                width="32%"
                size="xs"
                to={getShippingDoc(sale.ref)}
                text={i18n._(t`SELLER PAPER`)}
              />
              <ActionLink
                variant="white"
                width="32%"
                size="xs"
                to={getShippingDoc(sale.ref, 'label')}
                text={i18n._(t`AIRWAY BILL`)}
              />
              <ActionLink
                variant="white"
                width="32%"
                size="xs"
                to={getShippingDoc(sale.ref, 'invoice')}
                text={i18n._(t`INVOICE`)}
              />
            </GrayBox>
            <Box mt={2} width="100%">
              <Text mb={2} fontSize={2} textAlign="center" fontFamily="bold">
                <Trans>STEP 2</Trans>
              </Text>
              <ActionLink
                text={i18n._(t`REQUEST PICKUP`)}
                to={`https://mydhl.express.dhl/${sourceShortcode.toLocaleLowerCase()}/en/schedule-pickup.html#/schedule-pickup`}
              />
            </Box>
          </>
        ) : shippingMethods['seller-generate'] ? (
          <ActionButton
            text={i18n._(t`CREATE SHIPPING LABEL`)}
            onPress={confirmAddressDialogToggle}
          />
        ) : shippingMethods.automated ? (
          <Text mt={1} fontSize={1} textAlign="center">
            <Trans>
              Your Shipment is being created and will be sent to your email. Please reopen this page
              in a minute to download it. If you are facing any issues please contact
              support@novelship.com
            </Trans>
          </Text>
        ) : shippingMethods.manual && shippingMethods.manual.selection?.includes('single') ? (
          <>
            <GrayBox title={i18n._(t`STEP 1`)}>
              <ActionLink
                variant="white"
                to={getShippingDoc(sale.ref)}
                text={i18n._(t`SELLER PAPER`)}
              />
            </GrayBox>
            <GrayBox my={2} title={i18n._(t`STEP 2`)}>
              <Box width="100%">
                <Text fontSize={2} textAlign="center" fontFamily="bold">
                  <Trans>Arrange your Own Shipping</Trans>
                </Text>
              </Box>
            </GrayBox>
            <GrayBox my={2} title={i18n._(t`STEP 3`)}>
              <ActionButton
                text={i18n._(t`ENTER TRACKING NUMBER`)}
                onPress={manualShipmentDialogToggle}
                variant="white"
              />
            </GrayBox>
          </>
        ) : (
          <ActionLink text={i18n._(t`SELLER PAPER`)} to={getShippingDoc(sale.ref)} />
        ))}

      {!!sale.seller_courier &&
        !!sale.seller_courier_tracking &&
        (sale.seller_courier.includes('SELF') ? (
          <>
            <GrayBox title={i18n._(t`SELF DROP-OFF ID`)}>
              <Box center width="100%">
                <QRCode value={sale.seller_courier_tracking} backgroundColor={theme.colors.gray7} />
                <Text
                  textTransform="uppercase"
                  fontFamily="bold"
                  mt={3}
                  textDecorationLine="underline"
                  onPress={() =>
                    navigation.navigate('BulkShipment', {
                      screen: 'ShipmentDetails',
                      params: { shipment_id: sale.seller_courier_tracking },
                    })
                  }
                >
                  {sale.seller_courier_tracking}
                </Text>
              </Box>
            </GrayBox>
            <Text fontSize={1} mt={3} lineHeight={16}>
              <Trans>
                Please make sure your product is handed over to Novelship staff as soon as possible
                to avoid any penalty.
              </Trans>
            </Text>
          </>
        ) : (
          <>
            <Box
              center
              borderWidth={2}
              borderColor="textBlack"
              borderRadius={4}
              width="100%"
              py={2}
            >
              <Text fontFamily="medium" fontSize={1} color="gray2">
                <Trans>COURIER SERVICE</Trans>
              </Text>
              <Text textTransform="uppercase" fontFamily="bold" mb={3}>
                {sale.seller_courier}
              </Text>
              <Text fontFamily="medium" fontSize={1} color="gray2">
                <Trans>TRACKING NUMBER</Trans>
              </Text>
              <Text
                textTransform="uppercase"
                fontFamily="bold"
                textDecorationLine="underline"
                onPress={() =>
                  navigation.navigate('BulkShipment', {
                    screen: 'ShipmentDetails',
                    params: { shipment_id: sale.seller_courier_tracking },
                  })
                }
              >
                {sale.seller_courier_tracking}
              </Text>
            </Box>
            <Text fontSize={1} mt={3} lineHeight={16}>
              <Trans>
                Please make sure your product is handed over to the courier as soon as possible to
                avoid any penalty.
              </Trans>
            </Text>
          </>
        ))}

      <CreateLabelConfirmationDialog
        sale={sale}
        isOpen={confirmAddressDialog}
        onClose={confirmAddressDialogToggle}
      />

      <ManualShipmentDialog
        trxn={sale}
        refetch={refetch}
        isOpen={manualShipmentDialog}
        onClose={manualShipmentDialogToggle}
      />
    </>
  );
};

export default SaleActions;
