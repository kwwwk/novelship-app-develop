import { ShippingMethodType, ShippingGenerateConfigType } from 'types/views/label-generation';
import { TransactionSellerType } from 'types/resources/transactionSeller';
import { RootRoutes } from 'types/navigation';

import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/core';
import { Trans, t } from '@lingui/macro';
import { i18n } from '@lingui/core';

import {
  SafeAreaScreenContainer,
  ScrollContainer,
  PageContainer,
  Footer,
} from 'app/components/layout';
import { ButtonBase, AnchorButton, Text, Box, ImgixImage } from 'app/components/base';
import { getShippingDoc } from 'common/constants/transaction';
import { getImgixUrl } from 'common/constants';

import { NinjaVanNotes } from '../couriers/ninjavan';
import { TitleText } from '.';

const ShippingConfirmScreen = ({
  sale,
  config,
  shippingMethod,
  refetch,
}: {
  sale: TransactionSellerType;
  config: ShippingGenerateConfigType;
  shippingMethod: ShippingMethodType;
  refetch: () => void;
}) => {
  const navigation = useNavigation<StackNavigationProp<RootRoutes>>();

  const isDropOff = shippingMethod === 'drop-off';
  const isNinjaVan = config.dropOffCourier === 'NINJAVAN';
  const isBluPort = config.dropOffCourier === 'BLUPORT';
  const isGDEX = config.pickupCourier === 'GDEX';

  return (
    <SafeAreaScreenContainer>
      <ScrollContainer>
        <PageContainer>
          <Box center mt={7}>
            <ImgixImage src={getImgixUrl('icons/badge-confirmation.png')} height={60} width={60} />
          </Box>
          <TitleText my={6} textAlign="center">
            {isDropOff ? <Trans>DROP-OFF CONFIRMED</Trans> : <Trans>PICKUP CONFIRMED</Trans>}
          </TitleText>

          <Text mb={3} fontSize={2} fontFamily="bold">
            {isDropOff && isBluPort ? (
              <Trans>Please check your email for a drop off instructions from bluport.</Trans>
            ) : (
              <Trans>Your shipping label has been generated and ready to print.</Trans>
            )}
          </Text>
          {isDropOff && isNinjaVan && (
            <>
              <NinjaVanNotes config={config} isDropOff />
              <Box px={3} mb={3} flexDirection="row">
                <Text style={{ marginTop: -2 }}>{'\u2022'}</Text>
                <Text ml={2} fontSize={2} lineHeight={18}>
                  <Trans>
                    Please make sure to have your parcel's barcode correctly scanned at the Ninja
                    Point.
                  </Trans>
                </Text>
              </Box>
              <Box px={3} mb={3} flexDirection="row">
                <Text style={{ marginTop: -2 }}>{'\u2022'}</Text>
                <Text ml={2} fontSize={2} lineHeight={18}>
                  <Trans>
                    Penalty will be incurred if the item is not shipped out{' '}
                    <Text fontSize={2} fontFamily="bold">
                      within two business days.
                    </Text>
                  </Trans>
                </Text>
              </Box>
            </>
          )}

          <Box mt={6} borderBottomWidth={1} borderBottomColor="gray6" />

          <Box center mt={3}>
            <ImgixImage src={getImgixUrl(sale.product.image)} height={140} width={140} />
            <Text mt={2} fontSize={2} fontFamily="bold" textTransform="uppercase">
              {sale.product.name}
            </Text>
            <Text mt={2} color="gray4" fontSize={2} fontFamily="bold" textTransform="uppercase">
              SKU: {sale.product.sku}
              {'   '}Size:{sale.local_size}
            </Text>
            <Box mt={4}>
              <ButtonBase
                onPress={() => {
                  navigation.goBack();
                  refetch();
                }}
              >
                <Text color="blue" fontSize={2} fontFamily="bold" textDecorationLine="underline">
                  <Trans>VIEW DETAILS</Trans>
                </Text>
              </ButtonBase>
            </Box>
          </Box>
        </PageContainer>
      </ScrollContainer>

      <Footer>
        <AnchorButton
          variant="black"
          text={i18n._(t`DOWNLOAD SHIPPING LABEL`)}
          to={getShippingDoc(sale.ref, isGDEX || isNinjaVan ? 'label' : 'instruction')}
        />
      </Footer>
    </SafeAreaScreenContainer>
  );
};

export default ShippingConfirmScreen;
