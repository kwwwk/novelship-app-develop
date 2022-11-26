import { ProductType, defaultProduct } from './product';

export interface RaffleProductType {
  id: number;
  product_id: number;
  currency_id: number;
  price: number;
  description: string;
  created_at: string;
  updated_at: string;
  start_date: string;
  end_date: string;
  product: ProductType;
  raffle_status: 'upcoming' | 'running' | 'ended';

  description_id: string;
  'description_zh-Hant-TW': string;
  'description_zh-Hans': string;
  description_my: string;
  description_ja: string;

  cta_link: string;
  cta_text: string;
  cta_text_id: string;
  'cta_text_zh-Hant-TW': string;
  'cta_text_zh-Hans': string;
  cta_text_my: string;
  cta_text_ja: string;

  stats: { totalEntries: number };
}

const defaultRaffleProduct: RaffleProductType = {
  id: 0,
  product_id: 0,
  currency_id: 0,
  price: 0,
  description: '',
  created_at: '',
  updated_at: '',
  start_date: '',
  end_date: '',
  product: defaultProduct,
  raffle_status: 'upcoming',

  description_id: '',
  'description_zh-Hant-TW': '',
  'description_zh-Hans': '',
  description_my: '',
  description_ja: '',

  cta_link: '',
  cta_text: '',
  cta_text_id: '',
  'cta_text_zh-Hant-TW': '',
  'cta_text_zh-Hans': '',
  cta_text_my: '',
  cta_text_ja: '',

  stats: { totalEntries: 0 },
};

export { defaultRaffleProduct };
