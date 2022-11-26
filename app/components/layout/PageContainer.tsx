import React from 'react';

import { Box } from '../base';
import { BoxProps } from '../base/Box';

const PageContainer: React.FunctionComponent<BoxProps> = ({ style, ...props }) => (
  <Box style={[{ paddingHorizontal: 16, marginBottom: 120 }, style]} {...props} />
);

export default PageContainer;
