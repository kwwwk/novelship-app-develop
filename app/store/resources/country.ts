import { action, Action, Computed, computed } from 'easy-peasy';
import { CountryType, defaultCountry } from 'types/resources/country';

export type CountryStoreType = {
  countries: CountryType[];
  current: CountryType;
  getById: Computed<CountryStoreType, (id?: number | string) => CountryType>;
  set: Action<CountryStoreType, { countries: CountryType[]; currentCountry: CountryType }>;
};

const CountryStore: CountryStoreType = {
  countries: [defaultCountry],
  current: defaultCountry,
  set: action((store, { countries, currentCountry }) => {
    store.current = currentCountry;
    store.countries = countries;
  }),
  getById: computed((state) => (_id) => {
    if (!_id) return defaultCountry;
    const id = typeof _id === 'number' ? _id : parseInt(_id);
    return state.countries.find((c) => c.id === id) || defaultCountry;
  }),
};

export default CountryStore;
