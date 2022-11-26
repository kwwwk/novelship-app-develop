import { t } from '@lingui/macro';
import { i18n } from '@lingui/core';
import structuredClone from '@ungap/structured-clone';

import Store from 'app/store';
import BROWSE_DATA, { APPAREL_BRANDS } from 'common/constants/browseData';
import { $, toBaseCurrency } from 'common/utils/currency';
import { SizePreferencesType } from 'types/resources/user';
import { CategoryType, FilterType } from 'types/views/browse';
import { CURRENCY_CONSTANTS } from 'common/constants/currency';

import { SIZES } from 'common/constants/size';
import { filterOptions, SIZE_TYPES } from './constants';

const currentCurrency = () => Store.getState().currency.current;

const isNodeSelected = (currentValue: string | string[] | undefined, item: CategoryType) =>
  Array.isArray(currentValue)
    ? currentValue.includes(item.value || item.name)
    : currentValue === (item.value || item.name);

const findNodeRecursively = (
  nodes: CategoryType[],
  predicate: (_: CategoryType) => boolean
): CategoryType | void => {
  for (const node of nodes) {
    if (predicate(node)) return node;

    if (node.children) {
      const match = findNodeRecursively(node.children, predicate);
      if (match) return match;
    }
  }
};

const buildAlgoliaKeyValueString = (key: string, value: string | boolean) => {
  if (key === 'lowest_listing_price') {
    return `${key}${value}`;
  }
  if (typeof value === 'boolean') {
    return `${key}=1`;
  }
  return `${key}:"${value}"`;
};

const buildAlgoliaFilterString = (filter: FilterType) =>
  Object.entries(filter)
    .filter(([, value]) => (Array.isArray(value) ? value.length > 0 : !!value))
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.length > 1
          ? `(${value.map((v) => buildAlgoliaKeyValueString(key, v)).join(' OR ')})`
          : buildAlgoliaKeyValueString(key, value[0]);
      }
      return buildAlgoliaKeyValueString(key, value);
    })
    .join(' AND ');

const buildAlgoliaRangeFilterString = (_from: number, _to: number) => {
  const from = Math.floor(toBaseCurrency(_from)) || '';
  const to = Math.ceil(toBaseCurrency(_to)) || '';

  let str = !to ? ' > ' : !from ? ' < ' : ':';
  str += from || '';
  str += to && from ? ' TO ' : '';
  str += to || '';

  return str;
};

const makePriceDisplayString = (p: number, i: number, prices: number[]) => {
  const currency = currentCurrency();
  const isIDR = currency.code === 'IDR';
  const first = isIDR && prices[i - 1] ? prices[i - 1] / 1000000 : prices[i - 1];
  const last = isIDR && p ? p / 1000000 : p;

  let str = first ? $(first, currency) : `${i18n._(t`Under`)} `;
  str += first && isIDR ? 'M' : '';
  str += first && last ? ' - ' : '';
  str += last ? `${$(last, currency)}${isIDR ? 'M' : ''}` : '+';

  return str;
};

const getFilterOptions = (
  filter: FilterType,
  { Sneakers: sizePreference }: SizePreferencesType
) => {
  // TODO: remove polyfill after upgrading to node v17.0
  const _filterOptions = structuredClone(filterOptions);

  // size filters
  const sizeUnit = sizePreference?.unit || 'US';
  const shouldDisplaySizeFilter = ['Sneakers', 'Apparel'].includes(filter.class);
  const sizes =
    filter.class === 'Sneakers'
      ? SIZES.Sneakers[sizeUnit].filter((s) =>
          filter.gender.length > 0 ? s.gender.some((g) => filter.gender.includes(g)) : true
        )
      : SIZES.Apparel;
  if (shouldDisplaySizeFilter) {
    _filterOptions.splice(3, 0, {
      name: filter.class === 'Sneakers' ? i18n._(t`Size (${sizeUnit})`) : i18n._(t`Size`),
      filterKey: filter.class === 'Sneakers' ? `${sizeUnit.toLowerCase()}_size` : 'size',
      children: sizes,
    });
  }

  // gender filters
  const sizeTypeFilterIndex = _filterOptions.findIndex((fo) => fo.filterKey === 'gender');
  // removing unisex option for sneakers
  _filterOptions[sizeTypeFilterIndex].children = SIZE_TYPES.filter((s) =>
    filter.class === 'Sneakers' ? s.value !== 'unisex' : true
  );

  // brand-models filters
  const browseFilterIndex = _filterOptions.findIndex((fo) => fo.filterKey === 'category_level_1');
  _filterOptions[browseFilterIndex].children = BROWSE_DATA.find(
    (b) => b.name === (filter.class || 'Sneakers')
  )?.children;

  // apparel brands filters
  if (filter.class === 'Apparel') {
    _filterOptions[browseFilterIndex].name = i18n._(t`Models`);
    _filterOptions.splice(browseFilterIndex, 0, {
      name: i18n._(t`Brands`),
      filterKey: 'main_brand',
      children: APPAREL_BRANDS,
    });
  }

  // price filters
  const priceFilterIndex = _filterOptions.findIndex(
    (fo) => fo.filterKey === 'lowest_listing_price'
  );
  const prices = CURRENCY_CONSTANTS[currentCurrency().code].filterPrices;
  _filterOptions[priceFilterIndex].children = [...prices, NaN].map((p, i) => ({
    name: makePriceDisplayString(p, i, prices),
    value: buildAlgoliaRangeFilterString(prices[i - 1], p),
  }));

  return _filterOptions;
};

export { buildAlgoliaFilterString, findNodeRecursively, getFilterOptions, isNodeSelected };
