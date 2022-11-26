import { ProductRoutes, RootRoutes } from 'types/navigation';
import { TransactionType } from 'types/resources/transaction';

import React, { useContext, useState } from 'react';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { t, Trans } from '@lingui/macro';
import { Alert } from 'react-native';
import { i18n } from '@lingui/core';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  SafeAreaScreenContainer,
  KeyboardAwareContainer,
  ScrollContainer,
  PageContainer,
  Footer,
} from 'app/components/layout';
import { Box, Button, ButtonBase, ImgixImage, Text } from 'app/components/base';
import { canCreateList } from 'common/constants/transaction';
import { addressString } from 'common/utils/address';
import { useStoreState } from 'app/store';
import { cardString } from 'common/utils/payment';
import BuySellAlertMessage from 'app/components/widgets/BuySellAlertMessage';
import ConfirmDialog from 'app/components/dialog/ConfirmDialog';
import CheckBoxInput from 'app/components/form/CheckBox';
import Analytics from 'app/services/analytics';
import theme from 'app/styles/theme';
import API from 'common/api';

import ProductCheckoutContext from '../context';
import ReviewProfileEditBar from '../components/common/ReviewProfileEditBar';
import ProductImageHeader from '../components/common/ProductImageHeader';
import TermsAndPrivacy from '../components/common/TermsAndPrivacy';
import FollowSocial from '../components/common/FollowSocial';
import AddEmailBar from '../components/common/AddEmailBar';
import AddPhoneBar from '../components/common/AddPhoneBar';
import ListItem from '../components/common/ListItem';

type ConsignReviewNavigationProp = CompositeNavigationProp<
  StackNavigationProp<ProductRoutes, 'ConsignReview'>,
  StackNavigationProp<RootRoutes, 'UserStack'>
>;

type ConsignReviewRouteProp = RouteProp<ProductRoutes, 'ConsignReview'>;

