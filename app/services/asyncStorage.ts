import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = '@ns:';
const cacheInMemoryMap = new Map(); // synchronously readable in memory cache

export type CacheKeyType =
  | 'app_open_count'
  | 'detected_location'
  | 'is_app_review_prompted'
  | 'is_delivery_same'
  | 'is_shipping_same'
  | 'last_locale'
  | 'last_ticker_text'
  | 'PN_prompt_series'
  | 'power_seller_dialog'
  | 'partner_code'
  | 'recent_searches'
  | 'resell_dialog'
  | 'signup_dropoff_tracking'
  | 'token'
  | 'viewed_products_Apparel'
  | 'viewed_products_Collectibles'
  | 'viewed_products_Sneakers'
  | string;

/**
 *
 * @param {CacheKeyType} key - key string
 * @param {*} data
 * @param {number} [exp] - in minutes
 * @returns
 */
const cacheSet = <T>(key: CacheKeyType, data: T, exp?: number): Promise<T> => {
  cacheInMemoryMap.set(key, data);
  const item = JSON.stringify(data);
  if (exp) {
    AsyncStorage.setItem(`${CACHE_PREFIX}${key}_exp`, String(Date.now() + exp * 60 * 1000));
  }

  return AsyncStorage.setItem(`${CACHE_PREFIX}${key}`, item).then(() => data);
};

const cacheGet = <T>(key: CacheKeyType, fallback?: T): Promise<T | undefined> =>
  AsyncStorage.getItem(`${CACHE_PREFIX}${key}_exp`).then((exp) => {
    if (exp) {
      if (exp < String(Date.now())) {
        return fallback;
      }
    }

    return AsyncStorage.getItem(`${CACHE_PREFIX}${key}`).then((item) => {
      if (!item) return fallback;
      try {
        return JSON.parse(item);
      } catch (_) {
        return item;
      }
    });
  });

const cacheRemove = (key: CacheKeyType) =>
  AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`).then(() => cacheInMemoryMap.delete(key));

const cacheMapGet = (key: CacheKeyType) => cacheInMemoryMap.get(key);

// Use to clear all cache
// AsyncStorage.clear();

export { cacheGet, cacheSet, cacheRemove, cacheMapGet };
