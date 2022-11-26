import React from 'react';

import { Box } from 'app/components/base';
import { BoxProps } from 'app/components/base/Box';

const ListItem = (props: BoxProps) => (
  <Box my={2} flexDirection="row" justifyContent="space-between" alignItems="center" {...props} />
);

export default ListItem;
