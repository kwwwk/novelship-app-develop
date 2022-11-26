import { createStore, createTypedHooks } from 'easy-peasy';
import model, { StoreModel } from './storeModel';

const typedHooks = createTypedHooks<StoreModel>();

export const { useStoreState } = typedHooks;
export const { useStoreActions } = typedHooks;
export const { useStoreDispatch } = typedHooks;

const Store = createStore<StoreModel>(model);

// https://easy-peasy.now.sh/docs/recipes/hot-reloading.html
if (__DEV__) {
  if (module.hot) {
    module.hot.accept(() => {
      Store.reconfigure(model);
    });
  }
}

export default Store;
