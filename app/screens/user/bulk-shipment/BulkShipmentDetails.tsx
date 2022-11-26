import React from 'react';
import { i18n } from '@lingui/core';
import { Linking } from 'react-native';
import { t, Trans } from '@lingui/macro';
import QRCode from 'react-native-qrcode-svg';
import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';

import theme from 'app/styles/theme';
import { Box, Text, Button } from 'app/components/base';
import useAPIListFetch from 'app/hooks/useAPIListFetch';
import { TransactionType } from 'types/resources/transaction';
import { BulkShipmentRoutes, UserRoutes } from 'types/navigation';
import LoadingIndicator from 'app/components/misc/LoadingIndicator';
import ConfirmationTick from 'app/components/icons/ConfirmationTick';
import { Footer, SafeAreaScreenContainer, ScrollContainer } from 'app/components/layout';
import {
  getBulkShippingDoc,
  getPayoutStatus,
  getSaleStatus,
  getShippingDoc,
} from 'common/constants/transaction';

import { nsOfficeAddressString } from 'common/utils/address';
import { LB } from 'common/constants';
import { useStoreState } from 'app/store';
import ListCardProductInfo from '../components/ListCardProductInfo';
import { ActionLink } from '../components/ActionLinkButton';

type ShipmentDetailsNavigationProp = CompositeNavigationProp<
  StackNavigationProp<BulkShipmentRoutes, 'ConfirmedBulkShipment' | 'ShipmentDetails'>,
  StackNavigationProp<UserRoutes, 'Selling'>
>;

