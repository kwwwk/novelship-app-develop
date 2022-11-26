import { NavigatorScreenParams } from '@react-navigation/native';

import { BrowseParamType, FilterType } from 'types/views/browse';
import { PaymentMethodEnumType } from 'types/resources/paymentMethod';

export type RootRoutes = {
  BottomNavStack: NavigatorScreenParams<BottomTabRoutes>;
  ProductStack: NavigatorScreenParams<ProductRoutes> & { slug: string };
  RaffleProductStack: NavigatorScreenParams<RaffleRoutes> & { slug: string };
  // todo: @deprecate later
  RaffleProductStackOld: NavigatorScreenParams<RaffleRoutes> & { slug: string };
  SearchStack: NavigatorScreenParams<SearchRoutes>;
  UserStack: NavigatorScreenParams<UserRoutes>;
  AuthStack: NavigatorScreenParams<AuthRoutes> & { redirectTo?: string };
  StartScreen: undefined;
  PartnerSales: undefined;
  PowerSeller: undefined;
  TravelWithNS: undefined;
  NotFoundScreen: { uri: string };
  SessionExpiredScreen: undefined;
  StripePaymentHandler: {
    payment_intent: string;
    source_type: PaymentMethodEnumType;
  };
};

/* -- start: bottom tab routes -- */
export type BottomTabRoutes = {
  HomeStack: NavigatorScreenParams<HomeTopTabRoutes>;
  BrowseStack: NavigatorScreenParams<BrowseRoutes>;
  AccountStack: NavigatorScreenParams<AccountRoutes>;
};

export type HomeTopTabRoutes = {
  Sneakers: undefined;
  Apparel: undefined;
  Collectibles: undefined;
};

export type BrowseRoutes = {
  BrowseRoot: NavigatorScreenParams<BrowseRootRoutes>;
  FilterRoot: NavigatorScreenParams<FilterRootRoutes>;
};

export type BrowseRootRoutes = Record<string, BrowseParamType | undefined>;

export type FilterRootRoutes = {
  Filter: { title?: string; filterKey: keyof FilterType | ''; level?: number };
};

export type SearchRoutes = {
  Search: { q?: string };
};

export type AccountRoutes = {
  Account: undefined;
  About: undefined;
};
/*  -- end: bottom tab routes --  */

/* -- start: user dashboard routes -- */
export type UserRoutes = {
  Profile: NavigatorScreenParams<ProfileTopTabRoutes>;
  Buying: NavigatorScreenParams<BuyingTopTabRoutes>;
  Selling: NavigatorScreenParams<SellingTopTabRoutes>;
  Posts: NavigatorScreenParams<PostTopTabRoutes>;

  BulkShipment: NavigatorScreenParams<BulkShipmentRoutes>;
  BulkListEditStack: NavigatorScreenParams<BulkListRoutes>;

  PostEditStack: NavigatorScreenParams<PostEditRoutes>;

  Storage: undefined;
  PurchaseDetails: { sale_ref: string };
  PostPurchase: { sale_ref: string };
  PostPurchaseConfirmed: { sale_ref: string };
  StoreInStorage: { sale_ref: string };
  StoreInStorageConfirmed: { sale_ref: string };

  SaleDetails: { sale_ref: string };
  LabelGeneration: { sale_ref: string };
  PayoutRequest: undefined;
  PayoutHistory: undefined;

  Wishlist: undefined;
  Promotions: undefined;
  LoyaltyPointsStore: undefined;
  PostDetails: { user_post_id: number; status: 'published' | 'reviewing' | 'rejected' };

  Settings: undefined;
  BuyingForm: undefined;
  SellingForm: { limited?: boolean } | undefined;
  ProfileForm: undefined;
  SizePreferencesForm: undefined;
  PasswordForm: undefined;
  PhoneForm: { edit?: boolean } | undefined;
  PushNotificationForm: undefined;
};

export type ProfileTopTabRoutes = {
  User: undefined;
  Buying: undefined;
  Selling: { power_seller_enrolled?: boolean };
};

export type BuyingTopTabRoutes = {
  Offers: undefined;
  ConfirmedPurchases: undefined;
  PastPurchases: undefined;
};

export type SellingTopTabRoutes = {
  Lists: undefined;
  ConfirmedSales: undefined;
  PastSales: undefined;
};

export type PostTopTabRoutes = {
  PublishedPosts: undefined;
  ReviewingPosts: undefined;
  RejectedPosts: undefined;
};

export type BulkShipmentRoutes = {
  MakeBulkShipment: { selected_refs: string[] };
  ConfirmedBulkShipment: { shipment_id: string };
  ShipmentDetails: { shipment_id: string };
};

export type PostEditRoutes = {
  PostCreate: { product_id: number };
  PostEdit: { user_post_id: number };
  PostTagSelection: undefined;
};
/*  -- end: user dashboard routes --  */

export type AuthRoutes = {
  LogIn: undefined;
  LoginOTP: undefined;
  SignUp: { signup_reference: string } | undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
  SocialCallback: { token: string; signup: string; referral_code: string };
  SocialCallbackWeb: { token: string; signup: string; referral_code: string };
};

export type BulkListUpdateListType = {
  id: number;
  new_price: number;
  old_price: number;
};

export type BulkListRoutes = {
  BulkListUpdate: { selected_ids: number[]; is_select_all: boolean; search_term: string };
  BulkListReview: undefined;
  BulkListConfirmed: { confirmed_lists: BulkListUpdateListType[] };
};

export type RaffleRoutes = {
  RaffleProduct: undefined;
  RaffleProductSizes: undefined;
  RaffleProductReview: {
    size: string;
    price?: number;
  };
  RaffleProductConfirmed: { id: number };
};

export type ProductRoutes = {
  Product: undefined;
  Sizes: { flow: 'sell' | 'buy' };
  SizeChart: undefined;
  SizesWishlist: undefined;
  LookbookFeed: undefined;

  MakeOffer: {
    offer_list_id: 'offer' | number;
    size: string;
    price?: number;
    edit?: boolean;
  };
  BuyReview: {
    offer_list_id: 'offer' | number;
    size?: string;
    edit?: boolean;
    price?: number;
    expiration?: number;
  };
  DeliveryReview: { sale_ref: string };
  PaymentSelect: { offer_list_id?: number; cardOnly?: boolean };
  PromocodeSelect: {
    offer_list_id: 'offer' | number;
    size?: string;
    edit?: boolean;
    price?: number;
    expiration?: number;
  };
  ConfirmedPurchase: { id: string };
  ConfirmedOffer: { id: number };
  ConfirmedDelivery: { id: string };

  MakeList: {
    offer_list_id: 'list' | number;
    size: string;
    price?: number;
    edit?: boolean;
    sale_storage_ref?: string;
  };
  SellReview: {
    offer_list_id: 'list' | number;
    size?: string;
    edit?: boolean;
    price?: number;
    expiration?: number;
    sale_storage_ref?: string;
  };
  ConsignReview: {
    size: string;
  };
  ConfirmedSale: { id: string };
  ConfirmedList: { id: number };
  ConfirmedConsignment: { id: string };
};
