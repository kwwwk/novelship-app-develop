import React, { useState, useEffect } from 'react';
import { i18n } from '@lingui/core';
import { t, Trans } from '@lingui/macro';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { useStoreActions, useStoreState } from 'app/store';
import { cacheGet, cacheRemove } from 'app/services/asyncStorage';
import { Box, Text, ButtonBase } from 'app/components/base';
import theme from 'app/styles/theme';
import { KeyboardAwareContainer, ScrollContainer } from 'app/components/layout';

const RecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { searchesTrending = [] } = useStoreState((s) => s.base);

  useEffect(() => {
    // todo: move to browse store, to avoid refetching jump
    cacheGet<string[]>('recent_searches', []).then((rS) => {
      if (rS !== undefined) setRecentSearches(rS);
    });
  }, []);

  return (
    <KeyboardAwareContainer behavior="padding">
      <ScrollContainer>
        <Box>
          {!!recentSearches.length && (
            <>
              <TitleCard title={i18n._(t`RECENT SEARCHES`)}>
                <ButtonBase
                  onPress={() => {
                    cacheRemove('recent_searches');
                    setRecentSearches([]);
                  }}
                >
                  <Text fontSize={1} fontFamily="bold" textDecorationLine="underline">
                    <Trans>CLEAR</Trans>
                  </Text>
                </ButtonBase>
              </TitleCard>
              {recentSearches.map((recentSearch) => (
                <ItemCard key={recentSearch} title={recentSearch} />
              ))}
              <Box mt={3} />
            </>
          )}

          {!!searchesTrending.length && (
            <>
              <TitleCard title={i18n._(t`TRENDING`)} />
              {searchesTrending.map((s) => (
                <ItemCard key={s} title={s} showArrow />
              ))}
            </>
          )}
        </Box>
        <Box my={6} />
      </ScrollContainer>
    </KeyboardAwareContainer>
  );
};

const TitleCard = ({ title, children }: { title: string; children?: React.ReactNode }) => (
  <Box p={5} pb={3} flexDirection="row" justifyContent="space-between">
    <Text fontFamily="bold">{title}</Text>
    {children}
  </Box>
);

const ItemCard = ({ title, showArrow }: { title: string; showArrow?: boolean }) => {
  const { setSearch, setIsSearching } = useStoreActions((a) => a.search);

  const search = () => {
    setIsSearching(true);
    setSearch(title);
  };

  return (
    <ButtonBase onPress={search}>
      <Box
        px={5}
        height={40}
        width="100%"
        alignItems="center"
        flexDirection="row"
        justifyContent="space-between"
        borderBottomWidth={1}
        borderBottomColor="dividerGray"
      >
        <Text color="gray3" fontSize={2} fontFamily="medium">
          {title}
        </Text>
        {showArrow && <Ionicon name="chevron-forward" size={18} color={theme.colors.textBlack} />}
      </Box>
    </ButtonBase>
  );
};

export default RecentSearches;
