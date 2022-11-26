import { CurrencyType } from 'types/resources/currency';
import { useStoreState } from 'app/store';
import * as currencyUtils from 'common/utils/currency';
import * as offerUtils from 'common/utils/offer';
import * as listUtils from 'common/utils/list';

const useCurrencyUtils = (defaultCurrency?: CurrencyType) => {
  const currentCurrency = useStoreState((s) => s.currency.current);
  const fallbackCurrency = defaultCurrency || currentCurrency;

  const toBaseCurrency = (input: number, currency: CurrencyType = fallbackCurrency) =>
    currencyUtils.toBaseCurrency(input, currency);
  const toLocalCurrency = (input: number, currency: CurrencyType = fallbackCurrency) =>
    currencyUtils.toLocalCurrency(input, currency);

  const toCurrencyString = (
    input: number,
    currency: CurrencyType = fallbackCurrency,
    decimals = 0,
    position: 'front' | 'back' = 'front'
  ) => currencyUtils.toCurrencyString(input, currency, decimals, position);

  const $ = (input: number, currency: CurrencyType = fallbackCurrency) =>
    currencyUtils.$(input, currency);
  const $$ = (input: number, currency: CurrencyType = fallbackCurrency) =>
    currencyUtils.$$(input, currency);

  const toList = (input: number, currency: CurrencyType = fallbackCurrency) =>
    listUtils.toList(input, currency);
  const $toList = (input: number, currency: CurrencyType = fallbackCurrency) =>
    listUtils.$toList(input, currency);

  const toOffer = (input: number, currency: CurrencyType = fallbackCurrency) =>
    offerUtils.toOffer(input, currency);
  const $toOffer = (input: number, currency: CurrencyType = fallbackCurrency) =>
    offerUtils.$toOffer(input, currency);

  return {
    $,
    $$,
    $toList,
    $toOffer,
    toBaseCurrency,
    toCurrencyString,
    toList,
    toLocalCurrency,
    toOffer,
  };
};

export default useCurrencyUtils;
