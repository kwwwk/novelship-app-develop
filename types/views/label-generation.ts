type ShippingMethodType = 'drop-off' | 'pickup' | typeof undefined;
type ShippingScreenType = 'shipping-method' | 'pickup-info' | 'drop-off-info' | 'confirmation';

type ShippingPayloadType = {
  pickup_date?: Date | string;
  pickup_time?: string;
  pickup_start_time?: string;
  pickup_end_time?: string;
  location_id?: number;
  district?: string;
  bluPort_id?: string;
  bluPort_locker_size?: string;
};

type ShippingGenerateConfigType = {
  method: 'seller-generate';
  startScreen: number;
  pickupCourier: 'JANIO' | 'GDEX' | 'NINJAVAN';
  dropOffCourier?: 'BLUPORT' | 'NINJAVAN';
  defaultMethod?: ShippingMethodType;
};

type ShippingConfigMethodType = 'automated' | 'seller-generate' | 'manual';

type ShippingConfigType = {
  method: ShippingConfigMethodType;
  couriers?: string[];
  processingCountry?: string;
  sellerType?: string;
  startScreen?: number;
  defaultMethod?: 'pickup';
  pickupCourier?: 'GDEX' | 'NINJAVAN';
  dropOffCourier?: 'NINJAVAN';
  selection?: Array<'single' | 'bulk'>;
  bulkItemLimit?: number;
};

type ShippingCountryMethodsType = {
  [key in ShippingConfigMethodType]?: ShippingConfigType;
};

const defaultShippingConfig: ShippingConfigType = {
  method: 'manual',
  couriers: ['Others'],
  selection: ['single'],
};
const defaultCountryShippingMethods: ShippingCountryMethodsType = { manual: defaultShippingConfig };

export { defaultShippingConfig, defaultCountryShippingMethods };
export type {
  ShippingConfigType,
  ShippingCountryMethodsType,
  ShippingGenerateConfigType,
  ShippingMethodType,
  ShippingPayloadType,
  ShippingScreenType,
};
