import React, { useContext } from 'react';
import { StackHeaderProps } from '@react-navigation/stack';
import { Badge } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { Box, ButtonBase } from 'app/components/base';
import { Header } from 'app/components/layout';
import theme from 'app/styles/theme';

import { DummySearchBar } from '../../search/components/SearchBar';
import BrowseContext from '../context/index';

const BrowseHeader = ({ navigation }: StackHeaderProps) => {
  const { filter } = useContext(BrowseContext);
  const selectedFilterCount = Object.values(filter).filter((v) =>
    Array.isArray(v) ? v.length > 0 : !!v
  ).length;

  return (
    <Header>
      <Box flexDirection="row" alignItems="center" justifyContent="space-between" width="100%">
        <DummySearchBar width="88%" />

        <Box flexDirection="row" width={theme.constants.HEADER_ICON_SIZE}>
          <ButtonBase
            onPress={() => navigation.push('FilterRoot')}
            android_ripple={{ color: theme.colors.white, borderless: true }}
          >
            <FontAwesome
              name="sliders"
              size={theme.constants.HEADER_ICON_SIZE}
              color={theme.colors.white}
            />
          </ButtonBase>
          <ButtonBase
            onPress={() => navigation.push('FilterRoot')}
            android_ripple={{ color: theme.colors.white, borderless: true }}
          >
            <Badge
              style={{ backgroundColor: theme.colors.blue, top: -5, left: -8 }}
              visible={!!selectedFilterCount}
              size={16}
            >
              {selectedFilterCount}
            </Badge>
          </ButtonBase>
        </Box>
      </Box>
    </Header>
  );
};

export default BrowseHeader;
