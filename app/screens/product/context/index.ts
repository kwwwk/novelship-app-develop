import { createContext } from 'react';
import { UseMutateAsyncFunction } from 'react-query';

import { defaultProduct, ProductType, SneakerSizeMapType } from 'types/resources/product';
import { defaultOfferList, OfferListType } from 'types/resources/offerList';
import { PromocodeType, defaultPromocode } from 'types/resources/promocode';
import { PaymentMethodEnumType } from 'types/resources/paymentMethod';
import { TrxnDeliverToType } from 'types/resources/transaction';
import { defaultUserWishlist, UserWishlistType } from 'types/resources/wishlist';
import { HighLowOfferListsType } from 'common/utils/offerLists';
import { UserPostProductTagType } from 'types/resources/userPostProductTag';
import { defaultProductAddOn, ProductAddOnType } from 'types/resources/productAddOn';

export type LastSalesPricesForSizeType = {
  created_at: string;
  base_price: number;
  size: string;
};
export type ProductCheckoutContextType = {
  isFetching: boolean;
  product: ProductType;
  productsRelated: ProductType[];
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
  offerLists: OfferListType[];
  highLowOfferLists: HighLowOfferListsType;
  refetchOfferLists: () => void;
  wishlistProductSize: UseMutateAsyncFunction<
    UserWishlistType,
    unknown,
    { size: string; local_size: string }
  >;
  wishListedSizes: string[];
  lastSalesPricesForSize: LastSalesPricesForSizeType[];
  lookbookFeeds: UserPostProductTagType[];
  buy: {
    offerPrice?: number;
    setOfferPrice: (p: number) => void;
    expiration: number;
    setExpiration: (e: number) => void;
    paymentMethod: PaymentMethodEnumType;
    setPaymentMethod: (p: PaymentMethodEnumType) => void;
    deliverTo: TrxnDeliverToType;
    setDeliveryTo: (d: TrxnDeliverToType) => void;
    deliveryDeclare: number;
    setDeliveryDeclare: (d: number) => void;
    promocode: {
      currentPromocode: PromocodeType;
      setCurrentPromocode: (p: PromocodeType) => void;
      applicablePromocodes: PromocodeType[];
      setApplicablePromocodes: (p: PromocodeType[]) => void;
      fetchApplicablePromocodes: (setDefaultPromo?: boolean) => void;
      verifyPromocode: (code: string) => Promise<PromocodeType>;
    };
    productAddOn: {
      price: number;
      quantity: number;
      addOn: ProductAddOnType | null;
      setQuantity: React.Dispatch<React.SetStateAction<number>>;
    };
    buy: OfferListType;
  };
  sell: {
    listPrice?: number;
    setListPrice: (p: number) => void;
    expiration: number;
    setExpiration: (e: number) => void;
    sell: OfferListType;
  };
};

const defaultFn = () => {};

const ProductCheckoutContext = createContext<ProductCheckoutContextType>({
  isFetching: true,
  product: defaultProduct,
  productsRelated: [],
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
  offerLists: [],
  highLowOfferLists: {
    highest_offer_price: null,
    lowest_listing_price: null,
    lists: {},
    instant_lists: {},
    non_instant_lists: {},
    offers: {},
  },
  refetchOfferLists: defaultFn,
  wishlistProductSize: () => Promise.resolve(defaultUserWishlist),
  wishListedSizes: [],
  lastSalesPricesForSize: [],
  lookbookFeeds: [],
  buy: {
    setOfferPrice: defaultFn,
    expiration: 7,
    setExpiration: defaultFn,
    paymentMethod: 'stripe',
    setPaymentMethod: defaultFn,
    deliverTo: 'buyer',
    setDeliveryTo: defaultFn,
    deliveryDeclare: 0,
    setDeliveryDeclare: defaultFn,
    promocode: {
      currentPromocode: defaultPromocode,
      setCurrentPromocode: defaultFn,
      applicablePromocodes: [],
      setApplicablePromocodes: defaultFn,
      fetchApplicablePromocodes: defaultFn,
      verifyPromocode: () => Promise.resolve(defaultPromocode),
    },
    productAddOn: {
      price: 0,
      quantity: 0,
      addOn: defaultProductAddOn,
      setQuantity: defaultFn,
    },
    buy: defaultOfferList,
  },
  sell: {
    setListPrice: defaultFn,
    expiration: 7,
    setExpiration: defaultFn,
    sell: defaultOfferList,
  },
});

export default ProductCheckoutContext;
