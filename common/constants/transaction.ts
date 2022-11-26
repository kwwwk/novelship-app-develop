import {
  defaultCountryShippingMethods,
  ShippingCountryMethodsType,
} from 'types/views/label-generation';
import { t } from '@lingui/macro';
import { i18n } from '@lingui/core';
import { TransactionType } from 'types/resources/transaction';
import { UserType } from 'types/resources/user';
import envConstants from 'app/config';
import { TransactionSellerType } from 'types/resources/transactionSeller';

// mirrors api/sale/sale.constants.js

type SALE_STATUS_TYPE = {
  status: TransactionType['status'];
  buy: string;
  sell: string;
  buy_group: string;
  sell_group: string;
  deliver_to?: 'storage';
};

const SALE_STATUS: SALE_STATUS_TYPE[] = [
  {
    status: 'pending',
    buy: 'Payment Pending',
    sell: '',
    buy_group: 'in_progress',
    sell_group: 'hidden',
  },
  {
    status: 'payment_failed',
    buy: 'Payment Failed',
    sell: '',
    buy_group: 'failed',
    sell_group: 'hidden',
  },
  {
    status: 'confirmed',
    buy: 'Waiting for seller to ship',
    sell: 'Pending your shipment',
    buy_group: 'in_progress',
    sell_group: 'in_progress',
  },
  {
    status: 'shipping',
    buy: 'Seller Shipped Out',
    sell: 'Shipping To Novelship',
    buy_group: 'in_progress',
    sell_group: 'in_progress',
  },
  {
    status: 'shipping_arrived',
    buy: 'Arrived For Authentication',
    sell: 'Arrived For Authentication',
    buy_group: 'in_progress',
    sell_group: 'in_progress',
  },
  {
    status: 'authenticating',
    buy: 'Authenticating',
    sell: 'Authenticating',
    buy_group: 'in_progress',
    sell_group: 'in_progress',
  },
  {
    status: 'shipping_transferring',
    buy: 'Authenticating',
    sell: 'Authenticated',
    buy_group: 'in_progress',
    sell_group: 'completed',
  },
  {
    status: 'to_storage',
    buy: 'Authenticating',
    sell: 'Authenticated',
    buy_group: 'in_progress',
    sell_group: 'in_progress',
  },
  {
    status: 'in_storage',
    buy: 'Product In Storage',
    sell: 'Authenticated',
    buy_group: 'completed',
    sell_group: 'completed',
    deliver_to: 'storage',
  },
  {
    status: 'in_storage_to_deliver',
    buy: 'Delivery Requested',
    sell: 'Authenticated',
    buy_group: 'completed',
    sell_group: 'completed',
    deliver_to: 'storage',
  },
  {
    status: 'in_storage_sold',
    buy: 'Sold From Storage',
    sell: 'Authenticated',
    buy_group: 'completed',
    sell_group: 'completed',
    deliver_to: 'storage',
  },
  {
    status: 'to_inventory',
    buy: 'Authenticating',
    sell: 'Authenticated',
    buy_group: 'in_progress',
    sell_group: 'in_progress',
  },
  {
    status: 'to_complete',
    buy: 'Authenticating',
    sell: 'Authenticated',
    buy_group: 'in_progress',
    sell_group: 'in_progress',
  },
  {
    status: 'in_inventory',
    buy: 'Product In Storage',
    sell: 'Authenticated',
    buy_group: 'completed',
    sell_group: 'completed',
    deliver_to: 'storage',
  },
  {
    status: 'to_inventory_store',
    buy: 'Authenticating',
    sell: 'Authenticated',
    buy_group: 'in_progress',
    sell_group: 'completed',
  },
  {
    status: 'to_inventory_deliver',
    buy: 'Authenticating',
    sell: 'Authenticated',
    buy_group: 'in_progress',
    sell_group: 'completed',
  },
  {
    status: 'to_deliver',
    buy: 'Authenticating',
    sell: 'Authenticated',
    buy_group: 'in_progress',
    sell_group: 'in_progress',
  },
  {
    status: 'delivering',
    buy: 'Delivering To You',
    sell: 'Authenticated',
    buy_group: 'in_progress',
    sell_group: 'completed',
  },
  {
    status: 'completed',
    buy: 'Delivered',
    sell: 'Authenticated',
    buy_group: 'completed',
    sell_group: 'completed',
  },
  {
    status: 'buy_failed',
    buy: 'Order Canceled',
    sell: 'Sale Canceled',
    buy_group: 'failed',
    sell_group: 'canceled',
  },
  {
    status: 'qc_fail_decision',
    buy: 'Authenticating',
    sell: 'Authenticating',
    buy_group: 'in_progress',
    sell_group: 'in_progress',
  },
  {
    status: 'sell_failed',
    buy: 'Order Canceled',
    sell: 'Sale Canceled',
    buy_group: 'canceled',
    sell_group: 'failed',
  },

  // deprecated
  {
    // @ts-ignore deprecated
    status: 'failed',
    buy: 'Order Canceled',
    sell: 'Sale Canceled',
    buy_group: 'failed',
    sell_group: 'failed',
  },
  {
    // @ts-ignore deprecated
    status: 'canceled',
    buy: 'Order Canceled',
    sell: 'Sale Canceled',
    buy_group: 'failed',
    sell_group: 'failed',
  },
];

