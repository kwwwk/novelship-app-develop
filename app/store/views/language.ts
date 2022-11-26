import { cacheGet, cacheSet } from 'app/services/asyncStorage';
import { getActiveLanguage, getDeviceLang, loadLanguage } from 'app/services/language';
import { action, Action, Thunk, thunk } from 'easy-peasy';

export type LanguageStoreType = {
  current: string;
  set: Action<LanguageStoreType, string>;
  load: Thunk<LanguageStoreType, string | typeof undefined>;
};

const LanguageStore: LanguageStoreType = {
  current: '',
  set: action((store, language) => {
    store.current = language;
  }),
  load: thunk((actions, language, { getState }) => {
    const state = getState();
    if (language) {
      if (state.current !== language) {
        cacheSet<string>('last_locale', language).then(() => {
          const locale = getActiveLanguage(language);
          loadLanguage(locale);
          actions.set(locale);
        });
      }
    } else {
      cacheGet<string>('last_locale').then((lastLanguage) => {
        const fallBackLanguage = getActiveLanguage(lastLanguage || getDeviceLang());
        loadLanguage(fallBackLanguage);
        actions.set(fallBackLanguage);
      });
    }
  }),
};

export default LanguageStore;
