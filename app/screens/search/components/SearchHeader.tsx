import React from 'react';
import { Trans } from '@lingui/macro';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/core';

import { Header } from 'app/components/layout';
import { ButtonBase, Text, Box } from 'app/components/base';
import theme from 'app/styles/theme';

import { navigateBackOrGoToHome } from 'app/services/navigation';
import { useStoreActions } from 'app/store';
import { RootRoutes } from 'types/navigation';

import SearchBar from './SearchBar';

const SearchHeader = () => {
  const { setSearch } = useStoreActions((s) => s.search);
  const navigation = useNavigation<StackNavigationProp<RootRoutes>>();

  return (
    <Header>
      <Box flexDirection="row" alignItems="center" justifyContent="space-between" width="100%">
        <SearchBar autoFocus width="88%" />

        <ButtonBase
          style={{ paddingVertical: 12 }}
          android_ripple={{ color: theme.colors.white, borderless: true }}
          onPress={() => {
            setSearch('');
            navigateBackOrGoToHome(navigation);
          }}
        >
          <Text color="white" fontSize={11} fontFamily="bold" pl={3}>
            <Trans>CANCEL</Trans>
          </Text>
        </ButtonBase>
      </Box>
    </Header>
  );
};

export default SearchHeader;