const BulkShipmentDetails = ({
  route,
  navigation,
}: {
  navigation: ShipmentDetailsNavigationProp;
  route: RouteProp<BulkShipmentRoutes, 'ConfirmedBulkShipment' | 'ShipmentDetails'>;
}) => {
  const { shipment_id } = route.params;

  const { isLoading, results: bulkShipmentItems } = useAPIListFetch<TransactionType>(
    `me/sales/selling/confirmed`,
    {
      filter: { seller_courier_tracking: shipment_id },
    },
    {
      refetchOnScreenFocus: true,
    }
  );
  const userRef = useStoreState((s) => s.user.user.ref);

  const transaction = bulkShipmentItems[0];
  const tracking = transaction && transaction.seller_courier_tracking_url;

  const isShipmentConfirmationView = route.name === 'ConfirmedBulkShipment';
  const isSelfDropOff = transaction && transaction.seller_courier?.includes('SELF ');

  return isLoading ? (
    <Box center height="100%">
      <LoadingIndicator size="large" />
    </Box>
  ) : bulkShipmentItems.length > 0 ? (
    <SafeAreaScreenContainer>
      <Box flex={1}>
        <ScrollContainer>
          <Box center mt={5} mb={5}>
            {isShipmentConfirmationView ? (
              <>
                <ConfirmationTick />
                <Text fontFamily="bold" mt={4} color="gray2" fontSize={1}>
                  <Trans>You have successfully created bulk shipping!</Trans>
                </Text>
              </>
            ) : (
              <Text fontSize={3} fontFamily="bold" textTransform="uppercase">
                <Trans>SHIPMENT #{shipment_id}</Trans>
              </Text>
            )}
          </Box>

          <Box center mb={5} px={5}>
            <Text fontFamily="bold" fontSize={1}>
              {isSelfDropOff ? (
                <Trans>Please drop off your products at:</Trans>
              ) : (
                <Trans>Please ship to:</Trans>
              )}
            </Text>
            <Text textAlign="center" fontFamily="bold" color="gray2" fontSize={1}>
              {nsOfficeAddressString(transaction.processing_country)}
            </Text>

            {isSelfDropOff && (
              <>
                <Text fontFamily="bold" fontSize={1} mt={4}>
                  <Trans>Drop off hours:</Trans>
                </Text>
                <Text textAlign="center" fontFamily="bold" color="gray2" fontSize={1}>
                  {transaction.processing_country.drop_off_day_time}
                </Text>
              </>
            )}
          </Box>

          <Box alignSelf="center" maxWidth={300} width="100%" mb={5}>
            <Box center py={3} bg="black2" borderRadius={5}>
              <Text color="white" fontSize={2}>
                <Trans>STATUS</Trans>
              </Text>
              <Box maxWidth={200}>
                <Text
                  mt={3}
                  fontSize={2}
                  color="goldenrod"
                  textAlign="center"
                  textTransform="uppercase"
                >
                  {i18n._(getSaleStatus(transaction, 'selling'))}{' '}
                  {transaction.seller_courier === 'JANIO' ? (
                    <Trans>- Pickup Confirmed</Trans>
                  ) : transaction.seller_courier === 'BLUPORT' ? (
                    <Trans>- Drop Off Confirmed</Trans>
                  ) : transaction.seller_courier === 'NINJAVAN' ? (
                    transaction?.seller_courier_pickup_date_time ? (
                      <>
                        <Trans>- Ninjavan Pickup Confirmed at </Trans>
                        {'\n'}
                        {transaction.seller_courier_pickup_date_time}
                      </>
                    ) : (
                      <Trans>- Ninjavan Drop Off Confirmed</Trans>
                    )
                  ) : null}
                  {getPayoutStatus(transaction, 'selling')
                    ? `- ${i18n._(getPayoutStatus(transaction, 'selling'))}`
                    : ''}
                </Text>
              </Box>
            </Box>
            {isSelfDropOff ? (
              <Box center py={2} my={4} bg="gray7">
                <Text fontFamily="bold" fontSize={2} mb={3}>
                  <Trans>SELF DROP-OFF ID</Trans>
                </Text>
                <QRCode
                  value={transaction.seller_courier_tracking}
                  backgroundColor={theme.colors.gray7}
                />
                <Text textTransform="uppercase" fontFamily="bold" mt={3}>
                  {transaction.seller_courier_tracking}
                </Text>
              </Box>
            ) : (
              <Box center borderWidth={2} borderColor="textBlack" borderRadius={4} py={2} my={4}>
                <Text fontFamily="medium" fontSize={1} color="gray2">
                  <Trans>COURIER SERVICE</Trans>
                </Text>
                <Text textTransform="uppercase" fontFamily="bold" mb={3}>
                  {transaction.seller_courier}
                </Text>
                <Text fontFamily="medium" fontSize={1} color="gray2">
                  <Trans>TRACKING NUMBER</Trans>
                </Text>
                <Text textTransform="uppercase" fontFamily="bold">
                  {transaction.seller_courier_tracking}
                </Text>
              </Box>
            )}
            {transaction.status === 'shipping' && !!tracking && (
              <Box mb={4}>
                <Button
                  variant="black"
                  text={i18n._(t`TRACK`)}
                  onPress={() => Linking.openURL(tracking)}
                />
              </Box>
            )}
            <ActionLink
              variant="black"
              size="md"
              to={
                bulkShipmentItems.length > 1
                  ? getBulkShippingDoc(shipment_id, userRef)
                  : getShippingDoc(transaction.ref)
              }
              text={i18n._(t`DOWNLOAD SHIPPING DOCUMENT`)}
            />
            <Text fontSize={1} style={{ alignSelf: 'center' }} lineHeight={14}>
              {bulkShipmentItems.length > 1 && (
                <>
                  <Trans>
                    Please print the shipping document, and include in your bulk shipment.
                  </Trans>
                  {LB}
                </>
              )}
              {isSelfDropOff ? (
                <Trans>
                  Please make sure your product is handed over to Novelship staff as soon as
                  possible to avoid any penalty.
                </Trans>
              ) : (
                <Trans>
                  Please make sure your product is handed over to the courier as soon as possible to
                  avoid any penalty.
                </Trans>
              )}
            </Text>
          </Box>

          <Box
            height={40}
            px={5}
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            bg="gray6"
          >
            <Box>
              <Text fontSize={2} fontFamily="medium">
                <Trans>PRODUCT</Trans>
              </Text>
            </Box>
            <Box>
              <Text fontSize={2} fontFamily="medium">
                <Trans>SALE</Trans>
              </Text>
            </Box>
          </Box>
          {bulkShipmentItems.map((item, x) => (
            <Box
              key={x}
              alignItems="center"
              justifyContent="space-between"
              flexDirection="row"
              px={5}
              borderBottomWidth={1}
              borderBottomColor="dividerGray"
              py={3}
            >
              <ListCardProductInfo product={item.product} size={item.local_size} width="70%" />
              <Text fontFamily="medium" fontSize={1} color="blue">
                {item.ref}
              </Text>
            </Box>
          ))}
        </ScrollContainer>
        <Footer>
          <Button
            text={i18n._(t`RETURN TO DASHBOARD`)}
            variant="black"
            onPress={() => navigation.navigate('Selling', { screen: 'ConfirmedSales' })}
          />
        </Footer>
      </Box>
    </SafeAreaScreenContainer>
  ) : (
    <Box center mt={4}>
      <Text fontSize={2}>
        <Trans>Shipment details not found!</Trans>
      </Text>
    </Box>
  );
};

export default BulkShipmentDetails;
