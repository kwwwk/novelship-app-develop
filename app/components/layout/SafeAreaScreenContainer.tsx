import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '../base';
import { BoxProps } from '../base/Box';

const SafeAreaScreenContainer: React.FunctionComponent<BoxProps> = ({ style, ...props }) => {
  const insets = useSafeAreaInsets();
  const marginBottom = Math.max(insets.bottom, 0);

  return <Box style={[{ marginBottom, flex: 1 }, style]} {...props} />;
};

export default SafeAreaScreenContainer;
