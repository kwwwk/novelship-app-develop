import { CurrencyType } from 'types/resources/currency';
import { toLocalCurrency, toPrecision, toCurrencyString } from 'common/utils/currency';

const toList = (input: number, currency?: CurrencyType) =>
  toPrecision(toLocalCurrency(input, currency), 1, 'up');

const $toList = (input: number, currency: CurrencyType) =>
  toCurrencyString(toList(input, currency), currency);

export { toList, $toList };
