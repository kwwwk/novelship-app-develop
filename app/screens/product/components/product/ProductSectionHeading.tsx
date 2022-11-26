import * as React from 'react';
import { TextProps } from 'app/components/base/Text';
import { Text } from 'app/components/base';

const ProductSectionHeading = (props: TextProps) => (
  <Text textAlign="center" fontSize={3} fontFamily="bold" {...props} />
);

export default ProductSectionHeading;
