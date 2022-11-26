import React, { useState } from 'react';
import { i18n } from '@lingui/core';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { Box, ButtonBase, Text } from 'app/components/base';
import { APIQueryParamsType } from 'common/api/query';
import theme from 'app/styles/theme';

type SortSettingType = {
  name: string;
  key: string;
  isDescending?: boolean;
};

const SortFilterActionBar = ({
  sortSettings,
  onSort,
}: {
  sortSettings: SortSettingType[];
  onSort: (_: APIQueryParamsType) => void;
}) => {
  const [settings, changeSettings] = useState<SortSettingType[]>(sortSettings);

  const sort = (setting: SortSettingType) => {
    if (setting.key && onSort) {
      settings.forEach((s) => {
        if (setting.key !== s.key) {
          s.isDescending = undefined;
        }
      });
      setting.isDescending = setting.isDescending === false ? undefined : !setting.isDescending;

      onSort({
        sort:
          setting.isDescending === undefined
            ? '-id'
            : `${setting.isDescending ? '-' : ''}${setting.key || ''}`,
      });
      changeSettings(settings);
    }
  };

  return (
    <Box
      alignItems="center"
      justifyContent="space-evenly"
      flexDirection="row"
      bg="gray8"
      pt={2}
      pb={4}
    >
      {settings.map((setting) => (
        <ButtonBase
          key={setting.name}
          onPress={() => sort(setting)}
          style={{ flexDirection: 'row', marginRight: 8, alignItems: 'center' }}
        >
          <Text
            fontSize={1}
            fontFamily="medium"
            pr={2}
            color={setting.isDescending !== undefined ? 'blue' : 'gray2'}
          >
            {i18n._(setting.name)}
          </Text>
          <FontAwesome
            name={
              setting.isDescending === undefined
                ? 'sort'
                : setting.isDescending
                ? 'sort-desc'
                : 'sort-asc'
            }
            color={setting.isDescending !== undefined ? theme.colors.blue : theme.colors.gray2}
            size={12}
          />
        </ButtonBase>
      ))}
    </Box>
  );
};

export default SortFilterActionBar;
