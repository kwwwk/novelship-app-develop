import {
  ShippingGenerateConfigType,
  ShippingMethodType,
  ShippingScreenType,
} from 'types/views/label-generation';
import { TransactionSellerType } from 'types/resources/transactionSeller';

import React from 'react';
import { PressableProps } from 'react-native';
import { Trans, t } from '@lingui/macro';
import { i18n } from '@lingui/core';

import {
  SafeAreaScreenContainer,
  ScrollContainer,
  PageContainer,
  Footer,
} from 'app/components/layout';
import { ImgixImage, ButtonBase, Button, Text, Box } from 'app/components/base';
import { getImgixUrl, LB } from 'common/constants';
import ProductImageHeader from 'app/screens/product/components/common/ProductImageHeader';
import InfoDialog from 'app/components/dialog/InfoDialog';
import useToggle from 'app/hooks/useToggle';

import { NinjaVanDropOffConfirmDialog, NinjaVanNotes } from '../couriers/ninjavan';
import { BluPortNotes } from '../couriers/bluport';
import { JanioNotes } from '../couriers/janio';

const SelectShippingMethodScreen = ({
  sale,
  config,
  shippingMethod,
  setShippingMethod,

  setCurrentScreen,
}: {
  sale: TransactionSellerType;
  config: ShippingGenerateConfigType;
  shippingMethod: ShippingMethodType;
  setShippingMethod: (_: ShippingMethodType) => void;
  setCurrentScreen: (_: ShippingScreenType) => void;
}) => {
  const [confirmationDialog, confirmationDialogToggle] = useToggle(false);
  const [shipDiffDialog, shipDiffDialogToggle] = useToggle(false);

  const isRearrange = sale.seller_courier === 'BLUPORT';
  const isDropOff = shippingMethod === 'drop-off';
  const isPickup = shippingMethod === 'pickup';

  const action = () => {
    const isNinjaVanDropOff = isDropOff && config.dropOffCourier === 'NINJAVAN';

    if (isNinjaVanDropOff && !confirmationDialog) {
      confirmationDialogToggle();
    } else {
      setCurrentScreen(`${shippingMethod}-info` as ShippingScreenType);
    }
  };

  return (
    <SafeAreaScreenContainer>
      <ScrollContainer>
        <ProductImageHeader
          p={5}
          size={sale.local_size}
          product={sale.product}
          borderBottomWidth={1}
          borderBottomColor="gray6"
        />
        <PageContainer p={5}>
          <Text fontSize={4} fontFamily="bold" textTransform="uppercase">
            <Trans>Select Shipping Method</Trans>
          </Text>
          <Box mt={5} width="100%" flexDirection="row" justifyContent="space-around">
            <ShipTypeButton
              onPress={() => setShippingMethod('drop-off')}
              iconSrc="icons/drop-off.png"
              selected={isDropOff}
            >
              <Trans>Drop Off</Trans>
            </ShipTypeButton>
            <ShipTypeButton
              onPress={() => setShippingMethod('pickup')}
              iconSrc="icons/pickup.png"
              selected={isPickup}
            >
              <Trans>Pick Up</Trans>
            </ShipTypeButton>
          </Box>
          <Box center p={2} mt={8} mb={3} flexDirection="row">
            <ButtonBase onPress={shipDiffDialogToggle}>
              <Text color="blue" fontSize={2}>
                <Trans>What’s the difference?</Trans>
              </Text>
            </ButtonBase>
          </Box>
          {!isPickup && (
            <Box px={3} mb={3} alignItems="center" flexDirection="row">
              <Text>{'\u2022'}</Text>
              <Text ml={2} fontSize={2} lineHeight={18}>
                <Trans>Easy, convenient and affordable</Trans>
              </Text>
            </Box>
          )}
          <BluPortNotes isDropOff={isDropOff} config={config} />
          <JanioNotes isPickup={isPickup} config={config} />
          <NinjaVanNotes config={config} isDropOff={isDropOff} isPickup={isPickup} />
          <Box px={3} flexDirection="row">
            <Text style={{ marginTop: -2 }}>{'\u2022'}</Text>
            <Box flexDirection="row">
              <Text ml={2} fontSize={2} lineHeight={18}>
                <Trans>
                  Penalty will be incurred if the item is not shipped out within{' '}
                  <Text fontSize={1} fontFamily="bold">
                    2 business days.
                  </Text>
                </Trans>
              </Text>
            </Box>
          </Box>
        </PageContainer>
      </ScrollContainer>

      <Footer>
        <Button
          disabled={!shippingMethod}
          onPress={action}
          variant="black"
          size="lg"
          text={
            isPickup
              ? i18n._(t`CREATE PICKUP`)
              : isRearrange
              ? i18n._(t`REARRANGE DROP OFF`)
              : i18n._(t`CREATE DROP OFF`)
          }
        />
      </Footer>

      <InfoDialog
        isOpen={shipDiffDialog}
        onClose={shipDiffDialogToggle}
        buttonText={i18n._(t`GOT IT`)}
      >
        <Box center>
          <Text fontSize={4} fontFamily="bold" textTransform="uppercase" textAlign="center">
            <Trans>WHAT’S THE DIFFERENCE BETWEEN PICK UP AND DROP OFF?</Trans>
          </Text>

          <Text mt={3} mb={7} fontSize={2} textAlign="center">
            <Text fontSize={2} fontFamily="bold">
              <Trans>Pick Up</Trans>
            </Text>
            {LB}
            <Trans>
              This pick-up service gives you the convenience to have your item collected by our
              friendly courier partners directly from your doorstep.
            </Trans>
            {LB}
            {LB}
            <Text fontSize={2} fontFamily="bold">
              <Trans>Drop Off</Trans>
            </Text>
            {LB}
            <Trans>
              This self drop-off service gives you the flexibility to drop off your item at the
              selected drop-off stations in your own time.
            </Trans>
          </Text>
        </Box>
      </InfoDialog>

      <NinjaVanDropOffConfirmDialog
        sale={sale}
        isOpen={confirmationDialog}
        onClose={confirmationDialogToggle}
        setCurrentScreen={setCurrentScreen}
      />
    </SafeAreaScreenContainer>
  );
};

const ShipTypeButton = ({
  iconSrc,
  selected,
  children,
  onPress,
}: { iconSrc: string; selected: boolean } & PressableProps) => (
  <ButtonBase onPress={onPress}>
    <Box
      bg={selected ? 'black3' : 'white'}
      borderColor="black3"
      borderRadius={4}
      borderWidth={1}
      height={100}
      width={100}
      center
      p={3}
    >
      <ImgixImage
        style={{ tintColor: selected ? 'white' : '#000000' }}
        src={getImgixUrl(iconSrc)}
        height={60}
        width={60}
      />
      <Text mt={2} fontSize={2} color={selected ? 'white' : 'black2'}>
        {children}
      </Text>
    </Box>
  </ButtonBase>
);

export default SelectShippingMethodScreen;
