import React from 'react';
import { Image } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';

import theme from 'app/styles/theme';
import { BoxProps } from 'app/components/base/Box';
import { Box, Text, ButtonBase } from 'app/components/base';
import ChevronRight from 'app/components/icons/ChevronRight';

const FilterListItem = ({
  title,
  subTitle,
  selected,
  color,
  hasChildren,
  onPress,
}: {
  title: string;
  subTitle?: string;
  selected?: boolean;
  color?: string;
  hasChildren?: boolean;
  onPress?: () => void;
}) => (
  <ButtonBase onPress={onPress}>
    <Box
      height={64}
      width="100%"
      alignItems="center"
      flexDirection="row"
      justifyContent="space-between"
      borderBottomWidth={1}
      borderBottomColor="dividerGray"
      px={5}
    >
      <Box flexDirection="row" alignItems="center" width="92%">
        {!!color &&
          (title === 'Multi' ? (
            <Image
              source={require('assets/images/graphics/multi-color-background.png')}
              style={{ borderRadius: 100, marginRight: 16 }}
              resizeMode="contain"
              height={24}
              width={24}
            />
          ) : (
            <Box
              borderWidth={title === 'White' ? 1 : 0}
              style={{ backgroundColor: color }}
              borderColor="gray5"
              borderRadius={100}
              height={24}
              width={24}
              mr={4}
            />
          ))}
        <FilterListItemTitle title={title} subTitle={subTitle} selected={selected} />
      </Box>
      {hasChildren ? (
        <ChevronRight />
      ) : selected ? (
        <Ionicon name="ios-checkmark" size={22} color={theme.colors.textBlack} />
      ) : null}
    </Box>
  </ButtonBase>
);

const FilterListItemTitle = ({
  title,
  subTitle,
  selected,
  children,
  ...props
}: {
  title: string;
  subTitle?: string;
  selected?: boolean;
  children?: React.ReactNode;
} & BoxProps) => (
  <Box py={5} {...props}>
    <Text fontSize={2} fontFamily={selected ? 'bold' : 'medium'} textTransform="uppercase">
      {title}
    </Text>
    {!!subTitle && (
      <Text mt={2} fontSize={1} color="gray3" fontFamily="medium" numberOfLines={1}>
        {subTitle}
      </Text>
    )}
    {children}
  </Box>
);

export default FilterListItem;
export { FilterListItemTitle };
