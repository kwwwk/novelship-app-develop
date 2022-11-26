import { FeeType, defaultFee } from 'types/resources/fee';
import { CountryType, defaultCountry } from 'types/resources/country';
import { BaseType } from 'types/resources/base';
import { LanguageType } from 'app/services/language';

export interface AddressType {
  firstname: string;
  lastname: string;
  line_1: string;
  line_2: string;
  line_3: string;
  city: string;
  state: string;
  zip: string;
  country_code: string;
  phone: string;
  is_remote_area?: boolean;
  country?: CountryType;
}

const defaultAddress: AddressType = {
  firstname: '',
  lastname: '',
  line_1: '',
  line_2: '',
  line_3: '',
  city: '',
  state: '',
  zip: '',
  country_code: '',
  phone: '',
  is_remote_area: false,
  country: defaultCountry,
};

export type StripeType = {
  id: string;
  brand:
    | 'Visa'
    | 'MasterCard'
    | 'American Express'
    | 'Discover'
    | 'JCB'
    | 'Diners Club'
    | 'Unknown'
    | '';
  exp_month?: number;
  exp_year?: number;
  last4: string;
  customer?: string;
  funding?: string;
  country?: string;
};

type PayoutType = {
  account_type?: string;
  account_number?: string;
  bank_name?: string;
  bank_country?: string;
  dob?: string;
  branch_code?: string;
  bsb_code?: string;
  branch_name?: string;
};

type PowerSellerStatsType = {
  tier?: string;
  tier_last_updated_at?: string | Date;
  current_period_started_at: string | Date;
  penalty_fee_waiver_count?: number;
  return_shipping_fee_waiver_count?: number;
};

export interface SizePreferencesType {
  Sneakers?: {
    category: 'men' | 'women' | 'youth' | 'pre school' | 'toddler' | 'infant';
    unit: 'US' | 'UK' | 'EU' | 'JP';
    brand?: string;
    size: string;
    eu_size: string;
    us_size: string;
  };
  Apparel?: { size: 'XS' | 'S' | 'M' | 'L' | 'XL' };
}

export type ShippingStatsType = {
  to_ship_count: number;
  shipping_count: number;
  unfulfilled_count: number;
  to_ship_delayed_rate: number;
  to_ship_time_avg: number;
  has_to_ship: boolean;
};
export type InterestType = {
  name: string;
  size?: string | boolean;
};

export interface UserType extends BaseType {
  ref: string;

  // Ids
  country: CountryType;
  shipping_stats: ShippingStatsType;
  billing_country: CountryType;
  selling_country: CountryType;
  shipping_country: CountryType;

  country_id?: number;
  billing_country_id?: number;
  selling_country_id?: number;
  shipping_country_id?: number;

  selling_fee_id: number;
  selling_fee: FeeType;

  // Basic Information
  firstname?: string;
  lastname?: string;
  fullname?: string;
  username?: string;
  email: string;
  avatar?: string;

  // deprecated field interests & mappedInterests
  interests: Array<InterestType>;
  mappedInterests: Record<string, string | boolean>;
  size_preferences: SizePreferencesType;
  type?: 'sell' | 'buy' | 'both';
  locale: LanguageType;
  seller_type?: string;

  // Contact Information
  address: AddressType;
  billing_address: AddressType;
  selling_address: AddressType;
  shipping_address: AddressType;
  country_code?: string;
  phone?: string;

  // Social
  facebook?: string;
  google?: string;
  apple?: string;
  instagram?: string;

  // Status Properties
  role?: 'admin';
  email_verified: boolean;
  status: 'active' | 'vacation' | 'banned';

