import { OfferListType } from 'types/resources/offerList';

import { toOffer } from './offer';
import { toList } from './list';

export type HighLowOfferListsType = {
  lowest_listing_price: number | null;
  highest_offer_price: number | null;
  lists: Record<string, OfferListType>;
  instant_lists: Record<string, OfferListType>;
  non_instant_lists: Record<string, OfferListType>;
  offers: Record<string, OfferListType>;
};

// Incoming data is Sorted by Newest => Oldest
// Method overwrites newest with older if price match
// Older List/Offer must sell first
const getHighLowOfferLists = (offerLists: OfferListType[] = [], excludeUserId?: number) =>
  offerLists.reduce(
    (obj: HighLowOfferListsType, ol) => {
      if (ol.user_id && ol.user_id === excludeUserId) return obj;
      // if (ol.variant === 'flash') return obj;
      if (ol.type === 'selling') {
        // set lowest list
        obj.lists[ol.size] = obj.lists[ol.size]
          ? obj.lists[ol.size].price < ol.price
            ? obj.lists[ol.size]
            : ol
          : ol;

        // set lowest list price
        obj.lowest_listing_price = obj.lowest_listing_price
          ? obj.lowest_listing_price < ol.price
            ? obj.lowest_listing_price
            : ol.price
          : ol.price;

        // set lowest instant list
        if (ol.is_instant) {
          obj.instant_lists[ol.size] = obj.instant_lists[ol.size]
            ? obj.instant_lists[ol.size].price < ol.price
              ? obj.instant_lists[ol.size]
              : ol
            : ol;
        } else {
          // set lowest non instant list
          obj.non_instant_lists[ol.size] = obj.non_instant_lists[ol.size]
            ? obj.non_instant_lists[ol.size].price < ol.price
              ? obj.non_instant_lists[ol.size]
              : ol
            : ol;
        }
      } else if (ol.type === 'buying') {
        // set highest offer
        obj.offers[ol.size] = obj.offers[ol.size]
          ? obj.offers[ol.size].price > ol.price
            ? obj.offers[ol.size]
            : ol
          : ol;

        // set highest offer price
        obj.highest_offer_price = obj.highest_offer_price
          ? obj.highest_offer_price > ol.price
            ? obj.highest_offer_price
            : ol.price
          : ol.price;
      }
      return obj;
    },
    {
      highest_offer_price: null,
      lowest_listing_price: null,
      lists: {},
      instant_lists: {},
      non_instant_lists: {},
      offers: {},
    }
  );

const getHighLowOfferList = (highLowOfferLists: HighLowOfferListsType, size: string) => {
  const highestOffer = highLowOfferLists.offers[size] || {};
  const highestOfferPrice = toOffer(highestOffer.price);
  const lowestList = highLowOfferLists.lists[size] || {};
  const lowestListPrice = toList(lowestList.price);

  return { highestOffer, highestOfferPrice, lowestList, lowestListPrice };
};

export { getHighLowOfferLists, getHighLowOfferList };
