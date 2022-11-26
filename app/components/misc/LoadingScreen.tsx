import React from 'react';

import theme from 'app/styles/theme';
import { Box } from 'app/components/base';
import LoadingIndicator from 'app/components/misc/LoadingIndicator';

const LoadingScreen = () => (
  <Box center flex={1} height="100%" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
    <LoadingIndicator size="large" color={theme.colors.white} />
  </Box>
);

export default LoadingScreen;
