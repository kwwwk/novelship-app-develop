import React from 'react';
import { StackHeaderProps } from '@react-navigation/stack/lib/typescript/src/types';

import theme from 'app/styles/theme';
import Header from 'app/components/layout/Header';
import { Text, Box } from 'app/components/base';
import HeaderBackButton from 'app/components/layout/HeaderBackButton';

const BulkListHeader = ({ options }: StackHeaderProps) => {
  const { headerTitle } = options;

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
            {headerTitle}
          </Text>
        </Box>
        <Box width={theme.constants.HEADER_ICON_SIZE} />
      </Box>
    </Header>
  );
};

export default BulkListHeader;
