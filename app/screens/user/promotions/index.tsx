import React from 'react';
import { Box } from 'app/components/base';
import PromoCodeHeader from './components/PromoCodeHeader';
import PromoCodeTable from './components/PromoCodeTable';

const Promotions = () => (
  <Box flex={1}>
    <PromoCodeHeader />
    <PromoCodeTable />
  </Box>
);

export default Promotions;
