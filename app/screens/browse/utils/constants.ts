import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { CategoryType } from 'types/views/browse';

const DROP_YEARS = [];
for (let i = new Date().getFullYear(); i >= 1996; i -= 1) {
  DROP_YEARS.push({ name: String(i) });
}

const SIZE_TYPES = [
  { name: i18n._(t`Men`), value: 'men' },
  { name: i18n._(t`Women`), value: 'women' },
  { name: i18n._(t`Unisex`), value: 'unisex' },
  { name: i18n._(t`Youth`), value: 'youth' },
  { name: i18n._(t`Pre school`), value: 'ps' },
  { name: i18n._(t`Toddler`), value: 'td' },
  { name: i18n._(t`Infant`), value: 'infant' },
];

const COLORS = [
  { name: i18n._(t`Black`), value: 'Black', color: '#1D1D1D' },
  { name: i18n._(t`White`), value: 'White', color: '#FFFFFF' },
  { name: i18n._(t`Grey`), value: 'Grey', color: '#C4C4C4' },
  { name: i18n._(t`Silver`), value: 'Silver', color: '#EDEDED' },
  { name: i18n._(t`Red`), value: 'Red', color: '#FF0000' },
  { name: i18n._(t`Pink`), value: 'Pink', color: '#FF56B1' },
  { name: i18n._(t`Orange`), value: 'Orange', color: '#FF8A00' },
  { name: i18n._(t`Yellow`), value: 'Yellow', color: '#FBEE3A' },
  { name: i18n._(t`Gold`), value: 'Gold', color: '#FFD700' },
  { name: i18n._(t`Green`), value: 'Green', color: '#2C961B' },
  { name: i18n._(t`Olive`), value: 'Olive', color: '#808000' },
  { name: i18n._(t`Teal`), value: 'Teal', color: '#008080' },
  { name: i18n._(t`Blue`), value: 'Blue', color: '#6DB8EE' },
  { name: i18n._(t`Navy`), value: 'Navy', color: '#043B8C' },
  { name: i18n._(t`Purple`), value: 'Purple', color: '#8F00FF' },
  { name: i18n._(t`Beige`), value: 'Beige', color: '#FFF0DF' },
  { name: i18n._(t`Tan`), value: 'Tan', color: '#D2B48C' },
  { name: i18n._(t`Copper`), value: 'Copper', color: '#B87333' },
  { name: i18n._(t`Brown`), value: 'Brown', color: '#665549' },
  { name: i18n._(t`Burgundy`), value: 'Burgundy', color: '#800020' },
  { name: i18n._(t`Multi`), value: 'Multi', color: 'multi' },
  {
    name: i18n._(t`Clear`),
    value: 'Clear',
    color: 'linear-gradient(180deg, #DADADA 0%, rgba(241, 241, 241, 0.5) 47.92%, #FBFBFB 100%)',
  },
];

export const filterOptions: CategoryType[] = [
  {
    name: i18n._(t`Product Category`),
    filterKey: 'class',
    children: [
      { name: i18n._(t`Sneakers`), value: 'Sneakers' },
      { name: i18n._(t`Apparel`), value: 'Apparel' },
      { name: i18n._(t`Collectibles`), value: 'Collectibles' },
    ],
    type: 'select',
  },
  {
    name: i18n._(t`Brands & Models`),
    filterKey: 'category_level_1',
    children: [],
  },
  {
    name: i18n._(t`Size Types`),
    filterKey: 'gender',
    children: SIZE_TYPES,
    type: 'select',
  },
  {
    name: i18n._(t`Prices`),
    filterKey: 'lowest_listing_price',
    children: [],
  },
  {
    name: i18n._(t`Colors`),
    filterKey: 'main_color',
    children: COLORS,
  },
  {
    name: i18n._(t`Release Year`),
    filterKey: 'drop_year',
    children: DROP_YEARS,
  },
  {
    name: i18n._(t`Instant Delivery`),
    filterKey: 'is_instant_available',
    type: 'switch',
  },
];

export { SIZE_TYPES };
