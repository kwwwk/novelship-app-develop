import React from 'react';
import {
  StackHeaderProps,
  StackScreenProps,
} from '@react-navigation/stack/lib/typescript/src/types';
import Ionicon from 'react-native-vector-icons/Ionicons';

import theme from 'app/styles/theme';
import useIsFirstRouteInParent from 'app/hooks/useIsFirstRouteInParent';
import { makeHeaderTitle } from 'common/utils';
import { RootRoutes } from 'types/navigation';
import { Box, ButtonBase, Text } from '../base';
import Header from './Header';
import HeaderBackButton from './HeaderBackButton';

const AppHeader = ({
  navigation,
  options,
  route,
}: Pick<StackHeaderProps, 'options'> & StackScreenProps<RootRoutes>) => {
  const isFirstRouteInStack = useIsFirstRouteInParent();
  const { headerTitle } = options;

  return (
    <Header>
      <Box flexDirection="row" justifyContent="space-between" width="100%">
        <Box width={theme.constants.HEADER_ICON_SIZE}>
          {!isFirstRouteInStack && <HeaderBackButton />}
        </Box>

        <Box center>
          <Text
            color="white"
            fontFamily="bold"
            textTransform="uppercase"
            letterSpacing={theme.constants.LETTER_SPACINGS_TEXT_TITLE}
            fontSize={3}
          >
            {headerTitle || makeHeaderTitle(route.name)}
          </Text>
        </Box>

        <Box width={theme.constants.HEADER_ICON_SIZE}>
          {isFirstRouteInStack && (
            <ButtonBase
              onPress={() => navigation.goBack()}
              android_ripple={{ color: theme.colors.white, borderless: true }}
            >
              <Ionicon
                name="ios-close"
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

export default AppHeader;
