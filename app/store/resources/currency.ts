import { Action, action, Computed, computed } from 'easy-peasy';
import { CurrencyType, defaultCurrency } from 'types/resources/currency';

export type CurrencyStoreType = {
  currencies: CurrencyType[];
  current: CurrencyType;
  set: Action<CurrencyStoreType, { currencies: CurrencyType[]; currentCurrency: CurrencyType }>;
  getById: Computed<CurrencyStoreType, (id: number | string) => CurrencyType>;
};

const CurrencyStore: CurrencyStoreType = {
  currencies: [defaultCurrency],
  current: defaultCurrency,
  set: action((store, { currencies, currentCurrency }) => {
    store.current = currentCurrency;
    store.currencies = currencies;
  }),
  getById: computed((state) => (_id) => {
    const id = typeof _id === 'number' ? _id : parseInt(_id);
    return state.currencies.find((c) => c.id === id) || defaultCurrency;
  }),
};

export default CurrencyStore;
