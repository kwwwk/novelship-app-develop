import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { APIQueryParamsType } from 'common/api/query';
import API from 'common/api';

const useAPIListFetch = <T>(
  url: string,
  initialParams: APIQueryParamsType,
  options: {
    refetchOnScreenFocus: boolean;
    filter?: APIQueryParamsType['filter'];
  } = { refetchOnScreenFocus: false, filter: {} }
) => {
  const [isLoading, toggleLoading] = useState(true);
  const [params, setParams] = useState(initialParams);
  const [results, setResults] = useState<T[]>([]);
  const [total, setTotal] = useState(0);

  const navigation = useNavigation();

  const fetch = (extraParams?: APIQueryParamsType) => {
    const _params = {
      ...params,
      ...extraParams,
      filter: {
        ...params.filter,
        ...extraParams?.filter,
      },
    };
    setParams(_params);
    toggleLoading(true);

    return API.fetch<{ results: T[]; total: number }>(url, _params);
  };

  const refetch = (extraParams?: APIQueryParamsType) =>
    fetch({
      ...extraParams,
      page: initialParams.page,
    }).then((resp) => {
      setResults(resp.results);
      setTotal(resp.total);
      toggleLoading(false);
    });

  const fetchMore = (extraParams?: APIQueryParamsType) => {
    if (results.length >= total) return;

    return fetch({
      page: {
        ...extraParams,
        ...initialParams.page,
        number: results.length / (initialParams.page?.size || 10),
      },
    }).then((resp) => {
      setResults([...results, ...resp.results]);
      setTotal(resp.total);
      toggleLoading(false);
    });
  };

  useEffect(() => {
    if (options.refetchOnScreenFocus) {
      const unsubscribe = navigation.addListener('focus', () =>
        refetch({ filter: options.filter })
      );
      return unsubscribe;
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, options.filter]);

  return { results, total, isLoading, refetch, fetchMore };
};

export default useAPIListFetch;