const filterStatuses = (filter: (s: SALE_STATUS_TYPE) => boolean) =>
  SALE_STATUS.filter(filter).map((s) => s.status);

const SALE_STATUS_FAILED = filterStatuses(
  (s) => s.buy_group === 'failed' || s.sell_group === 'failed'
);

const progressStatuses = ['confirmed', 'in_progress', 'completed'];

const SALE_SELLER_STATUS_PROGRESS = [
  ...new Set(
    SALE_STATUS.filter((s) => s.sell && progressStatuses.includes(s.sell_group)).map((s) => s.sell)
  ),
];

const SALE_BUYER_STATUS_PROGRESS = [
  ...new Set(
    SALE_STATUS.filter(
      (s) => s.buy && progressStatuses.includes(s.buy_group) && s.deliver_to !== 'storage'
    ).map((s) => s.buy)
  ),
];

const SALE_BUYER_STATUS_PROGRESS_STORAGE = [
  ...new Set(
    SALE_STATUS.filter((s) => s.buy && progressStatuses.includes(s.buy_group)).map((s) => s.buy)
  ),
];

const SALE_STATUS_IN_STORAGE = ['in_storage', 'in_storage_sold'];

const SALE_STATUS_BUYER_DELIVERY_PROTECTION_AVAILABLE: string[] = filterStatuses(
  (s) => s.buy_group === 'in_progress'
).filter((p) => p !== 'pending');

const SALE_STATUS_BUYER_TO_STORAGE_AVAILABLE: string[] = ['confirmed', 'shipping'];

const SALE_STATUS_MAP = SALE_STATUS.reduce(
  (prev, curr) => {
    prev[curr.status] = curr;
    return prev;
  },
  {} as {
    [status: string]: SALE_STATUS_TYPE;
  }
);

const PAYOUT_STATUS = [
  {
    status: 'pending',
    msg: 'Payout Pending',
  },
  {
    status: 'ready',
    msg: 'Payout Ready',
  },
  {
    status: 'requested',
    msg: 'Payout Requested',
  },
  {
    status: 'expedited_requested',
    msg: 'Expedited Payout Requested',
  },
  {
    status: 'processed',
    msg: 'Payout Processed',
  },
  {
    status: 'bounced',
    msg: 'Payout Bounced',
  },
  {
    status: 're_requested',
    msg: 'Re-Payout Requested',
  },
  {
    status: 're_processed',
    msg: 'Re-Payout Processed',
  },
  {
    status: 'canceled',
    msg: 'Payout Canceled',
  },
];

