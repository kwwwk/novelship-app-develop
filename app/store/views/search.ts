import { getCurrentCountry } from 'common/utils/currency';
import { action, thunk, Action, Thunk, Actions } from 'easy-peasy';
import { Platform } from 'react-native';

import { cacheGet, cacheSet, cacheMapGet } from 'app/services/asyncStorage';
import { APIListResponse } from 'types';
import { ProductType } from 'types/resources/product';
import { FilterType, SortType } from 'types/views/browse';
import { debounce } from 'common/utils';
import AlgoliaClient, { AlgoliaConstants } from 'app/services/algolia';
import Analytics from 'app/services/analytics';

export type SearchResponseType = APIListResponse<ProductType> & {
  searchProductsFound?: boolean;
  totalByClasses?: {
    All?: number;
    Sneakers?: number;
    Apparel?: number;
    Collectibles?: number;
  };
};
export type AlgoliaParams = {
  filterString?: string;
  filter?: FilterType;
  sort?: SortType;
  page?: number;
};
type SearchThunkPayload = { search?: string } & AlgoliaParams;

export type SearchStoreType = {
  search: string;
  isSearching: boolean;
  isLoadingMore: boolean;
  searchProductsFound: boolean;
  browseProductsFound: boolean;
  searchProducts: SearchResponseType;
  browseProducts: SearchResponseType;

  setSearch: Action<SearchStoreType, string>;
  setIsSearching: Action<SearchStoreType, boolean>;
  setIsLoadingMore: Action<SearchStoreType, boolean>;
  setSearchProducts: Action<SearchStoreType, SearchResponseType>;
  setBrowseProducts: Action<SearchStoreType, SearchResponseType>;
  appendSearchProducts: Action<SearchStoreType, SearchResponseType>;
  appendBrowseProducts: Action<SearchStoreType, SearchResponseType>;

  debouncedFetchSearchProducts: Thunk<SearchStoreType, SearchThunkPayload>;
  debouncedFetchBrowseProducts: Thunk<SearchStoreType, SearchThunkPayload>;
  loadMore: Thunk<SearchStoreType, SearchThunkPayload>;
  loadMoreBrowseProducts: Thunk<SearchStoreType, SearchThunkPayload>;
};

const storeRecentSearches = (search: string) =>
  cacheGet<string[]>('recent_searches', []).then((recentSearches) => {
    if (recentSearches !== undefined) {
      const index = recentSearches.findIndex((r) => r === search);
      if (index >= 0) recentSearches.splice(index, 1);
      if (recentSearches.length >= 5) recentSearches.pop();
      recentSearches.unshift(search);
      cacheSet('recent_searches', recentSearches);
    }
  });

const getUpcomingSortFilter = (sort: AlgoliaParams['sort']): string => {
  if (sort && sort.startsWith('upcomingRelease')) {
    const countryShortCode = sort.replace('upcomingRelease', '');
    const suffix = countryShortCode !== 'US' ? `_${countryShortCode}` : '';
    const d = new Date();
    const threeDaysAgo = Math.floor(d.setDate(d.getDate() - 3) / 1000);
    return `drop_date_timestamp${suffix} > ${threeDaysAgo}`;
  }
  return '';
};

const getLatestReleaseSortFilter = (sort: AlgoliaParams['sort']): string => {
  if (sort && sort.startsWith('latestRelease')) {
    const d = new Date();
    const fourteenDaysAfter = Math.floor(d.setDate(d.getDate() + 14) / 1000);
    return `drop_date_timestamp < ${fourteenDaysAfter}`;
  }
  return '';
};

const getAnalyticsTags = () => {
  const userVisitingStatus = cacheMapGet('app_open_count') === 1 ? 'new_user' : 'returning_user';
  const country = getCurrentCountry().shortcode || 'Others';

  return [Platform.OS, userVisitingStatus, country];
};