const ConsignReview = ({
  navigation,
  route,
}: {
  navigation: ConsignReviewNavigationProp;
  route: ConsignReviewRouteProp;
}) => {
  const { product, refetchOfferLists } = useContext(ProductCheckoutContext);
  const {
    params: { size: sellSize },
  } = route;

  const user = useStoreState((s) => s.user.user);
  const [saving, setSaving] = useState<boolean>(false);
  const [confirmDialog, setConfirmDialog] = useState<boolean>(false);
  const [newCheck, setNewCheck] = useState<boolean>(false);
  const [shipCheck, setShipCheck] = useState<boolean>(false);

  const canProceed = canCreateList(user) && newCheck && shipCheck;

  const consignError = (error: string) => {
    setSaving(false);

    return Alert.alert(
      '',
      error,
      [
        {
          text: 'RETRY',
          onPress: () => {
            refetchOfferLists();
            return navigation.navigate('Sizes', { flow: 'sell' });
          },
        },
      ],
      { cancelable: false }
    );
  };

  const afterCreate = (item: TransactionType) => {
    setSaving(false);
    Analytics.sellListConfirm(item, product, user, 'Consignment', 'Confirm');
    refetchOfferLists();
    return navigation.replace('ConfirmedConsignment', { id: (item as TransactionType).ref });
  };

  const createSell = () => {
    setSaving(true);
    return API.post<TransactionType>('me/sales/consign', { size: sellSize, product_id: product.id })
      .then(afterCreate)
      .catch(consignError);
  };

  return (
    <SafeAreaScreenContainer>
      <KeyboardAwareContainer behavior="position">
        <ScrollContainer>
          {!user.country.selling_enabled && (
            <Box width="auto">
              <BuySellAlertMessage>
                <Text fontFamily="bold" fontSize={2} color="white" lineHeight={16} pr={3}>
                  <Trans>We are not available yet in your country for selling.</Trans>{' '}
                  <FollowSocial />
                </Text>
              </BuySellAlertMessage>
            </Box>
          )}

          <PageContainer>
            <ProductImageHeader product={product} />
            <Text fontFamily="bold" fontSize={2}>
              <Trans>Why Consign?</Trans>
            </Text>
            <Box py={3} pl={4} borderBottomColor="dividerGray" borderBottomWidth={1}>
              <Box mb={2} flexDirection="row">
                <Text>{'\u2022'}</Text>
                <Text ml={2} fontSize={2}>
                  <Trans>Faster Payout upon successful sale.</Trans>
                </Text>
              </Box>
              <Box mb={2} flexDirection="row">
                <Text>{'\u2022'}</Text>
                <Text ml={2} fontSize={2}>
                  <Trans>Sell faster - Instant Delivery lists are sold 60% quicker.</Trans>
                </Text>
              </Box>
              <Box mb={2} flexDirection="row">
                <Text>{'\u2022'}</Text>
                <Text ml={2} fontSize={2}>
                  <Trans>Even Lower fees - Consign at 50% off existing seller fees.</Trans>
                </Text>
              </Box>
              <Box mb={2} flexDirection="row">
                <Text>{'\u2022'}</Text>
                <Text ml={2} fontSize={2}>
                  <Trans>Save on shipping - Bulk ship consigns & normal sales.</Trans>
                </Text>
              </Box>
              <Box mb={2} flexDirection="row">
                <Text>{'\u2022'}</Text>
                <Text ml={2} fontSize={2}>
                  <Trans>
                    For limited time: You will{' '}
                    <Text fontFamily="bold" fontSize={2}>
                      NOT be penalised
                    </Text>{' '}
                    for QC fails of consigns.
                  </Trans>
                </Text>
              </Box>
              <Box mb={2} flexDirection="row">
                <Text>{'\u2022'}</Text>
                <Text ml={2} fontSize={2}>
                  <Trans>
                    For more information, please speak to our{' '}
                    <Text fontFamily="bold" fontSize={2}>
                      Support team.
                    </Text>
                  </Trans>
                </Text>
              </Box>
            </Box>
            <ListItem mt={4}>
              <Text fontFamily="medium">
                <Trans>Size</Trans>
              </Text>
              <ButtonBase
                onPress={() => navigation.navigate('Sizes', { flow: 'sell' })}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <Text fontFamily="bold" mr={3}>
                  {sellSize}
                </Text>
                <MaterialCommunityIcon name="pencil" size={20} color={theme.colors.textBlack} />
              </ButtonBase>
            </ListItem>
            <AddPhoneBar user={user} />
            <AddEmailBar user={user} />

            <ReviewProfileEditBar
              label={i18n._(t`Shipping Address`)}
              infoPresent={addressString(user.shipping_address, user.shipping_country)}
              infoMissing={i18n._(t`Add Shipping address`)}
              isFilled={user.hasShippingAddress}
              formName="SellingForm"
              Icon={
                <MaterialCommunityIcon
                  name="home-outline"
                  size={20}
                  color={theme.colors.textBlack}
                />
              }
            />

            <ReviewProfileEditBar
              label={i18n._(t`Payment Info`)}
              infoPresent={cardString(user.stripe_seller)}
              infoMissing={i18n._(t`Add Payment Info`)}
              isFilled={user.hasSellCard}
              formName="SellingForm"
              Icon={
                <MaterialCommunityIcon
                  name="credit-card-outline"
                  size={20}
                  color={theme.colors.textBlack}
                />
              }
            />

            <ReviewProfileEditBar
              label={i18n._(t`Billing Address`)}
              infoPresent={addressString(user.selling_address, user.selling_country)}
              infoMissing={i18n._(t`Add Billing address`)}
              isFilled={user.hasSellingAddress}
              formName="SellingForm"
              Icon={
                <MaterialCommunityIcon
                  name="home-outline"
                  size={20}
                  color={theme.colors.textBlack}
                />
              }
            />

            <ReviewProfileEditBar
              label={i18n._(t`Payout Info`)}
              infoPresent={`${user.payout_info.account_number} at ${user.payout_info.bank_name}`}
              infoMissing={i18n._(t`Add Payout Info`)}
              isFilled={user.hasPayout}
              formName="SellingForm"
              Icon={
                <MaterialCommunityIcon
                  name="currency-usd"
                  size={20}
                  color={theme.colors.textBlack}
                />
              }
            />

            <TermsAndPrivacy />
          </PageContainer>
        </ScrollContainer>
      </KeyboardAwareContainer>

      <Footer>
        <Box style={{ marginBottom: -6 }}>
          <CheckBoxInput checked={newCheck} onChecked={setNewCheck}>
            <Text color="gray1" fontSize={13} lineHeight={15}>
              <Trans>My item is brand new and unworn</Trans>
            </Text>
          </CheckBoxInput>
        </Box>
        <Box style={{ marginTop: -6 }}>
          <CheckBoxInput checked={shipCheck} onChecked={setShipCheck}>
            <Text color="gray1" fontSize={13} lineHeight={15}>
              <Trans>
                I have the product on hand and Upon sale, I will ship out within 2 business days to
                avoid penalties
              </Trans>
            </Text>
          </CheckBoxInput>
        </Box>
        <Box>
          <Button
            variant="black"
            size="lg"
            text={i18n._(t`CONFIRM SELL`)}
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
        onConfirm={createSell}
        title={i18n._(t`CONFIRM CONSIGNMENT`)}
        confirmText={i18n._(t`CONFIRM`)}
      >
        <Box mt={6} mb={4} mx={2} width="100%">
          <ImgixImage src={product.image} height={50} width={200} style={{ alignSelf: 'center' }} />
          <Text textAlign="center" fontSize={2} fontFamily="medium" my={4} px={4}>
            {product.name}
          </Text>

          {sellSize !== 'OS' && (
            <ListItem>
              <Text fontSize={2} fontFamily="medium" color="gray2">
                <Trans>Size</Trans>
              </Text>
              <Text fontSize={2} fontFamily="bold">
                {sellSize}
              </Text>
            </ListItem>
          )}
        </Box>
      </ConfirmDialog>
    </SafeAreaScreenContainer>
  );
};

export default ConsignReview;
