export type CurrencyConstantType = {
  id: number;
  filterPrices: number[];
  deliveryInsurancePrecision: number;
  deliveryInsuranceMaxFree: number;
  offerPriceMax: number;

  // Referrer -> referral giver
  // Referee -> referral receiver
  refereeDiscountValue: number;
  refereeDiscountMinBuy: number;

  powerSellerLevelSalesValues: number[];
};

type PowerSellerPayoutType = {
  payoutThresholdTier3: number;
  payoutThresholdTier4: number;
};

const PAYMENT_PROCESSING_FEES_SELLING = 0.03;
const DELIVERY_PROTECTION_FEE_BUYING = 0.03;

const commonFilterPrices = [100, 200, 300, 400, 500, 600];

const CURRENCY_CONSTANTS: {
  SGD: CurrencyConstantType;
  USD: CurrencyConstantType;
  MYR: CurrencyConstantType;
  HKD: CurrencyConstantType;
  AUD: CurrencyConstantType;
  IDR: CurrencyConstantType;
  JPY: CurrencyConstantType;
  NZD: CurrencyConstantType;
  EUR: CurrencyConstantType;
  TWD: CurrencyConstantType;
  CNY: CurrencyConstantType;
  [key: string]: CurrencyConstantType;
} = {
  SGD: {
    id: 1,
    filterPrices: commonFilterPrices,
    deliveryInsurancePrecision: 1,
    deliveryInsuranceMaxFree: 100,
    offerPriceMax: 100000,

    refereeDiscountValue: 20,
    refereeDiscountMinBuy: 150,

    powerSellerLevelSalesValues: [
      4800, 7200, 9600, 12000, 14400, 18000, 24000, 32000, 40000, 48000, 60000, 72000, 96000,
      120000, 160000, 240000, 360000, 480000, 720000, 960000, 1200000,
    ],
  },
  USD: {
    id: 2,
    filterPrices: commonFilterPrices,
    deliveryInsurancePrecision: 1,
    deliveryInsuranceMaxFree: 30,
    offerPriceMax: 80000,

    refereeDiscountValue: 15,
    refereeDiscountMinBuy: 100,

    powerSellerLevelSalesValues: [
      3500, 5300, 7100, 8900, 10600, 13300, 17700, 23600, 29500, 35400, 44300, 53100, 70900, 88600,
      118100, 177100, 265700, 354300, 531400, 708500, 885700,
    ],
  },
  MYR: {
    id: 3,
    filterPrices: [300, 600, 900, 1200, 1500, 1800],
    deliveryInsurancePrecision: 1,
    deliveryInsuranceMaxFree: 150,
    offerPriceMax: 300000,

    refereeDiscountValue: 60,
    refereeDiscountMinBuy: 450,
    powerSellerLevelSalesValues: [
      15000, 22500, 30000, 37500, 45000, 56300, 75100, 100100, 125100, 150100, 187700, 225200,
      300200, 375300, 500400, 750600, 1125900, 1501200, 2251800, 3002400, 3753000,
    ],
  },
  HKD: {
    id: 4,
    filterPrices: [500, 1000, 1500, 2000, 2500, 3000],
    deliveryInsurancePrecision: 1,
    deliveryInsuranceMaxFree: 200,
    offerPriceMax: 500000,

    refereeDiscountValue: 100,
    refereeDiscountMinBuy: 750,

    powerSellerLevelSalesValues: [
      27600, 41400, 55100, 68900, 82700, 103400, 137900, 183800, 229800, 275700, 344700, 413600,
      551500, 689300, 919100, 1378600, 2067900, 2757300, 4135900, 5514500, 6893200,
    ],
  },
  AUD: {
    id: 5,
    filterPrices: commonFilterPrices,
    deliveryInsurancePrecision: 1,
    deliveryInsuranceMaxFree: 50,
    offerPriceMax: 100000,

    refereeDiscountValue: 20,
    refereeDiscountMinBuy: 150,
    powerSellerLevelSalesValues: [
      4800, 7200, 9600, 12000, 14400, 18000, 24000, 32000, 40100, 48100, 60100, 72100, 96100,
      120200, 160200, 240300, 360500, 480700, 721000, 961400, 1201700,
    ],
  },
  IDR: {
    id: 6,
    filterPrices: [1, 2, 3, 4, 5, 6].map((n) => n * 1000000),
    deliveryInsurancePrecision: 1000,
    deliveryInsuranceMaxFree: 0,
    offerPriceMax: 1000000000,

    refereeDiscountValue: 200000,
    refereeDiscountMinBuy: 1500000,
    powerSellerLevelSalesValues: [
      50900000, 76300000, 101800000, 127200000, 152700000, 190800000, 254400000, 339200000,
      424100000, 508900000, 636100000, 763300000, 1017700000, 1272200000, 1696200000, 2544300001,
      3816500000, 5088600000, 7633000000, 10177300000, 12721600000,
    ],
  },
  JPY: {
    id: 7,
    filterPrices: [10000, 20000, 30000, 40000, 50000, 60000],
    deliveryInsurancePrecision: 100,
    deliveryInsuranceMaxFree: 5000,
    offerPriceMax: 8000000,

    refereeDiscountValue: 2000,
    refereeDiscountMinBuy: 10000,
    powerSellerLevelSalesValues: [
      388200, 582400, 776500, 970600, 1164700, 1455900, 1941200, 2588300, 3235400, 3882500, 4853100,
      5823700, 7765000, 9706200, 12941600, 19412500, 29118700, 38824900, 58237400, 77649900,
      97062400,
    ],
  },
  NZD: {
    id: 8,
    filterPrices: [75, 100, 150, 200, 250, 300],
    deliveryInsurancePrecision: 1,
    deliveryInsuranceMaxFree: 50,
    offerPriceMax: 100000,

    refereeDiscountValue: 20,
    refereeDiscountMinBuy: 150,
    powerSellerLevelSalesValues: [
      5000, 7500, 10100, 12600, 15100, 18900, 25100, 33500, 41900, 50300, 62900, 75400, 100600,
      125700, 167700, 251500, 377200, 503000, 754500, 1005900, 1257400,
    ],
  },
  EUR: {
    id: 9,
    filterPrices: [50, 100, 150, 200, 250, 300],
    deliveryInsurancePrecision: 1,
    deliveryInsuranceMaxFree: 30,
    offerPriceMax: 100000,

    refereeDiscountValue: 20,
    refereeDiscountMinBuy: 100,
    powerSellerLevelSalesValues: [
      3000, 4500, 6000, 7500, 9000, 11300, 15000, 20000, 25000, 30000, 37500, 45000, 60100, 75100,
      100100, 150200, 225200, 300300, 450500, 600600, 750800,
    ],
  },
  TWD: {
    id: 10,
    filterPrices: [300, 500, 1000, 2000, 2500, 5000],
    deliveryInsurancePrecision: 1,
    deliveryInsuranceMaxFree: 1000,
    offerPriceMax: 2000000,

    refereeDiscountValue: 415,
    refereeDiscountMinBuy: 3000,
    powerSellerLevelSalesValues: [
      98600, 147900, 197100, 246400, 295700, 369600, 492800, 657100, 821400, 985700, 1232100,
      1478500, 1971400, 2464200, 3285700, 4928500, 7392700, 9857000, 14785400, 19713900, 24642400,
    ],
  },
  CNY: {
    id: 11,
    filterPrices: [500, 1000, 1500, 2000, 2500, 3000],
    deliveryInsurancePrecision: 1,
    deliveryInsuranceMaxFree: 100,
    offerPriceMax: 500000,

    refereeDiscountValue: 100,
    refereeDiscountMinBuy: 800,
    powerSellerLevelSalesValues: [
      27600, 41400, 55100, 68900, 82700, 103400, 137900, 183800, 229800, 275700, 344700, 413600,
      551500, 689300, 919100, 1378600, 2067900, 2757300, 4135900, 5514500, 6893200,
    ],
  },
};
const getFilterPrices = (currencyCode: string) => CURRENCY_CONSTANTS[currencyCode].filterPrices;

