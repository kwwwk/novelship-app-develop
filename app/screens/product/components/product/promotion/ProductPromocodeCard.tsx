import { PromocodeType } from 'types/resources/promocode';
import { RootRoutes } from 'types/navigation';

import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/core';
import { t, Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';
import Clipboard from '@react-native-community/clipboard';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

import { ButtonBase, Text, Box } from 'app/components/base';
import { toDate } from 'common/utils/time';
import { LB } from 'common/constants';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import InfoDialog from 'app/components/dialog/InfoDialog';
import useToggle from 'app/hooks/useToggle';
import theme from 'app/styles/theme';

function copy(promocode: string) {
  if (promocode) {
    Clipboard.setString(promocode);
    Toast.show({
      type: 'default',
      text1: i18n._('CODE COPIED'),
      position: 'bottom',
      bottomOffset: 120,
    });
  }
}

const ProductPromocodeCard = ({ promocode }: { promocode: PromocodeType }) => {
  const navigation = useNavigation<StackNavigationProp<RootRoutes>>();
  const [isOpen, toggleDialog] = useToggle(false);
  const { $ } = useCurrencyUtils();

  const navigateToPointShop = () =>
    navigation.navigate('UserStack', { screen: 'LoyaltyPointsStore' });

  return (
    <Box mt={3} mx={6}>
      <ButtonBase onPress={() => (promocode.code ? toggleDialog() : null)}>
        <Box
          justifyContent="space-between"
          flexDirection="row"
          borderColor="gray4"
          alignItems="center"
          borderRadius={4}
          borderWidth={1}
          minHeight={64}
          px={4}
          py={3}
        >
          {promocode.code ? (
            <Box>
              <Box mb={2} flexDirection="row" alignItems="center">
                {promocode.is_shipping_free ? (
                  <Text fontSize={2} fontFamily="bold" textTransform="uppercase">
                    <Trans>Free Shipping</Trans>
                  </Text>
                ) : (
                  <Text fontSize={2} fontFamily="bold" textTransform="uppercase">
                    <Trans>
                      {promocode.is_percentage_discount
                        ? `${promocode.value}%`
                        : $(promocode.value)}{' '}
                      off
                    </Trans>{' '}
                    {promocode.is_shipping_only && <Trans>(Delivery)</Trans>}
                  </Text>
                )}
                <Text ml={2}>
                  <Ionicon name="information-circle" size={16} color={theme.colors.textBlack} />
                </Text>
              </Box>
              {!!promocode.min_buy && (
                <Text fontSize={1}>
                  <Trans>Min Spend</Trans> {$(promocode.min_buy)}
                </Text>
              )}
            </Box>
          ) : (
            <Text fontSize={2}>
              <Trans>
                Redeem promocode {LB}
                using NS Points
              </Trans>
            </Text>
          )}

          <Box alignItems="flex-end">
            <Text mb={2} fontSize={2} fontFamily="bold">
              {promocode.code}
            </Text>
            <ButtonBase
              onPress={() => (promocode.code ? copy(promocode.code) : navigateToPointShop())}
            >
              <Text
                textDecorationLine="underline"
                textTransform="uppercase"
                fontFamily="bold"
                fontSize={1}
              >
                {promocode.code ? <Trans>Copy Code</Trans> : <Trans>Redeem Now</Trans>}
              </Text>
            </ButtonBase>
          </Box>
        </Box>
      </ButtonBase>

      <ProductPromoCodeInfoDialog
        promocode={promocode}
        toggleDialog={toggleDialog}
        isOpen={isOpen}
      />
    </Box>
  );
};

const ProductPromoCodeInfoDialog = ({
  promocode,
  isOpen,
  toggleDialog,
}: {
  promocode: PromocodeType;
  isOpen: boolean;
  toggleDialog: () => void;
}) => {
  const { $ } = useCurrencyUtils();

  return (
    <InfoDialog isOpen={isOpen} onClose={toggleDialog} buttonText={i18n._(t`GOT IT`)} showClose>
      <Box pt={4} pb={5} justifyContent="center">
        {promocode.is_shipping_free ? (
          <Text fontSize={4} fontFamily="bold" textTransform="uppercase">
            <Trans>Free Shipping</Trans>
          </Text>
        ) : (
          <Text fontSize={4} fontFamily="bold" textTransform="uppercase">
            <Trans>
              {promocode.is_percentage_discount ? `${promocode.value}%` : $(promocode.value)} off
            </Trans>{' '}
            {promocode.is_shipping_only && <Trans>(Delivery)</Trans>}
          </Text>
        )}
      </Box>
      <Box mb={3} height={1} width={340} bg="dividerGray" />

      {promocode.first_purchase_only ? (
        <Text my={3} fontSize={2}>
          <Trans>For first time purchase</Trans>
        </Text>
      ) : (
        promocode.description && (
          <Text my={3} fontSize={2}>
            {promocode.description}
          </Text>
        )
      )}

      {!!promocode.min_buy && (
        <Text fontSize={3} my={2}>
          <Trans>Min Spend</Trans> {$(promocode.min_buy)}
        </Text>
      )}

      <Box
        justifyContent="center"
        alignItems="center"
        alignSelf="stretch"
        borderRadius={4}
        bg="orange2"
        height={44}
        my={3}
        mb={4}
      >
        <Text fontSize={3} fontFamily="bold">
          {promocode.code}
        </Text>
      </Box>

      <ButtonBase onPress={() => (promocode ? copy(promocode.code) : null)}>
        <Text
          textDecorationLine="underline"
          textTransform="uppercase"
          fontFamily="bold"
          fontSize={1}
          mb={5}
        >
          <Trans>Copy Code</Trans>
        </Text>
      </ButtonBase>

      <Text mb={3} fontSize={2}>
        Valid Till {toDate(promocode.end_date)}
      </Text>
    </InfoDialog>
  );
};

export default ProductPromocodeCard;
