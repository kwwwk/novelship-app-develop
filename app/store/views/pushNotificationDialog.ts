import { cacheGet, cacheSet } from 'app/services/asyncStorage';
import { action, thunk, Action, Thunk } from 'easy-peasy';
import PushNotification from 'app/services/pushNotification';

export type PushNotificationDialogStoreType = {
  isOpen: boolean;
  openDialog: Action<PushNotificationDialogStoreType>;
  closeDialog: Action<PushNotificationDialogStoreType>;
  promptDialog: Thunk<PushNotificationDialogStoreType>;
};

const SHOW_DIALOG_ON_APP_COUNT_SERIES = [2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377].map(
  (i) => i * 2
);
let hasPromptDialogShown = false;

const PushNotificationDialogStore: PushNotificationDialogStoreType = {
  isOpen: false,
  openDialog: action((store) => {
    store.isOpen = true;
  }),
  closeDialog: action((store) => {
    store.isOpen = false;
  }),
  promptDialog: thunk((actions) => {
    if (hasPromptDialogShown) return;
    hasPromptDialogShown = true;

    PushNotification.isPushEnabled().then((isEnabled) => {
      if (isEnabled) return;

      cacheGet<number>('PN_prompt_series').then((count = 0) => {
        cacheSet('PN_prompt_series', count + 1);
        if (SHOW_DIALOG_ON_APP_COUNT_SERIES.includes(count)) {
          actions.openDialog();
        }
      });
    });
  }),
};

export default PushNotificationDialogStore;
