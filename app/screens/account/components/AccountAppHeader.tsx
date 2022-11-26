import React from 'react';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { StackHeaderProps } from '@react-navigation/stack/lib/typescript/src/types';

import theme from 'app/styles/theme';
import { useStoreState } from 'app/store';
import { makeHeaderTitle } from 'common/utils';
import Header from 'app/components/layout/Header';
import { ButtonBase, Text, Box } from 'app/components/base';
import HeaderBackButton from 'app/components/layout/HeaderBackButton';
import useIsFirstRouteInParent from 'app/hooks/useIsFirstRouteInParent';

const AccountAppHeader = ({ navigation, route }: StackHeaderProps) => {
  const isFirstRouteInStack = useIsFirstRouteInParent();
  const userId = useStoreState((s) => s.user.user.id);

  return (
    <Header>
      <Box flexDirection="row" justifyContent="space-between" width="100%">
        <Box width={theme.constants.HEADER_ICON_SIZE}>
          {isFirstRouteInStack ? (
            <ButtonBase
              android_ripple={{ color: theme.colors.white, borderless: true }}
              onPress={() => navigation.navigate('AccountStack', { screen: 'About' })}
            >
              <Ionicon
                name="ios-help-circle-outline"
                size={theme.constants.HEADER_ICON_SIZE}
                color={theme.colors.white}
              />
            </ButtonBase>
          ) : (
            <HeaderBackButton />
          )}
        </Box>

        <Box center>
          <Text
            color="white"
            fontFamily="bold"
            textTransform="uppercase"
            letterSpacing={theme.constants.LETTER_SPACINGS_TEXT_TITLE}
            fontSize={3}
          >
            {makeHeaderTitle(route.name)}
          </Text>
        </Box>

        <Box width={theme.constants.HEADER_ICON_SIZE}>
          {isFirstRouteInStack && userId && (
            <ButtonBase
              onPress={() => navigation.navigate('UserStack', { screen: 'Settings' })}
              android_ripple={{ color: theme.colors.white, borderless: true }}
            >
              <Ionicon
                name="ios-settings-outline"
                size={theme.constants.HEADER_ICON_SIZE}
                color={theme.colors.white}
              />
            </ButtonBase>
          )}
        </Box>
      </Box>
    </Header>
  );
};

export default AccountAppHeader;
