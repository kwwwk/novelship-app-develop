// @flow
import type { ProductClassType } from 'types/resources/product';
import type { ViewedProductType, UserViewedProductType } from 'types/resources/userViewedProduct';
import { ProductClassEnums } from 'types/resources/product';
import { cacheSet, cacheGet, CacheKeyType } from 'app/services/asyncStorage';
import API from 'common/api';
import { isAuthenticated } from 'common/utils/user';
import { uniqBy } from 'common/utils';

class UserViewedProduct {
  cacheKey = `viewed_products_`;

  priorityMap = {
    view: 0,
    'cta-click': 1,
  };

  merge = (viewedProducts: Partial<ViewedProductType>[]): ViewedProductType[] => {
    const cleaned = viewedProducts
      .filter((p) => Number.isInteger(p.product_id))
      .map<ViewedProductType>((p) => ({
        product_id: Number(p.product_id),
        timestamp: Number(p.timestamp) || Date.now(),
      }));

    const sorted = cleaned.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

    return uniqBy(sorted, 'product_id').slice(0, 10);
  };

  async cacheGet(productClass: ProductClassType) {
    const cached = await cacheGet(`${this.cacheKey}${productClass}` as CacheKeyType, []);

    if (Array.isArray(cached)) return cached;

    return this.cacheSet([], productClass);
  }

  cacheSet(viewedProduct: ViewedProductType[], productClass: ProductClassType) {
    return cacheSet(`${this.cacheKey}${productClass}` as CacheKeyType, viewedProduct);
  }

  add(product: { id: number; class: ProductClassType }) {
    const productClass = product.class;

    this.cacheGet(productClass).then((currentViewedProducts) => {
      const mergedViewedProducts = this.merge([
        { product_id: product.id },
        ...currentViewedProducts,
      ]);
      this.cacheSet(mergedViewedProducts, productClass);

      if (isAuthenticated()) {
        API.post<{ results: UserViewedProductType }>('me/viewed-products', {
          products: mergedViewedProducts,
          product_class: productClass,
        }).then(({ results }) => this.cacheSet(results.products, productClass));
      }
    });
  }

  async syncAll() {
    if (!isAuthenticated()) return;

    const cached = ProductClassEnums.map(async (c) => ({
      product_class: c,
      products: await this.cacheGet(c),
    }));
    const products = await Promise.all(cached);

    API.post<{ results: UserViewedProductType[] }>('me/viewed-products/sync', products).then(
      ({ results }) => results.forEach((p) => this.cacheSet(p.products, p.product_class))
    );
  }
}

const UserViewedProductService = new UserViewedProduct();

export default UserViewedProductService;
