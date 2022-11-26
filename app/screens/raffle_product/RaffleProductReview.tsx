import { i18n } from '@lingui/core';
import { t, Trans } from '@lingui/macro';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useState } from 'react';
import { Alert } from 'react-native';

import { Box, Button, ButtonBase, ImgixImage, Text } from 'app/components/base';
import ConfirmDialog from 'app/components/dialog/ConfirmDialog';
import {
  Footer,
  KeyboardAwareContainer,
  PageContainer,
  SafeAreaScreenContainer,
  ScrollContainer,
} from 'app/components/layout';
import BuySellAlertMessage from 'app/components/widgets/BuySellAlertMessage';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import Analytics from 'app/services/analytics';
import { useStoreState } from 'app/store';
import theme from 'app/styles/theme';
import API from 'common/api';
import { canBuyActions } from 'common/constants/transaction';
import { addressString } from 'common/utils/address';
import { getCurrentCurrency } from 'common/utils/currency';
import { cardString } from 'common/utils/payment';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RaffleRoutes, RootRoutes } from 'types/navigation';
import { RaffleProductEntryType } from 'types/resources/raffleProductEntry';
import { UserType } from 'types/resources/user';
import PaymentButton from '../product/components/buy/PaymentButton';
import AddEmailBar from '../product/components/common/AddEmailBar';
import AddPhoneBar from '../product/components/common/AddPhoneBar';
import FollowSocial from '../product/components/common/FollowSocial';
import ListItem from '../product/components/common/ListItem';
import ProductImageHeader from '../product/components/common/ProductImageHeader';
import TermsAndPrivacy from '../product/components/common/TermsAndPrivacy';
import RaffleEntryItems from './components/RaffleEntryItems';
import RaffleProductCheckoutContext from './context';

type RaffleEntryReviewNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RaffleRoutes, 'RaffleProductReview'>,
  StackNavigationProp<RootRoutes, 'UserStack'>
