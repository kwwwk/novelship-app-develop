import React from 'react';
import { SafeAreaScreenContainer } from 'app/components/layout';
import SizeChart from './components/product/SizeChart';

const ProductSizeChart = () => (
  <SafeAreaScreenContainer>
    <SizeChart mode="dialog" />
  </SafeAreaScreenContainer>
);

export default ProductSizeChart;
