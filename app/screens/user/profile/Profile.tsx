import React, { useState } from 'react';
import { i18n } from '@lingui/core';
import { t, Trans } from '@lingui/macro';
import Clipboard from '@react-native-community/clipboard';
import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp } from '@react-navigation/native';

import { useStoreState } from 'app/store';
import { Box, Button, Text } from 'app/components/base';
import { ScrollContainer } from 'app/components/layout';
import ApparelIcon from 'app/components/icons/ApparelIcon';
import SneakersIcon from 'app/components/icons/SneakersIcon';
import { ProfileTopTabRoutes, RootRoutes } from 'types/navigation';
import ReferralWidget from 'app/screens/product/components/common/ReferralWidget';
import Avatar from './components/Avatar';

type ProfileInfoNavigationType = CompositeNavigationProp<
  StackNavigationProp<ProfileTopTabRoutes, 'User'>,
  StackNavigationProp<RootRoutes, 'UserStack'>
>;

const ProfileInfo = ({ navigation }: { navigation: ProfileInfoNavigationType }) => {
  const user = useStoreState((s) => s.user.user);
  const [copyBtnTitle, setCopyBtnTitle] = useState('COPY');

  const sneakerSize = user.sneakerSize || '--';
  const apparelSize = user.teeSize || '--';
  const isSizeFilled = user.sneakerSize && user.teeSize;

  return (
    <ScrollContainer>
      <Box p={5} justifyContent="space-between">
        {/* Primary user profile details starts here */}
        <Avatar />
        <Box mt={2} flexDirection="row" justifyContent="space-between">
          <Box>
            <Text fontSize={1} fontFamily="bold">
              <Trans>NAME</Trans>
            </Text>
            <Text mt={2}>{user.fullname}</Text>
          </Box>
          <Box alignItems="flex-end">
            <Button
              variant="white"
              text={i18n._(t`EDIT`)}
              onPress={() => navigation.push('UserStack', { screen: 'ProfileForm' })}
              size="xs"
              width={64}
            />
          </Box>
        </Box>
        <Box mt={4}>
          <Text fontSize={1} fontFamily="bold">
            <Trans>EMAIL</Trans>
          </Text>
          <Text mt={2}>{user.email}</Text>
        </Box>
        <Box mt={8} flexDirection="row" justifyContent="space-between">
          <Box>
            <Text fontSize={1} fontFamily="bold">
              <Trans>PHONE NUMBER</Trans>
            </Text>
            <Text my={2}>
              {user.country_code} {user.phone}
            </Text>
          </Box>
          <Button
            variant="white"
            text={user.phone ? i18n._(t`CHANGE`) : i18n._(t`ADD`)}
            onPress={() =>
              navigation.push('UserStack', { screen: 'PhoneForm', params: { edit: !!user.phone } })
            }
            size="xs"
            width={64}
          />
        </Box>

        <Box mt={8} flexDirection="row" justifyContent="space-between">
          <Box>
            <Text fontSize={1} fontFamily="bold">
              <Trans>PASSWORD</Trans>
            </Text>
            <Text my={2}>********</Text>
          </Box>
          <Button
            variant="white"
            text={i18n._(t`CHANGE`)}
            onPress={() => navigation.push('UserStack', { screen: 'PasswordForm' })}
            size="xs"
            width={64}
          />
        </Box>

        {/* Primary user profile details ends here */}
        <Box mt={6} backgroundColor="dividerGray" height={1} />
        {/* User size preference starts here */}
        <Box mt={6} flexDirection="row" justifyContent="space-between">
          <Text fontSize={3} fontFamily="bold">
            <Trans>MY SIZE</Trans>
          </Text>
          <Box alignItems="flex-end">
            <Button
              variant={isSizeFilled ? 'white' : 'red-inverted'}
              text={i18n._(t`EDIT`)}
              onPress={() => navigation.push('UserStack', { screen: 'SizePreferencesForm' })}
              size="xs"
              width={64}
            />
          </Box>
        </Box>
        <Box mt={6} width="100%" flexDirection="row">
          <Box width="30%" style={{ marginRight: '3%' }}>
            <Text color="gray3" fontSize={2} fontFamily="medium" mb={3}>
              <Trans>SNEAKERS</Trans>
            </Text>

            <SneakersIcon />
            <Text fontFamily="bold" fontSize={2} mt={3}>
              <Trans>Size</Trans>: {sneakerSize}
            </Text>
          </Box>
          <Box mx={4} />
          <Box width="30%" style={{ marginRight: '3%' }}>
            <Text color="gray3" fontSize={2} fontFamily="medium" mb={3}>
              <Trans>APPAREL</Trans>
            </Text>
            <ApparelIcon />
            <Text fontFamily="bold" fontSize={2} mt={3}>
              <Trans>Size</Trans>: {apparelSize}
            </Text>
          </Box>
        </Box>
        {/* User size preference ends here */}

        <Box mt={6} backgroundColor="dividerGray" height={1} />

        <Box my={2}>
          <ReferralWidget user={user} mt={6} />
        </Box>

        <Text fontSize={3} fontFamily="bold" mt={7}>
          <Trans>REFER A FRIEND</Trans>
        </Text>
        <Box mt={4} flexDirection="row" justifyContent="space-between">
          <Box>
            <Text fontSize={1} fontFamily="bold">
              <Trans>YOUR REFERRAL CODE</Trans>
            </Text>
            <Text mt={2}>{user.referral_code}</Text>

            <Text fontSize={1} mt={6} fontFamily="bold">
              <Trans>REFERRALS</Trans>
            </Text>
            <Text mt={2}>{user.referred_users.length}</Text>
          </Box>
          <Button
            variant="white"
            text={i18n._(copyBtnTitle)}
            onPress={() => {
              setCopyBtnTitle('COPIED');
              Clipboard.setString(user.referral_code);
            }}
            size="xs"
            width={80}
          />
        </Box>

        <Box mt={7}>
          <Button
            variant="white"
            text={i18n._(t`VIEW PROMOCODES`)}
            onPress={() => navigation.push('UserStack', { screen: 'Promotions' })}
            width="100%"
          />
        </Box>
        <Box mt={7} height={50} />
      </Box>
    </ScrollContainer>
  );
};

export default ProfileInfo;
