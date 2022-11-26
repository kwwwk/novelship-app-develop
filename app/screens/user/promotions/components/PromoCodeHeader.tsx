import React from 'react';
import { useStoreState } from 'app/store';
import { Anchor, Box, Text, Button } from 'app/components/base';
import { Image } from 'react-native';
import getFaqLink from 'common/constants/faq';
import { i18n } from '@lingui/core';
import { t, Trans } from '@lingui/macro';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { UserRoutes } from 'types/navigation';

const Header = () => {
  const user = useStoreState((s) => s.user.user);
  const navigation = useNavigation<StackNavigationProp<UserRoutes>>();

  return (
    <Box pt={4} pb={6}>
      <Box flexDirection="row" justifyContent="center" mb={4}>
        <Text fontSize={3} textAlign="center" mt={3} fontFamily="bold">
          <Trans>YOUR LOYALTY POINTS (NSP)</Trans>
        </Text>
      </Box>
      <Box flexDirection="row" justifyContent="center" alignItems="center" mb={4}>
        <Image
          style={{ flex: 0 }}
          height={20}
          width={20}
          resizeMode="contain"
          source={require('assets/images/graphics/loyalty-icon.png')}
        />
        <Text fontSize={6} fontFamily="bold" ml={3}>
          {user.points}
        </Text>
      </Box>
      <Box alignItems="center">
        <Anchor
          mb={5}
          color="blue"
          fontSize={2}
          textDecorationLine="underline"
          to={getFaqLink('loyalty')}
        >
          <Trans>How do I get more loyalty points?</Trans>
        </Anchor>
        <Button
          onPress={() => navigation.navigate('LoyaltyPointsStore')}
          borderRadius={4}
          variant="black"
          text={i18n._(t`REDEEM POINTS`)}
          width="75%"
        />
      </Box>
    </Box>
  );
};

export default Header;
