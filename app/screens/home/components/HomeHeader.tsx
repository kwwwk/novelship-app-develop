import React from 'react';
import { StackHeaderProps } from '@react-navigation/stack';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { Box, ButtonBase } from 'app/components/base';
import { Header } from 'app/components/layout';
import theme from 'app/styles/theme';

import { DummySearchBar } from '../../search/components/SearchBar';

const HomeHeader = ({ navigation }: StackHeaderProps) => (
  <Header>
    <Box flexDirection="row" alignItems="center" justifyContent="space-between" width="100%">
      <DummySearchBar width="88%" />

      <Box flexDirection="row" width={theme.constants.HEADER_ICON_SIZE}>
        <ButtonBase
          onPress={() => navigation.navigate('BrowseStack')}
          android_ripple={{ color: theme.colors.white, borderless: true }}
        >
          <FontAwesome
            name="sliders"
            size={theme.constants.HEADER_ICON_SIZE}
            color={theme.colors.white}
          />
        </ButtonBase>
      </Box>
    </Box>
  </Header>
);

export default HomeHeader;
