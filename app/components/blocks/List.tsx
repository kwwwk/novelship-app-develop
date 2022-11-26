import React, { useState } from 'react';
import { i18n } from '@lingui/core';

import { Text, Box } from 'app/components/base';
import { t } from '@lingui/macro';

type ListItemType = {
  label: string;
  value: string | string[];
};
const List = ({
  items,
  extraItems = [],
}: {
  items: ListItemType[];
  extraItems?: ListItemType[];
}) => {
  const [more, setMore] = useState(false);
  const listItems = more ? [...items, ...extraItems] : items;

  return (
    <Box>
      {listItems.map(
        ({ label, value }, x) =>
          !!value && (
            <Box
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              borderBottomWidth={1}
              borderBottomColor="dividerGray"
              mt={4}
              pb={3}
              px={1}
              key={x}
            >
              <Text
                color="gray3"
                fontFamily="medium"
                textTransform="uppercase"
                fontSize={2}
                style={{ width: '34%' }}
              >
                {label}
              </Text>
              <Text
                color="gray2"
                fontFamily="medium"
                textTransform="uppercase"
                fontSize={2}
                textAlign="right"
                style={{ width: '62%' }}
              >
                {Array.isArray(value) ? value.filter((v) => !!v).join('\n') : value}
              </Text>
            </Box>
          )
      )}
      {!!extraItems.length && (
        <Text
          p={4}
          fontSize={2}
          fontFamily="medium"
          textDecorationLine="underline"
          textAlign="center"
          onPress={() => setMore((_more) => !_more)}
        >
          {more ? i18n._(t`View Less`) : i18n._(t`View More`)}
        </Text>
      )}
    </Box>
  );
};

export default List;
