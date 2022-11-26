import { ProductType } from 'types/resources/product';
import { RootRoutes } from 'types/navigation';

import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { Box, Text, ButtonBase, ImgixImage } from 'app/components/base';
import { BoxProps } from 'app/components/base/Box';
import InstantAvailableIndicator from 'app/components/product/InstantAvailableIndicator';
import AlgoliaInsights from 'app/services/algolia-insights';
import Analytics from 'app/services/analytics';

const SearchProductCard = ({
  product,
  index,
}: { product: ProductType; index: number } & BoxProps) => {
  const navigation = useNavigation<StackNavigationProp<RootRoutes, 'ProductStack'>>();

  const onProductCardPress = () => {
    AlgoliaInsights.productClicked({
      position: index,
      sort: 'search',
      ...product,
    });
    Analytics.productSearchClick(product);
    navigation.push('ProductStack', {
      screen: 'Product',
      slug: product.name_slug,
    });
  };

  return (
    <ButtonBase onPress={onProductCardPress}>
      <Box
        p={5}
        width="100%"
        flexDirection="row"
        borderBottomWidth={1}
        borderBottomColor="dividerGray"
      >
        <Box mr={5} pt={2} width={80}>
          <InstantAvailableIndicator
            size="sm"
            view="icon"
            justifyContent="flex-end"
            isInstantAvailable={product.is_instant_available}
            style={{ top: 0, right: 0, zIndex: 1, position: 'absolute' }}
          />
          <ImgixImage src={product.image} height={45} width={80} />
        </Box>

        <Box flex={1}>
          <Text color="textSecondary" fontSize={1} fontFamily="bold" mb={1}>
            {product.category_level_1}
          </Text>
          <Text color="textBlack" fontSize={2} fontFamily="medium">
            {product.name}
          </Text>
        </Box>
      </Box>
    </ButtonBase>
  );
};

export default SearchProductCard;
