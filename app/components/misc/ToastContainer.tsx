import React from 'react';
import { ToastConfig as config } from 'react-native-toast-message';

import { Box, Text } from 'app/components/base';
import { WINDOW_WIDTH } from 'common/constants';

const ToastConfig: config = {
  default: ({ text1 }) => (
    <Box
      center
      maxWidth={WINDOW_WIDTH - 26}
      px={5}
      py={3}
      borderRadius={6}
      bg="gray1"
      opacity={0.9}
    >
      <Text fontSize={1} color="white" textAlign="center">
        {text1}
      </Text>
    </Box>
  ),
};

export default ToastConfig;
