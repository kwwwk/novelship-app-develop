import searchInsights from 'search-insights';

import envConstants from 'app/config';
import Analytics from 'app/services/analytics';

import { AlgoliaIndices } from './algolia';

searchInsights('init', {
  appId: envConstants.ALGOLIA.APP_ID,
  apiKey: envConstants.ALGOLIA.API_KEY,
});

type AlgoliaInsightsParamsType = {
  name_slug: string;
  position: number;
  objectID: string;
  queryID: string;
  sort: keyof typeof AlgoliaIndices;
};

const AlgoliaInsights = {
  productClickEvents: new Map<string, any>(),

  productClicked: async ({
    name_slug,
    position,
    objectID,
    queryID,
    sort = 'search',
  }: AlgoliaInsightsParamsType) => {
    const userID = await Analytics.mixpanel.getDistinctId();
    const params = {
      userToken: userID ? String(userID) : 'Guest-User',
      positions: [position + 1],
      eventName: 'Product Clicked',
      index: AlgoliaIndices[sort] || AlgoliaIndices.search,
      objectIDs: [objectID],
      queryID,
    };

    AlgoliaInsights.productClickEvents.set(name_slug, params);
    searchInsights('clickedObjectIDsAfterSearch', params);
  },

  productConversion: ({
    name_slug,
    mode,
  }: {
    name_slug: string;
    mode: 'Purchase' | 'Sale' | 'Offer' | 'List' | 'Consignment';
  }) => {
    const { positions, ..._params } = AlgoliaInsights.productClickEvents.get(name_slug) || {};
    if (_params.queryID) {
      const eventName = /(Purchase|Sale)/.test(mode)
        ? `Product ${mode === 'Purchase' ? 'Purchased' : 'Sold'}`
        : `${mode} Created`;

      const params = {
        ..._params,
        eventName,
      };

      searchInsights('convertedObjectIDsAfterSearch', params);
    }
  },

  productWishListed: (name_slug: string) => {
    const { positions, ..._params } = AlgoliaInsights.productClickEvents.get(name_slug) || {};
    if (_params.queryID) {
      const params = {
        ..._params,
        eventName: 'Product Wishlisted',
      };

      searchInsights('convertedObjectIDsAfterSearch', params);
    }
  },
};

export default AlgoliaInsights;
