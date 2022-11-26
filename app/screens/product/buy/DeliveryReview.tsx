import { useQuery } from 'react-query';
import React, { useContext, useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { i18n } from '@lingui/core';
import { t, Trans } from '@lingui/macro';

import API from 'common/api';
import theme from 'app/styles/theme';
import { useStoreState } from 'app/store';
import getFaqLink from 'common/constants/faq';
import { TransactionType } from 'types/resources/transaction';
import { ProductRoutes, RootRoutes } from 'types/navigation';
import { cardString } from 'common/utils/payment';
import { addressString } from 'common/utils/address';
import CheckBoxInput from 'app/components/form/CheckBox';
import ConfirmDialog from 'app/components/dialog/ConfirmDialog';
import BuySellAlertMessage from 'app/components/widgets/BuySellAlertMessage';
import {
  Footer,
  PageContainer,
  ScrollContainer,
  SafeAreaScreenContainer,
} from 'app/components/layout';
import { Anchor, Box, Button, ButtonBase, ImgixImage, Text } from 'app/components/base';

import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import { Alert } from 'react-native';
import ProductCheckoutContext from '../context';
import ListItem from '../components/common/ListItem';
import AddPhoneBar from '../components/common/AddPhoneBar';
import AddEmailBar from '../components/common/AddEmailBar';
import BuyOfferItems from '../components/buy/BuyOfferItems';
import PaymentButton from '../components/buy/PaymentButton';
import FollowSocial from '../components/common/FollowSocial';
import ProductImageHeader from '../components/common/ProductImageHeader';
import TermsAndPrivacy from '../components/common/TermsAndPrivacy';

type DeliveryReviewNavigationProp = CompositeNavigationProp<
  StackNavigationProp<ProductRoutes, 'DeliveryReview'>,
  StackNavigationProp<RootRoutes, 'UserStack'>
>;
type DeliveryReviewRouteProp = RouteProp<ProductRoutes, 'DeliveryReview'>;

const DeliveryReview = ({
  navigation,
  route,
}: {
  navigation: DeliveryReviewNavigationProp;
  route: DeliveryReviewRouteProp;
}) => {
  const { sale_ref } = route.params;
  const { data: transaction, isFetching } = useQuery<TransactionType>(
    `me/sales/buying/${sale_ref}`
  );

  const {
    product,
    buy: { buy },
  } = useContext(ProductCheckoutContext);

  const user = useStoreState((s) => s.user.user);
  const { $$ } = useCurrencyUtils();

  const [saving, setSaving] = useState<boolean>(false);
  const [dutyCheck, setDutyCheck] = useState<boolean>(false);
  const [confirmDialog, setConfirmDialog] = useState<boolean>(false);

  const canBuyActions = user.hasDelivery && user.phone && user.email && user.country.buying_enabled;
  const isDeliveryPaid = !!transaction?.is_delivery_paid;
  const checkBuyerCard = isDeliveryPaid ? true : user.hasBuyCardAndEnabled;

  const canProceed =
    user.country.storage_delivery_enabled && checkBuyerCard && canBuyActions && dutyCheck;

  const afterCreate = () => {
    setSaving(false);
    navigation.replace('ConfirmedDelivery', { id: sale_ref });
  };

  const buyError = (error: string) => {
    setSaving(false);

    Alert.alert(
      '',
      error,
      [
        {
          text: i18n._(t`RETRY`),
          onPress: () => navigation.goBack(),
        },
      ],
      { cancelable: false }
    );
  };

  const createDelivery = () => {
    setSaving(true);
    API.put(`me/sales/${transaction?.ref}/deliver`).then(afterCreate).catch(buyError);
  };

  return isFetching || !sale_ref || !transaction?.id ? null : (
    <SafeAreaScreenContainer>
      <ScrollContainer>
        {!user.country.storage_delivery_enabled && (
          <Box width="auto">
            <BuySellAlertMessage>
              <Text fontFamily="bold" fontSize={2} color="white" lineHeight={16} pr={3}>
                <Trans>Deliveries are not available in your country.</Trans> <FollowSocial />
              </Text>
            </BuySellAlertMessage>
          </Box>
        )}

        <PageContainer>
          <ProductImageHeader product={product} />
          <BuyOfferItems
            view="delivery"
            product={product}
            size={transaction?.local_size}
            isDeliveryPaid={isDeliveryPaid}
          />
          <AddPhoneBar user={user} />
          <AddEmailBar user={user} />

          <ListItem>
            <Box center flexDirection="row">
              <MaterialCommunityIcon name="home-outline" size={18} color={theme.colors.textBlack} />
              <Text fontFamily="medium" ml={2}>
                <Trans>Deliver To</Trans>
              </Text>
            </Box>
            <ButtonBase
              onPress={() =>
                isDeliveryPaid ? {} : navigation.push('UserStack', { screen: 'BuyingForm' })
              }
              style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 'auto' }}
            >
              {user.hasDelivery ? (
                <Text fontSize={2} textAlign="right" mr={3} style={{ width: 170 }}>
                  {addressString(user.address, user.country)}
                </Text>
              ) : (
                <Text fontSize={2} color="red" mr={3}>
                  <Trans>Add Delivery address</Trans>
                </Text>
              )}
              {!isDeliveryPaid && (
                <MaterialCommunityIcon
                  name="pencil"
                  size={20}
                  color={theme.colors[user.hasDelivery ? 'textBlack' : 'red']}
                />
              )}
            </ButtonBase>
          </ListItem>

          {!isDeliveryPaid && (
            <Box mt={5}>
              <PaymentButton
                currentPaymentMethod="stripe"
                user={user}
                mode="buy"
                selectPayment={() => navigation.navigate('PaymentSelect', { cardOnly: true })}
              />
            </Box>
          )}

          <TermsAndPrivacy />
        </PageContainer>
      </ScrollContainer>

      <Footer>
        <CheckBoxInput checked={dutyCheck} onChecked={setDutyCheck}>
          <Box pr={5}>
            <Text color="gray1" fontSize={2} lineHeight={15}>
              <Trans>
                I understand I am responsible for import duties, taxes and fees.{' '}
                <Anchor
                  to={getFaqLink('duty_tax')}
                  fontSize={2}
                  textDecorationLine="underline"
                  color="blue"
                >
                  Learn more
                </Anchor>
              </Trans>
            </Text>
          </Box>
        </CheckBoxInput>
        <Box>
          <Button
            variant="black"
            size="lg"
            text={i18n._(t`CONFIRM DELIVERY`)}
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
        onConfirm={createDelivery}
        title={i18n._(t`CONFIRM DELIVERY FROM STORAGE`)}
        confirmText={i18n._(t`CONFIRM DELIVERY`)}
      >
        <Box mt={6} mb={4} mx={2} width="100%">
          <ImgixImage src={product.image} height={50} width={200} style={{ alignSelf: 'center' }} />
          <Text textAlign="center" fontSize={2} fontFamily="medium" mb={2} mt={4} px={4}>
            {product.name}
          </Text>
          {transaction?.size !== 'OS' && (
            <ListItem>
              <Text fontSize={2} fontFamily="medium" color="gray2">
                <Trans>Size</Trans>
              </Text>
              <Text fontSize={2} fontFamily="bold">
                {transaction?.local_size}
              </Text>
            </ListItem>
          )}
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
              {$$(buy.totalPrice)}
            </Text>
          </ListItem>
        </Box>
      </ConfirmDialog>
    </SafeAreaScreenContainer>
  );
};

export default DeliveryReview;
