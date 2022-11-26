import React from 'react';
import { CompositeNavigationProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import Analytics from 'app/services/analytics';
import { Box, Text, ButtonBase, Button, Anchor, ImgixImage } from 'app/components/base';
import { useStoreActions, useStoreState } from 'app/store';
import { AccountRoutes, RootRoutes } from 'types/navigation';
import getFaqLink from 'common/constants/faq';
import NSIcon from 'app/components/icons/NSIcon';
import theme from 'app/styles/theme';
import { getWelcomePromo } from 'common/constants/welcomePromo';

import { ScrollContainer } from 'app/components/layout';
import LanguageSelector from 'app/components/widgets/LanguageSelector';
import { i18n } from '@lingui/core';
import { t, Trans } from '@lingui/macro';
import { LB } from 'common/constants';
import MenuItem from './components/AccountMenuItem';
import ShipmentPendingAlert from '../user/components/ShipmentPendingAlert';

type AccountNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AccountRoutes, 'Account'>,
  StackNavigationProp<RootRoutes, 'AuthStack'>
>;

const Account = ({ navigation }: { navigation: AccountNavigationProp }) => {
  const user = useStoreState((s) => s.user.user);
  const country = useStoreState((s) => s.country.current);
  const logout = useStoreActions((s) => s.user.logout);

  const { value: welcomeDiscount } = getWelcomePromo(country.shortcode);
  return user.id ? (
    <Box>
      <Box px={5} mt={2} style={{ borderBottomWidth: 1, borderColor: theme.colors.gray1 }}>
        <MenuItem
          CustomIcon={() =>
            user.avatar ? (
              <ImgixImage
                width={52}
                height={52}
                borderRadius={52 / 2}
                src={user.avatar}
                resizeMode="cover"
                style={{ marginRight: 16 }}
              />
            ) : null
          }
          text={(user.fullname && user.fullname.toUpperCase()) || user.email}
          subText={i18n._(t`View & Edit Your Profile`)}
          onPress={() =>
            navigation.navigate('UserStack', { screen: 'Profile', params: { screen: 'User' } })
          }
        />
      </Box>
      <ScrollContainer>
        <Box px={5} mt={3}>
          <MenuItem
            text={i18n._(t`BUYING`)}
            icon="cart-outline"
            onPress={() =>
              navigation.navigate('UserStack', { screen: 'Buying', params: { screen: 'Offers' } })
            }
          />
          <MenuItem
            text={i18n._(t`SELLING`)}
            icon="logo-usd"
            Wrap={ShipmentPendingAlert}
            onPress={() =>
              navigation.navigate('UserStack', { screen: 'Selling', params: { screen: 'Lists' } })
            }
          />
          <MenuItem
            text={i18n._(t`STORAGE`)}
            icon="file-tray-full-outline"
            onPress={() => navigation.navigate('UserStack', { screen: 'Storage' })}
          />
          <MenuItem
            text={i18n._(t`WISHLIST`)}
            icon="heart-outline"
            onPress={() => navigation.navigate('UserStack', { screen: 'Wishlist' })}
          />

          <MenuItem
            text={i18n._(t`POSTS`)}
            icon="grid-outline"
            onPress={() =>
              navigation.navigate('UserStack', {
                screen: 'Posts',
                params: { screen: 'PublishedPosts' },
              })
            }
          />
          <MenuItem
            text={i18n._(t`PAYOUT REQUEST`)}
            icon="wallet-outline"
            onPress={() =>
              navigation.navigate('UserStack', {
                screen: 'PayoutRequest',
              })
            }
          />
          <MenuItem
            text={i18n._(t`PROMOCODES`)}
            icon="pricetag-outline"
            onPress={() => navigation.navigate('UserStack', { screen: 'Promotions' })}
          />
          <MenuItem
            text={i18n._(t`POWER SELLER`)}
            icon="pricetag-outline"
            onPress={() => navigation.navigate('PowerSeller')}
          />
          <MenuItem
            text={i18n._(t`NEWS`)}
            icon="newspaper-outline"
            onPress={() => navigation.navigate('NotFoundScreen', { uri: '/news' })}
          />

          <MenuItem
            text={i18n._(t`CONTACT`)}
            icon="call-outline"
            link={getFaqLink('contact_form')}
            action={() => Analytics.contactUsClick()}
          />
          <MenuItem
            text={i18n._(t`FAQ GUIDE`)}
            icon="help-circle-outline"
            link={getFaqLink('main')}
          />
          <MenuItem text={i18n._(t`LOGOUT`)} icon="log-out-outline" onPress={logout} />
        </Box>
        <Box my={10} />
      </ScrollContainer>
    </Box>
  ) : (
    <ScrollContainer>
      <Box center px={5}>
        <Box
          center
          mt={4}
          pb={8}
          width="100%"
          style={{ borderBottomWidth: 1, borderBottomColor: theme.colors.dividerGray }}
        >
          <Box my={8}>
            <NSIcon width={90} height={90} />
          </Box>
          {welcomeDiscount ? (
            <Text fontSize={3} fontFamily="bold" textAlign="center">
              <Trans>
                SIGN UP TO GET {welcomeDiscount} OFF
                {LB}
                YOUR FIRST PURCHASE
              </Trans>
            </Text>
          ) : (
            <Text fontSize={3} fontFamily="bold" textAlign="center">
              <Trans>
                SIGN UP TO ACCESS IN-APP PROMOS,
                {LB}
                LATEST RELEASES AND MORE!
              </Trans>
            </Text>
          )}

          <Box py={4}>
            <Button
              width={240}
              variant="white"
              text={i18n._(t`SIGN UP`)}
              onPress={() => navigation.navigate('AuthStack', { screen: 'SignUp' })}
            />
          </Box>

          <Box mt={1} flexDirection="row">
            <Text mr={2} fontSize={2} fontFamily="regular">
              <Trans>Have an account?</Trans>
            </Text>
            <ButtonBase onPress={() => navigation.navigate('AuthStack', { screen: 'LogIn' })}>
              <Text fontSize={2} fontFamily="bold" textDecorationLine="underline">
                <Trans>LOG IN</Trans>
              </Text>
            </ButtonBase>
          </Box>
        </Box>

        <Box center pt={6}>
          <Text my={3} fontFamily="bold" onPress={() => navigation.navigate('PowerSeller')}>
            <Trans>POWER SELLER</Trans>
          </Text>
          <Anchor
            my={3}
            fontFamily="bold"
            to={getFaqLink('contact_form')}
            action={() => Analytics.contactUsClick()}
          >
            <Trans>CONTACT</Trans>
          </Anchor>
          <Anchor my={3} fontFamily="bold" to={getFaqLink('main')}>
            <Trans>FAQ GUIDE</Trans>
          </Anchor>
          <Anchor my={3} fontFamily="bold" to="https://trustpilot.com/review/novelship.com">
            <Trans>REVIEWS</Trans>
          </Anchor>
          <Text
            my={3}
            fontFamily="bold"
            onPress={() => navigation.navigate('NotFoundScreen', { uri: '/news' })}
          >
            <Trans>NEWS</Trans>
          </Text>
          <LanguageSelector mt={3} variant="textBlack" />
        </Box>
      </Box>
    </ScrollContainer>
  );
};

export default Account;
