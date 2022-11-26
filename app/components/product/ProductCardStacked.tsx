import { ProductType } from 'types/resources/product';

import * as React from 'react';

import { AlgoliaIndices } from 'app/services/algolia';

import { ProductCard } from '.';
import { Box } from '../base';

const ProductCardStacked = ({
  product,
  section,
  index,
  sort,
  ...props
}: {
  product: ProductType;
  section?: string;
  index: number;
  sort?: keyof typeof AlgoliaIndices;
}) => (
  <Box width="50%" {...props}>
    <ProductCard
      borderLeftWidth={index % 2 === 1 ? 0 : 1}
      style={{ marginTop: -1 }}
      sort={sort || 'search'}
      styleName="search"
      product={product}
      section={section}
      index={index}
    />
  </Box>
);

export default ProductCardStacked;