const fetchProducts = async (search?: string, _params?: AlgoliaParams) => {
  const userID = await Analytics.mixpanel.getDistinctId();
  const { page, sort, filterString } = _params || {};
  const analyticsTags = getAnalyticsTags();

  const params = {
    page,
    facets: ['class'],
    facetingAfterDistinct: true,
    filters: [filterString, getUpcomingSortFilter(sort), getLatestReleaseSortFilter(sort)]
      .filter(Boolean)
      .join(' AND '),
    userToken: userID ? String(userID) : 'Guest-User',
    analyticsTags,
    ...AlgoliaConstants,
  };
  const Algolia = sort && AlgoliaClient[sort] ? AlgoliaClient[sort] : AlgoliaClient.search;
  return Algolia<ProductType>(search || '', params)
    .then(({ hits, nbHits, facets, queryID }) => ({
      results: hits.map((p) => ({ ...p, queryID: queryID || '' })),
      total: nbHits,
      totalByClasses: { ...facets?.class, All: nbHits } || {},
    }))
    .then((resp) => {
      if (resp.total === 0) {
        return AlgoliaClient.mostPopular<ProductType>('', {
          page,
          analyticsTags,
          ...AlgoliaConstants,
        }).then(({ hits, nbHits, queryID }) => ({
          results: hits.map((p) => ({ ...p, queryID: queryID || '' })),
          total: nbHits,
        }));
      }
      if (search) storeRecentSearches(search);
      return { ...resp, searchProductsFound: true };
    })
    .catch(() => ({ results: [], total: 0, searchProductsFound: false }));
};

const fetchSearchProducts = (
  actions: Actions<SearchStoreType>,
  search?: string,
  params?: AlgoliaParams
) => {
  actions.setIsSearching(true);
  fetchProducts(search, params).then(actions.setSearchProducts);
};
const fetchBrowseProducts = (
  actions: Actions<SearchStoreType>,
  search: string,
  params: AlgoliaParams
) => {
  actions.setIsSearching(true);
  fetchProducts(search, params).then(actions.setBrowseProducts);
  Analytics.browseView(params);
};

const debouncedFetchSearchProducts = debounce(fetchSearchProducts, 700);
const debouncedFetchBrowseProducts = debounce(fetchBrowseProducts, 700);

const SearchStore: SearchStoreType = {
  search: '',
  searchProductsFound: false,
  browseProductsFound: false,
  setSearch: action((store, search = '') => {
    store.search = search;
  }),

  searchProducts: {
    results: [],
    total: 0,
    totalByClasses: { Sneakers: 0, Apparel: 0, Collectibles: 0 },
  },
  browseProducts: {
    results: [],
    total: 0,
  },
  setSearchProducts: action((store, searchProducts) => {
    store.isSearching = false;
    store.searchProducts = searchProducts;
    store.searchProductsFound = !!searchProducts.searchProductsFound;
    Analytics.productSearch('Search', store.search, searchProducts.total);
  }),
  setBrowseProducts: action((store, browseProducts) => {
    store.isSearching = false;
    store.browseProducts = browseProducts;
    store.browseProductsFound = !!browseProducts.searchProductsFound;
  }),
  appendSearchProducts: action((store, searchProducts) => {
    store.isLoadingMore = false;
    store.searchProducts.results.push(...searchProducts.results);
  }),
  appendBrowseProducts: action((store, browseProducts) => {
    store.isLoadingMore = false;
    store.browseProducts.results.push(...browseProducts.results);
  }),

  isSearching: false,
  setIsSearching: action((store, isSearching) => {
    store.isSearching = isSearching;
  }),

  isLoadingMore: false,
  setIsLoadingMore: action((store, isLoadingMore) => {
    store.isLoadingMore = isLoadingMore;
  }),

  debouncedFetchSearchProducts: thunk((actions, { search }) =>
    debouncedFetchSearchProducts(actions, search)
  ),
  debouncedFetchBrowseProducts: thunk((actions, { search, ...params }) =>
    debouncedFetchBrowseProducts(actions, search, params)
  ),

  loadMore: thunk((actions, { search, ...params }) =>
    fetchProducts(search, params).then(actions.appendSearchProducts)
  ),
  loadMoreBrowseProducts: thunk((actions, { search, ...params }) =>
    fetchProducts(search, params).then(actions.appendBrowseProducts)
  ),
};

export default SearchStore;
