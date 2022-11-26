import { CurrencyType } from 'types/resources/currency';
import { toLocalCurrency, toPrecision, toCurrencyString } from 'common/utils/currency';

const toOffer = (input: number, currency?: CurrencyType) =>
  toPrecision(toLocalCurrency(input, currency), 1, 'down');

const $toOffer = (input: number, currency: CurrencyType) =>
  toCurrencyString(toOffer(input, currency), currency);

export { toOffer, $toOffer };
