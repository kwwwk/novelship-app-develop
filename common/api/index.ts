import axios, { AxiosError, AxiosResponse, AxiosPromise, AxiosAdapter } from 'axios';
import { throttleAdapterEnhancer } from 'axios-extensions';
import { Alert, Linking, Platform } from 'react-native';
import { QueryClient } from 'react-query';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';
import VersionCheck from 'react-native-version-check';
import DeviceInfo from 'react-native-device-info';

import envConstants from 'app/config';
import { navigationRef } from 'app/navigation';
import { CACHE_TIME } from 'common/constants';
import { cacheMapGet } from 'app/services/asyncStorage';
import { sentryCapture } from 'app/services/sentry';

import getQuery, { APIQueryParamsType } from './query';

// these errors happen on expired or malformed token, remove token from cache and reload page
const errorsRequiringReload = ['token', 'signature', 'unauthorized'];
const ERROR_MSG_DEFAULT = i18n._(t`Something went wrong! Please try again.`);

const errorHandler = (err: AxiosError) => {
  console.log('API', err?.response);
  try {
    // @ts-ignore null check present
    const message = err?.response?.data?.message;

    if (message) {
      for (const _error of errorsRequiringReload) {
        const _message = message.toLowerCase();
        if (_message.includes(_error)) {
          if (navigationRef.current) {
            // if navigation is ready, redirect to session expired screen which will logout user
            navigationRef.current.navigate('SessionExpiredScreen');
          } else {
            // if navigation is not ready, throw the error and hope the callee will handle it
            return Promise.reject(message);
          }
        }
      }
      return Promise.reject(message);
    }
    return Promise.reject(ERROR_MSG_DEFAULT);
  } catch (_) {
    return Promise.reject(ERROR_MSG_DEFAULT);
  }
};

const appVersion = VersionCheck.getCurrentVersion();
const headers = {
  'x-app-version': appVersion,
  'x-app-os': Platform.OS,
  'x-device-id': DeviceInfo.getUniqueId(),
  'x-device-name': DeviceInfo.getDeviceId(),
};

const axiosInstance = axios.create({
  baseURL: envConstants.API_URL_PROXY,
  timeout: 25 * 1000,
  headers,
  adapter: throttleAdapterEnhancer(axios.defaults.adapter as AxiosAdapter, { threshold: 2 * 1000 }),
});

const api = () => {
  const token = cacheMapGet('token');
  if (token) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common.Authorization;
  }
  return axiosInstance;
};

const handleAppUpgradeError = (err: AxiosError) => {
  VersionCheck.needUpdate()
    .then((res) => {
      if (res && res.isNeeded) {
        Alert.alert(
          'App Update Available',
          'Please update to continue using the app.',
          [{ text: 'Update', onPress: () => Linking.openURL(res.storeUrl) }],
          { cancelable: false }
        );
      }
    })
    .catch((error) => sentryCapture(error));

  return errorHandler(err);
};

const isExternalAPI = (path: string): boolean => /:\/\//.test(path);
const responseHandler = <T>(res: AxiosPromise<T>) =>
  res
    .then((resp: AxiosResponse<T>) => resp.data)
    .catch((err: AxiosError<T>) => {
      if (err.response?.status === 426) {
        return handleAppUpgradeError(err);
      }
      return errorHandler(err);
    });

// API Methods
const fetch = <T>(path: string, params: APIQueryParamsType = {}) =>
  responseHandler<T>(isExternalAPI(path) ? axios.get(path) : api().get(getQuery(path, params)));

const post = <T>(path: string, body: unknown = {}) =>
  responseHandler<T>(isExternalAPI(path) ? axios.post(path, body) : api().post(path, body));

const put = <T>(path: string, body: unknown = {}) =>
  responseHandler<T>(isExternalAPI(path) ? axios.put(path, body) : api().put(path, body));

const remove = <T>(path: string) =>
  responseHandler<T>(isExternalAPI(path) ? axios.delete(path) : api().delete(path));

const API = { fetch, post, put, remove };

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // @ts-ignore override
      queryFn: ({ queryKey }: { queryKey: [path: string] }) => API.fetch(...queryKey),
      cacheTime: CACHE_TIME.short,
      retry: 3,
      keepPreviousData: true,
    },
  },
});

export default API;

export { queryClient, errorHandler, ERROR_MSG_DEFAULT };
