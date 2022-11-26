import { BottomTabRoutes } from 'types/navigation';
import { BrowseParamType } from 'types/views/browse';
import { ProductType } from 'types/resources/product';

import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';

import { Button, Text, Box } from 'app/components/base';
import { BoxProps } from 'app/components/base/Box';
import HintAlert from 'app/components/dialog/HintAlert';
import Analytics from 'app/services/analytics/index';

const HomeSectionHeader = ({
  title,
  subTitle,
  viewMoreParams,
  productCategory,
  hintTitle,
  hintText,
  ...prop
}: BoxProps & {
  title: string;
  subTitle?: string;
  hintTitle?: string;
  hintText?: string;
  viewMoreParams?: BrowseParamType;
  productCategory?: ProductType['class'];
}) => {
  const navigation = useNavigation<StackNavigationProp<BottomTabRoutes>>();

  return (
    <Box flexDirection="row" alignItems="center" justifyContent="space-between">
      <Box flexDirection="row" alignItems="center">
        <Box mt={3} mb={3} {...prop}>
          <Text fontSize={3} fontFamily="bold" textTransform="uppercase">
            {title}
          </Text>
          {subTitle && (
            <Text fontSize={1} color="blue" fontFamily="medium">
              {subTitle}
            </Text>
          )}
        </Box>
        {hintTitle && hintText && <HintAlert title={hintTitle} text={hintText} />}
      </Box>
      {viewMoreParams && (
        <Button
          size="xs"
          variant="white"
          text={i18n._(t`VIEW MORE`)}
          style={{ paddingHorizontal: 12, marginRight: 16 }}
          onPress={() => {
            Analytics.homepageViewMoreClick(title);
            navigation.navigate('BrowseStack', {
              screen: 'BrowseRoot',
              params: {
                screen: String(productCategory).toLowerCase(),
                params: { ...viewMoreParams, q: '' },
              },
            });
          }}
        />
      )}
    </Box>
  );
};

export default HomeSectionHeader;
