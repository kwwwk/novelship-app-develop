import { OfferListType } from 'types/resources/offerList';
import { ProductType } from 'types/resources/product';
import { PromocodeType } from 'types/resources/promocode';
import { TransactionType } from 'types/resources/transaction';

import { HighLowOfferListsType, getHighLowOfferList } from 'common/utils/offerLists';
import { AlgoliaParams } from 'app/store/views/search';
import { LastSalesPricesForSizeType } from 'app/screens/product/context';
import { AppEventsLogger } from 'react-native-fbsdk-next';

export type TrackingProperties = { [key: string]: string | number | boolean | typeof undefined };

export type BuyOfferTrxnType = TransactionType & OfferListType & any;

const titleCase = (str: string) =>
  str
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substr(1))
    .join(' ');

const mapProductForTracking = (product: ProductType) => ({
  'Product ID': product.id,
  Name: product.name,
  Brand: product.main_brand,
  Category: product.class,
});

const mapBrowseForTracking = (params: AlgoliaParams) => ({
  Brand: params.filter?.category_level_1 || undefined,
  Category: params.filter?.class || undefined,
  // Collection: params.filter?.collection || undefined,
  Page: (params.page || 0) + 1,
  Sort: params.sort,
  Color: params.filter?.main_color.join(', ') || undefined,
  'Release Year': params.filter?.drop_year || undefined,
  'Size Type': params.filter?.gender.join(', ') || undefined,
});

const mapOfferListLogDataForTracking = ({
  offerList,
  offerLists,
  highLowOfferLists,
  lastSalesPricesForSize,
}: {
  offerList: OfferListType;
  offerLists: OfferListType[];
  highLowOfferLists: HighLowOfferListsType;
  lastSalesPricesForSize: LastSalesPricesForSizeType[];
}): TrackingProperties => {
  const { highestOffer, lowestList } = getHighLowOfferList(highLowOfferLists, offerList.size);
  const sizeOfferList = offerLists.filter((ol) => ol.size === offerList.size);
  const offerCount = sizeOfferList.filter((ol) => ol.type === 'buying').length;
  const listCount = sizeOfferList.filter((ol) => ol.type === 'selling').length;

  const properties = {
    'Price (SGD)': offerList.price,
    'Offer/List ID': offerList.id,
    'User ID': offerList.user_id,
    'Highest Offer Price': highestOffer.price || undefined,
    'Lowest List Price': lowestList.price || undefined,
    'Last Sale Price 1': lastSalesPricesForSize[0]?.base_price || undefined,
    'Last Sale Price 2': lastSalesPricesForSize[1]?.base_price || undefined,
    'Last Sale Price 3': lastSalesPricesForSize[2]?.base_price || undefined,
    'Offer Count': offerCount,
    'List Count': listCount,
  };

  return properties;
};

const mapEditOptionForTracking = {
  beatLowestListByValue: `Beat Lowest List`,
  decreaseByValue: `Decrease List Price`,
  setToValue: `New List Price`,
  increaseByValue: `Increase List Price`,
};

const getBuyItem = (
  buy: BuyOfferTrxnType
): {
  item_variant?: string;
  item_category5?: 'Offer' | 'Purchase';
  price: number;
} => {
  const productPrice = buy.local_price || buy.offer_price_local || 0;

  return {
    ...(buy?.size && { item_variant: buy.size }),
    price: productPrice,
  };
};

const getProductItem = (product: ProductType) => ({
  item_brand: product.main_brand || '',
  item_category: product.class || '',
  item_category2: String(product.category) || '',
  item_id: String(product.id) || '',
  item_list_id: product.sku || '',
  item_list_name: product.sku || '',
  item_name: product.name || '',
  quantity: 1,
});

const getPromocodeInfo = (promocode: PromocodeType) => ({
  creative_name: String(promocode.description),
  promotion_id: String(promocode.id),
  promotion_name: String(promocode.description),
  creative_slot: '',
  location_id: '',
});

const mapDynamicAdsPixelEvent = {
  AddToCart: AppEventsLogger.AppEvents.AddedToCart,
  Purchase: 'Purchase',
  ViewContent: AppEventsLogger.AppEvents.ViewedContent,
};

export {
  mapOfferListLogDataForTracking,
  titleCase,
  mapProductForTracking,
  mapBrowseForTracking,
  mapEditOptionForTracking,
  getProductItem,
  getBuyItem,
  getPromocodeInfo,
  mapDynamicAdsPixelEvent,
};
