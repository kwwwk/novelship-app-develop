import { SearchOptions, SearchResponse } from '@algolia/client-search';
import { RequestOptions } from '@algolia/transporter';
import algoliasearch from 'algoliasearch/lite';

import envConstants from 'app/config';

const client = algoliasearch(envConstants.ALGOLIA.APP_ID, envConstants.ALGOLIA.API_KEY);

const AlgoliaIndices = {
  search: envConstants.ALGOLIA.INDICE,
  mostPopular: `${envConstants.ALGOLIA.INDICE}-most_popular`,
  mostPopularSG: `${envConstants.ALGOLIA.INDICE}-most_popular-sg`,
  mostPopularMY: `${envConstants.ALGOLIA.INDICE}-most_popular-my`,
  mostPopularID: `${envConstants.ALGOLIA.INDICE}-most_popular-id`,
  mostPopularAU: `${envConstants.ALGOLIA.INDICE}-most_popular-au`,
  mostPopularNZ: `${envConstants.ALGOLIA.INDICE}-most_popular-nz`,
  mostPopularTW: `${envConstants.ALGOLIA.INDICE}-most_popular-tw`,
  mostPopularJP: `${envConstants.ALGOLIA.INDICE}-most_popular-jp`,

  latestRelease: `${envConstants.ALGOLIA.INDICE}-latest_release`,
  priceLowToHigh: `${envConstants.ALGOLIA.INDICE}-price_low_to_high`,
  priceHighToLow: `${envConstants.ALGOLIA.INDICE}-price_high_to_low`,

  upcomingReleaseUS: `${envConstants.ALGOLIA.INDICE}-upcoming_release-us`,
  upcomingReleaseSG: `${envConstants.ALGOLIA.INDICE}-upcoming_release-sg`,
  upcomingReleaseTW: `${envConstants.ALGOLIA.INDICE}-upcoming_release-tw`,
  upcomingReleaseJP: `${envConstants.ALGOLIA.INDICE}-upcoming_release-jp`,
  upcomingReleaseID: `${envConstants.ALGOLIA.INDICE}-upcoming_release-id`,
  upcomingReleaseMY: `${envConstants.ALGOLIA.INDICE}-upcoming_release-my`,
};

// Filter Query Reference
// https://www.algolia.com/doc/api-reference/api-parameters/filters/
const AlgoliaClient: {
  [key in keyof typeof AlgoliaIndices]: <TObject>(
    query: string,
    requestOptions?: RequestOptions & SearchOptions
  ) => Readonly<Promise<SearchResponse<TObject>>>;
} = {
  search: client.initIndex(AlgoliaIndices.search).search, // Most Relevant
  mostPopular: client.initIndex(AlgoliaIndices.mostPopular).search,
  mostPopularSG: client.initIndex(AlgoliaIndices.mostPopularSG).search,
  mostPopularMY: client.initIndex(AlgoliaIndices.mostPopularMY).search,
  mostPopularID: client.initIndex(AlgoliaIndices.mostPopularID).search,
  mostPopularAU: client.initIndex(AlgoliaIndices.mostPopularAU).search,
  mostPopularNZ: client.initIndex(AlgoliaIndices.mostPopularNZ).search,
  mostPopularTW: client.initIndex(AlgoliaIndices.mostPopularTW).search,
  mostPopularJP: client.initIndex(AlgoliaIndices.mostPopularJP).search,

  latestRelease: client.initIndex(AlgoliaIndices.latestRelease).search,
  priceLowToHigh: client.initIndex(AlgoliaIndices.priceLowToHigh).search,
  priceHighToLow: client.initIndex(AlgoliaIndices.priceHighToLow).search,

  upcomingReleaseUS: client.initIndex(AlgoliaIndices.upcomingReleaseUS).search,
  upcomingReleaseSG: client.initIndex(AlgoliaIndices.upcomingReleaseSG).search,
  upcomingReleaseTW: client.initIndex(AlgoliaIndices.upcomingReleaseTW).search,
  upcomingReleaseJP: client.initIndex(AlgoliaIndices.upcomingReleaseJP).search,
  upcomingReleaseID: client.initIndex(AlgoliaIndices.upcomingReleaseID).search,
  upcomingReleaseMY: client.initIndex(AlgoliaIndices.upcomingReleaseMY).search,
};

// ? can ProductType be fixed to this client...

const AlgoliaConstants = {
  hitsPerPage: 20,
  clickAnalytics: true,
  enablePersonalization: true,
};

export default AlgoliaClient;
export { AlgoliaIndices, AlgoliaConstants };
