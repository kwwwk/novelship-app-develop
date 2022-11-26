import theme from 'app/styles/theme';
import React from 'react';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { BoxProps } from 'app/components/base/Box';
import { Box, ButtonBase, Text } from '../base';
import { TextProps } from '../base/Text';

type CounterProps = {
  min?: number;
  max?: number;
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  textProps?: TextProps;
};
const Counter: React.FC<BoxProps & CounterProps> = ({
  min = 0,
  max = 0,
  setCount,
  count,
  textProps,
  ...props
}) => {
  const increment = () => setCount((prev: number) => (prev < max && prev + 1) || max);
  const decrement = () => setCount((prev: number) => (prev > min && prev - 1) || min);

  return (
    <Box flexDirection="row" alignItems="center" {...props}>
      <ButtonBase onPress={decrement}>
        <Ionicon
          name="remove-circle-outline"
          size={24}
          color={(count === min && theme.colors.gray5) || theme.colors.black2}
        />
      </ButtonBase>
      <Text mx={4} {...textProps}>
        {count}
      </Text>
      <ButtonBase onPress={increment}>
        <Ionicon
          name="add-circle-outline"
          size={24}
          color={(count === max && theme.colors.gray5) || theme.colors.black2}
        />
      </ButtonBase>
    </Box>
  );
};
export default React.memo(Counter);
