import React from 'react';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {
  StackHeaderProps,
  StackScreenProps,
} from '@react-navigation/stack/lib/typescript/src/types';

import theme from 'app/styles/theme';
import { makeHeaderTitle } from 'common/utils';
import { Box, Text, ButtonBase } from 'app/components/base';
import { Header, HeaderBackButton } from 'app/components/layout';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { UserRoutes } from 'types/navigation';

const UserAppHeader = ({
  navigation,
  options,
  route,
}: Pick<StackHeaderProps, 'options'> & StackScreenProps<UserRoutes>) => {
  const { headerTitle } = options;
  const routeName = route.name;

  return (
    <Header>
      <Box flexDirection="row" justifyContent="space-between" width="100%">
        <Box width={theme.constants.HEADER_ICON_SIZE}>
          <HeaderBackButton />
        </Box>

        <Box center>
          <Text
            color="white"
            fontFamily="bold"
            textTransform="uppercase"
            letterSpacing={theme.constants.LETTER_SPACINGS_TEXT_TITLE}
            fontSize={3}
          >
            {headerTitle || makeHeaderTitle(routeName)}
          </Text>
        </Box>

        <Box width={theme.constants.HEADER_ICON_SIZE}>
          {routeName === 'Profile' ? (
            <ButtonBase
              onPress={() => navigation.navigate('Settings')}
              android_ripple={{ color: theme.colors.white, borderless: true }}
            >
              <Ionicon
                name="ios-settings-outline"
                size={theme.constants.HEADER_ICON_SIZE}
                color={theme.colors.white}
              />
            </ButtonBase>
          ) : routeName === 'PayoutRequest' ? (
            <ButtonBase
              onPress={() => navigation.navigate('PayoutHistory')}
              android_ripple={{ color: theme.colors.white, borderless: true }}
            >
              <MaterialCommunityIcons
                name="history"
                size={theme.constants.HEADER_ICON_SIZE}
                color={theme.colors.white}
              />
            </ButtonBase>
          ) : null}
        </Box>
      </Box>
    </Header>
  );
};

export default UserAppHeader;
