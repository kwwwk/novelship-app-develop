import { action, Action } from 'easy-peasy';

export type ReferralInputDialogStoreType = {
  isOpen: boolean;
  openDialog: Action<ReferralInputDialogStoreType>;
  closeDialog: Action<ReferralInputDialogStoreType>;
};

const ReferralInputDialogStore: ReferralInputDialogStoreType = {
  isOpen: false,
  openDialog: action((store) => {
    store.isOpen = true;
  }),
  closeDialog: action((store) => {
    store.isOpen = false;
  }),
};

export default ReferralInputDialogStore;
