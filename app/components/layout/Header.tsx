import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import theme from 'app/styles/theme';

import { BoxProps } from '../base/Box';
import { Box } from '../base';

const Header = ({ children, style, ...props }: BoxProps) => {
  const insets = useSafeAreaInsets();

  return (
    <Box
      style={[{ paddingTop: insets.top, backgroundColor: theme.colors.bgBlack }, style]}
      {...props}
    >
      <Box center px={5} height={theme.constants.LAYOUT_BAR_ELEMENT_LARGE_HEIGHT}>
        {children}
      </Box>
    </Box>
  );
};

export default Header;