const getDeliveryInsurancePrecision = (currencyCode: string) =>
  CURRENCY_CONSTANTS[currencyCode].deliveryInsurancePrecision;

const POWER_SELLER_EXPEDITED_PAYOUT_THRESHOLD: {
  SGD: PowerSellerPayoutType;
  USD: PowerSellerPayoutType;
  MYR: PowerSellerPayoutType;
  HKD: PowerSellerPayoutType;
  AUD: PowerSellerPayoutType;
  IDR: PowerSellerPayoutType;
  JPY: PowerSellerPayoutType;
  NZD: PowerSellerPayoutType;
  EUR: PowerSellerPayoutType;
  TWD: PowerSellerPayoutType;
  [key: string]: PowerSellerPayoutType;
} = {
  SGD: {
    payoutThresholdTier3: 1000,
    payoutThresholdTier4: 0,
  },
  USD: {
    payoutThresholdTier3: 750,
    payoutThresholdTier4: 0,
  },
  MYR: {
    payoutThresholdTier3: 3200,
    payoutThresholdTier4: 0,
  },
  HKD: {
    payoutThresholdTier3: 6000,
    payoutThresholdTier4: 0,
  },
  AUD: {
    payoutThresholdTier3: 1050,
    payoutThresholdTier4: 0,
  },
  IDR: {
    payoutThresholdTier3: 11000000,
    payoutThresholdTier4: 0,
  },
  JPY: {
    payoutThresholdTier3: 82000,
    payoutThresholdTier4: 0,
  },
  NZD: {
    payoutThresholdTier3: 1100,
    payoutThresholdTier4: 0,
  },
  EUR: {
    payoutThresholdTier3: 650,
    payoutThresholdTier4: 0,
  },
  TWD: {
    payoutThresholdTier3: 21000,
    payoutThresholdTier4: 0,
  },
  CNY: {
    payoutThresholdTier3: 6000,
    payoutThresholdTier4: 0,
  },
};

export {
  PAYMENT_PROCESSING_FEES_SELLING,
  DELIVERY_PROTECTION_FEE_BUYING,
  CURRENCY_CONSTANTS,
  POWER_SELLER_EXPEDITED_PAYOUT_THRESHOLD,
  getFilterPrices,
  getDeliveryInsurancePrecision,
};
