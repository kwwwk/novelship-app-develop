import React, { useLayoutEffect, useRef } from 'react';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { InteractionManager, TextInput } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { BottomTabRoutes, RootRoutes } from 'types/navigation';
import { useStoreActions, useStoreState } from 'app/store';
import { ButtonBase, Box } from 'app/components/base';
import { BoxProps } from 'app/components/base/Box';
import { IS_OS_ANDROID } from 'common/constants';
import theme from 'app/styles/theme';

const SearchBar = ({ autoFocus, ...props }: BoxProps & { autoFocus: boolean }) => {
  const { setSearch, setIsSearching } = useStoreActions((a) => a.search);
  const search = useStoreState((s) => s.search.search);
  const inputRef = useRef<TextInput>(null);
  const navigation = useNavigation<StackNavigationProp<BottomTabRoutes>>();

  const onSearchTermChange = (v: string) => {
    setIsSearching(true);
    setSearch(v);
  };

  if (IS_OS_ANDROID) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useLayoutEffect(() => {
      if (autoFocus && inputRef.current) {
        if (inputRef.current) {
          InteractionManager.runAfterInteractions(() => {
            inputRef.current?.focus();
          });
        }
      }
    }, [autoFocus, inputRef]);
  }

  return (
    <Box
      flexDirection="row"
      alignItems="center"
      borderRadius={5}
      width="100%"
      bg="white"
      {...props}
    >
      <Box ml={4} mr={2} pr={1}>
        <Ionicon name="ios-search" size={18} color={theme.colors.textBlack} />
      </Box>
      <TextInput
        ref={inputRef}
        placeholder={i18n._(t`Search`)}
        placeholderTextColor={theme.colors.gray4}
        onChangeText={onSearchTermChange}
        returnKeyType="search"
        allowFontScaling={false}
        numberOfLines={1}
        value={search}
        autoFocus={autoFocus}
        onSubmitEditing={() =>
          navigation.navigate('BrowseStack', {
            screen: 'BrowseRoot',
            params: { screen: 'browse' },
          })
        }
        style={{
          fontFamily: theme.fonts.medium,
          paddingRight: 36,
          fontSize: 14,
          width: '88%',
          height: 36,
        }}
      />
      {!!search && autoFocus && (
        <ButtonBase
          style={{
            marginLeft: 'auto',
            marginRight: 12,
          }}
          onPress={() => setSearch('')}
          android_ripple={{ color: theme.colors.gray6, borderless: true }}
        >
          <Ionicon name="ios-close" size={20} color={theme.colors.gray2} />
        </ButtonBase>
      )}
    </Box>
  );
};

const DummySearchBar = (props: BoxProps) => {
  const navigation = useNavigation<StackNavigationProp<RootRoutes>>();

  return (
    <Box style={{ bottom: 0, height: 36 }} {...props}>
      <SearchBar autoFocus={false} />
      <ButtonBase
        onPress={() => navigation.push('SearchStack', { screen: 'Search', params: {} })}
        style={{ height: 38, top: -37 }}
      />
    </Box>
  );
};

export default SearchBar;
export { DummySearchBar };
