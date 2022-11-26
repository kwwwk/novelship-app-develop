import React from 'react';

import theme from 'app/styles/theme';
import { WINDOW_WIDTH } from 'common/constants';
import Box, { BoxProps } from '../base/Box';

const Footer: React.FunctionComponent<BoxProps> = (props) => (
  <Box width={WINDOW_WIDTH}>
    <Box
      justifyContent="center"
      alignContent="center"
      minHeight={theme.constants.LAYOUT_BAR_ELEMENT_LARGE_HEIGHT}
      borderColor="gray7"
      borderTopWidth={1}
      px={5}
      pt={3}
      pb={4}
      {...props}
    />
  </Box>
);

export default Footer;