  // Settings
  email_preferences: {
    buyer_new_highest_offer: boolean;
    buyer_new_lowest_list: boolean;
    seller_new_highest_offer: number;
    seller_new_lowest_list: boolean;
    promotions: boolean;
  };
  notification_preferences: {
    email: boolean;
    push: boolean;
    promotions: { push: boolean; email: boolean };
    list_expiring: { push: boolean };
    offer_expiring: { push: boolean };
    sale_updates: { push: boolean };
    buyer_new_lowest_list: { push: boolean; email: boolean };
    seller_new_lowest_list: { push: boolean; email: boolean };
    wishlist_new_lowest_list: { push: boolean; email: boolean };
    wishlist_instant_delivery_available: { push: boolean; email: boolean };
    wishlist_new_highest_offer: { push: boolean };
    buyer_new_highest_offer: { push: boolean; email: boolean };
    seller_new_highest_offer: { push: boolean; email: boolean; threshold: number };
  };
  payout_info: PayoutType;

  // Promos, Credits & Points
  referred_users: number[];
  referral_code: string;
  referred_by?: number;
  promocodes: string[];
  signup_reference?: string;
  registrationId?: string;
  groups: string[];
  points: number;

  // Third Party Integrations
  stripe_buyer: StripeType;
  stripe_seller: StripeType;

  // Campaign & Event Specific
  // raffle: never[];
  // checkin: object[];
  // referral?: object;

  hasBuyCard: boolean;
  hasBuyCardAndEnabled: boolean;
  hasSellCard: boolean;
  hasPayout: boolean;
  hasDelivery: boolean;
  hasSellingAddress: boolean;
  hasShippingAddress: boolean;
  buying_card_disabled: boolean;

  // Power Seller Perks/Stats
  power_seller_stats?: PowerSellerStatsType;

  // client only
  isAdmin?: boolean;
  showPowerSellerFeature?: boolean;
  refereeEligible?: boolean;
  firstTimePromocodeEligible?: boolean;
  otpSent: boolean;
  showTrustpilotWidget: boolean;
  sneakerSize?: string;
  teeSize?: string;
}

const anonymousUser: UserType = {
  id: undefined, // also used to check if user is logged in or not
  ref: '',
  email: '',
  country: defaultCountry,
  shipping_stats: {
    to_ship_count: 0,
    shipping_count: 0,
    unfulfilled_count: 0,
    to_ship_delayed_rate: 0,
    to_ship_time_avg: 0,
    has_to_ship: false,
  },
  billing_country: defaultCountry,
  selling_country: defaultCountry,
  shipping_country: defaultCountry,
  locale: 'en',

  selling_fee_id: 0,
  selling_fee: defaultFee,
  // deprecated field interests & mappedInterests
  interests: [],
  mappedInterests: {},

  size_preferences: {},

  address: defaultAddress,
  billing_address: defaultAddress,
  selling_address: defaultAddress,
  shipping_address: defaultAddress,

  email_verified: false,
  status: 'active',

  stripe_buyer: {
    id: '',
    brand: '',
    last4: '',
  },
  stripe_seller: {
    id: '',
    brand: '',
    last4: '',
  },
  email_preferences: {
    buyer_new_highest_offer: false,
    buyer_new_lowest_list: false,
    seller_new_highest_offer: 85,
    seller_new_lowest_list: false,
    promotions: false,
  },
  notification_preferences: {
    push: false,
    email: true,
    promotions: { push: true, email: true },
    sale_updates: { push: true },
    list_expiring: { push: true },
    offer_expiring: { push: true },
    buyer_new_lowest_list: { push: true, email: true },
    wishlist_new_lowest_list: { push: true, email: true },
    wishlist_instant_delivery_available: { push: true, email: true },
    wishlist_new_highest_offer: { push: true },
    seller_new_lowest_list: { push: true, email: true },
    buyer_new_highest_offer: { push: true, email: true },
    seller_new_highest_offer: { push: true, email: true, threshold: 85 },
  },
  payout_info: {},

  groups: [],
  referred_users: [],
  points: 0,
  promocodes: [],
  referral_code: '',

  // raffle: [],
  // checkin: [],

  hasBuyCard: false,
  hasBuyCardAndEnabled: false,
  hasSellCard: false,
  hasPayout: false,
  hasDelivery: false,
  hasSellingAddress: false,
  hasShippingAddress: false,
  buying_card_disabled: false,
  otpSent: false,
  showTrustpilotWidget: false,
};

export { anonymousUser, defaultAddress };
