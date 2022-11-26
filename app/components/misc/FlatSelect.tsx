import React, { createRef } from 'react';

import { useWindowDimensions, LayoutChangeEvent, ScrollView } from 'react-native';
import { ButtonBase, Text, Box } from 'app/components/base';
import { BoxProps } from 'app/components/base/Box';

type ItemType = { name: string; value?: any };
const scrollViewRef = createRef<ScrollView>();

const FlatSelect = ({
  items = [],
  selected,
  onSelect,
  ...props
}: {
  items?: ItemType[];
  onSelect: (_: string | any) => void;
  selected: string | string[];
} & BoxProps) => {
  const { width } = useWindowDimensions();
  const isMultiSelect = Array.isArray(selected);

  const isSelected = (item: ItemType) =>
    isMultiSelect
      ? selected.includes(item.value || item.name)
      : (item.value || item.name) === selected;
  const getColor = (item: ItemType) => (isSelected(item) ? 'blue' : 'black2');

  const select = (item: ItemType) => {
    if (!isSelected(item)) {
      onSelect(isMultiSelect ? [...selected, item.value || item.name] : item.value || item.name);
    } else {
      onSelect(isMultiSelect ? selected.filter((s) => s !== (item.value || item.name)) : null);
    }
  };

  const scrollIntoView = ({ nativeEvent }: LayoutChangeEvent, item: ItemType) => {
    const { x } = nativeEvent.layout;
    if (isSelected(item) && x > width - 50 && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x, animated: true });
    }
  };

  return (
    <ScrollView horizontal ref={scrollViewRef} showsHorizontalScrollIndicator={false}>
      <Box flexDirection="row" {...props}>
        {items.map((item, i) => (
          <ButtonBase
            key={i}
            onPress={() => select(item)}
            onLayout={(ev) => scrollIntoView(ev, item)}
          >
            <Box
              px={3}
              mr={3}
              borderWidth={1}
              borderRadius={4}
              borderColor={getColor(item)}
              style={{ paddingVertical: 5 }}
            >
              <Text color={getColor(item)} fontSize={2} textTransform="uppercase">
                {item.name}
              </Text>
            </Box>
          </ButtonBase>
        ))}
      </Box>
    </ScrollView>
  );
};

export default FlatSelect;
