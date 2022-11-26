import { i18n, Messages } from '@lingui/core';
import * as RNLocalize from 'react-native-localize';
import { en, id, zh, ja, my } from 'make-plural/plurals';

import { messages as EN } from '../../locales/en/messages';
import { messages as ID } from '../../locales/id/messages';
import { messages as JA } from '../../locales/ja/messages';
import { messages as ZH_HANT_TW } from '../../locales/zh-Hant-TW/messages';
import { messages as ZH_HANS } from '../../locales/zh-Hans/messages';
import { messages as MY } from '../../locales/my/messages';

export type LanguageType = 'en' | 'id' | 'zh-Hant-TW' | 'zh-Hans' | 'my' | 'ja';

const defaultLanguage: LanguageType = 'en';

// https://www.w3.org/International/articles/bcp47/
const LANGUAGES: Record<
  string,
  {
    name: string;
    codes: string[];
    plural: (n: number | string, ord?: boolean | undefined) => 'one' | 'two' | 'few' | 'other';
    messages: Messages;
  }
> = {
  en: { name: 'English', codes: ['en'], plural: en, messages: EN },
  id: { name: 'Indonesian', codes: ['id'], plural: id, messages: ID },
  'zh-Hans': {
    name: '简体中文',
    codes: ['zh-Hans', 'zh-CN', 'zh-SG', 'zh'],
    plural: zh,
    messages: ZH_HANS,
  },
  'zh-Hant-TW': {
    name: '繁體中文',
    codes: ['zh-Hant', 'zh-TW', 'zh-HK'],
    plural: zh,
    messages: ZH_HANT_TW,
  },
  ja: { name: '日本語', codes: ['ja'], plural: ja, messages: JA },
  my: { name: 'Malay', codes: ['my', 'ms'], plural: my, messages: MY },
};

const languageCodesMap = Object.entries(LANGUAGES).reduce((prev: Record<string, string>, curr) => {
  for (const code of curr[1].codes) {
    // eslint-disable-next-line prefer-destructuring
    prev[code] = curr[0];
  }
  return prev;
}, {});

const getDeviceLang = () => {
  try {
    const detectedLocales = RNLocalize.getLocales();
    const preferredLocales = detectedLocales.map(
      (l) => `${l.languageCode}${l.scriptCode ? `-${l.scriptCode}` : ''}`
    );

    let detectedLocale: string = defaultLanguage;
    for (const l of preferredLocales) {
      const matchingCode = Object.keys(languageCodesMap).find((code) => code === l);
      if (matchingCode) {
        detectedLocale = languageCodesMap[matchingCode];
        break;
      }
    }

    return detectedLocale;
  } catch (error) {
    return defaultLanguage;
  }
};

const loadLanguage = (language = 'en') => {
  i18n.loadLocaleData({ [language]: { plurals: LANGUAGES[language].plural } });
  i18n.load(language, LANGUAGES[language].messages);
  i18n.activate(language);
};

const getActiveLanguage = (language: string) => {
  const activeLanguages = { ...LANGUAGES };
  // if (IS_RELEASE_PRODUCTION) {
  //   // add any language to be tested in test env only
  //   delete activeLanguages.my;
  // }

  return Object.keys(activeLanguages).includes(language) ? language : defaultLanguage;
};

export { LANGUAGES, defaultLanguage, loadLanguage, getDeviceLang, getActiveLanguage };
