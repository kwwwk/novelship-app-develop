import React from 'react';
import theme from 'app/styles/theme';
import { Box, Text } from 'app/components/base';
import { BoxProps } from 'app/components/base/Box';

const ProductCollectionChip = ({
  tagColor,
  tagStyle,
  children,
  ...props
}: { tagColor: string; tagStyle: 'primary' | 'secondary' } & BoxProps) => {
  const isPrimary = tagStyle === 'primary';

  return (
    <Box
      center
      px={4}
      borderRadius={18}
      style={[
        isPrimary
          ? {
              backgroundColor: tagColor,
            }
          : {
              backgroundColor: theme.colors.white,
              borderColor: tagColor,
            },
        {
          paddingVertical: 3,
        },
      ]}
      {...props}
    >
      <Text
        textAlign="center"
        fontFamily="medium"
        textTransform="uppercase"
        fontSize={0}
        lineHeight={13}
        style={{
          color: isPrimary ? theme.colors.white : theme.colors.textBlack,
        }}
      >
        {children}
      </Text>
    </Box>
  );
};

export default ProductCollectionChip;
