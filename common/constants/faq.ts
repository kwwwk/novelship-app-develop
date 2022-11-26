import { defaultLanguage } from 'app/services/language';
import Store from 'app/store';

const Faqs = {
  main: {
    en: 'en-us/',
    id: 'id-id/',
    // my: 'ms-my/categories/900000134246-Pengetahuan',
  },
  sellers_guide: {
    en: 'en-us/articles/900001662763-Seller-s-Guide-to-Novelship-Sell-Now-',
    id: 'id-id/articles/900001788983-Panduan-Penjual-di-Novelship-Jual-Sekarang-',
    // my: 'ms-my/articles/900001800863-Panduan-Penjual-di-Novelship-Jual-Sekarang-',
  },
  buyers_guide: {
    en: 'en-us/articles/900001698146-Buyer-s-Guide-to-Novelship-Buy-Now-',
    id: 'id-id/articles/900001789143-Panduan-Pembeli-di-Novelship-Beli-Sekarang-',
    // my: 'ms-my/articles/900001798766-Panduan-Pembeli-di-Novelship-Beli-Sekarang-',
  },
  listing_guide: {
    en: 'en-us/articles/900001666466-Seller-s-Guide-to-Novelship-Make-A-List-',
    id: 'id-id/articles/900001789103-Panduan-Penjual-di-Novelship-Buat-Listing-',
    // my: 'ms-my/articles/900001800763-Panduan-Penjual-di-Novelship-Buat-Senarai-',
  },
  offer_guide: {
    en: 'en-us/articles/900001698683-Buyer-s-Guide-to-Novelship-Make-Offer-',
    id: 'id-id/articles/900001790023-Panduan-Pembeli-di-Novelship-Membuat-Penawaran-',
    // my: 'ms-my/articles/900001796866-Panduan-Pembeli-di-Novelship-Membuat-Tawaran-',
  },
  selling: {
    en: 'en-us/sections/4409415266201-SELLING',
    id: 'id-id/sections/900000306123-Selling',
    // my: 'ms-my/sections/900000306123-Selling ',
  },
  buying: {
    en: 'en-us/sections/4409439808665-BUYING',
    id: 'id-id/sections/900000306143-Buying',
    // my: 'ms-my/sections/900000306143-Buying',
  },
  loyalty: {
    en: 'en-us/articles/900001699663-Loyalty-Programme',
    id: 'id-id/articles/900001801143-Program-Loyalitas-Novelship',
    // my: 'ms-my/articles/900001801123-Program-Kesetiaan-Novelship',
  },
  seller_rewards: {
    en: 'en-us/articles/900001662883-Seller-Fees-Rewards',
    id: 'id-id/articles/900001799506-Biaya-Keuntungan-Penjual',
    // my: 'ms-my/articles/900001799546-Yuran-Ganjaran-Penjual',
  },
  covid: {
    en: 'en-us/articles/900004852743-Covid-Delays',
  },
  storage: {
    en: 'en-us/articles/900001698406-Novelship-Storage',
    id: 'id-id/articles/900001801543-Gudang-Novelship',
    // my: 'ms-my/articles/900001799746-Penyimpanan-Novelship',
  },
  duty_tax: {
    en: 'en-us/articles/900001699466-Custom-Duties-Tax',
    id: 'id-id/articles/900001801683-Bea-Masuk',
    // my: 'ms-my/articles/900001801663-Cukai-Kastam',
  },
  referral: {
    en: 'en-us/sections/4409439810457-REFERRAL',
  },
  contact_form: {
    en: 'en-us/requests/new',
    id: 'id-id/requests/new',
    'zh-Hant-TW': 'zh-tw/requests/new',
    ja: 'ja/requests/new',
    // todo: add contact form for simplified chinese
    // my: 'ms-my/requests/new',
  },
  delivery_declare: {
    en: 'en-us/articles/900002242963-Protection-Compensation-for-Logistics-Issues',
  },
  size_chart_guide: {
    en: 'en-us/sections/4409439841433-SIZE-GUIDE',
  },
  singles_day_2020: {
    en: 'en-us/articles/900004268843-11-11-SINGLES-DAY-2020',
  },
  black_friday_2020: {
    en: 'en-us/articles/900004596183-BLACK-FRIDAY-2020',
  },
  cyber_monday_2020: {
    en: 'en-us/articles/900004611863',
  },
  year_end_xmas_2020: {
    en: 'en-us/articles/900003828106',
  },
  cny_2021: {
    en: 'en-us/articles/900005301923',
  },
  payout_request: {
    en: 'en-us/articles/900001696886-Payout-Request',
  },
  latest_release: {
    en: 'en-us/articles/900003767966',
  },
  instant_delivery: {
    en: 'en-us/articles/4403096533017-Instant-Delivery',
  },
  sell_from_storage: {
    en: 'en-us/articles/900003679246-Sell-from-Storage',
  },
  power_seller: { en: 'en-us/articles/4405161448857-Novelship-Power-Seller-Program' },
  bulk_shipping: {
    en: 'en-us/articles/4409338032537-Bulk-Shipment-Shipping-Guide',
    ja: 'ja/articles/4409618210457-まとめて出荷-発送ガイド',
    'zh-Hant-TW': 'zh-tw/articles/4409754701977-貨件寄送指南-台灣地區',
  },
  post_purchase_storage: {
    en: 'en-us/articles/900001698406-Novelship-Storage',
  },
  post_purchase_protection: {
    en: 'en-us/articles/900003014223-Why-get-Delivery-Protection-',
  },
  travel_with_ns: {
    en: 'en-us/articles/8663334456473',
  },
};

const currentLanguage = () => Store.getState().language.current;

const getFaqLink = (guide: keyof typeof Faqs) => {
  const FAQ = Faqs[guide] || Faqs.main;
  // @ts-ignore correct usage
  return `https://support.novelship.com/hc/${FAQ[currentLanguage()] || FAQ[defaultLanguage]}`;
};

type FAQ_LINK_TYPES = keyof typeof Faqs;
export type { FAQ_LINK_TYPES };
export default getFaqLink;
