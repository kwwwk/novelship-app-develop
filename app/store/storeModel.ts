import language, { LanguageStoreType } from './views/language';
import referralInputDialog, { ReferralInputDialogStoreType } from './views/referralInputDialog';
import pushNotificationDialog, {
  PushNotificationDialogStoreType,
} from './views/pushNotificationDialog';
import user, { UserStoreType } from './resources/user';
import country, { CountryStoreType } from './resources/country';
import currency, { CurrencyStoreType } from './resources/currency';
import search, { SearchStoreType } from './views/search';
import base from './resources/base';
import type { BaseStoreType } from './resources/base';

export type StoreModel = {
  user: UserStoreType;
  country: CountryStoreType;
  currency: CurrencyStoreType;
  base: BaseStoreType;
  search: SearchStoreType;
  pushNotificationDialog: PushNotificationDialogStoreType;
  referralInputDialog: ReferralInputDialogStoreType;
  language: LanguageStoreType;
};

const model: StoreModel = {
  // Resources
  user,
  country,
  currency,
  base,
  // Views
  search,
  // UI State
  pushNotificationDialog,
  referralInputDialog,
  language,
};

export default model;
