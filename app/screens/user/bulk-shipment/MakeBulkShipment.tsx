import { Trans } from '@lingui/macro';
import React, { useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';

import {
  KeyboardAwareContainer,
  SafeAreaScreenContainer,
  ScrollContainer,
} from 'app/components/layout';
import { Anchor, Box, Text } from 'app/components/base';
import { BulkShipmentRoutes } from 'types/navigation';
import { TransactionSellerType } from 'types/resources/transactionSeller';
import useAPIListFetch from 'app/hooks/useAPIListFetch';
import CheckBoxInput from 'app/components/form/CheckBox';
import LoadingIndicator from 'app/components/misc/LoadingIndicator';
import getFaqLink from 'common/constants/faq';
import ListCardProductInfo from '../components/ListCardProductInfo';
import { ManualShipmentForm } from '../components/ManualShipmentDialog';

const MakeBulkShipment = ({
  navigation,
  route,
}: StackScreenProps<BulkShipmentRoutes, 'MakeBulkShipment'>) => {
  const { selected_refs } = route.params;

  const [selectedSaleRefs, setSelectedSaleRefs] = useState<string[]>(selected_refs);

  const { isLoading, results: bulkShipmentItems } = useAPIListFetch<TransactionSellerType>(
    `me/sales/selling/confirmed`,
    {
      filter: { 'ref:in': selected_refs.join(',') },
    },
    {
      refetchOnScreenFocus: true,
    }
  );

  return isLoading ? (
    <Box center height="100%">
      <LoadingIndicator size="large" />
    </Box>
  ) : (
    <Box flex={1} backgroundColor="white">
      <SafeAreaScreenContainer>
        <KeyboardAwareContainer>
          <ScrollContainer>
            {selectedSaleRefs.length ? (
              <Box px={5}>
                <Text mt={6} fontSize={3} fontFamily="bold">
                  <Trans>SELECT SHIPPING METHOD</Trans>
                </Text>
                <Anchor
                  to={getFaqLink('bulk_shipping')}
                  fontSize={2}
                  color="blue"
                  fontFamily="bold"
                  mb={4}
                >
                  <Trans>Shipment Guide</Trans>
                </Anchor>
                <ManualShipmentForm
                  onSubmit={(tracking_id) =>
                    navigation.replace('ConfirmedBulkShipment', { shipment_id: tracking_id })
                  }
                  trxn={bulkShipmentItems[0]}
                  trxn_refs={selectedSaleRefs}
                />
              </Box>
            ) : (
              <Text px={5} mt={6} fontSize={1} fontFamily="bold" color="red">
                <Trans>Please select at least one transaction to continue.</Trans>
              </Text>
            )}
            <Box
              height={40}
              px={5}
              mt={2}
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
                  <Trans>SALE ID</Trans>
                </Text>
              </Box>
            </Box>
            {bulkShipmentItems.map((item, x) => {
              const isSaleSelected = selectedSaleRefs.includes(item.ref);

              return (
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
                  <Box center width="70%" flexDirection="row">
                    <CheckBoxInput
                      checked={isSaleSelected}
                      onChecked={() => {
                        if (isSaleSelected) {
                          setSelectedSaleRefs(selectedSaleRefs.filter((s) => s !== item.ref));
                        } else {
                          setSelectedSaleRefs([...selectedSaleRefs, item.ref]);
                        }
                      }}
                    />
                    <ListCardProductInfo product={item.product} size={item.size} width="90%" />
                  </Box>
                  <Text fontFamily="medium" fontSize={1} color="blue">
                    {item.ref}
                  </Text>
                </Box>
              );
            })}
          </ScrollContainer>
        </KeyboardAwareContainer>
      </SafeAreaScreenContainer>
    </Box>
  );
};

export default MakeBulkShipment;
