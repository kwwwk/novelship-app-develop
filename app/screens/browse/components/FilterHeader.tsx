import React from 'react';
import { StackHeaderProps } from '@react-navigation/stack';

import { Header, HeaderBackButton } from 'app/components/layout';
import { Box, Text } from 'app/components/base';
import { makeHeaderTitle } from 'common/utils';
import theme from 'app/styles/theme';

const FilterHeader = ({ options, route }: StackHeaderProps) => {
  const { headerTitle } = options;
  const routeName = route.name;

  return (
    <Header style={{ paddingTop: 0 }}>
      <Box flexDirection="row" alignItems="center" justifyContent="space-between" width="100%">
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

        <Box width={theme.constants.HEADER_ICON_SIZE} />
      </Box>
    </Header>
  );
};

export default FilterHeader;
