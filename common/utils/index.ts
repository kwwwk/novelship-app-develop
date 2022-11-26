import { cacheGet, cacheSet } from 'app/services/asyncStorage';
import { i18n } from '@lingui/core';

const debounce = (fn: (...args: any) => void, delay: number) => {
  let timeoutID: NodeJS.Timeout;
  return function (...args: unknown[]): void {
    clearTimeout(timeoutID);
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that: unknown = this;
    timeoutID = setTimeout(function () {
      fn.apply(that, args);
    }, delay);
  };
};

const makeHeaderTitle = (routeName: string) =>
  i18n._(routeName.match(/[A-Z][a-z]+|[0-9]+/g)?.join(' ') || '');

const buildQueryString = (params: Record<string, string | number | boolean>) =>
  Object.keys(params)
    .filter((key) => params[key] !== undefined)
    .map((key: string) => `${key}=${params[key].toString()}`)
    .join('&');

const uniqBy = (array: any[], property: string): any[] =>
  array.filter(
    (value, index, self) => self.findIndex((v) => v[property] === value[property]) === index
  );

function _appOpenCount() {
  return cacheGet<number>('app_open_count').then((app_open_count) =>
    // Store in memory for the first session
    cacheSet('app_open_count', (Number(app_open_count) || 0) + 1)
  );
}
_appOpenCount();

export { debounce, buildQueryString, makeHeaderTitle, uniqBy };