>;
type RaffleEntryReviewRouteProp = RouteProp<RaffleRoutes, 'RaffleProductReview'>;
const RaffleProductReview = ({
  navigation,
  route,
}: {
  navigation: RaffleEntryReviewNavigationProp;
  route: RaffleEntryReviewRouteProp;
}) => {
  const {
    raffleProduct,
    size: { getDisplaySize },
  } = useContext(RaffleProductCheckoutContext);

  const { size } = route.params;
  const currency = getCurrentCurrency();
  const user = useStoreState((s) => s.user.user);
  const [confirmDialog, setConfirmDialog] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const offerPrice = raffleProduct.price;
  const { $$ } = useCurrencyUtils();
  const canProceed = user.hasBuyCardAndEnabled && canBuyActions(user);

  const raffleEntryError = (error: string) => {
    setSaving(false);

    return Alert.alert(
      '',
      error,
      [
        {
          text: /vacation/i.test(error) ? i18n._(t`OK`) : i18n._(t`Continue`),
          onPress: () => {
            if (/vacation/i.test(error)) {
              return navigation.push('UserStack', { screen: 'Settings' });
            }
            return navigation.navigate('RaffleProduct');
          },
        },
      ],
      { cancelable: false }
    );
  };

  const { collatedTranslatedSize } = getDisplaySize(size);
  const afterCreate = (item: RaffleProductEntryType) => {
    setSaving(false);

    Analytics.raffleReviewConfirm('Confirm', raffleProduct, {
      Size: item.size,
      'User Raffle ID': item.id,
      Price: item.local_price,
    });
    return navigation.replace('RaffleProductConfirmed', {
      id: (item as RaffleProductEntryType).id,
    });
  };
  const createRaffleEntry = () => {
    setSaving(true);
    const raffleEntry = {
      size,
      local_size: collatedTranslatedSize,
      raffle_product_id: raffleProduct.id,
      local_currency_id: currency.id,
    };
    const saveOffer = API.post<RaffleProductEntryType>(
      `me/raffle_product_entry/enter`,
      raffleEntry
    );

    return saveOffer.then(afterCreate).catch(raffleEntryError);
  };

  return (
    <SafeAreaScreenContainer>
      <KeyboardAwareContainer behavior="position">
        <ScrollContainer>
          {!user.country.buying_enabled && (
            <Box width="auto">
              <BuySellAlertMessage>
                <Text fontFamily="bold" fontSize={2} color="white" lineHeight={16} pr={3}>
                  <Trans>We are not available yet in your country for buying.</Trans>{' '}
                  <FollowSocial />
                </Text>
              </BuySellAlertMessage>
            </Box>
          )}
          <PageContainer>
            <ProductImageHeader product={raffleProduct.product} />
            <RaffleEntryItems size={size} />

            <Box height={1} bg="dividerGray" mt={3} mb={3} />

            <AddPhoneBar user={user} />
            <AddEmailBar user={user} />
            <ListItem>
              <DeliverTo user={user} navigation={navigation} />
            </ListItem>
            <Box height={1} bg="dividerGray" mt={3} mb={3} />
            <Box mt={5}>
              <PaymentButton
                currentPaymentMethod="stripe"
                user={user}
                mode="buy"
                selectPayment={() =>
                  navigation.push('ProductStack', {
                    screen: 'PaymentSelect',
                    slug: raffleProduct.product.name_slug,
                    params: { cardOnly: true },
                  })
                }
              />
            </Box>
            <TermsAndPrivacy />
          </PageContainer>
        </ScrollContainer>
      </KeyboardAwareContainer>
      <Footer>
        <Box>
          <Button
            variant="black"
            size="lg"
            text={i18n._(t`CONFIRM RAFFLE ENTRY`)}
            loading={saving}
            disabled={!canProceed}
            onPress={() => setConfirmDialog(true)}
          />
        </Box>
      </Footer>
      {/* Dialogs */}
      <ConfirmDialog
        isOpen={confirmDialog}
        onClose={() => setConfirmDialog(false)}
        onConfirm={createRaffleEntry}
        title={i18n._(t`CONFIRM RAFFLE ENTRY`)}
        confirmText={i18n._(t`CONFIRM`)}
      >
        <Box mt={8} mb={4} mx={2} width="100%">
          <ImgixImage
            src={raffleProduct.product.image}
            height={50}
            width={200}
            style={{ alignSelf: 'center' }}
          />
          <Text textAlign="center" fontSize={2} fontFamily="medium" my={6} px={4}>
            {raffleProduct.product.name}
          </Text>
          {size !== 'OS' && (
            <ListItem>
              <Text fontSize={2} fontFamily="medium" color="gray2">
                <Trans>Size</Trans>
              </Text>
              <Text fontSize={2} fontFamily="bold">
                {size}
              </Text>
            </ListItem>
          )}
          <ListItem>
            <Text fontSize={2} fontFamily="medium" color="gray2">
              <Trans>Product Price</Trans>
            </Text>
            <Text fontSize={2} fontFamily="bold">
              {$$(offerPrice)}
            </Text>
          </ListItem>
          <ListItem>
            <Text fontSize={2} fontFamily="medium" color="gray2">
              <Trans>Payment Method</Trans>
            </Text>
            <Text fontSize={2} fontFamily="bold">
              {cardString(user.stripe_buyer)}
            </Text>
          </ListItem>
          <ListItem>
            <Text fontSize={2} fontFamily="medium" color="gray2">
              <Trans>Total Payable</Trans>
            </Text>
            <Text fontSize={2} fontFamily="bold" color="blue">
              {$$(offerPrice)}
            </Text>
          </ListItem>
        </Box>
      </ConfirmDialog>
    </SafeAreaScreenContainer>
  );
};

const DeliverTo = ({
  user,
  navigation,
}: {
  user: UserType;
  navigation: RaffleEntryReviewNavigationProp;
}) => (
  <>
    <Box center flexDirection="row">
      <MaterialCommunityIcon name="home-outline" size={18} color={theme.colors.textBlack} />
      <Text fontFamily="medium" ml={2}>
        <Trans>Deliver</Trans>
      </Text>
    </Box>
    <ButtonBase
      onPress={() => navigation.push('UserStack', { screen: 'BuyingForm' })}
      style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 'auto' }}
    >
      {user.hasDelivery ? (
        <Text fontSize={2} textAlign="right" mr={3} style={{ width: 170 }}>
          {addressString(user.address, user.country)}
        </Text>
      ) : (
        <Text fontSize={2} fontFamily="medium" color="red" mr={3}>
          <Trans>Add Delivery address</Trans>
        </Text>
      )}
      <MaterialCommunityIcon
        name="pencil"
        size={20}
        color={theme.colors[user.hasDelivery ? 'textBlack' : 'red']}
      />
    </ButtonBase>
  </>
);

export default RaffleProductReview;
