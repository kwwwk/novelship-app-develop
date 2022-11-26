import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

import { BoxProps } from 'app/components/base/Box';
import { Box } from 'app/components/base';

const Blink = ({ children, ...props }: { children: React.ReactNode[] } & BoxProps) => {
  // eslint-disable-next-line no-param-reassign
  children = children.filter((c) => c);
  const fadeAnimation1 = useRef(new Animated.Value(1)).current;
  const fadeAnimation2 = useRef(new Animated.Value(children.length > 1 ? 0 : 1)).current;

  useEffect(() => {
    if (children.length > 1) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnimation1, {
            toValue: 0,
            duration: 500,
            delay: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnimation2, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnimation2, {
            toValue: 0,
            duration: 500,
            delay: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnimation1, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [fadeAnimation1, fadeAnimation2, children.length]);

  return (
    <Box center height={20} flexDirection="row" style={{ position: 'relative' }} {...props}>
      <Animated.View style={{ opacity: fadeAnimation1, position: 'absolute' }}>
        {children[0]}
      </Animated.View>
      <Animated.View style={{ opacity: fadeAnimation2, position: 'absolute' }}>
        {children[1]}
      </Animated.View>
    </Box>
  );
};

export default Blink;
