import { CurrencyType } from 'types/resources/currency';
import Store from 'app/store';

const normalizeNumber = (input: number, precision = 4): number =>
  Math.round(input * 10 ** precision) / 10 ** precision;

function toPrecision(
  input: number,
  precision = 0.01,
  round: 'up' | 'down' | boolean = false
): number {
  if ((!input && input !== 0) || Number.isNaN(input)) {
    return NaN;
  }

  let result = normalizeNumber(input);
  let rounding = Math.round.bind(Math);

  if (round) {
    if (round === 'up') {
      rounding = Math.ceil.bind(Math);
    } else if (round === 'down') {
      rounding = Math.floor.bind(Math);
    }
  }

  if ([0.01, 0.1, 1, 10, 100, 1000].includes(precision)) {
    result = normalizeNumber(rounding(normalizeNumber(result / precision)) * precision);
  }
  return result;
}

const getCurrentCurrency = () => Store.getState().currency.current;
const getCurrentCountry = () => Store.getState().country.current;
const getCurrencyById = (currencyId: number) => Store.getState().currency.getById(currencyId);

function toLocalCurrency(input: number, currency: CurrencyType = getCurrentCurrency()): number {
  if ((!input && input !== 0) || Number.isNaN(input)) {
    return input;
  }
  return normalizeNumber(
    Math.round((input * currency.rate) / currency.precision) * currency.precision
  );
}

function toBaseCurrency(input: number, currency: CurrencyType = getCurrentCurrency()): number {
  const result = input / currency.rate;
  return result;
}

function toCurrencyString(
  input: number,
  currency: CurrencyType = getCurrentCurrency(),
  decimals = 0,
  position: 'front' | 'back' = 'front'
): string {
  if ((!input && input !== 0) || Number.isNaN(input)) {
    return '';
  }
  const maxDecimal = decimals < currency.max_decimals ? decimals : currency.max_decimals;
  try {
    const result = new Intl.NumberFormat(currency.locale, {
      style: 'decimal',
      minimumFractionDigits: maxDecimal,
      maximumFractionDigits: maxDecimal,
    }).format(input);
    if (position === 'front') {
      return `${currency.symbol} ${result}`;
    }
    return `${result} ${currency.code}`;
  } catch (_) {
    if (position === 'front') {
      return `${currency.symbol} ${input.toFixed(maxDecimal)}`;
    }
    return `${input.toFixed(maxDecimal)} ${currency.code}`;
  }
}

const $ = (input: number, currency: CurrencyType): string => toCurrencyString(input, currency);
const $$ = (input: number, currency: CurrencyType): string =>
  toCurrencyString(input, currency, 2, 'back');

export {
  toPrecision,
  toLocalCurrency,
  toBaseCurrency,
  toCurrencyString,
  $,
  $$,
  getCurrentCurrency,
  getCurrentCountry,
  getCurrencyById,
  normalizeNumber,
};
