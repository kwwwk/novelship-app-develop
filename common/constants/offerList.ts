import { partialMatcher } from 'common/utils/string';

const validOfferListsFilter = {
  'status:in': 'live,vacation',
  'stock_count:gt': 0,
};

const productSkuSearchFilter = (search: string) =>
  search
    ? {
        [encodeURIComponent('product.name|product.sku|product.class:likeLower')]:
          partialMatcher(search),
      }
    : {};

export default validOfferListsFilter;
export { productSkuSearchFilter };
