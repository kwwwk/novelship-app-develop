import React, { useEffect } from 'react';
import { StackScreenProps } from '@react-navigation/stack';

import { useStoreState, useStoreActions } from 'app/store';
import { SearchRoutes } from 'types/navigation';

import RecentSearches from './RecentSearches';
import SearchResults from './SearchResults';

const Search = ({ route }: StackScreenProps<SearchRoutes, 'Search'>) => {
  const { q } = route.params || {};
  const { search } = useStoreState((s) => s.search);
  const { setSearch } = useStoreActions((s) => s.search);

  useEffect(() => {
    if (q) setSearch(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return q || search ? <SearchResults /> : <RecentSearches />;
};

export default Search;
