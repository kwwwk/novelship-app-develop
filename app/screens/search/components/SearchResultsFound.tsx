import React from 'react';
import { Trans } from '@lingui/macro';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { ButtonBase, Text, Box } from 'app/components/base';
import { SearchResponseType } from 'app/store/views/search';
import { BottomTabRoutes } from 'types/navigation';
import { ProductType } from 'types/resources/product';
import theme from 'app/styles/theme';

const SearchResultsFound = ({
  search,
  resultsCount,
}: {
  search: string;
  resultsCount?: SearchResponseType['totalByClasses'];
}) => {
  const navigation = useNavigation<StackNavigationProp<BottomTabRoutes>>();

  return (
    <Box width="100%">
      {(['Sneakers', 'Apparel', 'Collectibles', 'All'] as (ProductType['class'] & 'All')[]).map(
        (productClass) =>
          !!(resultsCount && resultsCount[productClass]) && (
            <ButtonBase
              key={productClass}
              onPress={() =>
                navigation.navigate('BrowseStack', {
                  screen: 'BrowseRoot',
                  params: { screen: String(productClass).toLowerCase(), params: { q: search } },
                })
              }
            >
              <Box
                px={5}
                height={60}
                width="100%"
                alignItems="center"
                flexDirection="row"
                justifyContent="space-between"
                borderBottomWidth={1}
                borderBottomColor="dividerGray"
              >
                <Box>
                  {productClass !== 'All' ? (
                    <Box flexDirection="row">
                      <Trans>
                        <Text fontSize={2} fontFamily="bold">
                          {search}{' '}
                        </Text>
                        <Text color="textSecondary" fontSize={2} fontFamily="medium">
                          in {productClass}
                        </Text>
                      </Trans>
                    </Box>
                  ) : (
                    <Box flexDirection="row">
                      <Trans>
                        <Text color="textSecondary" fontSize={2} fontFamily="medium">
                          All results for{' '}
                        </Text>
                        <Text fontSize={2} fontFamily="bold">
                          {search}
                        </Text>
                      </Trans>
                    </Box>
                  )}
                  <Text mt={1} color="textSecondary" fontSize={1}>
                    <Trans>{resultsCount[productClass]} results</Trans>
                  </Text>
                </Box>
                <Ionicon name="chevron-forward" size={20} color={theme.colors.textBlack} />
              </Box>
            </ButtonBase>
          )
      )}
    </Box>
  );
};

export default SearchResultsFound;
