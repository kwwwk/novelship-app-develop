import Config from 'react-native-config';

type EnvConstantsType = {
  RELEASE: 'development' | 'staging' | 'production';
  IPSTACK_ACCESS_KEY: string;
  SENTRY_ORG: string;
  SENTRY_PROJECT: string;
  SENTRY_AUTH_TOKEN: string;
  SENTRY_DSN: string;
  IMGIX_URL: string;
  APP_URL_SCHEME: string;
  UNIVERSAL_DOMAIN: 'novelship.com' | 'test.novelship.com';
  API_URL_PROXY: string;
  API_URL_PRIMARY: string;
  WEB_APP_URL: string;
  CLIENT_ID_FACEBOOK: number;
  CLIENT_ID_GOOGLE: string;
  CLIENT_ID_APPLE: string;
  CLIENT_ID_LINE_JP: number;
  CLIENT_ID_LINE_TW: number;
  STRIPE_KEY: string;
  MIXPANEL_TOKEN: string;
  ONE_SIGNAL_APP_ID: string;
  ALGOLIA: {
    APP_ID: string;
    API_KEY: string;
    INDICE: string;
    PAGING_LIMIT: number;
  };
};

function getEnvironment(): EnvConstantsType {
  const releaseChannel = Config.RELEASE;
  console.info('RELEASE:', releaseChannel);

  const baseConfig = {
    IPSTACK_ACCESS_KEY: '846ff559d57810e9d25fde44653a3475',
    SENTRY_ORG: 'novelship',
    SENTRY_PROJECT: 'novelship-app',
    SENTRY_AUTH_TOKEN: 'b082e009bd414bf3a1d9d7f53c1eacf3757efb680afd40988829a7df6b543ed0',
    SENTRY_DSN: 'https://018ecb5663fe44f7b3ce15dfe0a8f992@o1036078.ingest.sentry.io/6004036',
    IMGIX_URL: 'https://ns.imgix.net/',
    APP_URL_SCHEME: 'novelship',
  };

  if (releaseChannel && releaseChannel.indexOf('prod') !== -1) {
    return {
      ...baseConfig,
      RELEASE: 'production',
      APP_URL_SCHEME: 'novelship',
      API_URL_PROXY: 'https://novelship.com/api/',
      API_URL_PRIMARY: 'https://api.novelship.com/',
      WEB_APP_URL: 'https://novelship.com/',
      UNIVERSAL_DOMAIN: 'novelship.com',
      CLIENT_ID_FACEBOOK: 2024958714406360,
      CLIENT_ID_GOOGLE: '610539107569-teaq0eo506a920vtgvkroacose4r57u4.apps.googleusercontent.com',
      CLIENT_ID_APPLE: 'com.novelship.client-live',
      CLIENT_ID_LINE_JP: 1656804820,
      CLIENT_ID_LINE_TW: 1656804797,
      STRIPE_KEY: 'pk_live_0VrSmhaDwHmRnNiCYPLgcLIO',
      MIXPANEL_TOKEN: 'a86494259a847fb6626c3dcccf32f9eb',
      ONE_SIGNAL_APP_ID: 'faef3df1-f64c-422f-8921-23abae8352e9',
      ALGOLIA: {
        APP_ID: 'N8IBE2VBXJ',
        API_KEY: 'a6d4df9f20747fe6ac25247993a4ac8c',
        INDICE: 'prod_products',
        PAGING_LIMIT: 500,
      },
    };
  }

  if (releaseChannel && releaseChannel.indexOf('staging') !== -1) {
    return {
      ...baseConfig,
      RELEASE: 'staging',
      APP_URL_SCHEME: 'novelship-test',
      API_URL_PROXY: 'https://test.novelship.com/test-api/',
      API_URL_PRIMARY: 'https://api-test.novelship.com/',
      WEB_APP_URL: 'https://test.novelship.com/',
      UNIVERSAL_DOMAIN: 'test.novelship.com',
      CLIENT_ID_FACEBOOK: 116846465638888,
      CLIENT_ID_GOOGLE: '661574306674-r2pn7v0g6ffj47qkakacn63l47tsufbu.apps.googleusercontent.com',
      CLIENT_ID_APPLE: 'com.novelship.client-test',
      CLIENT_ID_LINE_JP: 1656804822,
      CLIENT_ID_LINE_TW: 1656800028,
      STRIPE_KEY: 'pk_test_yZbrSzZrh4BxB8Xrn5VleqBK',
      MIXPANEL_TOKEN: 'c9c2ddf241d8ba4e33e86c2e16c79898',
      ONE_SIGNAL_APP_ID: '1af137ab-5f17-4e7b-ba09-1a5b36e8610c',
      ALGOLIA: {
        APP_ID: 'N8IBE2VBXJ',
        API_KEY: '8d88f90c0ec64a42ccca5fdc95d609af',
        INDICE: 'test_products',
        PAGING_LIMIT: 500,
      },
    };
  }

  // dev env settings
  const _API_URL = Config.API_URL || 'https//localhost:3000/';
  const API_URL = _API_URL.endsWith('/') ? _API_URL : `${_API_URL}/`;
  const WEB_APP_URL = Config.WEB_APP_URL || 'https://localhost:5000/';
  return {
    ...baseConfig,
    RELEASE: 'development',
    APP_URL_SCHEME: 'novelship-dev',
    API_URL_PROXY: API_URL,
    API_URL_PRIMARY: API_URL,
    WEB_APP_URL: WEB_APP_URL.endsWith('/') ? WEB_APP_URL : `${WEB_APP_URL}/`,
    UNIVERSAL_DOMAIN: 'test.novelship.com',
    CLIENT_ID_FACEBOOK: 116846465638888,
    CLIENT_ID_GOOGLE: '661574306674-vb3s578nds0tjktc4qfrnsagc441tdj0.apps.googleusercontent.com',
    CLIENT_ID_APPLE: 'com.novelship.client-test',
    CLIENT_ID_LINE_JP: 1656804824,
    CLIENT_ID_LINE_TW: 1656804816,
    STRIPE_KEY: 'pk_test_yZbrSzZrh4BxB8Xrn5VleqBK',
    MIXPANEL_TOKEN: 'c9c2ddf241d8ba4e33e86c2e16c79898',
    ONE_SIGNAL_APP_ID: 'd57e4933-bcd5-40f8-a504-0fa0765d43f3',
    ALGOLIA: {
      APP_ID: 'N8IBE2VBXJ',
      API_KEY: '8d88f90c0ec64a42ccca5fdc95d609af',
      INDICE: 'test_products',
      PAGING_LIMIT: 500,
    },
  };
}

const envConstants = getEnvironment();

export default envConstants;
