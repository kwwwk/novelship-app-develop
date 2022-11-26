import { AddressType, StripeType } from 'types/resources/user';
import { CountryType } from 'types/resources/country';
import { RootRoutes } from 'types/navigation';

import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { t, Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';

import { PageContainer, ScrollContainer, KeyboardAwareContainer } from 'app/components/layout';
import { Text, Box, ImgixImage, Button } from 'app/components/base';
import { cardImage, cardString } from 'common/utils/payment';
import { CVCRecheckText } from 'app/components/form/CVCRecheck';
import { addressString } from 'common/utils/address';
import { useStoreState } from 'app/store';
import { BoxProps } from 'app/components/base/Box';
import { LB } from 'common/constants';
import LanguageSelector from 'app/components/widgets/LanguageSelector';

import getFaqLink from 'common/constants/faq';
import { openExternalUrl } from 'app/services/url';
import UserDashboardSectionTitle from '../components/UserDashboardSectionTitle';
import VacationSetting from './VacationSetting';

const UserInfoCard = ({
  label,
  children,
  ...props
}: BoxProps & { label: string; children: React.ReactNode }) => (
  <Box {...props}>
    <Text fontSize={2} fontFamily="bold" mb={2}>
      {label}
    </Text>
    {children}
  </Box>
);

const AddressBox = ({
  country,
  type,
  address,
}: {
  country: CountryType;
  address: AddressType;
  type: 'billing' | 'delivery' | 'selling' | 'shipping';
}) =>
  address.city ? (
    <Text color="textSecondary" fontSize={2}>
      {addressString(address, country)}
    </Text>
  ) : (
    <Text color="textSecondary" fontSize={2}>
      {i18n._(t`No ${i18n._(type)} address added.`)}
    </Text>
  );

const PaymentBox = ({ card = { last4: '', id: '', brand: '' } }: { card: StripeType }) =>
  card.last4 ? (
    <Box flexDirection="row" justifyContent="space-between" alignItems="center">
      <Box flexDirection="row" mt={2}>
        <ImgixImage width={40} src={cardImage(card)} />
        <Text ml={4} fontFamily="medium" fontSize={3}>
          {cardString(card)}
        </Text>
      </Box>
      <Box alignItems="center">
        <Text color="textSecondary" fontSize={3}>
          <Trans>Expiring</Trans> {card.exp_month}/{card.exp_year}
        </Text>
      </Box>
    </Box>
  ) : (
    <Text color="textSecondary" fontSize={3}>
      {i18n._(t`No payment info added.`)}
    </Text>
  );

const Settings = ({ navigation }: StackScreenProps<RootRoutes, 'UserStack'>) => {
  const user = useStoreState((s) => s.user.user);

  return (
    <KeyboardAwareContainer>
      <ScrollContainer>
        <PageContainer mt={2} mb={10}>
          <UserDashboardSectionTitle
            title={i18n._(t`BUYING INFO`)}
            onPress={() => navigation.push('UserStack', { screen: 'BuyingForm' })}
            buttonText={i18n._(t`EDIT`)}
          >
            <UserInfoCard label={i18n._(t`CREDIT/DEBIT CARD`)} mt={6}>
              <PaymentBox card={user.stripe_buyer} />
              {user.buying_card_disabled && (
                <CVCRecheckText mt={4} ml={2} justifyContent="flex-start" />
              )}
            </UserInfoCard>

            <UserInfoCard mt={6} label={i18n._(t`BILLING ADDRESS`)}>
              <AddressBox
                address={user.billing_address}
                country={user.billing_country}
                type="billing"
              />
            </UserInfoCard>
            <UserInfoCard my={6} label={i18n._(t`DELIVERY ADDRESS`)}>
              <AddressBox address={user.address} country={user.country} type="delivery" />
            </UserInfoCard>
          </UserDashboardSectionTitle>
          <UserDashboardSectionTitle
            title={i18n._(t`SELLING INFO`)}
            onPress={() => navigation.push('UserStack', { screen: 'SellingForm' })}
            buttonText={i18n._(t`EDIT`)}
          >
            <UserInfoCard label={i18n._(t`CREDIT/DEBIT CARD`)} mt={6}>
              <PaymentBox card={user.stripe_seller} />
            </UserInfoCard>

            <UserInfoCard mt={6} label={i18n._(t`PAYOUT INFO`)}>
              <Box>
                {user.hasPayout ? (
                  <Text color="textSecondary" fontSize={2}>
                    <Trans>
                      {user.payout_info.account_number} at {user.payout_info.bank_name}
                      {LB}
                      {user.payout_info.bank_name}
                    </Trans>
                  </Text>
                ) : (
                  <Text color="textSecondary" fontSize={2}>
                    <Trans>No payout info added</Trans>
                  </Text>
                )}
              </Box>
            </UserInfoCard>

            <UserInfoCard mt={6} label={i18n._(t`BILLING ADDRESS`)}>
              <AddressBox
                address={user.selling_address}
                country={user.selling_country}
                type="selling"
              />
            </UserInfoCard>
            <UserInfoCard my={6} label={i18n._(t`SHIPPING FROM ADDRESS`)}>
              <AddressBox
                address={user.shipping_address}
                country={user.shipping_country}
                type="shipping"
              />
            </UserInfoCard>
          </UserDashboardSectionTitle>
          <VacationSetting user={user} />

          <Box height={1} bg="dividerGray" my={2} />

          <UserDashboardSectionTitle
            title={i18n._(t`NOTIFICATIONS`)}
            onPress={() => navigation.push('UserStack', { screen: 'PushNotificationForm' })}
            buttonText={i18n._(t`EDIT`)}
          >
            <Text />
          </UserDashboardSectionTitle>

          <Box flexDirection="row" justifyContent="space-between" alignItems="center" mt={5}>
            <Text mr={4} fontSize={3} fontFamily="bold">
              <Trans>LANGUAGE</Trans>
            </Text>
            <LanguageSelector variant="textBlack" />
          </Box>
          <Box height={1} bg="dividerGray" my={2} />
          <Box flexDirection="row" justifyContent="space-between" alignItems="center" mt={5}>
            <Text mr={4} fontSize={3} fontFamily="bold">
              <Trans>DELETE MY ACCOUNT</Trans>
            </Text>
            <Button
              variant="white"
              text="Delete"
              onPress={() => openExternalUrl(getFaqLink('contact_form'))}
              size="xs"
              width={64}
            />
          </Box>
        </PageContainer>
      </ScrollContainer>
    </KeyboardAwareContainer>
  );
};

export default Settings;