const PAYOUT_STATUS_MAP = PAYOUT_STATUS.reduce(
  (prev, curr) => {
    prev[curr.status] = curr;
    return prev;
  },
  {} as {
    [status: string]: {
      status: string;
      msg: string;
    };
  }
);

const APPEAL_STATUSES = {
  appeal_pending: undefined,
  penalty_accepted: t`Penalty Accepted`,
  'penalty_accepted-auto': t`Penalized`,
  appealed: t`Pending Appeal Review`,
  appeal_accepted: t`Penalty Waived`,
  appeal_declined: t`Penalized`,
  'appeal_declined-auto': t`Penalized`,
};

const getSaleStatus = (sale: TransactionType, mode: string): string => {
  if (sale?.status) {
    if (sale.status === 'sell_failed' && sale.penalty_appeal_status) {
      return i18n._(APPEAL_STATUSES[sale.penalty_appeal_status] || t`Sale Canceled`);
    }
    if (sale.is_list_from_storage) return i18n._(t`Listed From Storage`);
    return SALE_STATUS_MAP[sale.status][mode.replace('ing', '') as 'sell' | 'buy'];
  }
  return '';
};

const getPayoutStatus = (sale: TransactionType, mode: string): string =>
  sale?.status
    ? getSaleStatus(sale, mode) === 'Authenticated' &&
      mode.includes('sell') &&
      sale.type === 'transaction'
      ? PAYOUT_STATUS_MAP[sale.payout_status].msg
      : ''
    : '';

const canBuyActions = (user: UserType) =>
  user.hasDelivery && user.phone && user.email && user.country.buying_enabled;

const canCreateList = (user: UserType) =>
  user.phone &&
  user.email &&
  user.hasPayout &&
  user.hasSellCard &&
  user.hasSellingAddress &&
  user.shipping_country_id &&
  user.shipping_country.selling_enabled;

const getShippingDoc = (ref: string, type: 'instruction' | 'label' | 'invoice' = 'instruction') =>
  `${envConstants.API_URL_PRIMARY}sales/${ref}/shipping-${type}`;

const getBulkShippingDoc = (sale_ref: string, user_ref: string) =>
  `${envConstants.API_URL_PRIMARY}sales/${user_ref}/${sale_ref}/bulk-shipping-instruction`;

const canCreateLabel = (sale: TransactionType) =>
  sale.status === 'confirmed' && sale.seller_country.shortcode === 'SG';

function getAvailableShippingMethods(
  trxnSeller: TransactionSellerType,
  sellerType: string | typeof undefined
): ShippingCountryMethodsType {
  if (!trxnSeller) return defaultCountryShippingMethods;
  if (!trxnSeller.seller_country) return defaultCountryShippingMethods;

  const countryShippingConfig = trxnSeller.seller_country.shipping_config.reduce((prev, curr) => {
    if (
      curr.processingCountry &&
      curr.processingCountry !== trxnSeller.processing_country.shortcode
    ) {
      return prev;
    }

    if (curr.sellerType && curr.sellerType !== sellerType) {
      return prev;
    }

    if (prev[curr.method]) {
      return prev;
    }

    prev[curr.method] = curr;
    return prev;
  }, {} as ShippingCountryMethodsType);

  if (!Object.keys(countryShippingConfig).length) return defaultCountryShippingMethods;

  return countryShippingConfig;
}

export {
  canBuyActions,
  canCreateLabel,
  canCreateList,
  getPayoutStatus,
  getSaleStatus,
  getShippingDoc,
  getBulkShippingDoc,
  getAvailableShippingMethods,
  SALE_BUYER_STATUS_PROGRESS,
  SALE_BUYER_STATUS_PROGRESS_STORAGE,
  SALE_SELLER_STATUS_PROGRESS,
  SALE_STATUS_FAILED,
  SALE_STATUS_IN_STORAGE,
  SALE_STATUS_BUYER_DELIVERY_PROTECTION_AVAILABLE,
  SALE_STATUS_BUYER_TO_STORAGE_AVAILABLE,
};
