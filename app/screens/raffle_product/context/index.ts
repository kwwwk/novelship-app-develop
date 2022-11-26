import { createContext } from 'react';
import { SneakerSizeMapType } from 'types/resources/product';

import { defaultRaffleProduct, RaffleProductType } from 'types/resources/raffleProduct';

export type RaffleProductCheckoutContextType = {
  isFetching: boolean;
  refetchRaffleProduct: () => void;
  raffleProduct: RaffleProductType;
  raffleRegistered: { isUserRaffleRegistered: boolean };
  refetchRaffleRegistered: () => void;
  size: {
    map: { [key: string]: SneakerSizeMapType };
    getDisplaySize: (size: string) => {
      displaySize: string | number;
      collatedTranslatedSize: string;
      defaultSize: string;
    };
    preferredSizeUnit: string;
    preferredSize?: string;
  };
};

const defaultFn = () => {};

const RaffleProductCheckoutContext = createContext<RaffleProductCheckoutContextType>({
  isFetching: true,
  refetchRaffleProduct: defaultFn,
  raffleProduct: defaultRaffleProduct,
  raffleRegistered: { isUserRaffleRegistered: false },
  refetchRaffleRegistered: defaultFn,
  size: {
    map: {},
    getDisplaySize: (size) => ({
      displaySize: size,
      collatedTranslatedSize: size,
      defaultSize: size,
    }),
    preferredSizeUnit: 'US',
    preferredSize: undefined,
  },
});

export default RaffleProductCheckoutContext;
